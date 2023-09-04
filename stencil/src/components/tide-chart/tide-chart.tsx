import { Component, h, Host } from "@stencil/core";
import { GetTides, TideResponse } from '../../services/TideApi';
import { GetDaylight, DaylightResponse } from '../../services/DaylightApi';
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

	@State() daylight : DaylightResponse[] = [];


	minDate: Date = new Date(2023, 8, 1);
	maxDate: Date = new Date(2023, 8, 2);
	minY: number = -3;
	maxY: number = 3;

	chartWidth = 800;
	chartHeight = 450;
	chartAreaXOffset = 40;

	_getChartData() {
		const tides = this._getTides();
		const daylight = this._getDaylight();

		// TODO calc minY, maxY based on data later

		// assign state last after all calcs to avoid re-renders:
		this.tides = tides;
		this.daylight = daylight;
	}

	_getDaylight() : DaylightResponse[] {
		return GetDaylight();
	}

	_getTides() : TideResponse[] {
		const tides = GetTides();
		console.log('getTides response:', tides);

		this._setTidesYAxisRange(tides);
		this._setMinMaxDate(tides);

		return tides;
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
		// console.log('_getChartDays startDate', startDate.toISOString(), 'endDate', endDate.toISOString(), 'this.minDate', this.minDate.toISOString(), 'this.maxdate', this.maxDate.toISOString());
		/*
			TODO
			this rounding function does not actually work. For startDate
				2023-09-06T00:00:00.000Z
			, all of the following erroneously return a value of 3:
				2023-09-07T23:59:59.999Z
				2023-09-07T23:59:59.699Z
				2023-09-07T23:59:58.000Z
		*/

		const msInDay = 24 * 60 * 60 * 1000;

		return Math.round(
			Math.abs(Number(endDate) - Number(startDate)) / msInDay
		) + 1;
	}

	_getDaylightRects() : {index: number, x: number, width: number}[] {
		let result = this.daylight.map((daylight, i) => ({
			index: i,
			x: this._getXForDate(daylight.rise),
			width: this._getXForDate(daylight.set) - this._getXForDate(daylight.rise)
		}));
		console.log('getDaylightRects result', result);
		return result;
	}

	// TODO: why bother passing in dates, maybe just use minDate, maxDate class attributes
	_getChartDayRects(startDate: Date, endDate: Date): {index: number, x: number, width: number}[] {
		const chartDays = this._getChartDays(startDate, endDate);
		console.log('chart days', chartDays);
		const dayWidth = (this.chartWidth - this.chartAreaXOffset) / chartDays;

		let result = [...Array(chartDays).keys()].map(i => ({
			index: i,
			x: i * dayWidth + this.chartAreaXOffset,
			width: dayWidth
		}));

		return result;
	}

	_getChartXAxisGridlines(): {index: number, x: number}[] {
		const chartDays = this._getChartDays(this.minDate, this.maxDate);
		const dayWidth = (this.chartWidth - this.chartAreaXOffset) / chartDays;

		let result = [...Array(chartDays + 1).keys()].map(i => ({
			index: i,
			x: i * dayWidth + this.chartAreaXOffset
		}));

		return result;
	}

	_getExpandedUnixDate(input: Date) : number {
		// do not mutate incoming obj!
		const localDate = new Date(input);

		localDate.setUTCHours(23);
		localDate.setUTCMinutes(59);
		localDate.setUTCSeconds(59);
		localDate.setUTCMilliseconds(999);
		return localDate.valueOf();
	}

	_getFlattenedUnixDate(input: Date) : number {
		// do not mutate incoming obj!
		const localDate = new Date(input);

		localDate.setUTCHours(0);
		localDate.setUTCMinutes(0);
		localDate.setUTCSeconds(0);
		localDate.setUTCMilliseconds(0);
		return localDate.valueOf();
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
		return thisRatio * (this.chartWidth - this.chartAreaXOffset);
	}

	_getYCoord(y: number): number {
		const totalHeight = this.maxY - this.minY;

		const thisRatio = y / totalHeight;
		const transform = -1 * thisRatio * this.chartHeight + (this.chartHeight / 2);

		return transform;
	}

	_getYAxis(): {index: number, y: number, label: string}[] {
		// just output 3 Y gridlines: 25%, 50%, 75%
		const gridlines = 5;
		const gridSpace = this.chartHeight / (gridlines - 1);
		const labelIncrement = (this.maxY - this.minY) / (gridlines - 1);

		let result = [...Array(gridlines).keys()].map(i => {
			return {
				index: i,
				y: i * gridSpace,
				label: `${this.maxY - labelIncrement * i}`
			};
		});

		console.log('_getYAxisYPos result', result);
		return result;
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
			// this gives straight line path:
			(i.index === 0 ? 'M ' : 'L ') + i.x + ',' + i.y

			// this gives sine wave, if i'm lucky:
			// (i.index === 0 ? 'm ' : (i.index === 1 ? 'c ' : '') ) + i.x + ',' + i.y
		);
		let result = points.join(' ');
		console.log(result);
		return result;
	}

	_getCalendarLabels() : {day: string, date: string}[] {
		const days = this._getChartDays(this.minDate, this.maxDate);
		let currentDate = this.minDate;

		let result = [...Array(days).keys()].map(i => {
			const msInDay = 24 * 60 * 60 * 1000;
			let offset = msInDay * i;
			currentDate = new Date(currentDate.getTime() + offset);

			currentDate = new Date()
			return {
				day: 'asfd',
				date: `${currentDate.getUTCDate()}`

			};
		});

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

		// console.log('chart days', chartDays);
		/****** END items that may need to transfer to state later ******/

		const yAxis = this._getYAxis();

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
					<button onClick={this._getChartData.bind(this)}>Get Tides</button>

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
						{this._getDaylightRects().map(day =>
							<rect class="chartDaylight" id={`${day.index}`} width={day.width} height={this.chartHeight} x={day.x} y="0" />
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
								<circle class="tideMarker" id={`tide-marker-${i.index}`} cx={i.x} cy={i.y} r="7" />
							)
						}
						<path class="tideSineWave" id="tideSineWave" d={this._getTideSineWave()} />
					</g>

					<g id="y-axis-ticks-and-labels">
						{
							yAxis.map(i =>
								<path class="yGridline" id={`y-tick-${i.index}`} d={`M ${this.chartAreaXOffset},${i.y} H ${this.chartWidth}`} />
							)
						}
						{
							yAxis.slice(1, yAxis.length - 1).map(i =>
								<text class="yTickLabel" id={`y-tick-${i.index}`} text-anchor="end" alignment-baseline="middle" x={this.chartAreaXOffset - 5} y={i.y}>{i.label}</text>
							)
						}
					</g>
				</svg>
			</Host>
		);
	}
}
