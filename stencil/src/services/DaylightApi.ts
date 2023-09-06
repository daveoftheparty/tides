import {DateRangeToArray} from './DateUtils';
import { getTimes } from "suncalc";

export type DaylightResponse = {
	when: Date,
	rise: Date,
	set: Date
};

/*
	possible other implementations:
		could use this api but only returns results for one day, and needs attribution like this:
		<p>* data for sunrise & set provided by <a href="https://sunrise-sunset.org/api">sunrise-sunset.org</a></p>
*/
export function GetDaylight(start: Date, end: Date): DaylightResponse[] {
	return _getDaylight(start, end);
}

function _getDaylight(start: Date, end: Date) : DaylightResponse[] {
	const lat = 27.58;
	const long = -97.216;


	const result: DaylightResponse[] = [];
	// [start].map(d => {
	DateRangeToArray(start, end).map(d => {

		// suncalc has a bug where midnight at local time is returning the calcs for the previous day
		// so let's goose it by bumping up the timezoneoffset by x hours (the + n below)
		// TODO: this may not work if timezone offset for some locations forces us into the next day, needs research/testing
		const currentLocal = new Date(
			d.valueOf()
			+ ((d.getTimezoneOffset() + 120) * 60 * 1000)
			);
		const calcs = getTimes(currentLocal, lat, long);

		result.push({
			when: d,
			rise: calcs.sunrise,
			set: calcs.sunset
		})
	});

	console.log('day calc results', result);
	return result;
}

function _getMockDaylight() : DaylightResponse[] {
	return [
		{
			when: new Date(Date.UTC(2023, 8, 6, 0, 0, 0, 0)),
			rise: new Date(Date.UTC(2023, 8, 6, 7, 11, 0, 0)),
			set: new Date(Date.UTC(2023, 8, 6, 19, 49, 0, 0)),
		},
		{
			when: new Date(Date.UTC(2023, 8, 7, 0, 0, 0, 0)),
			rise: new Date(Date.UTC(2023, 8, 7, 7, 11, 0, 0)),
			set: new Date(Date.UTC(2023, 8, 7, 19, 48, 0, 0)),
		},
	];

}

