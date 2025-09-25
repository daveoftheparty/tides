import {DateRangeToArray } from './DateUtils';
import SunCalc from 'suncalc';


// see moon.md in sandbox folder for more info


export type MoonRiseSet = {
	rise: Date,
	set: Date,
	illumination: string
};


export function GetMoonTimes(start: Date, end: Date, lat: number, long: number): MoonRiseSet[] {
	return _getMoonTimes(start, end, lat, long);
}

type MoonRiseRaw = {
	when: Date,
	rise: Date,
	set: Date
};

function _getMoonTimes(start: Date, end: Date, lat: number, long: number) : MoonRiseSet[] {
	const raw: MoonRiseRaw[] = [];
	const result: MoonRiseSet[] = [];

	// get moon data for a couple of days before and after the range to ensure we get moonrise/set for edge cases
	let adjustedStart = new Date(start);
	adjustedStart.setDate(adjustedStart.getDate() - 3);
	let adjustedEnd = new Date(end);
	adjustedEnd.setDate(adjustedEnd.getDate() + 3);

	DateRangeToArray(adjustedStart, adjustedEnd).map(d => {
		const moonrise = SunCalc.getMoonTimes(d, lat, long);

		raw.push({
			when: d,
			rise: moonrise.rise,
			set: moonrise.set
		})
	});

	console.log('moon results', raw);
	// debug.map(r => {
	// 	console.log(formatDebug(r));
	// });


	// sort our debug data by rise time
	raw.sort((a, b) => {
		if(!a.rise && !b.rise) return 0;
		if(!a.rise) return 1;
		if(!b.rise) return -1;
		return a.rise.valueOf() - b.rise.valueOf();
	});



	let currentRise: Date = new Date(0, 0, 0);

	for(let i = 0; i < raw.length; ) {
		let currentSet: Date | undefined = undefined;

		let riseIndex: number = i;
		for(; riseIndex < raw.length; riseIndex++) {
			if(raw[riseIndex].rise && raw[riseIndex].rise.valueOf() > currentRise.valueOf()) {
				currentRise = raw[riseIndex].rise;
				break;
			}
		}

		for(let setIndex = riseIndex; setIndex < raw.length; setIndex++) {
			if(raw[setIndex].set && raw[setIndex].set.valueOf() > currentRise.valueOf()) {
				currentSet = raw[setIndex].set;
				break;
			}
		}

		if(currentRise && currentSet)
			result.push({rise: currentRise, set: currentSet, illumination: _getMoonPhase(currentRise, currentSet)});

		i = riseIndex;
	}

	console.log('moon and illumination results to return', result);


	// console.log('moon phases during these moonlight times');
	// result.map(r => {
	// 	const rawRise = SunCalc.getMoonIllumination(r.rise);
	// 	const rawSet = SunCalc.getMoonIllumination(r.set);

	// 	console.log(`rise: ${ToLocalISOString(r.rise)}, fraction: ${rawRise.fraction}, phase: ${rawRise.phase}`)
	// 	console.log(`set: ${ToLocalISOString(r.set)}, fraction: ${rawSet.fraction}, phase: ${rawSet.phase}`)
	// });

	return result;
}

// function formatDebug(r: MoonDebug) : string {
// 	const whenLog = !r.when ? 'undefined' : ToLocalISOString(r.when).substring(0, 10);
// 	const riseLog = !r.rise ? 'undefined' : ToLocalISOString(r.rise).substring(11, 19);
// 	const setLog = !r.set ? 'undefined' : ToLocalISOString(r.set).substring(11, 19);
// 	return `{when: ${whenLog}, rise: ${riseLog}, set: ${setLog}}`;
// }



function _getMoonPhase(start: Date, end: Date) : string {

	const rawRise = SunCalc.getMoonIllumination(start);
	const rawSet = SunCalc.getMoonIllumination(end);

	const avgIllumination = (rawRise.fraction + rawSet.fraction) / 2;

	return Math.round(avgIllumination * 100) + '%';
}

// function _getMoonPhaseDebug(start: Date, end: Date) {

// 	console.log('moon phase info:')
// 	DateRangeToArray(start, end).map(d => {
// 		const raw = SunCalc.getMoonIllumination(d);

// 		console.log(`date: ${ToLocalISOString(d)}, fraction: ${raw.fraction}, phase: ${raw.phase}`)
// 	});
// 	console.log('END moon phases');
// }





