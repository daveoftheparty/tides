import { Component, h, Element } from "@stencil/core";

@Component({
	tag: 'ds-user-guide',
	shadow: true
})
export class UserGuide {

	@Element() hostElement: HTMLElement;

	render() {
		return (
			<div>
				<h1>Sun, Moon, Tide: reading the chart</h1>
				<p><button onClick={() => this.hostElement.dispatchEvent(new CustomEvent('backToTide', {bubbles: true }))}>Back to Tide Chart</button></p>


				<p>This chart shows the predicted tides for the selected NOAA tide station over a 7-day period. The
				chart also includes information about sunrise and sunset times, as well as moon data. From top to bottom:</p>


				<h2>Moon</h2>
				<p>
					The greyish squares
				</p>

				<div style={{ maxWidth: '100px' }}>
					{this._getSampleMoonRect()}
				</div>

				<p>
					at the top of the chart represent the moon: when it rises, when it sets, and how
					illuminated it is. 100% is as bright as the moon gets-- full moon, 0% would be a new moon. Illumination
					data seems much more useful that knowing you're halfway between quarters (moon phases).
				</p>

				<p>
					<b><i>Tip:</i></b> hover over the greyish squares or the illumination percentages to get the exact moonrise and set time.
				</p>

				<h2>Sun</h2>
				<p>
					The dark blue and light blue rectangles represent daylight and nighttime hours. The left edge of each
					rectangle is the time of sunrise, and the right edge is the time of sunset.
				</p>

				<p>
					There is no hover functionality here, because the sunrise and set times are labelled at the bottom of the chart.
					In the sample below, note that the sun rises at 7:23 am on Tuesday, and sets at 7:18 pm (24-hour clock).
				</p>

				<p>
					<b><i>Tip:</i></b> remember that it gets light about 30 minutes before sunrise, and stays light about 30 minutes after sunset.
				</p>

				<h2>Tide</h2>


				<p>
					<b><i>Tip:</i></b> hover over the circular tide markers
				</p>

				<div style={{ maxWidth: '35px' }}>
					{this._getSampleTideMarker()}
				</div>

				<p>
					to get the exact tide height and time.
				</p>

				{this._getSampleChart()}
				<p><button onClick={() => this.hostElement.dispatchEvent(new CustomEvent('backToTide', {bubbles: true }))}>Back to Tide Chart</button></p>
			</div>
		);
	}

	_getSampleMoonRect(): string {
		return (
		<svg xmlns="http://www.w3.org/2000/svg" id="chart" viewBox="0 0 100 25">
				<style>
					{`
					.chartMoonData {
						fill: rgb(151, 151, 190);;
					}`
					}
				</style>
				<g>
					<rect class="chartMoonData" id="moonSample" width="100%" height="100%" >
						<title>
							moonrise: 3:11:58 PM&#10;
							set: 1:38:54 AM&#10;
							illumination: 61&#10;
						</title>
					</rect>
					<text class="moonLabel" id="moon-label-4" text-anchor="middle" dominant-baseline="middle" x="50%" y="50%" font-size="18">
						61%
						<title>
							moonrise: 3:11:58 PM&#10;
							set: 1:38:54 AM&#10;
							illumination: 61&#10;
						</title>
					</text>
				</g>
		</svg>
		);
	}

	_getSampleTideMarker(): string {
		return (
		<svg xmlns="http://www.w3.org/2000/svg" id="chart" viewBox="0 0 25 25">
				<style>
					{`
					.tideMarker {
						fill: rgb(42, 127, 255);
					}`
					}
				</style>
				<circle class="tideMarker" id="tide-marker-6" cx="50%" cy="50%" r="4">
					<title>1.053 ft at 8:25:00 AM</title>
				</circle>
		</svg>
		);
	}

	_getSampleChart(): string {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" id="chart" viewBox="0 0 800 200">
				<style>
					{`
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
					}`
					}
				</style>
				<rect id="chartArea" width="100%" height="100%" fill="rgb(128, 128, 128)" />
				<g id="days">
					<rect class="chartDayDark" id="dark0" width="110.71428571428571" height="140" x="25" y="25" />
					<rect class="chartDayDark" id="dark1" width="110.71428571428571" height="140" x="135.71428571428572" y="25" />
					<rect class="chartDayDark" id="dark2" width="110.71428571428571" height="140" x="246.42857142857142" y="25" />
					<rect class="chartDayDark" id="dark3" width="110.71428571428571" height="140" x="357.1428571428571" y="25" />
					<rect class="chartDayDark" id="dark4" width="110.71428571428571" height="140" x="467.85714285714283" y="25" />
					<rect class="chartDayDark" id="dark5" width="110.71428571428571" height="140" x="578.5714285714286" y="25" />
					<rect class="chartDayDark" id="dark6" width="110.71428571428571" height="140" x="689.2857142857142" y="25" />
					<rect class="chartDaylight" id="light0" width="54.98200476187501" height="140" x="59.0703160698914" y="25" />
					<rect class="chartDaylight" id="light1" width="54.855949371454926" height="140" x="169.82185527417636" y="25" />
					<rect class="chartDaylight" id="light2" width="54.73001058983141" height="140" x="280.57375583758886" y="25" />
					<rect class="chartDaylight" id="light3" width="54.6042102010652" height="140" x="391.3260356999438" y="25" />
					<rect class="chartDaylight" id="light4" width="54.478566144971126" height="140" x="502.0787166453021" y="25" />
					<rect class="chartDaylight" id="light5" width="54.3531002056103" height="140" x="612.8318166134785" y="25" />
					<rect class="chartDaylight" id="light6" width="54.22783160421261" height="140" x="723.5853548257033" y="25" />
				</g>
				<g id="x-axis-day-ticks">
					<path class="xGridline" id="x-tick-0" d="M 25,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-1" d="M 135.71428571428572,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-2" d="M 246.42857142857142,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-3" d="M 357.1428571428571,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-4" d="M 467.85714285714283,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-5" d="M 578.5714285714286,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-6" d="M 689.2857142857142,12.5 V 182.5" />
					<path class="xGridline" id="x-tick-7" d="M 800,12.5 V 182.5" />
				</g>
				<g id="y-axis-ticks-and-labels">
					<path class="yGridline" id="y-tick-0" d="M 25,50 H 800" />
					<path class="yGridline" id="y-tick-1" d="M 25,78.75 H 800" />
					<path class="yGridline" id="y-tick-2" d="M 25,107.5 H 800" />
					<path class="yGridline" id="y-tick-3" d="M 25,136.25 H 800" />
					<path class="yGridline" id="y-tick-4" d="M 25,165 H 800" />
					<text class="yTickLabel" id="y-tick-0" text-anchor="end" alignment-baseline="middle" x="20" y="50" font-size="9">1.3</text>
					<text class="yTickLabel" id="y-tick-1" text-anchor="end" alignment-baseline="middle" x="20" y="78.75" font-size="9">1.05</text>
					<text class="yTickLabel" id="y-tick-2" text-anchor="end" alignment-baseline="middle" x="20" y="107.5" font-size="9">0.81</text>
					<text class="yTickLabel" id="y-tick-3" text-anchor="end" alignment-baseline="middle" x="20" y="136.25" font-size="9">0.56</text>
					<text class="yTickLabel" id="y-tick-4" text-anchor="end" alignment-baseline="middle" x="20" y="165" font-size="9">0.32</text>
				</g>
				<path class="yGridline" id="yLineBelowDayLabels" d="M 25,25 H 800" />
				<g id="x-axis-top-series-labels">
					<text class="xAxisTopSeriesLabel" id="x-top-label-0" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="80.35714285714286" text-anchor="middle">Tuesday</tspan>
						<tspan x="80.35714285714286" dy="1.2em" text-anchor="middle">9/30</tspan>
					</text>
					<text class="xAxisTopSeriesLabel" id="x-top-label-1" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="191.07142857142858" text-anchor="middle">Wednesday</tspan>
						<tspan x="191.07142857142858" dy="1.2em" text-anchor="middle">10/1</tspan>
					</text>
					<text class="xAxisTopSeriesLabel" id="x-top-label-2" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="301.7857142857143" text-anchor="middle">Thursday</tspan>
						<tspan x="301.7857142857143" dy="1.2em" text-anchor="middle">10/2</tspan>
					</text>
					<text class="xAxisTopSeriesLabel" id="x-top-label-3" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="412.49999999999994" text-anchor="middle">Friday</tspan>
						<tspan x="412.49999999999994" dy="1.2em" text-anchor="middle">10/3</tspan>
					</text>
					<text class="xAxisTopSeriesLabel" id="x-top-label-4" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="523.2142857142857" text-anchor="middle">Saturday</tspan>
						<tspan x="523.2142857142857" dy="1.2em" text-anchor="middle">10/4</tspan>
					</text>
					<text class="xAxisTopSeriesLabel" id="x-top-label-5" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="633.9285714285714" text-anchor="middle">Sunday</tspan>
						<tspan x="633.9285714285714" dy="1.2em" text-anchor="middle">10/5</tspan>
					</text>
					<text class="xAxisTopSeriesLabel" id="x-top-label-6" text-anchor="middle" dominant-baseline="hanging" y="5" font-size="9">
						<tspan x="744.6428571428571" text-anchor="middle">Monday</tspan>
						<tspan x="744.6428571428571" dy="1.2em" text-anchor="middle">10/6</tspan>
					</text>
				</g>
				<g id="x-axis-daylight-labels">
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-0" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 59.0703160698914, 168)" x="59.0703160698914" y="168" font-size="9">07:23</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-0" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 114.05232083176641, 168)" x="114.05232083176641" y="168" font-size="9">19:18</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-1" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 169.82185527417636, 168)" x="169.82185527417636" y="168" font-size="9">07:23</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-1" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 224.67780464563128, 168)" x="224.67780464563128" y="168" font-size="9">19:17</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-2" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 280.57375583758886, 168)" x="280.57375583758886" y="168" font-size="9">07:24</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-2" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 335.30376642742027, 168)" x="335.30376642742027" y="168" font-size="9">19:15</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-3" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 391.3260356999438, 168)" x="391.3260356999438" y="168" font-size="9">07:24</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-3" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 445.930245901009, 168)" x="445.930245901009" y="168" font-size="9">19:14</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-4" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 502.0787166453021, 168)" x="502.0787166453021" y="168" font-size="9">07:25</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-4" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 556.5572827902732, 168)" x="556.5572827902732" y="168" font-size="9">19:13</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-5" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 612.8318166134785, 168)" x="612.8318166134785" y="168" font-size="9">07:25</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-5" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 667.1849168190888, 168)" x="667.1849168190888" y="168" font-size="9">19:12</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-6" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 723.5853548257033, 168)" x="723.5853548257033" y="168" font-size="9">07:26</text>
					<text class="xAxisDaylightLabel" id="x-axis-daylight-label-6" text-anchor="end" dominant-baseline="middle" transform="rotate(270, 777.813186429916, 168)" x="777.813186429916" y="168" font-size="9">19:11</text>
				</g>
				<clipPath id="tideClip">
					<rect x="25" y="50" width="775" height="115" />
				</clipPath>
				<g id="tides" clip-path="url(#tideClip)">
					<path class="tideSineWave" id="tideSineWave" d="M -282.92410765199094,85.29877425944842 L -226.64434565417383,152.25485188968335 L -169.28819476568816,83.06690500510726 L -108.31845260138633,152.9596527068437 L -53.03819457347585,81.18743615934628 L 8.315972194636199,155.54392236976506 L 63.826884984832816,78.60316649642493 L 124.5659723868485,158.71552604698672 L 178.38541692028014,77.07609805924412 L 239.04761940153378,159.77272727272728 L 302.47767903022105,77.66343207354443 L 352.60664736707446,156.01378958120532 L 419.95783795462603,78.72063329928498 L 466.08879041185315,146.14657814096017 L 507.29910794030934,92.46424923391214 L 516.986607956327,93.75638406537283 L 542.28174688704,79.89530132788559 L 579.9553580604421,130.75842696629212 L 608.710318425447,97.98518896833504 L 630.6994057633918,106.67773237997957 L 659.685020890683,77.78089887640449 L 695.513393965796,112.08120531154239 L 715.6572432054518,96.10572012257404 L 744.7966281742669,120.77374872318693 L 778.7797631510908,74.60929519918284 L 811.8402790787703,93.16905005107252 L 824.0649814799355,88.1179775280899 L 860.1240093173346,134.16496424923392 L 901.2574419250288,67.56128702757916 L 975.2976206188783,144.97191011235955 L 1026.1185532425902,55.22727272727272 L 1089.8561525543257,151.08018386108273" />
					<circle class="tideMarker" id="tide-marker-0" cx="-282.92410765199094" cy="85.29877425944842" r="4">
						<title>0.996 ft at 5:15:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-1" cx="-226.64434565417383" cy="152.25485188968335" r="4">
						<title>0.426 ft at 5:27:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-2" cx="-169.28819476568816" cy="83.06690500510726" r="4">
						<title>1.015 ft at 5:53:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-3" cx="-108.31845260138633" cy="152.9596527068437" r="4">
						<title>0.42 ft at 7:06:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-4" cx="-53.03819457347585" cy="81.18743615934628" r="4">
						<title>1.031 ft at 7:05:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-5" cx="8.315972194636199" cy="155.54392236976506" r="4">
						<title>0.398 ft at 8:23:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-6" cx="63.826884984832816" cy="78.60316649642493" r="4">
						<title>1.053 ft at 8:25:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-7" cx="124.5659723868485" cy="158.71552604698672" r="4">
						<title>0.371 ft at 9:35:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-8" cx="178.38541692028014" cy="77.07609805924412" r="4">
						<title>1.066 ft at 9:15:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-9" cx="239.04761940153378" cy="159.77272727272728" r="4">
						<title>0.362 ft at 10:24:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-10" cx="302.47767903022105" cy="77.66343207354443" r="4">
						<title>1.061 ft at 12:09:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-11" cx="352.60664736707446" cy="156.01378958120532" r="4">
						<title>0.394 ft at 11:01:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-12" cx="419.95783795462603" cy="78.72063329928498" r="4">
						<title>1.052 ft at 1:37:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-13" cx="466.08879041185315" cy="146.14657814096017" r="4">
						<title>0.478 ft at 11:37:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-14" cx="507.29910794030934" cy="92.46424923391214" r="4">
						<title>0.935 ft at 8:33:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-15" cx="516.986607956327" cy="93.75638406537283" r="4">
						<title>0.924 ft at 10:39:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-16" cx="542.28174688704" cy="79.89530132788559" r="4">
						<title>1.042 ft at 4:08:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-17" cx="579.9553580604421" cy="130.75842696629212" r="4">
						<title>0.609 ft at 12:18:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-18" cx="608.710318425447" cy="97.98518896833504" r="4">
						<title>0.888 ft at 6:32:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-19" cx="630.6994057633918" cy="106.67773237997957" r="4">
						<title>0.814 ft at 11:18:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-20" cx="659.685020890683" cy="77.78089887640449" r="4">
						<title>1.06 ft at 5:35:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-21" cx="695.513393965796" cy="112.08120531154239" r="4">
						<title>0.768 ft at 1:21:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-22" cx="715.6572432054518" cy="96.10572012257404" r="4">
						<title>0.904 ft at 5:43:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-23" cx="744.7966281742669" cy="120.77374872318693" r="4">
						<title>0.694 ft at 12:02:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-24" cx="778.7797631510908" cy="74.60929519918284" r="4">
						<title>1.087 ft at 7:24:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-25" cx="811.8402790787703" cy="93.16905005107252" r="4">
						<title>0.929 ft at 2:34:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-26" cx="824.0649814799355" cy="88.1179775280899" r="4">
						<title>0.972 ft at 5:13:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-27" cx="860.1240093173346" cy="134.16496424923392" r="4">
						<title>0.58 ft at 1:02:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-28" cx="901.2574419250288" cy="67.56128702757916" r="4">
						<title>1.147 ft at 9:57:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-29" cx="975.2976206188783" cy="144.97191011235955" r="4">
						<title>0.488 ft at 2:00:00 PM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-30" cx="1026.1185532425902" cy="55.22727272727272" r="4">
						<title>1.252 ft at 1:01:00 AM</title>
					</circle>
					<circle class="tideMarker" id="tide-marker-31" cx="1089.8561525543257" cy="151.08018386108273" r="4">
						<title>0.436 ft at 2:50:00 PM</title>
					</circle>
				</g>
				<clipPath id="moonClip">
					<rect x="25" y="25" width="775" height="140" />
				</clipPath>
				<g id="moon" clip-path="url(#moonClip)">
					<g id="moonData0">
						<rect class="chartMoonData" id="moon0" width="48.2643552385324" height="15" x="-363.88757996674536" y="30">
							<title>
								moonrise: 11:41:57 AM
								set: 10:09:42 PM
								illumination: 23
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-0" text-anchor="middle" dominant-baseline="middle" x="-339.75540234747916" y="37.5" font-size="9">
							23%
							<title>
								moonrise: 11:41:57 AM
								set: 10:09:42 PM
								illumination: 23
							</title>
						</text>
					</g>
					<g id="moonData1">
						<rect class="chartMoonData" id="moon1" width="47.40623494941505" height="15" x="-248.87401616050596" y="30">
							<title>
								moonrise: 12:37:52 PM
								set: 10:54:27 PM
								illumination: 32
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-1" text-anchor="middle" dominant-baseline="middle" x="-225.17089868579842" y="37.5" font-size="9">
							32%
							<title>
								moonrise: 12:37:52 PM
								set: 10:54:27 PM
								illumination: 32
							</title>
						</text>
					</g>
					<g id="moonData2">
						<rect class="chartMoonData" id="moon2" width="47.0291041617545" height="15" x="-133.96239535212038" y="30">
							<title>
								moonrise: 1:32:27 PM
								set: 11:44:08 PM
								illumination: 41
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-2" text-anchor="middle" dominant-baseline="middle" x="-110.44784327124313" y="37.5" font-size="9">
							41%
							<title>
								moonrise: 1:32:27 PM
								set: 11:44:08 PM
								illumination: 41
							</title>
						</text>
					</g>
					<g id="moonData3">
						<rect class="chartMoonData" id="moon3" width="47.300017149966955" height="15" x="-19.244987134995014" y="30">
							<title>
								moonrise: 2:24:31 PM
								set: 12:39:44 AM
								illumination: 51
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-3" text-anchor="middle" dominant-baseline="middle" x="4.405021439988463" y="37.5" font-size="9">
							51%
							<title>
								moonrise: 2:24:31 PM
								set: 12:39:44 AM
								illumination: 51
							</title>
						</text>
					</g>
					<g id="moonData4">
						<rect class="chartMoonData" id="moon4" width="48.201490283071266" height="15" x="95.11709998365923" y="30">
							<title>
								moonrise: 3:11:58 PM
								set: 1:38:54 AM
								illumination: 61
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-4" text-anchor="middle" dominant-baseline="middle" x="119.21784512519486" y="37.5" font-size="9">
							61%
							<title>
								moonrise: 3:11:58 PM
								set: 1:38:54 AM
								illumination: 61
							</title>
						</text>
					</g>
					<g id="moonData5">
						<rect class="chartMoonData" id="moon5" width="49.6014954937194" height="15" x="209.17207284916017" y="30">
							<title>
								moonrise: 3:55:25 PM
								set: 2:40:33 AM
								illumination: 71
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-5" text-anchor="middle" dominant-baseline="middle" x="233.97282059601986" y="37.5" font-size="9">
							71%
							<title>
								moonrise: 3:55:25 PM
								set: 2:40:33 AM
								illumination: 71
							</title>
						</text>
					</g>
					<g id="moonData6">
						<rect class="chartMoonData" id="moon6" width="51.30631737980542" height="15" x="322.93257518672715" y="30">
							<title>
								moonrise: 4:35:02 PM
								set: 3:42:21 AM
								illumination: 81
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-6" text-anchor="middle" dominant-baseline="middle" x="348.5857338766299" y="37.5" font-size="9">
							81%
							<title>
								moonrise: 4:35:02 PM
								set: 3:42:21 AM
								illumination: 81
							</title>
						</text>
					</g>
					<g id="moonData7">
						<rect class="chartMoonData" id="moon7" width="53.4020798667363" height="15" x="436.3274038712424" y="30">
							<title>
								moonrise: 5:09:54 PM
								set: 4:44:28 AM
								illumination: 89
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-7" text-anchor="middle" dominant-baseline="middle" x="463.02844380461056" y="37.5" font-size="9">
							89%
							<title>
								moonrise: 5:09:54 PM
								set: 4:44:28 AM
								illumination: 89
							</title>
						</text>
					</g>
					<g id="moonData8">
						<rect class="chartMoonData" id="moon8" width="55.527571189695095" height="15" x="549.661228215379" y="30">
							<title>
								moonrise: 5:43:58 PM
								set: 5:46:11 AM
								illumination: 95
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-8" text-anchor="middle" dominant-baseline="middle" x="577.4250138102266" y="37.5" font-size="9">
							95%
							<title>
								moonrise: 5:43:58 PM
								set: 5:46:11 AM
								illumination: 95
							</title>
						</text>
					</g>
					<g id="moonData9">
						<rect class="chartMoonData" id="moon9" width="57.87568280072048" height="15" x="662.8638356280817" y="30">
							<title>
								moonrise: 6:16:20 PM
								set: 6:49:06 AM
								illumination: 99
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-9" text-anchor="middle" dominant-baseline="middle" x="691.8016770284419" y="37.5" font-size="9">
							99%
							<title>
								moonrise: 6:16:20 PM
								set: 6:49:06 AM
								illumination: 99
							</title>
						</text>
					</g>
					<g id="moonData10">
						<rect class="chartMoonData" id="moon10" width="60.25330284433403" height="15" x="776.1439584178968" y="30">
							<title>
								moonrise: 6:49:43 PM
								set: 7:53:23 AM
								illumination: 100
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-10" text-anchor="middle" dominant-baseline="middle" x="806.2706098400638" y="37.5" font-size="9">
							100%
							<title>
								moonrise: 6:49:43 PM
								set: 7:53:23 AM
								illumination: 100
							</title>
						</text>
					</g>
					<g id="moonData11">
						<rect class="chartMoonData" id="moon11" width="62.70870479945222" height="15" x="889.5650381771908" y="30">
							<title>
								moonrise: 7:24:55 PM
								set: 9:00:32 AM
								illumination: 98
							</title>
						</rect>
						<text class="moonLabel" id="moon-label-11" text-anchor="middle" dominant-baseline="middle" x="920.9193905769168" y="37.5" font-size="9">
							98%
							<title>
								moonrise: 7:24:55 PM
								set: 9:00:32 AM
								illumination: 98
							</title>
						</text>
					</g>
				</g>
			</svg>
		);
	}
}
