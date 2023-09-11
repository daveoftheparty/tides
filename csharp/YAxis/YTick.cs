namespace YAxis;

public class SvgComboChartData
{
	public int Index { get; init; }
	public double Value { get; init; }
}

public class YTick
{
	public IReadOnlyList<(double Y, int label)> GetYAxisTicks(IReadOnlyList<SvgComboChartData> data, int height, int tickCount)
	{
		// first, calc tickHeights: the double value that will translate to svg Y coordinates
		var tickYs = new double[tickCount];

		var tickHeight = (double)height / (tickCount - 1);

		for (int i = 0; i < tickCount; i++)
			tickYs[i] = i * tickHeight;

		// next, calc tickLabels: the integer values that will display on svg Y axis
		var tickLabels = new int[tickCount];

		var max = data.Max(d => d.Value);
		var min = data.Min(d => d.Value);

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


}
