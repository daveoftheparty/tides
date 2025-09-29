import { Component, h, Prop, State } from "@stencil/core";
import { TideStationsResponse } from "../../services/TideStationsApi";

@Component({
	tag: 'ds-tide-guide',
	shadow: true
})
export class TideGuide {
	@State() showGuide = false;
	@Prop() station: TideStationsResponse;

	tideChartEl: HTMLDsTideChartElement;
	userGuideEl: HTMLDsUserGuideElement;

	render() {
		let guide =
			<ds-user-guide ref={(el: HTMLDsUserGuideElement) => {
				this.userGuideEl = el as HTMLDsUserGuideElement;
				if (this.userGuideEl) {
					this.userGuideEl.addEventListener('backToTide', () => {
						this.showGuide = false;
						console.log('!! backToTide EVENT RECEIVED !!')
					});
				}
			}} />

		let tideChart =
			<ds-tide-chart
				ref={el => {
					this.tideChartEl = el as HTMLDsTideChartElement;
					if (this.tideChartEl) {
						this.tideChartEl.addEventListener('showUserGuide', () => {
							this.showGuide = true;
							console.log('!! showUserGuide EVENT RECEIVED !!')
						});
					}
				}}
					station={this.station}
			/>

		let content = this.showGuide ? guide : tideChart;

		return (
			<div>
				{content}
			</div>
		);
	}
}
