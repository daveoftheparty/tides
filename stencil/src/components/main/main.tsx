import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'ds-main',
  shadow: false
})
export class DsMain {
  @State() showMap = true;
  @State() selectedStation: any = null;

  mapEl: HTMLDsMapElement;

  componentDidLoad() {
    // Listen for custom event from ds-map
    this.mapEl?.addEventListener('stationSelected', (event: CustomEvent) => {
      this.selectedStation = event.detail;
      this.showMap = false;
    });
  }

  render() {
    return (
      <div>
        {this.showMap ? (
          <ds-map ref={el => this.mapEl = el as HTMLDsMapElement} />
        ) : (
          <ds-tide-chart station={this.selectedStation} />
        )}
      </div>
    );
  }
}
