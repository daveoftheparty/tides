namespace YAxis;

public interface ISvgComboChartData
{
	int Index { get; }
	double Value { get; }
}

public class SvgComboChartData : ISvgComboChartData
{
	public int Index { get; init; }
	public double Value { get; init; }
}

public class YTick
{
	private int _tickCount = 5;

	public IReadOnlyList<(double Y, int label)> GetYAxisTicks(IReadOnlyList<ISvgComboChartData> data, int width, int height)
	{
		/*
			technically, we probably only have room for say 5 ticks. can make this
			configurable later based on height, because very tall graphs will have
			more room for text
		*/

		// first, calc tickHeights: the double value that will translate to svg Y coordinates
		var tickHeights = new double[_tickCount];

		// we want to have a zero base, and one tick at the top that is higher than the rest of our items

		var tickHeight = height / (_tickCount - 1);

		for (int i = 0; i < _tickCount; i++)
			tickHeights[i] = i * tickHeight;

		// next, calc tickLabels: the integer values that will display on svg Y axis
		var tickLabels = new int[_tickCount];

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
		var candidate = increments.Find(x => x >= min && (_tickCount - 1) * x >= max);
		if(candidate == 0)
			throw new Exception("no increment found!");


		for (int i = 0; i < _tickCount; i++)
			tickLabels[i] = i * candidate;

		return tickHeights
			.Zip(tickLabels)
			.Select(x => (x.First, x.Second))
			.ToList();
	}


}
