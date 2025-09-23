import { Component, h, Element, Host } from "@stencil/core";
import { GetMoonTimes } from "../../services/Moon";


@Component({
	tag: 'ds-moon',
	shadow: false // Use light DOM so Leaflet CSS applies correctly
})
export class Moon {

	componentDidLoad() {
		console.log('moon component loaded');

		const huttoLat = 30.545806;
		const huttoLong = -97.542111;

		GetMoonTimes(new Date(2025, 8, 1, 0, 0, 0, 0), new Date(2025, 8, 30, 0, 0, 0, 0), huttoLat, huttoLong);

		// Date(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number):

		;
	}
	render() {
		return (
			<Host>
				<div>Moon Component</div>
			</Host>
		);
	}
}
