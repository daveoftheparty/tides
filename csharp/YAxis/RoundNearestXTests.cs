namespace YAxis;
public class RoundNearestXTests
{
	private readonly ITestOutputHelper _out;

	public RoundNearestXTests(ITestOutputHelper @out)
	{
		_out = @out;
	}

	private record RoundData(double value, double roundTo);

	[Fact]
	public void TestName()
	{
		var tests = new []
		{
			new RoundData(1.25, .5),
			new RoundData(1.26, .5),
			new RoundData(1.45, .5),
			new RoundData(1.5, .5),
			new RoundData(1.51, .5),
			new RoundData(1.75, .5),
		};

		_out.WriteLine("");
		_out.WriteLine($"{"value", 10}   {"roundTo", 10}   {"result", 10}");
		_out.WriteLine($"---------------------------------------------------------");

		foreach(var test in tests)
			_out.WriteLine($"{test.value, 10}   {test.roundTo, 10}   {RoundTo(test.value, test.roundTo), 10}");
	}

	private double RoundTo(double value, double roundTo)
	{
		return Math.Round(value / roundTo) * roundTo;
	}

}
