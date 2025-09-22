import { Component, h } from "@stencil/core";
import { GetTideStations, TideStationsResponse }  from "../services/TideStationsApi";

@Component({
	tag: "ds-noaa",
	shadow: true
})
export class DsNoaa {
	async componentWillLoad(): Promise<void> {
		// Example usage of GetTideStations
		GetTideStations().then((stations: TideStationsResponse[]) => {
			console.log('Fetched tide stations:', stations);
		});
	}

	render() {
		return <div>NOAA Component</div>;
	}
}
