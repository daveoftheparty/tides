import { Component, h, Host } from "@stencil/core";

@Component({
	tag: 'ds-debug-tide-api',
	shadow: true
})
export class DebugTideApi {

	onGo() {
		this.onGetTides();
	}

	onGetStocks() {
		fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=OT30KCGGNBUU13DH`,
		{mode: 'cors'})
		.then(res => {
		console.log('res is', res);
		  return res.json();
		})
		.then(parsedRes => {
		  console.log(parsedRes);
		  if(!parsedRes['Global Quote']['05. price']) {
			throw new Error('invalid stock symbol');
		  }
		})
		.catch(err => {
		  console.log(err);
		});
	}

	_noaaStringToDate(input: string) : Date {
		const year = +input.slice(0, 4);
		const month = +input.slice(5, 7) - 1;
		const day = +input.slice(8, 10);
		const hour = +input.slice(11, 13);
		const minute = +input.slice(14, 16);

		return new Date(Date.UTC(year, month, day, hour, minute, 0, 0));
	}

	onGetTides() {
		fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=20230906&end_date=20230907&datum=MLLW&station=8775870&time_zone=gmt&units=english&interval=hilo&format=json`,
		{mode: 'cors'})
			.then(res => {
				console.log('res is', res);
				return res.json();
			})
			// .then(res => res.json())
			.then(parsedRes => {
				console.log('parsed json is ', parsedRes);
				let results = parsedRes['predictions'].map(tide => {
					return {
						when: this._noaaStringToDate(tide.t),
						level: +tide.v
					};
				});
				console.log('tide api results', results.map(i => {i.when.toISOString(), i.level}));
			})
			.then(parsed => console.log('we got this parsed:', parsed))
			.catch(err => {
				console.log('we caught one');
				console.log(err);
			})
	}

	render() {
		return (
			<Host>
			<h1>Hi dave, this is debug...</h1>
			<button onClick={this.onGo.bind(this)}>Go!</button>
			</Host>
		);
	}
}
