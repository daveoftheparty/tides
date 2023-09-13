namespace YAxis;

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
			new ExplorationData(5, -1.5, 1.5),

			// new ExplorationData(4, 0, 100),
			// new ExplorationData(4, .353, 1.934),
			// new ExplorationData(4, -1.5, 1.5),
		};

		var algorithms = new []
		{
			Alg0,
			Alg1,
			Alg2,
			Alg3,
			Alg4,
		};

		_out.WriteLine("");
		foreach(var test in tests)
		{
			_out.WriteLine($"ticks: {test.Ticks,-3}   min: {test.MinValue,-5}   max: {test.MaxValue,-5}");
			_out.WriteLine( "------------------------------------------------------------------------");
			_out.WriteLine( "     Alg   P/F    Spread   Spread+   Ticks");
			_out.WriteLine( "     ---   ----   ------   -------   -------------------------------");

			var i = 0;
			foreach(var algorithm in algorithms)
			{

				var result = algorithm(test.Ticks, test.MinValue, test.MaxValue);
				var success = result.Ticks.Min() <= test.MinValue && result.Ticks.Max() >= test.MaxValue
					? "Pass"
					: "Fail";

				_out.WriteLine($"     {i,3}   {success}   {result.NaturalSpread,6}   {result.EnhancedSpread,7}   {string.Join(", ", result.Ticks)}");
				i++;
			}
			_out.WriteLine("");
			_out.WriteLine("");
		}
	}


	private AlgorithmResponse Alg0(int ticks, double min, double max)
	{
		var tickLabels = new double[ticks];

		var spread = max - min;
		var increment = spread / ticks;

		for (int i = 1; i <= ticks; i++)
			tickLabels[i-1] = i * increment;

		return new AlgorithmResponse(spread, spread, tickLabels);
	}

	private AlgorithmResponse Alg1(int ticks, double min, double max)
	{
		var tickLabels = new double[ticks];

		var spread = max - min;
		var increment = spread / ticks;

		for (int i = 0; i < ticks; i++)
			tickLabels[i] = i * increment;

		return new AlgorithmResponse(spread, spread, tickLabels);
	}

	private AlgorithmResponse Alg2(int ticks, double min, double max)
	{
		var tickLabels = new double[ticks];

		var spread = max - min;
		var increment = spread / (ticks - 1);

		for (int i = 0; i < ticks; i++)
			tickLabels[i] = i * increment;

		return new AlgorithmResponse(spread, spread, tickLabels);
	}

	private AlgorithmResponse Alg3(int ticks, double min, double max)
	{
		var tickLabels = new double[ticks];

		var spread = max - min;
		var increment = spread / (ticks - 1);

		for (int i = 0; i < ticks; i++)
			tickLabels[i] = i * increment + min;

		return new AlgorithmResponse(spread, spread, tickLabels);
	}

	private AlgorithmResponse Alg4(int ticks, double min, double max)
	{
		var tickLabels = new double[ticks];

		var spread = max - min;
		var newMin = YTick.QuarterSpread(min);
		var enhancedSpread = YTick.QuarterSpread(max) - newMin;

		var increment = enhancedSpread / (ticks - 1);

		for (int i = 0; i < ticks; i++)
			tickLabels[i] = i * increment + newMin;

		return new AlgorithmResponse(spread, enhancedSpread, tickLabels);
	}
}
