export function DateRangeToArray(start: Date, end: Date) : Date[] {
	const result: Date[] = [];
	const msInDay = 24 * 60 * 60 * 1000;
	let current = new Date(start);

	while (current <= end) {
		result.push(new Date(current));
		current = new Date(current.getTime() + msInDay);
	}

	return result;
}


export function UtcToLocal(date: Date): Date {
    var newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
}
