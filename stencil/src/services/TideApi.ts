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

export function GetTides(): TideResponse[] {
	return [
		{when: new Date('2023-09-06 14:27'), level: +'0.093'},
		{when: new Date('2023-09-07 01:09'), level: +'2.078'},
		{when: new Date('2023-09-07 15:31'), level: +'0.121'},
	];
};

