import { Component, h, Element, Host } from "@stencil/core";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure the CSS is imported
import { GetTideStations, TideStationsResponse }  from "../../services/TideStationsApi";


@Component({
	tag: 'ds-map',
	shadow: false, // Use light DOM so Leaflet CSS applies correctly
	styleUrl: './map.css'
})
export class Map {

	// https://leafletjs.com/examples/quick-start/

	@Element() hostElement: HTMLElement;
	map: L.Map;
	tideStations: TideStationsResponse[];

	async componentWillLoad(): Promise<void> {
		// Example usage of GetTideStations
		GetTideStations().then((stations: TideStationsResponse[]) => {
			console.log('Fetched tide stations:', stations);
			this.tideStations = stations;
		});
	}

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

			this.map = L.map(mapContainer).setView(packeryChannelBeach, 15);
			// Store reference for cleanup
			(mapContainer as any)._leaflet_map = this.map;
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(this.map);

			console.log('we have ' + this.tideStations.length + ' stations');
			// Add tide stations to the map
			this.tideStations.forEach(station => {
				L.marker([station.lat, station.lng])
					.addTo(this.map)
					.bindPopup(station.name);
			});
			this.map.invalidateSize();
		}, 350);
	}

	render() {
		return (
			<Host>
				<div id="map-container">
					<h1>Choose your closest tide station</h1>
					<div id="map"></div>
				</div>

				<ds-noaa></ds-noaa>
			</Host>
		);
	}
}
