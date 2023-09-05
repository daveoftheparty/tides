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
	return _mockTides();
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

