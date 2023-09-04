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
	tidesMinY: number;
	tidesMaxY: number;

	minDate: Date = new Date(2023, 8, 1);
	maxDate: Date = new Date(2023, 8, 2);

	chartWidth = 800;
	chartHeight = 450;

	_getTides() {
		const tides = GetTides();
		console.log('getTides response:', tides);

		this._setTidesYAxisRange(tides);
		this._setMinMaxDate(tides);

		// assign state last after all calcs to avoid re-renders:
		this.tides = tides;
	}

	_setTidesYAxisRange(tides: TideResponse[]) {
		this.tidesMinY = tides.reduce((min, current) => current.level < min ? current.level : min, tides[0].level);
		this.tidesMaxY = tides.reduce((max, current) => current.level > max ? current.level : max, tides[0].level);
	}

	_setMinMaxDate(tides: TideResponse[]) {
		// new Date() around the reduce here because otherwise this.min/maxDate refer to same object as in tides array,
		// and later when we calculate coordinates our source data has been corrupted
		this.minDate = new Date(tides.reduce((min, current) => current.when < min ? current.when : min, tides[0].when));
		this.maxDate = new Date(tides.reduce((max, current) => current.when > max ? current.when : max, tides[0].when));
	}

	_getChartDays(startDate: Date, endDate: Date): number {
		const msInDay = 24 * 60 * 60 * 1000;

		return Math.round(
			Math.abs(Number(endDate) - Number(startDate)) / msInDay
		) + 1;
	}

	// TODO: why bother passing in dates, maybe just use minDate, maxDate class attributes
	_getChartDayRects(startDate: Date, endDate: Date): {index: number, x: number, width: number}[] {
		const chartDays = this._getChartDays(startDate, endDate);
		console.log('chart days', chartDays);
		const dayWidth = this.chartWidth / chartDays;

		let result = [...Array(chartDays).keys()].map(i => ({
			index: i,
			x: i * dayWidth,
			width: dayWidth
		}));

		return result;
	}

	_getChartXAxisGridlines(): {index: number, x: number}[] {
		const chartDays = this._getChartDays(this.minDate, this.maxDate);
		const dayWidth = this.chartWidth / chartDays;

		let result = [...Array(chartDays + 1).keys()].map(i => ({
			index: i,
			x: i * dayWidth
		}));

		return result;
	}

	_getExpandedUnixDate(input: Date) : number {
		input.setUTCHours(23);
		input.setUTCMinutes(59);
		input.setUTCSeconds(59);
		input.setUTCMilliseconds(999);
		return input.valueOf();
	}

	_getFlattenedUnixDate(input: Date) : number {
		input.setUTCHours(0);
		input.setUTCMinutes(0);
		input.setUTCSeconds(0);
		input.setUTCMilliseconds(0);
		return input.valueOf();
	}


	_getXForDate(input: Date): number {
		const expandedMaxDate = this._getExpandedUnixDate(this.maxDate);
		const flattenedMinDate = this._getFlattenedUnixDate(this.minDate);
		const chartDateDiff = expandedMaxDate - flattenedMinDate;

		const thisRatio = (input.valueOf() - flattenedMinDate) / chartDateDiff;
		// console.log(
		// 	'getxfordate input:', input.toISOString(),
		// 	'input valueOf():', input.valueOf(),
		// 	'flattenedMinDate:', new Date(flattenedMinDate).toISOString(),
		// 	'flattenedMinDate valueOf():', new Date(flattenedMinDate).valueOf(),
		// 	'expandedMaxDate:', new Date(expandedMaxDate).toISOString(),
		// 	'expandedMaxDate valueOf():', new Date(expandedMaxDate).valueOf(),
		// 	'ratio:', thisRatio);

		// const thisRatio = input.valueOf() / expandedMaxDate;
		return thisRatio * this.chartWidth;
	}

	_getYCoord(y: number): number {
		// TODO: calc Y bounds on the fly later with "good increments"
		const maxY = 3;
		const minY = -3;
		const totalHeight = maxY - minY;

		const thisRatio = y / totalHeight;
		const transform = -1 * thisRatio * this.chartHeight + (this.chartHeight / 2);

		return transform;
	}

	_getTideCoords() : {index: number, x: number, y: number}[] {
		let i = 0;
		let result = this.tides.map(tide => ({
			index: i++,
			x: this._getXForDate(tide.when),
			y: this._getYCoord(tide.level)
		}));

		// if(this.tides[0]) {
		// 	console.log('how is a date interpreted?',
		// 		'tide level:', this.tides[0].level,
		// 		'utc string', this.tides[0].when.toUTCString(),
		// 		'locale string', this.tides[0].when.toLocaleString(),
		// 		'tostring', this.tides[0].when.toString(),
		// 		'json', this.tides[0].when.toJSON(),
		// 		);
		// }
		return result;
	}

	_getTideSineWave() : string {
		let points = this._getTideCoords().map(i =>
			(i.index === 0 ? 'M ' : 'L ') + i.x + ',' + i.y
		);
		let result = points.join(' ');
		console.log(result);
		return result;
	}

	render() {
		let content = <ul>{this.tides.map(result =>
			<li><strong>{result.when.toISOString()}</strong> - Ms since 1970: {result.when.getTime()} Level: {result.level}</li>
		)}</ul>;

		/****** BEGIN items that may need to transfer to state later ******/



		// gonna try to do without a separate chart background, chart area, and instead, put the chart in a div and specify padding/margin
		// const chartAreaXOffset = 40;
		// const chartAreaYOffset = 20;

		const beginDate = new Date('2023-09-06 14:27');
		const endDate = new Date('2023-09-07 15:31');
		const chartDays = this._getChartDays(beginDate, endDate);

		// console.log('chart days', chartDays);
		/****** END items that may need to transfer to state later ******/

		this._getTideSineWave();

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

				<svg id="chart" viewBox={`0 0 ${this.chartWidth} ${this.chartHeight}`}>
					<rect id="chartArea" width="100%" height="100%" />
					<g id="days">
						{this._getChartDayRects(this.minDate, this.maxDate).map(day =>
							<rect class="chartDayDark" id={`${day.index}`} width={day.width} height={this.chartHeight} x={day.x} y="0" />
						)}
					</g>
					<g id="x-axis-day-ticks">
						{
							this._getChartXAxisGridlines().map(i =>
								<path class="xGridline" id={`x-tick-${i.index}`} d={`M ${i.x},0 V ${this.chartHeight}`} />
							)
						}
					</g>

					<g id="tides">
						{
							this._getTideCoords().map(i =>
								<circle class="tideMarker" id={`tide-marker-${i.index}`} cx={i.x} cy={i.y} r="3" />
							)
						}
						<path class="tideSineWave" id="tideSineWave" d={this._getTideSineWave()} />

					</g>
				</svg>
			</Host>
		);
	}
}
