import { Component, h, Host, State } from "@stencil/core";
import { GetMoonTimes, MoonRiseSet } from "../../services/Moon";
import { ToLocalISOString } from "../../services/DateUtils";


@Component({
	tag: 'ds-moon',
	shadow: false // Use light DOM so Leaflet CSS applies correctly
})
export class Moon {
	@State() moonRiseSet: MoonRiseSet[];

	async componentWillLoad() {
		const huttoLat = 30.545806;
		const huttoLong = -97.542111;
		let start : Date = new Date(2025, 8, 1, 0, 0, 0, 0);
		let end : Date = new Date(2025, 8, 30, 0, 0, 0, 0);

		this.moonRiseSet = GetMoonTimes(start, end, huttoLat, huttoLong);
	}

	componentDidLoad() {
		console.log('moon component loaded');
		// Date(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number):
	}

	render() {
		let moonRiseSetDebug = '';

		if(this.moonRiseSet) {
			moonRiseSetDebug = <ul>{this.moonRiseSet.map(result =>
				<li>Rise: {ToLocalISOString(result.rise)} Set: {ToLocalISOString(result.set)} Illumination: {result.illumination} </li>
			)}</ul>;
		}

		return (
			<Host>
				<div>Moon Component</div>
				{moonRiseSetDebug}
			</Host>
		);
	}
}
