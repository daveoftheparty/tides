import { Component, h, Host } from "@stencil/core";
import { GetTides, TideResponse } from '../../services/TideApi';
import { GetDaylight, DaylightResponse } from '../../services/DaylightApi';
import { State } from "@stencil/core";
import { GetExpandedUnixDate, GetFlattenedUnixDate, UtcToLocal } from "../../services/DateUtils";


// TODO: station (Bob Hall Pier) is hard coded, need station selector
// TODO: is the tide data what we really want? MLLW type? explore other types?
// TODO: filter tide retrieval by local? since we are retrieving tides in UTC and graphing in local, we have some instances where an "early GMT" tide transitions to the day before and the left side of the tide sine wave/markers crosses the YAxis marker. Example: we want tides from 9/14 - 9/20 local, but we get a GMT tide for 9/14 2:07 am that tranlates into 9/13 9:07 pm

@Component({
	tag: 'ds-tide-chart',
	styleUrl: './tide-chart.css',
	shadow: true
})
export class TideChart {
	beginDateInput : HTMLInputElement;
	endDateInput : HTMLInputElement;
	beginDate: Date;
	endDate: Date;

	@State() tides : TideResponse[] = [];
	tidesMinY: number;
	tidesMaxY: number;

	@State() daylight : DaylightResponse[] = [];
	@State() loaded = false;

	@State() showDebug = false;

	chartWidth = 800;
	chartHeight = 200;

	chartFontSize = 9; // TODO this should be relative to/calculated by chart width/height
	chartAreaXOffset = 25; // TODO this should be based on the font size of the y-axis labels
	chartAreaYOffsetTop = 25; // TODO this should be based on the font size of the x-axis top series labels
	chartAreaYOffsetBottom = 35; // TODO this should be based on the font size of the x-axis-daylight-labels

	chartAreaHeight = this.chartHeight - this.chartAreaYOffsetTop - this.chartAreaYOffsetBottom;

	componentDidLoad() {
		const today = new Date(GetFlattenedUnixDate(new Date()));
		const toOneWeek = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
		this.beginDateInput.valueAsDate = today;
		this.endDateInput.valueAsDate = toOneWeek;
	}

	_getChartData() {
		this.beginDate = this.beginDateInput.valueAsDate;
		this.endDate = this.endDateInput.valueAsDate;

		// TODO currently hard coded to "Bob Hall Pier, Corpus Christi", StationId 8775870, lat/long: 27.58,-97.216
		this._getTides()
			.then(tides => {
				this.tides = tides;
				this.loaded = true;
			});
		const daylight = this._getDaylight();


		// assign state last after all calcs to avoid re-renders:
		// TODO: make only this.loaded state? could avoid the re-render problem...
		this.daylight = daylight;
	}

	_getDaylight() : DaylightResponse[] {
		return GetDaylight(this.beginDate, this.endDate);
	}

	_getTides() : Promise<TideResponse[]> {
		return GetTides(this.beginDate, this.endDate)
			.then(tides => {
				console.log('getTides response:', tides);
				this._setTidesYAxisRange(tides);
				return tides;
			});
	}

	_setTidesYAxisRange(tides: TideResponse[]) {
		this.tidesMinY = tides.reduce((min, current) => current.level < min ? current.level : min, tides[0].level);
		this.tidesMaxY = tides.reduce((max, current) => current.level > max ? current.level : max, tides[0].level);
	}

	_getChartDays(): number {
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
			Math.abs(Number(this.beginDate) - Number(this.endDate)) / msInDay
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

	_getDaylightLabels() : {index: number, x: number, y: number, label: string}[] {
		const result: {index: number, x: number, y: number, label: string}[]= [];

		this.daylight.forEach((daylight, i) => {
			[daylight.rise, daylight.set].map(day => {
				result.push(
				{
					index: i,
					x: this._getXForDate(day),
					y: this.chartHeight - this.chartAreaYOffsetBottom + 3,
					label: `${day.getHours()}:${day.getMinutes()}`
				});
			})
		});

		console.log('getDaylightRects result', result);
		return result;
	}

	_getChartDayRects(): {index: number, x: number, width: number}[] {
		const chartDays = this._getChartDays();
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
		const chartDays = this._getChartDays();
		const dayWidth = (this.chartWidth - this.chartAreaXOffset) / chartDays;

		let result = [...Array(chartDays + 1).keys()].map(i => ({
			index: i,
			x: i * dayWidth + this.chartAreaXOffset
		}));

		return result;
	}

	_getXForDate(input: Date, log: boolean = false): number {

		const inputLocal = UtcToLocal(input);
		const expandedMaxDate = GetExpandedUnixDate(this.endDate);
		const flattenedMinDate = GetFlattenedUnixDate(this.beginDate);
		const chartDateDiff = expandedMaxDate - flattenedMinDate;

		const thisRatio = (inputLocal.valueOf() - flattenedMinDate) / chartDateDiff;
		if(log) {
			console.log(
				'getxfordate input:', inputLocal.toISOString(),
				'input valueOf():', inputLocal.valueOf(),
				'flattenedMinDate:', new Date(flattenedMinDate).toISOString(),
				'flattenedMinDate valueOf():', new Date(flattenedMinDate).valueOf(),
				'expandedMaxDate:', new Date(expandedMaxDate).toISOString(),
				'expandedMaxDate valueOf():', new Date(expandedMaxDate).valueOf(),
				'ratio:', thisRatio);
		}

		// const thisRatio = input.valueOf() / expandedMaxDate;
		return thisRatio * (this.chartWidth - this.chartAreaXOffset) + this.chartAreaXOffset;
	}

	_getYCoord(y: number): number {
		const spread = this.tidesMaxY - this.tidesMinY;
		const basis = y - this.tidesMinY;
		const thisRatio = basis / spread;

		const transform = (this.chartAreaHeight + this.chartAreaYOffsetTop)
			- (thisRatio * this.chartAreaHeight);

		if(y === this.tidesMinY)
			console.log('_getYCoord for min', y, 'has basis', basis, 'and ratio', thisRatio, 'and is returning', transform);
		return transform;
	}

	_getYAxis(): {index: number, y: number, label: string}[] {
		const gridlines = 5;
		const gridSpace = this.chartAreaHeight / (gridlines - 1);
		const labelIncrement = (this.tidesMaxY - this.tidesMinY) / (gridlines - 1);

		let result = [...Array(gridlines).keys()].map(i => {
			let labelNumber = Math.round(( (this.tidesMaxY - labelIncrement * i) + Number.EPSILON) * 100) / 100;
			return {
				index: i,
				y: i * gridSpace + this.chartAreaYOffsetTop,
				label: `${labelNumber}`
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
		// console.log(result);
		return result;
	}

	_getCalendarLabels() : {index: number, x: number, day: string, date: string}[] {
		const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const days = this._getChartDays();
		const chartRects = this._getChartDayRects();
		// TODO: replace this date stuff with DateRangeToArray()
		let result = [...Array(days).keys()].map(i => {
			const msInDay = 24 * 60 * 60 * 1000;
			let offset = msInDay * i;
			let currentDate = new Date(this.beginDate.getTime() + offset);

			return {
				index: i,
				x: (chartRects[i].width / 2) + chartRects[i].x,
				day: dayNames[currentDate.getUTCDay()],
				date: `${currentDate.getUTCMonth() + 1}/${currentDate.getUTCDate()}`
			};
		});

		return result;
	}

	_toggleDebug() {
		this.showDebug = !this.showDebug;
	}

	_getChartStyle() : string {
		return `
			#chartArea {
				fill: white;
			}

			.chartDayDark {
				fill: rgb(31, 31, 83);
			}
			.chartDaylight {
				/* fill: rgb(205, 205, 255); */
				fill: rgb(151, 151, 190);
			}
			.tideMarker {
				fill: rgb(0, 255, 236);
			}
			.tideSineWave {
				stroke: rgb(0, 255, 236);
				stroke-width: 3px;
				fill: none;
			}

			.xGridline,
			.yGridline {
				stroke: gray;
			}

			svg .yTickLabel {
				fill: black;
			}
	`;
	}

	render() {
		let chart = '';

		if(this.loaded) {
			let debugContent = '';

			let tideDebug = <ul>{this.tides.map(result =>
				<li><strong>{result.when.toISOString()}</strong> - Ms since 1970: {result.when.getTime()} Level: {result.level}</li>
			)}</ul>;

			let daylightDebug = <ul>{this.daylight.map(result =>
				<li><strong>{result.when.toISOString()}</strong> Rise: {result.rise.toLocaleString()} Set: {result.set.toLocaleString()}</li>
			)}</ul>;

			if(this.showDebug) {
				debugContent =
					<div>
						<h2>debug begin/enddate state</h2>
						<p>BeginDate: {this.beginDate.toISOString()}</p>
						<p>EndDate: {this.endDate.toISOString()}</p>

						<h2>debug tide response</h2>
						{tideDebug}
						<p>Max Y: {this.tidesMaxY}</p>
						<p>Min Y: {this.tidesMinY}</p>

						<h2>debug daylight response</h2>
						{daylightDebug}

					</div>
			}

			const yAxis = this._getYAxis();
			this._getTideSineWave();

			chart =
			<div id="chartContainer">
				<p><button onClick={this._toggleDebug.bind(this)}>Toggle Debug Info</button></p>
				{debugContent}
				<svg id="chart" viewBox={`0 0 ${this.chartWidth} ${this.chartHeight}`} xmlns="http://www.w3.org/2000/svg">
					<style>
						{this._getChartStyle()}
					</style>
					<rect id="chartArea" width="100%" height="100%" />
					<g id="days">
						{this._getChartDayRects().map(day =>
							<rect class="chartDayDark" id={`${day.index}`} width={day.width} height={this.chartAreaHeight} x={day.x} y={this.chartAreaYOffsetTop} />
						)}
						{this._getDaylightRects().map(day =>
							<rect class="chartDaylight" id={`${day.index}`} width={day.width} height={this.chartAreaHeight} x={day.x} y={this.chartAreaYOffsetTop} />
						)}
					</g>
					<g id="x-axis-day-ticks">
						{
							this._getChartXAxisGridlines().map(i =>
								<path class="xGridline" id={`x-tick-${i.index}`} d={`M ${i.x},${this.chartAreaYOffsetTop / 2} V ${this.chartHeight - this.chartAreaYOffsetBottom / 2}`} />
							)
						}
					</g>

					<clipPath
						id="tideClip">
						<rect
							x={this.chartAreaXOffset}
							y={this.chartAreaYOffsetTop}
							width={this.chartWidth - this.chartAreaXOffset }
							height={this.chartAreaHeight} />
					</clipPath>
					<g id="tides" clip-path="url(#tideClip)">
						<path class="tideSineWave" id="tideSineWave" d={this._getTideSineWave()} />
						{
							this._getTideCoords().map(i =>
								<circle class="tideMarker" id={`tide-marker-${i.index}`} cx={i.x} cy={i.y} r="4">
									<title>{this.tides[i.index].level} ft at {this.tides[i.index].when.toLocaleTimeString()}</title>
								</circle>
							)
						}
					</g>

					<g id="y-axis-ticks-and-labels">
						{
							yAxis.map(i =>
								<path class="yGridline" id={`y-tick-${i.index}`} d={`M ${this.chartAreaXOffset},${i.y} H ${this.chartWidth}`} />
							)
						}
						{
							// yAxis.slice(1, yAxis.length - 1).map(i =>
							yAxis.map(i =>
								<text
									class="yTickLabel" id={`y-tick-${i.index}`}
									text-anchor="end" alignment-baseline="middle"
									x={this.chartAreaXOffset - 5} y={i.y}
									font-size={this.chartFontSize}
								>
									{i.label}
								</text>
							)
						}
					</g>
					<g id="x-axis-top-series-labels">
						{
							this._getCalendarLabels().map(i =>
								<text
									class="xAxisTopSeriesLabel" id={`x-top-label-${i.index}`}
									text-anchor="middle" dominant-baseline="hanging"
									y="5"
									font-size={this.chartFontSize}
								>
									<tspan x={i.x} text-anchor="middle">{i.day}</tspan>
									<tspan x={i.x} dy="1.2em" text-anchor="middle">{i.date}</tspan>
								</text>
							)
						}
					</g>
					<g id="x-axis-daylight-labels">
						{
							this._getDaylightLabels().map(i =>
								<text
									class="xAxisDaylightLabel" id={`x-axis-daylight-label-${i.index}`}
									text-anchor="end" dominant-baseline="middle" transform={`rotate(270, ${i.x}, ${i.y})`}
									x={i.x} y={i.y}
									font-size={this.chartFontSize}
								>
									{i.label}
									<span>hi</span>
								</text>
							)
						}
					</g>
				</svg>
			</div>
		}


		return (
			<Host>
				<div id="userInput">
					<p>
						Begin Date: <input
							id="begin-date"
							type="date"
							ref={el => this.beginDateInput = el}
						/>
					</p>
					<p>
						End Date: <input
							id="end-date"
							type="date"
							ref={el => this.endDateInput = el}
						/>
					</p>
					<button onClick={this._getChartData.bind(this)}>Get Tides</button>
				</div>
				{chart}
			</Host>
		);
	}
}
