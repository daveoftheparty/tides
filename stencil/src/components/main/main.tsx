import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'ds-main',
  shadow: false
})
export class DsMain {
	@State() showMap = true;
	@State() selectedStation: any = null;

	mapEl: HTMLDsMapElement;
	tideChartEl: HTMLDsTideChartElement;


	render() {
		return (
		<div>
			{this.showMap ? (
			<ds-map ref={el => {
				this.mapEl = el as HTMLDsMapElement;
				if (this.mapEl) {
					this.mapEl.addEventListener('stationSelected', (event: CustomEvent) => {
						this.selectedStation = event.detail;
						this.showMap = false;
					});
				}
			}} />
			) : (
			<ds-tide-chart
				ref={el => {
					this.tideChartEl = el as HTMLDsTideChartElement;
					if (this.tideChartEl) {
						this.tideChartEl.addEventListener('resetStation', () => {
							this.selectedStation = null;
							this.showMap = true;
							console.log('resetStation event received in ds-main');
						});
					}
				}}
				station={this.selectedStation}
			/>
			)}
		</div>
		);
	}
}
