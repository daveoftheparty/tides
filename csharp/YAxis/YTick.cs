namespace YAxis;

public class SvgComboChartData
{
	public int Index { get; init; }
	public double Value { get; init; }
}

public class YTick
{
	private double[] GetYCoordinates(int height, int tickCount)
	{
		// first, calc tickHeights: the double value that will translate to svg Y coordinates
		var tickYs = new double[tickCount];

		var tickHeight = (double)height / (tickCount - 1);

		for (int i = 0; i < tickCount; i++)
			tickYs[i] = i * tickHeight;

		return tickYs;
	}

	public IReadOnlyList<(double Y, int label)> GetPositiveYAxisTicksStartingAtZero(IReadOnlyList<SvgComboChartData> data, int height, int tickCount)
	{
		var tickYs = GetYCoordinates(height, tickCount);

		// next, calc tickLabels: the integer values that will display on svg Y axis
		var tickLabels = new int[tickCount];

		var max = data.Max(d => d.Value);
		var min = data.Min(d => d.Value);

		// TODO: write a better algorithm so that we don't have to repeat common divisors (ie, if 20 is in this list, there is no need for 40, 60, 120, etc.)
		var increments = new List<int>
		{
			5,
			10,
			15,
			20,
			25,
			40,
			50,
			60,
			75,
			80,
			100,
			150,
			200,
			250,
			300,
			400,
			500,
			600,
			700,
			800,
			900,
			1000,
			10000,
			100000,
			1000000,
			10000000,
			100000000,
		};

#warning gonna need some abs() logic here later...
		var candidate = increments.Find(x => x >= min && (tickCount - 1) * x >= max);
		if(candidate == 0)
			throw new Exception("no increment found!");


		for (int i = 0; i < tickCount; i++)
			tickLabels[i] = i * candidate;

		return tickYs
			.Zip(tickLabels)
			.Select(x => (x.First, x.Second))
			.ToList();
	}

	public IReadOnlyList<(double Y, double label)> GetYAxisTicks(int tickCount, int height, double minVal, double maxVal)
	{
		var tickYs = GetYCoordinates(height, tickCount);

		var tickLabels = new double[tickCount];


		var increments = new List<double>
		{
			.1d,
			.33d,
			.5d,
			1,
		};
		/*
		new logic idea:
		what we want is the "nice" increment that is smaller than the min and where the top tick is >= max

		to calculate the last part, we need to know the spread between min and max
			spread = max - min;
		and then
			multipliers = spread / tickCount
		our actual label assingment loop will end up looking like this:
		for(int i=0; i<tickCount; i++)
			tick[i] = i * increment + increment;

		problems with this: now our lowest increment (the y tick that correlates with the x axis) is always the same as min data point, and we might want to be less,
		ie, we may have data ranging from .33 to 6 and we want ticks like 0, 1.75, 3.5, 5.25, 7

		so maybe, instead what we want for an increment is "the smallest value, that when added to our max, is also less than or equal to our min?"

		--------
		algorithm C

		or, think of this another way. what we want to do is minimize wasted space (above max or below min). so maybe, we calculate the wasted space for all increments,
		and choose the one with the least amount of wasted space?
		--------

		rounding to the nearest X (does it work for fracions, like round to nearest .25 or nearest .05? or only x when x is int? what about negative numbers?)
		https://stackoverflow.com/questions/1531695/round-to-nearest-five
		*/

		// let's first just cut some basic logic that works without worry about "nice increments" or wasted space:

		// hmm, I think the spread is wrong. let's increase and decrease the max value to the next .25:

		var spread = QuarterCeiling(maxVal) - QuarterCeiling(minVal);
		// var spread = maxVal - minVal;
		// var spread = maxVal - minVal + 0.25d;

		// OK, we HAVE to add some number to the spread to come up with a distribution that will encompass the max,
		// so let's calculate that "some number"
		var baseIncrement = spread / tickCount;

		var candidates = increments
			.Select(i => new {
				minLabel = baseIncrement + i,
				maxLabel = (baseIncrement + i) * tickCount
			});


		// var increment = spread / (tickCount - 1);
		// var increment = spread / tickCount + 0.25d;
		var increment = spread / tickCount;

		// var currValue = QuarterCeiling(minVal);
		for (int i = 1; i <= tickCount; i++)
		{
			// if (i == 0)
			// 	tickLabels[i] = minVal;
			// else if (i == tickCount - 1)
			// 	tickLabels[i] = maxVal;
			// else
				tickLabels[i-1] = (i * increment) + QuarterCeiling(minVal);
		}

		return tickYs
			.Zip(tickLabels)
			.Select(x => (x.First, (double)x.Second))
			.ToList();
	}

	public double QuarterCeiling(double value)
	{
		var baseValue = (int)Math.Abs(value);
		var fraction = Math.Abs(value) - baseValue;

		var newFraction = 0d;
		// TODO see if Math.round can do this for us:
		if(fraction == 0)
			newFraction = 0.0;
		else if(fraction > 0.0 && fraction < 0.25)
			newFraction = 0.25;
		else if (fraction >= 0.25 && fraction < 0.5)
			newFraction = 0.5;
		else if (fraction >= 0.5 && fraction < 0.75)
			newFraction = 0.75;
		else if (fraction >= 0.75)
			newFraction = 1.0;

		var result = newFraction + baseValue;
		if(value < 0)
			result = result * -1;
		return result;
	}

}
