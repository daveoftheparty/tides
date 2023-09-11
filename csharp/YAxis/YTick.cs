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
		*/

#warning gonna need some abs() logic here later...
		var candidate = 197;


		for (int i = 0; i < tickCount; i++)
			tickLabels[i] = i * candidate;

		return tickYs
			.Zip(tickLabels)
			.Select(x => (x.First, (double)x.Second))
			.ToList();
	}


}
