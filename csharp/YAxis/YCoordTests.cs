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

			new YTestData(1.5d, 4d, 4d),
			new YTestData(1.5d, 4d, 2.5d),
			new YTestData(1.5d, 4d, 2.75d),
			new YTestData(1.5d, 4d, 2.125d),
			new YTestData(1.5d, 4d, 1.5d),
		};

		_out.WriteLine("");
		foreach(var test in tests)
			_out.WriteLine($"min: {test.min:N6}   max: {test.max:N6}   val: {test.value:N6}   ratio: {YCoord.GetCoordinateRatio(test.min, test.max, test.value):N3}   ticks: {string.Join(", ", YCoord.GetYTicks(5, test.min, test.max))}");

	}
}
