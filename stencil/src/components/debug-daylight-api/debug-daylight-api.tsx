import { Component, h, Host, State } from "@stencil/core";
import { DaylightResponse } from '../../services/DaylightApi';
import { getTimes } from "suncalc";

@Component({
	tag: 'ds-debug-daylight-api',
	shadow: true
})
export class DebugDaylightApi {
	beginDateInput: HTMLInputElement;
	beginDate: Date;
	lat = 27.58;
	long = -97.216;

	@State() daylight: DaylightResponse[] = [];

	componentDidLoad() {
		this.beginDateInput.valueAsDate = new Date('2023-09-06T00:00:00.000Z');
		this.beginDate = this.beginDateInput.valueAsDate;
	}

	_onGetDaylight() {
		this.beginDate = this.beginDateInput.valueAsDate;

		// suncalc has a bug where midnight at local time is returning the calcs for the previous day
		// so let's goose it by bumping up the timezoneoffset by x hours (the + n below)
		// TODO: this may not work if timezone offset for some locations forces us into the next day, needs research/testing
		const currentLocal = new Date(
			this.beginDate.valueOf()
			+ ((this.beginDate.getTimezoneOffset() + 120) * 60 * 1000)
			);

		// suncalc has a bug where midnight at local time is returning the calcs for the previous day, so let's goose it by setting max minutes:seconds:milliseconds:
		// currentLocal.setUTCMinutes(59);
		// currentLocal.setUTCSeconds(59);
		// currentLocal.setUTCMilliseconds(999);

		// const currentLocal = new Date(this.beginDate.valueOf());
		// currentLocal.setUTCHours(12);
		console.log('current local iso', currentLocal.toISOString(), 'current local locale', currentLocal.toLocaleString());
		console.log(getTimes(currentLocal, this.lat, this.long));


	}



	render() {
		let daylightDebug = '';
		if(this.daylight)
		{
			daylightDebug = <ul>{this.daylight.map(result =>
				<li><strong>{result.when.toISOString()}</strong><br />
					Rise Local: {result.rise.toLocaleString()} Rise UTC: {result.rise.toISOString()}<br />
					Set Local: {result.set.toLocaleString()} Set UTC: {result.set.toISOString()}</li>
			)}</ul>;
		}

		return (
			<Host>
				<p>
						Begin Date: <input
							id="begin-date"
							type="date"
							ref={el => this.beginDateInput = el}
						/>
				</p>
				<button onClick={this._onGetDaylight.bind(this)}>Get Daylight</button>
				<h1>beginDate: {this.beginDate ? this.beginDate.toISOString() : 'not loaded'}</h1>
				<p>
					{daylightDebug}
				</p>
			</Host>
		)
	}
}
