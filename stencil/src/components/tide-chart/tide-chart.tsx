import { Component, h, Host } from "@stencil/core";
import { GetTides, TideResponse } from '../../services/TideApi';
import { State } from "@stencil/core";

@Component({
	tag: 'ds-tide-chart',
	styleUrl: './tide-chart.css',
	shadow: true
})
export class TideChart {
	@State() beginDate : string;
	@State() endDate : string;


	@State() tides : TideResponse[] = [];
	@State() tidesMinY: number;
	@State() tidesMaxY: number;

	_getTides() {
		this.tides = GetTides();
		console.log('getTides response:', this.tides);
		this._getYAxisRange();
	}

	_getYAxisRange() {
		this.tidesMinY = this.tides.reduce((min, current) => current.level < min ? current.level : min, this.tides[0].level);
		this.tidesMaxY = this.tides.reduce((max, current) => current.level > max ? current.level : max, this.tides[0].level);
	}

	render() {
		let content = <ul>{this.tides.map(result =>
			<li><strong>{result.when.toDateString()}</strong> - Ms since 1970: {result.when.getTime()} Level: {result.level}</li>
		)}</ul>;

		return (
			<Host>
				<h1>Tide shittle</h1>
				<div>
					<p>
						Begin Date: <input
							id="begin-date"
							value={this.beginDate}
						/>
					</p>
					<p>
						End Date: <input
							id="end-date"
							value={this.endDate}
						/>
					</p>
					<button onClick={this._getTides.bind(this)}>Get Tides</button>

				</div>
				<h2>debug stuff after here, would be the chart</h2>
				{content}
				<p>Max Y: {this.tidesMaxY}</p>
				<p>Min Y: {this.tidesMinY}</p>
			</Host>
		);
	}
}
