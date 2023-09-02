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

	_getChartDays(startDate: Date, endDate: Date): number {
		const msInDay = 24 * 60 * 60 * 1000;

		return Math.round(
			Math.abs(Number(endDate) - Number(startDate)) / msInDay
		) + 1;
	}

	render() {
		let content = <ul>{this.tides.map(result =>
			<li><strong>{result.when.toDateString()}</strong> - Ms since 1970: {result.when.getTime()} Level: {result.level}</li>
		)}</ul>;

		/****** BEGIN items that may need to transfer to state later ******/

		const chartWidth = 800;
		const chartHeight = 450;

		// gonna try to do without a separate chart background, chart area, and instead, put the chart in a div and specify padding/margin
		// const chartAreaXOffset = 40;
		// const chartAreaYOffset = 20;

		const beginDate = new Date('2023-09-06 14:27');
		const endDate = new Date('2023-09-07 15:31');
		const chartDays = this._getChartDays(beginDate, endDate);

		console.log('chart days', chartDays);
		/****** END items that may need to transfer to state later ******/

		return (
			<Host>
				<div>
					{/* <p>
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
					</p> */}
					<button onClick={this._getTides.bind(this)}>Get Tides</button>

				</div>
				<h2>debug stuff after here, would be the chart</h2>
				{content}
				<p>Max Y: {this.tidesMaxY}</p>
				<p>Min Y: {this.tidesMinY}</p>
				<h2>let's rock this chart:</h2>

				<svg id="chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
					<rect id="chartArea" width="100%" height="100%" />
				</svg>
			</Host>
		);
	}
}
