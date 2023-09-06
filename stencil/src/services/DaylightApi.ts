import {getSunrise, getSunset} from './SunAlgorithm';
import {DateRangeToArray} from './DateUtils';

export type DaylightResponse = {
	when: Date,
	rise: Date,
	set: Date
};

/*
	possible other implementations:
		could use this api but only returns results for one day, and needs attribution like this:
		<p>* data for sunrise & set provided by <a href="https://sunrise-sunset.org/api">sunrise-sunset.org</a></p>


		tried and failed to install https://github.com/mourner/suncalc/tree/master via npm install suncalc
*/
export function GetDaylight(start: Date, end: Date): DaylightResponse[] {
	return _getDaylight(start, end);
}

function _getDaylight(start: Date, end: Date) : DaylightResponse[] {
	const lat = 27.58;
	const long = -97.216;

	const result: DaylightResponse[] = [];
	DateRangeToArray(start, end).map(d => {
		result.push({
			when: d,
			rise: getSunrise(lat, long, d),
			set: getSunset(lat, long, d)
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

