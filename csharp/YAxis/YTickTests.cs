namespace YAxis;

public class YTickTests
{
	private readonly ITestOutputHelper _out;

	public YTickTests(ITestOutputHelper @out)
	{
		_out = @out;
	}


	[Theory]
	[InlineData(17, 5)]
	[InlineData(13, 7)]
	[InlineData(100, 7)]
	public void YCoordTests(int chartHeight, int ticks)
	{
		var tick = new YTick();
		var actual = tick.GetPositiveYAxisTicksStartingAtZero(
			new List<SvgComboChartData>
			{
				new SvgComboChartData { Index = 0, Value = 1.5 },
				new SvgComboChartData { Index = 1, Value = -1.25 },
			},
			chartHeight,
			ticks
		);

		Assert.Equal(ticks, actual.Count);

		// assert exactly one element has Y coord 0 and one element has Y coord == chartHeight
		Assert.Equal(1, actual.Count(x => x.Y == 0));
		Assert.Equal(1, actual.Count(x => x.Y == chartHeight));
	}

	// TODO: this test is either testing too many things (or not enough)-- the inputs/expecteds are kinda large, break down
	[Theory]
	[InlineData(100, new[] { 4, }, new[] { 0d, 25d, 50d, 75d, 100d }, new[] { 0, 5, 10, 15, 20 })]
	[InlineData(20, new[] { 5, 10, 15 }, new[] { 0d, 5d, 10d, 15d, 20d }, new[] { 0, 5, 10, 15, 20 })]
	[InlineData(20, new[] { 3, 71, 42 }, new[] { 0d, 5d, 10d, 15d, 20d }, new[] { 0, 20, 40, 60, 80, })]
	[InlineData(20, new[] { 18, 94, 326 }, new[] { 0d, 5d, 10d, 15d, 20d }, new[] { 0, 100, 200, 300, 400 })]
	[InlineData(20, new[] { 89, 71, 117, 265, 280, }, new[] { 0d, 5d, 10d, 15d, 20d }, new[] { 0, 75, 150, 225, 300 })]
	[InlineData(20, new[] { 17, 15, 21, 32, 41, }, new[] { 0d, 5d, 10d, 15d, 20d }, new[] { 0, 15, 30, 45, 60 })]
	public void LegacyTickTests(int height, int[] data, double[] expectedTickHeights, int[] expectedTickLabels)
	{
		var svg = new YTick();

		var input = data
			.Select((d, i) => new SvgComboChartData
			{
				Index = i,
				Value = d
			})
			.ToList();

		var actual = svg.GetPositiveYAxisTicksStartingAtZero(input, height, 5).ToList();

		_out.WriteLine("debugging values:");
		foreach(var item in actual)
		{
			_out.WriteLine($"tick {item}");
		}

		// assert tick heights (Y coord)
		Assert.Equal(expectedTickHeights.Length, actual.Count);

		for (int i = 0; i < expectedTickHeights.Length; i++)
		{
			// range for double rounding issues...
			Assert.InRange(actual[i].Y, expectedTickHeights[i] - 1, expectedTickHeights[i] + 1);
		}

		try
		{
			Assert.Equal(string.Join(',', expectedTickLabels), string.Join(',', actual.Select(a => a.label)));
		}
		catch
		{
			_out.WriteLine($"input for failed test: {string.Join(',', data)}");
			throw;
		}
	}

}
