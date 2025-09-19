import { Component, h, Element } from "@stencil/core";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure the CSS is imported



@Component({
	tag: 'ds-map',
	shadow: false // Use light DOM so Leaflet CSS applies correctly
})
export class Map {

	// https://leafletjs.com/examples/quick-start/

	@Element() hostElement: HTMLElement;
	map: L.Map;

				componentDidLoad() {

					// packery channel beach: 27.616428, -97.201094
					var packeryChannelBeach = L.latLng(27.616428, -97.201094);

					// Use getElementById from document since shadow is disabled
					const mapContainer = document.getElementById('map');
					if (!mapContainer) return;

					// Destroy any previous Leaflet map instance
					if ((mapContainer as any)._leaflet_id) {
						try {
							const oldMap = (mapContainer as any)._leaflet_map;
							if (oldMap && typeof oldMap.remove === 'function') {
								oldMap.remove();
							}
							// Remove all child nodes (tiles, overlays, etc.)
							while (mapContainer.firstChild) {
								mapContainer.removeChild(mapContainer.firstChild);
							}
						} catch (e) {
							console.warn('Error cleaning up previous Leaflet map:', e);
						}
					}

					// Log computed styles and container size before initializing Leaflet
					setTimeout(() => {
						const rect = mapContainer.getBoundingClientRect();
						const computed = window.getComputedStyle(mapContainer);
						console.log('Map container size:', rect.width, rect.height);
						console.log('Map container computed styles:', computed.width, computed.height, computed.display);

						this.map = L.map(mapContainer).setView(packeryChannelBeach, 9);
						// Store reference for cleanup
						(mapContainer as any)._leaflet_map = this.map;
						L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
							attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
						}).addTo(this.map);
						this.map.invalidateSize();
					}, 350);
				}

			render() {
				return (
					<div style={{ width: '620px', margin: '0 auto', boxSizing: 'border-box' }}>
						<h1>Hi dave, this is the map component...</h1>
						<div id="map" style={{ width: '600px', height: '400px', boxSizing: 'border-box', margin: '0 auto' }}></div>
					</div>
				);
			}
}
