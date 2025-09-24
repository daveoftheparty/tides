import { Component, h, Host, Prop, Element } from "@stencil/core";
import { GetTides, TideResponse } from '../../services/TideApi';
import { GetDaylight, DaylightResponse } from '../../services/DaylightApi';
import { State } from "@stencil/core";
import { GetExpandedUnixDate, GetFlattenedUnixDate, UtcToLocal } from "../../services/DateUtils";
import { TideStationsResponse }  from "../../services/TideStationsApi";
import { GetMoonTimes, MoonRiseSet } from "../../services/Moon";

// TODO: station (Bob Hall Pier) is hard coded, need station selector
// TODO: is the tide data what we really want? MLLW type? explore other types?
// TODO: filter tide retrieval by local? since we are retrieving tides in UTC and graphing in local, we have some instances where an "early GMT" tide transitions to the day before and the left side of the tide sine wave/markers crosses the YAxis marker. Example: we want tides from 9/14 - 9/20 local, but we get a GMT tide for 9/14 2:07 am that tranlates into 9/13 9:07 pm

type Rect = {
	x: number,
	y: number,
	width: number,
	height: number
}


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

	@Element() hostElement: HTMLElement;
	@Prop() station: TideStationsResponse;
	@State() tides : TideResponse[] = [];
	tidesMinY: number;
	tidesMaxY: number;

	@State() daylight : DaylightResponse[] = [];
	@State() loaded = false;

	@State() showDebug = false;

	@State() moonData: MoonRiseSet[] = [];

	chartWidth = 800;
	chartHeight = 200;

	chartFontSize = 9; // TODO this should be relative to/calculated by chart width/height
	chartAreaXOffset = 25; // TODO this should be based on the font size of the y-axis labels
	chartAreaYOffsetTop = 25; // TODO this should be based on the font size of the x-axis top series labels
	chartAreaYOffsetBottom = 35; // TODO this should be based on the font size of the x-axis-daylight-labels

	chartAreaHeight = this.chartHeight - this.chartAreaYOffsetTop - this.chartAreaYOffsetBottom;

	chartRect: Rect;
	xAxisHeaderRect: Rect;
	yAxisRect: Rect;
	moonRect: Rect;
	xAxisFooterRect: Rect;
	dayPlotArea: Rect;
	tidePlotArea: Rect;


	constructor() {
		// TODO: move all chart sizes that are declared outside this method into here
		this.chartRect = { x: 0, y: 0, width: 800, height: 200 };
		this.xAxisHeaderRect = { x: this.chartAreaXOffset, y: this.chartRect.y, width: this.chartRect.width - this.chartAreaXOffset, height: this.chartAreaYOffsetTop };
		this.yAxisRect = { x: this.chartRect.x, y: this.chartRect.y, width: this.chartAreaXOffset, height: this.chartRect.height };
		this.moonRect = { x: this.xAxisHeaderRect.x, y: this.xAxisHeaderRect.y + this.xAxisHeaderRect.height, width: this.xAxisHeaderRect.width, height: 25}
		this.xAxisFooterRect = { x: this.xAxisHeaderRect.x, y: this.chartRect.height - this.chartAreaYOffsetBottom, width: this.xAxisHeaderRect.width, height: this.chartAreaYOffsetBottom };
		this.dayPlotArea = { x: this.xAxisHeaderRect.x, y: this.moonRect.y, width: this.xAxisHeaderRect.width, height: this.chartRect.height - this.xAxisHeaderRect.height - this.xAxisFooterRect.height };
		this.tidePlotArea = { x: this.dayPlotArea.x, y: this.moonRect.y + this.moonRect.height, width: this.dayPlotArea.width, height: this.dayPlotArea.height - this.moonRect.height };
	}

	componentDidLoad() {
		const today = new Date(GetFlattenedUnixDate(new Date()));
		const toOneWeek = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
		this.beginDateInput.valueAsDate = today;
		this.endDateInput.valueAsDate = toOneWeek;
	}

	_getChartData() {
		this.beginDate = this.beginDateInput.valueAsDate;
		this.endDate = this.endDateInput.valueAsDate;

		// TODO: extend dates since we are now clipping the svg to the chart area and we want to see the full sine wave
		this._getTides()
			.then(tides => {
				this.tides = tides;
				this.loaded = true;
			});


		this.moonData = GetMoonTimes(this.beginDate, this.endDate, this.station.lat, this.station.lng);
		const daylight = this._getDaylight();


		// assign state last after all calcs to avoid re-renders:
		// TODO: make only this.loaded state? could avoid the re-render problem...
		this.daylight = daylight;
	}

	_getDaylight() : DaylightResponse[] {
		return GetDaylight(this.beginDate, this.endDate, this.station.lat, this.station.lng);
	}

	_getTides() : Promise<TideResponse[]> {
		// return GetTides(this.beginDate, this.endDate, this.station.id)
		// 		.then(tides => {
		// 		console.log('getTides response:', tides);
		// 		this._setTidesYAxisRange(tides);
		// 		return tides;
		// 	});

		let tides = this._mockTides();
		this._setTidesYAxisRange(tides);
		console.log('mock tides', tides);
		return Promise.resolve(tides);
	}

	_mockTides() : TideResponse[] {

		return [
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 10, 0, 0), level: 4},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 16, 0, 0), level: 1},

			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 10, 0, 0), level: 4},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 12, 0, 0), level: 3},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 14, 0, 0), level: 2},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 16, 0, 0), level: 1},
		]
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

	_getDaylightRectsNew() : {index: number, x: number, width: number}[] {
		let result = this.daylight.map((daylight, i) => ({
			index: i,
			x: this._getXForDateNew(daylight.rise),
			width: this._getXForDateNew(daylight.set) - this._getXForDateNew(daylight.rise)
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

	_getChartDayRectsNew(): {index: number, x: number, width: number}[] {
		const chartDays = this._getChartDays();
		console.log('chart days', chartDays);
		const dayWidth = this.dayPlotArea.width / chartDays;

		let result = [...Array(chartDays).keys()].map(i => ({
			index: i,
			x: i * dayWidth + this.dayPlotArea.x,
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

	_getChartXAxisGridlinesNew(): {index: number, x: number}[] {
		const chartDays = this._getChartDays();
		const dayWidth = (this.chartWidth - this.chartAreaXOffset) / chartDays;

		let result = [...Array(chartDays + 1).keys()].map(i => ({
			index: i,
			x: i * dayWidth + this.yAxisRect.width
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

	_getXForDateNew(input: Date, log: boolean = false): number {

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
		return thisRatio * this.dayPlotArea.width + this.yAxisRect.y;
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

	_getYCoordNew(y: number): number {
		const spread = this.tidesMaxY - this.tidesMinY;
		const basis = y - this.tidesMinY;
		const thisRatio = basis / spread;

		const transform = this.tidePlotArea.height + this.tidePlotArea.y - (thisRatio * this.tidePlotArea.height);

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

	_getYAxisNew(): {index: number, y: number, label: string}[] {
		const gridlines = 5;
		const gridSpace = this.dayPlotArea.height / (gridlines - 1);
		const labelIncrement = (this.tidesMaxY - this.tidesMinY) / (gridlines - 1);

		let result = [...Array(gridlines).keys()].map(i => {
			let labelNumber = Math.round(( (this.tidesMaxY - labelIncrement * i) + Number.EPSILON) * 100) / 100;
			return {
				index: i,
				y: i * gridSpace + this.dayPlotArea.y,
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

	_getTideCoordsNew() : {index: number, x: number, y: number}[] {
		let i = 0;
		let result = this.tides.map(tide => ({
			index: i++,
			x: this._getXForDateNew(tide.when),
			y: this._getYCoordNew(tide.level)
		}));

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
	_getTideSineWaveNew() : string {
		let points = this._getTideCoordsNew().map(i =>
			// this gives straight line path:
			(i.index === 0 ? 'M ' : 'L ') + i.x + ',' + i.y
		);
		let result = points.join(' ');
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

	_clearStationData() {
		this.tides = [];
		this.daylight = [];
		this.loaded = false;
		this.hostElement.dispatchEvent(new CustomEvent('resetStation', {bubbles: true }));
		console.log('clearing station data and dispatching resetStation event');
	}

	_getSvgOld() : string {
		// TODO: delete me once ready
		const yAxis = this._getYAxis();

		let svg =

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

		return svg;
	}

	_getNewSvgLayoutRectsOnly() : string {
		let svg =
			<svg id="chart" viewBox={`0 0 ${this.chartRect.width} ${this.chartRect.height}`} xmlns="http://www.w3.org/2000/svg">
				<rect id="chartArea" width="100%" height="100%" fill="rgb(128, 128, 128)" />
				<rect id="yAxisRect" x={this.yAxisRect.x} y={this.yAxisRect.y} width={this.yAxisRect.width} height={this.yAxisRect.height} fill="rgb(0, 255, 236)" />
				<rect id="xAxisHeaderRect" x={this.xAxisHeaderRect.x} y={this.xAxisHeaderRect.y} width={this.xAxisHeaderRect.width} height={this.xAxisHeaderRect.height} fill="rgb(255, 128, 0)" />
				<rect id="moonRect" x={this.moonRect.x} y={this.moonRect.y} width={this.moonRect.width} height={this.moonRect.height} fill="rgb(255, 255, 0)" />
				<rect id="xAxisFooterRect" x={this.xAxisFooterRect.x} y={this.xAxisFooterRect.y} width={this.xAxisFooterRect.width} height={this.xAxisFooterRect.height} fill="rgb(0, 128, 255)" />
				<rect id="dayPlotArea" x={this.dayPlotArea.x} y={this.dayPlotArea.y} width={this.dayPlotArea.width} height={this.dayPlotArea.height} fill="rgb(128, 0, 255)" />
				<rect id="tidePlotArea" x={this.tidePlotArea.x} y={this.tidePlotArea.y} width={this.tidePlotArea.width} height={this.tidePlotArea.height} fill="rgb(255, 0, 128)" />
			</svg>

		return svg;
	}

	// TODO: get rid of all methods that don't have the NEW suffix and rename all the NEW suffix methods
	_getNewSvg() : string {
		const yAxis = this._getYAxisNew();

		let svg =
			<svg id="chart" viewBox={`0 0 ${this.chartRect.width} ${this.chartRect.height}`} xmlns="http://www.w3.org/2000/svg">
				<style>
					{this._getChartStyle()}
				</style>
				<rect id="chartArea" width="100%" height="100%" fill="rgb(128, 128, 128)" />
				<g id="days">
					{this._getChartDayRectsNew().map(day =>
						<rect class="chartDayDark" id={`dark${day.index}`} width={day.width} height={this.dayPlotArea.height} x={day.x} y={this.dayPlotArea.y} />
					)}
					{this._getDaylightRectsNew().map(day =>
						<rect class="chartDaylight" id={`light${day.index}`} width={day.width} height={this.dayPlotArea.height} x={day.x} y={this.dayPlotArea.y} />
					)}
				</g>
				<g id="x-axis-day-ticks">
					{
						this._getChartXAxisGridlinesNew().map(i =>
							<path class="xGridline" id={`x-tick-${i.index}`} d={`M ${i.x},${this.xAxisHeaderRect.height / 2} V ${this.chartRect.height - this.xAxisFooterRect.height / 2}`} />
						)
					}
				</g>


				<clipPath
					id="tideClip">
					<rect
						x={this.tidePlotArea.x}
						y={this.tidePlotArea.y}
						width={this.tidePlotArea.width}
						height={this.tidePlotArea.height} />
				</clipPath>
				<g id="tides" clip-path="url(#tideClip)">
					<path class="tideSineWave" id="tideSineWave" d={this._getTideSineWaveNew()} />
					{
						this._getTideCoordsNew().map(i =>
							<circle class="tideMarker" id={`tide-marker-${i.index}`} cx={i.x} cy={i.y} r="4">
								<title>{this.tides[i.index].level} ft at {this.tides[i.index].when.toLocaleTimeString()}</title>
							</circle>
						)
					}
				</g>
				<g id="y-axis-ticks-and-labels">
					{
						yAxis.map(i =>
							<path class="yGridline" id={`y-tick-${i.index}`} d={`M ${this.dayPlotArea.x},${i.y} H ${this.chartRect.width}`} />
						)
					}
					{
						yAxis.map(i =>
							<text
								class="yTickLabel" id={`y-tick-${i.index}`}
								text-anchor="end" alignment-baseline="middle"
								x={this.dayPlotArea.x - 5} y={i.y}
								font-size={this.chartFontSize}
							>
								{i.label}
							</text>
						)
					}
				</g>
			</svg>

		return svg;
	}

	render() {
		let chart = '';
		let debugContent = '';

		if(this.loaded) {

			let tideDebug = <ul>{this.tides.map(result =>
				<li><strong>{result.when.toISOString()}</strong> - Ms since 1970: {result.when.getTime()} Level: {result.level}</li>
			)}</ul>;

			let daylightDebug = <ul>{this.daylight.map(result =>
				<li><strong>{result.when.toISOString()}</strong> Rise: {result.rise.toLocaleString()} Set: {result.set.toLocaleString()}</li>
			)}</ul>;

			let moonRiseSetDebug = <ul>{this.moonData.map(result =>
					<li>Rise: {result.rise.toLocaleString()} Set: {result.set.toLocaleString()} Illumination: {result.illumination} </li>
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

						<h2>debug moonlight response</h2>
						{moonRiseSetDebug}

					</div>
			}

			chart =
				<div id="chartContainer">
					<p><button onClick={this._toggleDebug.bind(this)}>Toggle Debug Info</button></p>
					{debugContent}
					{this._getNewSvg()}
				</div>
		}


		return (
			<Host>
				<div id="userInput">
					<h2>Tide Predictions for {this.station.name}</h2>
					<button onClick={this._clearStationData.bind(this)}>Choose Another Station</button>


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
