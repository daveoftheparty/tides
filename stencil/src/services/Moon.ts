import {DateRangeToArray, ToLocalISOString} from './DateUtils';
import SunCalc from 'suncalc';


// see moon.md in sandbox folder for more info
export type MoonDebug = {
	when: Date,
	rise: Date,
	set: Date
};

export type MoonResponse = {
	rise: Date,
	set: Date
};


export function GetMoonTimes(start: Date, end: Date, lat: number, long: number): MoonResponse[] {
	return _getMoonTimes(start, end, lat, long);
}

//https://github.com/mourner/suncalc
function _getMoonTimes(start: Date, end: Date, lat: number, long: number) : MoonResponse[] {
	const debug: MoonDebug[] = [];
	const result: MoonResponse[] = [];

	// get moon data for a couple of days before and after the range to ensure we get moonrise/set for edge cases
	let adjustedStart = new Date(start);
	adjustedStart.setDate(adjustedStart.getDate() - 3);
	let adjustedEnd = new Date(end);
	adjustedEnd.setDate(adjustedEnd.getDate() + 3);

	DateRangeToArray(adjustedStart, adjustedEnd).map(d => {
		const moonrise = SunCalc.getMoonTimes(d, lat, long);

		debug.push({
			when: d,
			rise: moonrise.rise,
			set: moonrise.set
		})
	});

	console.log('moon results', debug);
	// debug.map(r => {
	// 	console.log(formatDebug(r));
	// });


	// sort our debug data by rise time
	debug.sort((a, b) => {
		if(!a.rise && !b.rise) return 0;
		if(!a.rise) return 1;
		if(!b.rise) return -1;
		return a.rise.valueOf() - b.rise.valueOf();
	});



	let currentRise: Date = new Date(0, 0, 0);

	for(let i = 0; i < debug.length; ) {
		let currentSet: Date | undefined = undefined;

		let riseIndex: number = i;
		for(; riseIndex < debug.length; riseIndex++) {
			if(debug[riseIndex].rise && debug[riseIndex].rise.valueOf() > currentRise.valueOf()) {
				currentRise = debug[riseIndex].rise;
				break;
			}
		}

		for(let setIndex = riseIndex; setIndex < debug.length; setIndex++) {
			if(debug[setIndex].set && debug[setIndex].set.valueOf() > currentRise.valueOf()) {
				currentSet = debug[setIndex].set;
				break;
			}
		}

		if(currentRise && currentSet)
			result.push({rise: currentRise, set: currentSet});

		i = riseIndex;
	}

	console.log('results to return', result);
	return result;
}

function formatDebug(r: MoonDebug) : string {
	const whenLog = !r.when ? 'undefined' : ToLocalISOString(r.when).substring(0, 10);
	const riseLog = !r.rise ? 'undefined' : ToLocalISOString(r.rise).substring(11, 19);
	const setLog = !r.set ? 'undefined' : ToLocalISOString(r.set).substring(11, 19);
	return `{when: ${whenLog}, rise: ${riseLog}, set: ${setLog}}`;
}
