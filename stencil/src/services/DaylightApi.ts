export type DaylightResponse = {
	when: Date,
	rise: Date,
	set: Date
};

export function GetDaylight(): DaylightResponse[] {
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
};

