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

export function GetExpandedUnixDate(input: Date) : number {
	const localDate = new Date(input);

	localDate.setUTCHours(23);
	localDate.setUTCMinutes(59);
	localDate.setUTCSeconds(59);
	localDate.setUTCMilliseconds(999);
	return localDate.valueOf();
}

export function GetFlattenedUnixDate(input: Date) : number {
	const localDate = new Date(input);

	localDate.setUTCHours(0);
	localDate.setUTCMinutes(0);
	localDate.setUTCSeconds(0);
	localDate.setUTCMilliseconds(0);
	return localDate.valueOf();
}

export function ToLocalISOString(date: Date) {
if(!date) return 'undefined';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
