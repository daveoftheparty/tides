import { Component, h, Host, Prop, Element } from "@stencil/core";
import { GetTides, TideResponse } from '../../services/TideApi';
import { GetDaylight, DaylightResponse } from '../../services/DaylightApi';
import { State } from "@stencil/core";
import { GetExpandedUnixDate, GetFlattenedUnixDate, UtcToLocal } from "../../services/DateUtils";
import { TideStationsResponse }  from "../../services/TideStationsApi";
import { GetMoonTimes, MoonRiseSet } from "../../services/Moon";


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
	@State() debugMoonOpen = false;
	@State() debugSunOpen = false;
	@State() debugTideOpen = false;
	@State() debugDateRangeOpen = false;

	@State() moonData: MoonRiseSet[] = [];




	chartRect: Rect;
	xAxisHeaderRect: Rect;
	yAxisRect: Rect;
	moonRect: Rect;
	xAxisFooterRect: Rect;
	dayPlotArea: Rect;
	tidePlotArea: Rect;
	chartFontSize: number;


	// TODO: clean up console logs. there is a lot there. put behind a new this.log variable-- it is currently being passed into a method but not declared "globally"
	// TODO: create new component that explains how to read the chart, and create a button or link above the chart to redirect to that component
	// TODO: style the user input box so that it doesn't take up half the vertical space on the screen
	// TODO: add gridline on the Y axis at the top of day plot area below day labels
	// TODO: consider adding a y Axis title named "Moon" so that it's a little more obvious what that row is
	// TODO: consider adding a y Axis title named "Sunrise/Set" at bottom of chart so that it's more obvious what the times are
	// TODO: consider adding twilight before and after sunrise/set: new rects with different color
	// TODO: consider reducing tide api date call so there isn't too much extra info, impacting the tideMax and tideMin more than we need
	// TODO: consider putting a render() counter and seeing if I have the lifecycle right for componentDidLoad and the API async calls

	// TODO: have a close look at the daylight debug data. ISO/Local seems to be off from each other and not sure the dates are correct for daylight!
	constructor() {
		const yAxisWidth = 25;
		const xAxisFooterHeight = 35;

		this.chartFontSize = 9; // TODO this should MAYBE be relative to/calculated by chart width/height

		this.chartRect = { x: 0, y: 0, width: 800, height: 200 };
		this.xAxisHeaderRect = { x: yAxisWidth, y: this.chartRect.y, width: this.chartRect.width - yAxisWidth, height: 25 };
		this.moonRect = { x: this.xAxisHeaderRect.x, y: this.xAxisHeaderRect.y + this.xAxisHeaderRect.height, width: this.xAxisHeaderRect.width, height: 25}
		this.xAxisFooterRect = { x: this.xAxisHeaderRect.x, y: this.chartRect.height - xAxisFooterHeight, width: this.xAxisHeaderRect.width, height: xAxisFooterHeight };
		this.yAxisRect = { x: this.chartRect.x, y: this.moonRect.y + this.moonRect.height, width: yAxisWidth, height: this.chartRect.height - this.xAxisHeaderRect.height - this.moonRect.height - this.xAxisFooterRect.height };
		this.dayPlotArea = { x: this.xAxisHeaderRect.x, y: this.moonRect.y, width: this.xAxisHeaderRect.width, height: this.chartRect.height - this.xAxisHeaderRect.height - this.xAxisFooterRect.height };
		this.tidePlotArea = { x: this.xAxisHeaderRect.x, y: this.moonRect.y + this.moonRect.height, width: this.xAxisHeaderRect.width, height: this.dayPlotArea.height - this.moonRect.height };
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
		// this.moonData = this._mockMoonTimes();
		const daylight = this._getDaylight();


		// assign state last after all calcs to avoid re-renders:
		// TODO: make only this.loaded state? could avoid the re-render problem...
		this.daylight = daylight;
	}

	_getDaylight() : DaylightResponse[] {
		return GetDaylight(this.beginDate, this.endDate, this.station.lat, this.station.lng);
		// return this._mockDaylight();
	}

	_mockMoonTimes() : MoonRiseSet[] {
		let result: MoonRiseSet[] = [];

		this._mockDaylight().forEach(d => {
			result.push({
				rise: d.rise,
				set: d.set,
				illumination: "foo%"
			});
		});

		return result;
	}


	_mockDaylight() : DaylightResponse[] {
		let mockDaylight = [
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 0, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 23, 59, 59),
			},
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 2, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 22, 0, 0),
			},
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 3, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 3, 4, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 3, 20, 0, 0),
			},
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 4, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 4, 6, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 4, 18, 0, 0),
			},
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 5, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 5, 8, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 5, 16, 0, 0),
			},
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 6, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 6, 10, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 6, 14, 0, 0),
			},
			{
				when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 7, 0, 0, 0),
				rise: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 7, 12, 0, 0),
				set: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 7, 12, 59, 59),
			},

		];

		console.log('mockDaylight', mockDaylight);
		return mockDaylight;
	}

	_getTides() : Promise<TideResponse[]> {
		// expand input so we make sure we get full sine waves at the edges
		let adjustedStart = new Date(this.beginDate);
		adjustedStart.setDate(adjustedStart.getDate() - 3);
		let adjustedEnd = new Date(this.endDate);
		adjustedEnd.setDate(adjustedEnd.getDate() + 3);

		return GetTides(adjustedStart, adjustedEnd, this.station.id)
				.then(tides => {
				console.log('getTides response:', tides);
				this._setTidesYAxisRange(tides);
				return tides;
			});

		// let tides = this._mockTides();
		// this._setTidesYAxisRange(tides);
		// console.log('mock tides', tides);
		// return Promise.resolve(tides);
	}

	_mockTides() : TideResponse[] {

		return [
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 10, 0, 0), level: 5},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 1, 16, 0, 0), level: 1},

			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 8, 0, 0), level: 5},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 10, 0, 0), level: 4},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 12, 0, 0), level: 3},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 14, 0, 0), level: 2},
			{when: new Date(this.beginDate.getFullYear(), this.beginDate.getMonth(), this.beginDate.getDate() + 2, 16, 0, 0), level: 1},
		]
	}

	_setTidesYAxisRange(tides: TideResponse[]) {


		let minHeight = tides.reduce((min, current) => current.level < min ? current.level : min, tides[0].level);
		let maxHeight = tides.reduce((max, current) => current.level > max ? current.level : max, tides[0].level);


		let buffer = (maxHeight - minHeight) * 0.05; // add 5% buffer space for visuals
		this.tidesMinY = minHeight - buffer;
		this.tidesMaxY = maxHeight + buffer;
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


	_getXAxisBottomLabels() : {index: number, x: number, y: number, label: string}[] {
		const result: {index: number, x: number, y: number, label: string}[]= [];

		this.daylight.forEach((daylight, i) => {
			[daylight.rise, daylight.set].map(day => {
				result.push(
				{
					index: i,
					x: this._getXForDate(day),
					y: this.xAxisFooterRect.y + 3,
					label: `${('00' + day.getHours()).slice(-2)}:${('00' + day.getMinutes()).slice(-2)}`
				});
			})
		});

		console.log('_getXAxisBottomLabels result', result);
		return result;
	}


	_getChartDayRects(): {index: number, x: number, width: number}[] {
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
		const dayWidth = (this.chartRect.width - this.yAxisRect.width) / chartDays;

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
		return thisRatio * this.dayPlotArea.width + this.yAxisRect.width;
	}


	_getYCoord(y: number): number {
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
		const gridSpace = this.yAxisRect.height / (gridlines - 1);
		const labelIncrement = (this.tidesMaxY - this.tidesMinY) / (gridlines - 1);

		let result = [...Array(gridlines).keys()].map(i => {
			let labelNumber = Math.round(( (this.tidesMaxY - labelIncrement * i) + Number.EPSILON) * 100) / 100;
			return {
				index: i,
				y: i * gridSpace + this.yAxisRect.y,
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

		return result;
	}


	_getTideSineWave() : string {
		let points = this._getTideCoords().map(i =>
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

	_getMoonData() : {
			index: number,
			x: number, y: number, width: number, height: number,
			rise: Date, set: Date,
			illumination: string}[] {
		const rectHeight = 15;
		let i = 0;
		let result = this.moonData.map(moon => ({
			index: i++,
			x: this._getXForDate(moon.rise),
			y: (this.moonRect.height - rectHeight) / 2  + this.moonRect.y,
			width: this._getXForDate(moon.set) - this._getXForDate(moon.rise),
			height: rectHeight,
			rise: moon.rise,
			set: moon.set,
			illumination: moon.illumination
		}));

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
				fill: rgb(0, 34, 43);
			}
			.chartDaylight {
				/* fill: rgb(205, 205, 255); */
				fill: rgb(170, 238, 255);
			}
			.tideMarker {
				fill: rgb(42, 127, 255);
			}
			.tideSineWave {
				// stroke: rgb(0, 255, 236);
				stroke: rgb(42, 127, 255);
				stroke-width: 2px;
				fill: none;
			}

			.xGridline,
			.yGridline {
				stroke: gray;
			}

			svg .yTickLabel {
				fill: black;
			}
			.chartMoonData {
				fill: rgb(151, 151, 190);;
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


	_getSvg() : string {
		const yAxis = this._getYAxis();

		let svg =
			<svg id="chart" viewBox={`0 0 ${this.chartRect.width} ${this.chartRect.height}`} xmlns="http://www.w3.org/2000/svg">
				<style>
					{this._getChartStyle()}
				</style>
				<rect id="chartArea" width="100%" height="100%" fill="rgb(128, 128, 128)" />
				<g id="days">
					{this._getChartDayRects().map(day =>
						<rect class="chartDayDark" id={`dark${day.index}`} width={day.width} height={this.dayPlotArea.height} x={day.x} y={this.dayPlotArea.y} />
					)}
					{this._getDaylightRects().map(day =>
						<rect class="chartDaylight" id={`light${day.index}`} width={day.width} height={this.dayPlotArea.height} x={day.x} y={this.dayPlotArea.y} />
					)}
				</g>
				<g id="x-axis-day-ticks">
					{
						this._getChartXAxisGridlines().map(i =>
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
						this._getXAxisBottomLabels().map(i =>
							<text
								class="xAxisDaylightLabel" id={`x-axis-daylight-label-${i.index}`}
								text-anchor="end" dominant-baseline="middle" transform={`rotate(270, ${i.x}, ${i.y})`}
								x={i.x} y={i.y}
								font-size={this.chartFontSize}
							>
								{i.label}
							</text>
						)
					}
				</g>

				<clipPath
					id="moonClip">
					<rect
						x={this.dayPlotArea.x}
						y={this.dayPlotArea.y}
						width={this.dayPlotArea.width}
						height={this.dayPlotArea.height} />
				</clipPath>
				<g id="moon" clip-path="url(#moonClip)">
					{this._getMoonData().map(moon =>
						<g id={`moonData${moon.index}`}>
							<rect class="chartMoonData" id={`moon${moon.index}`} width={moon.width} height={moon.height} x={moon.x} y={moon.y}>
								<title>
									moonrise: {moon.rise.toLocaleTimeString()}&#10;
									set: {moon.set.toLocaleTimeString()}&#10;
									illumination: {moon.illumination}
								</title>
							</rect>

							<text
									class="moonLabel" id={`moon-label-${moon.index}`}
									text-anchor="middle" dominant-baseline="middle"
									// todo: adjust y so that the text is in the middle of the moon rect
									x={moon.width / 2 + moon.x} y={moon.height / 2 + moon.y}
									font-size={this.chartFontSize}
								>
									{moon.illumination}
								<title>
									moonrise: {moon.rise.toLocaleTimeString()}&#10;
									set: {moon.set.toLocaleTimeString()}&#10;
									illumination: {moon.illumination}
								</title>
							</text>
					</g>
					)}
				</g>
			</svg>

		return svg;
	}

	render() {
		let chart = '';
		let debugContent = '';

		if(this.loaded) {

			let dateRangeSection = (
				<div>
					<h2
						style={{ cursor: 'pointer', userSelect: 'none', marginBottom: '0.5rem' }}
						onClick={() => this.debugDateRangeOpen = !this.debugDateRangeOpen}
					>
						{this.debugDateRangeOpen ? '▼' : '▶'} debug date range
					</h2>
					{this.debugDateRangeOpen && (
						<div id="debugTable">
							<div id="debugHeader">
								<div id="debugCell"></div>
								<div id="debugCell">Locale</div>
								<div id="debugCell">ISO</div>

							</div>
								<div id="debugRow">
									<div id="debugCell">Begin Date</div>
									<div id="debugCell">{this.beginDate.toLocaleString()}</div>
									<div id="debugCell">{this.beginDate.toISOString()}</div>
								</div>
								<div id="debugRow">
									<div id="debugCell">End Date</div>
									<div id="debugCell">{this.endDate.toLocaleString()}</div>
									<div id="debugCell">{this.endDate.toISOString()}</div>
								</div>
						</div>
					)}
				</div>
			);

			let tideSection = (
				<div>
					<h2
						style={{ cursor: 'pointer', userSelect: 'none', marginBottom: '0.5rem' }}
						onClick={() => this.debugTideOpen = !this.debugTideOpen}
					>
						{this.debugTideOpen ? '▼' : '▶'} debug tide response
					</h2>
					{this.debugTideOpen && (
						<div>
							<p>Max Tide: {this.tidesMaxY} Min Tide: {this.tidesMinY}</p>
							<div id="debugTable">
								<div id="debugHeader">
									<div id="debugCell">Date Locale</div>
									<div id="debugCell">Level</div>
									<div id="debugCell">Date ISO</div>

								</div>
								{this.tides.map(result =>
									<div id="debugRow">
										<div id="debugCell">{result.when.toLocaleString()}</div>
										<div id="debugCell">{result.level}</div>
										<div id="debugCell">{result.when.toISOString()}</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			);

			let sunSection = (
				<div>
					<h2
						style={{ cursor: 'pointer', userSelect: 'none', marginBottom: '0.5rem' }}
						onClick={() => this.debugSunOpen = !this.debugSunOpen}
					>
						{this.debugSunOpen ? '▼' : '▶'} debug daylight response
					</h2>
					{this.debugSunOpen && (
						<div id="debugTable">
							<div id="debugHeader">
								<div id="debugCell">Date (Local / ISO)</div>
								<div id="debugCell">Rise Locale</div>
								<div id="debugCell">Set Locale</div>
								<div id="debugCell">Rise ISO</div>
								<div id="debugCell">Set ISO</div>

							</div>
							{this.daylight.map(result =>
								<div id="debugRow">
									<div id="debugCell">Local: {result.when.toLocaleDateString()} Iso: {result.when.toISOString()}</div>
									<div id="debugCell">{result.rise.toLocaleString()}</div>
									<div id="debugCell">{result.set.toLocaleString()}</div>
									<div id="debugCell">{result.rise.toISOString()}</div>
									<div id="debugCell">{result.set.toISOString()}</div>
								</div>
							)}
						</div>
					)}
				</div>
			);

			let moonSection = (
				<div>
					<h2
						style={{ cursor: 'pointer', userSelect: 'none', marginBottom: '0.5rem' }}
						onClick={() => this.debugMoonOpen = !this.debugMoonOpen}
					>
						{this.debugMoonOpen ? '▼' : '▶'} debug moonlight response
					</h2>
					{this.debugMoonOpen && (
						<div id="debugTable">
							<div id="debugHeader">
								<div id="debugCell">Rise Locale</div>
								<div id="debugCell">Set Locale</div>
								<div id="debugCell">Illumination</div>
								<div id="debugCell">Rise ISO</div>
								<div id="debugCell">Set ISO</div>

							</div>
							{this.moonData.map(result =>
								<div id="debugRow">
									<div id="debugCell">{result.rise.toLocaleString()}</div>
									<div id="debugCell">{result.set.toLocaleString()}</div>
									<div id="debugCell">{result.illumination}</div>
									<div id="debugCell">{result.rise.toISOString()}</div>
									<div id="debugCell">{result.set.toISOString()}</div>
								</div>
							)}
						</div>
					)}
				</div>
			);


			if(this.showDebug) {
				debugContent =
					<div>
						{dateRangeSection}

						{tideSection}

						{sunSection}

						{moonSection}
					</div>
			}



			chart =
				<div id="chartContainer">
					{this._getSvg()}
					<p><button onClick={this._toggleDebug.bind(this)}>Toggle Debug Info</button></p>
					{debugContent}
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


	_getSvgLayoutRectsOnly() : string {
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
}
