import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'ds-main',
  shadow: false
})
export class DsMain {
	@State() showMap = true;
	@State() selectedStation: any = null;

	mapEl: HTMLDsMapElement;
	tideGuideEl: HTMLDsTideGuideElement;


	render() {
		let map =
			<ds-map ref={el => {
				this.mapEl = el as HTMLDsMapElement;
				if (this.mapEl) {
					this.mapEl.addEventListener('stationSelected', (event: CustomEvent) => {
						this.selectedStation = event.detail;
						this.showMap = false;
						console.log('!! stationSelected EVENT RECEIVED !!')
					});
				}
			}} />

		let tideChart =
			<ds-tide-guide
				ref={el => {
					this.tideGuideEl = el as HTMLDsTideGuideElement;
					if (this.tideGuideEl) {
						this.tideGuideEl.addEventListener('resetStation', () => {
							this.selectedStation = null;
							this.showMap = true;
							console.log('!! resetStation EVENT RECEIVED !!')
						});
					}
				}}
				station={this.selectedStation}
			/>

		let content = this.showMap ? map : tideChart;

		return (
			<div>
				{content}
			</div>
		);
	}
}
