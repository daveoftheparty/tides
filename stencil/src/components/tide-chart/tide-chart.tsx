import { Component, h, Host } from "@stencil/core";
import { GetTides, TideResponse } from '../../services/TideApi';

@Component({
	tag: 'ds-tide-chart',
	styleUrl: './tide-chart.css',
	shadow: true
})
export class TideChart {

	_getTides(): TideResponse[] {
		let response = GetTides();
		console.log('getTides response:', response);
		return response;
	}

	render() {
		let content = <ul>{this._getTides().map(result =>
			<li><strong>{result.when.toDateString()}</strong> - {result.level}</li>
		)}</ul>;

		return (
			<Host>
				<h1>Tide shittle</h1>
				{content}
			</Host>
		);
	}
}
