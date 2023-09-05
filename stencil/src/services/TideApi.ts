/*
type NoaaHighLowResponse = {
	predictions: Array<NoaaHighLow>;
};

type NoaaHighLow = {
	t: string;
	v: string;
	type: string;
};
*/
export type TideResponse = {
	when: Date,
	level: number
};

export function GetTides(start: Date, end: Date): TideResponse[] {
	return _getTides(start, end);
	// return _mockTides();
}

function _yyyymmdd(input: Date) : string {
	const mm = input.getUTCMonth() + 1; // getMonth() is zero-based
	const dd = input.getUTCDate();

	return [
		input.getUTCFullYear(),
		(mm > 9 ? '' : '0') + mm,
		(dd > 9 ? '' : '0') + dd
	].join('');
}

function _getTides(start: Date, end: Date): TideResponse[] {
	let results: TideResponse[] = [];
    fetch(`https://tidesandcurrents.noaa.gov/api/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=${_yyyymmdd(start)}&end_date=${_yyyymmdd(end)}&datum=MLLW&station=8775870&time_zone=gmt&units=english&interval=hilo&format=json`,
	{mode: 'no-cors'})
		.then(res => res.json())
		.then(parsedRes => {
			console.log('parsed json is ', parsedRes);
			results = parsedRes['predictions'].map(tide => {
				return {
					when: _noaaStringToDate(tide.t),
					level: +tide.v
				};
			});
			console.log('tide api results', results);
		})
		.catch(err => {
			console.log('we caught one');
			console.log(err);
		})
		return results;
}

function _noaaStringToDate(input: string) : Date {
	const year = +input.slice(0, 4);
	const month = +input.slice(5, 7) - 1;
	const day = +input.slice(8, 10);
	const hour = +input.slice(11, 13);
	const minute = +input.slice(14, 16);

	return new Date(Date.UTC(year, month, day, hour, minute, 0, 0));
}

function _mockTides(): TideResponse[] {
	/*
	return [
		{when: new Date('2023-09-06 14:27'), level: +'0.093'},
		{when: new Date('2023-09-07 01:09'), level: +'2.078'},
		{when: new Date('2023-09-07 15:31'), level: +'0.121'},
	];
	*/
	/*
	return [
		{when: new Date('2023-09-06 07:00'), level: +'0.093'},
		{when: new Date('2023-09-07 03:00'), level: +'2.078'},
		{when: new Date('2023-09-07 11:00'), level: +'0.121'},
	];
	*/
	/*
	return [
		{when: new Date('2023-09-06T12:00:00.000Z'), level: +'0.093'},
		{when: new Date('2023-09-07T08:00:00.000Z'), level: +'2.078'},
		{when: new Date('2023-09-07T16:00:00.000Z'), level: +'0.121'},
	];
	*/


	return [
		{when: new Date(Date.UTC(2023, 8, 6, 12, 0, 0, 0)), level: +'0.093'},
		{when: new Date(Date.UTC(2023, 8, 7, 8, 0, 0, 0)), level: +'2.078'},
		{when: new Date(Date.UTC(2023, 8, 7, 16, 0, 0, 0)), level: +'0.121'},
	];

	/*
	return [
		{when: new Date(Date.UTC(2023, 8, 6, 12, 0, 0, 0)), level: +'3'},

		{when: new Date(Date.UTC(2023, 8, 6, 12, 0, 0, 0)), level: +'0'},
		{when: new Date(Date.UTC(2023, 8, 7, 8, 0, 0, 0)), level: +'1.5'},
		{when: new Date(Date.UTC(2023, 8, 7, 16, 0, 0, 0)), level: +'-1.5'},

		{when: new Date(Date.UTC(2023, 8, 7, 16, 0, 0, 0)), level: +'-3'},


	];
	*/
};

