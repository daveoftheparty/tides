namespace YAxis;

public class YCoordTests
{
	private readonly ITestOutputHelper _out;

	public YCoordTests(ITestOutputHelper @out)
	{
		_out = @out;
	}

	private record YTestData(double min, double max, double value);

	[Fact]
	public void YTest()
	{
		var tests = new[]
		{
			new YTestData(-0.693d, 2.101d, 2.101d),

			new YTestData(-0.693d, 2.101d, 1.402499d),
			new YTestData(-0.693d, 2.101d, 0.704d),
			new YTestData(-0.693d, 2.101d, 0.0055d),

			new YTestData(-0.693d, 2.101d, -0.693d),
		};

		_out.WriteLine("");
		foreach(var test in tests)
			_out.WriteLine($"min: {test.min:N6}   max: {test.max:N6}   val: {test.value:N6}   ratio: {YCoord.GetCoordinateRatio(test.min, test.max, test.value):N3}   ticks: {string.Join(", ", YCoord.GetYTicks(5, test.min, test.max))}");

	}
}
