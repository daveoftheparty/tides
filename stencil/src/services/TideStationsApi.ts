export type TideStationsResponse = {
	id: string
	name: string
	lat: number
	lng: number
};

export function GetTideStations(): Promise<TideStationsResponse[]> {
	return _getTideStations();
}
/*
      "id": "1610367",
      "name": "Nonopapa, Niihau Island",
      "lat": 21.87,
      "lng": -160.235,
*/

function _getTideStations(): Promise<TideStationsResponse[]> {
    return fetch(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions`,
	{mode: 'cors'})
		.then(res => res.json())
		.then(parsedRes => {
			// console.log('parsed json is ', parsedRes);
			let results = parsedRes['stations'].map(station => {
				return {
					id: station.id,
					name: station.name,
					lat: station.lat,
					lng: station.lng
				};
			});
			// console.log('tide station api results', results);
			return results;
		})
		.catch(err => {
			console.log('we caught one');
			console.log(err);
		})
}

