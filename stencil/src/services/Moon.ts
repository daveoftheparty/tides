import {DateRangeToArray, ToLocalISOString} from './DateUtils';
import SunCalc from 'suncalc';


// see moon.md in sandbox folder for more info
export type MoonResponse = {
	when: Date,
	rise: Date,
	set: Date
};

export function GetMoonTimes(start: Date, end: Date, lat: number, long: number): MoonResponse[] {
	return _getMoonTimes(start, end, lat, long);
}

//https://github.com/mourner/suncalc
function _getMoonTimes(start: Date, end: Date, lat: number, long: number) : MoonResponse[] {
	const result: MoonResponse[] = [];

	// get moon data for one day before and one day after the range to ensure we get moonrise/set for edge cases
	let adjustedStart = new Date(start);
	adjustedStart.setDate(adjustedStart.getDate() - 1);
	let adjustedEnd = new Date(end);
	adjustedEnd.setDate(adjustedEnd.getDate() + 1);

	DateRangeToArray(adjustedStart, adjustedEnd).map(d => {
		const moonrise = SunCalc.getMoonTimes(d, lat, long);

		result.push({
			when: d,
			rise: moonrise.rise,
			set: moonrise.set
		})
	});

	console.log('moon results', result);
	result.map(r => {
		console.log(formatResponse(r));
	});

	return result;
}

function formatResponse(r: MoonResponse) : string {
	const whenLog = !r.when ? 'undefined' : ToLocalISOString(r.when).substring(0, 10);
	const riseLog = !r.rise ? 'undefined' : ToLocalISOString(r.rise).substring(11, 19);
	const setLog = !r.set ? 'undefined' : ToLocalISOString(r.set).substring(11, 19);
	return `{when: ${whenLog}, rise: ${riseLog}, set: ${setLog}}`;
}
