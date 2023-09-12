namespace YTick;

public class YTickExplorationTests
{
	private readonly ITestOutputHelper _out;

	public YTickExplorationTests(ITestOutputHelper @out)
	{
		_out = @out;
	}

	/*
		exploration possibility, generate output that looks like this:
			where spread is the natural spread
			where spread+ is the enhanced spread, if any


		min, max   ticks   spread   spread+   Alg0
		--------   -----   ------   -------   -------------
		0, 100     5       20       20        0,20,40,60,80



		where inputs is ticks (min, max)
		spreads is (natural, enhanced)
		and then the return ticks in columns by each algorithm:

		inputs            spreads        Alg0
		------------      ------------   ---------------
		5 (0, 100)        20       20    0,20,40,60,80
		5 (.353, 1.934)   1.581, 1.581   ...,...,...,...

		or use this format:


		ticks: 5   min: .353   max: 1.934
		------------------------------------------------------------
			Alg   Spread   Spread+   Ticks
			---   ------   -------   ----------------------------
			  1       20        20   0,20,40,60,80
			  2       20        25   13,69,20,40


	*/

	private record ExplorationData
	(
		int Ticks,
		double MinValue,
		double MaxValue
	);

	private record AlgorithmResponse
	(
		double NaturalSpread,
		double EnhancedSpread,
		double[] Ticks
	);

	[Fact]
	public void PrintExplorations()
	{
		var tests = new []
		{
			new ExplorationData(5, 0, 100),
			new ExplorationData(5, .353, 1.934),
		};

		var algorithms = new []
		{
			Go
		};

		_out.WriteLine("");
		foreach(var test in tests)
		{
			_out.WriteLine($"ticks: {test.Ticks,-3}   min: {test.MinValue,5}   max: {test.MinValue,5}");
			_out.WriteLine( "------------------------------------------------------------------------");
			_out.WriteLine( "     Alg   Spread   Spread+   Ticks");
			_out.WriteLine( "     ---   ------   -------   -------------------------------");

			var i = 0;
			foreach(var algorithm in algorithms)
			{

				var result = algorithm(test.Ticks, test.MinValue, test.MaxValue);
				_out.WriteLine($"     {i,3}   {result.NaturalSpread,6}   {result.EnhancedSpread,7}   {string.Join(',', result.Ticks)}");
			}
			_out.WriteLine("");
			_out.WriteLine("");
		}
	}

	// [Theory]
	// [InlineData(1)]
	// public void GoDataOriented(int actual)
	// {
	// 	Assert.True(actual == actual);
	// }

	private AlgorithmResponse Go(int ticks, double min, double max)
	{
		return new AlgorithmResponse(20, 20, new[] {0d,5d,10d});
	}
}
