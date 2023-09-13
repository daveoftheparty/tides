namespace YAxis;

public class BobHallPierTests
{

	public class PredictionRaw
	{
		// {"t":"2023-09-14 02:07", "v":"0.562", "type":"L"}
		public string t { get; set; }
		public string v { get; set; }
	}

	public class ResponseModel
	{
		public PredictionRaw[] predictions { get; set; }
	}

	public record Prediction(DateTime DateUtc, double Level);

	private readonly ITestOutputHelper _out;

	public BobHallPierTests(ITestOutputHelper @out)
	{
		_out = @out;
	}

	public record TideResult(DateTime WeekStart, double Min, double Max, double Spread);

	[Fact]
	public void BobHallYearSpread()
	{
		var results = new List<TideResult>();

		var predictions = MapPredictions(LoadJson());
		var minDate = predictions.Min(p => p.DateUtc);
		var maxDate = predictions.Max(p => p.DateUtc);

		var currentBeginDate = minDate;
		var currentEndDate = minDate.AddDays(7);
		while(currentEndDate <= maxDate)
		{
			var range = predictions
				.Where(p => p.DateUtc >= currentBeginDate && p.DateUtc <= currentEndDate)
				.ToArray();

			var min = range.Min(r => r.Level);
			var max = range.Max(r => r.Level);

			results.Add(new TideResult(currentBeginDate, min, max, max - min));

			currentBeginDate = currentBeginDate.AddDays(1);
			currentEndDate = currentEndDate.AddDays(1);
		}

		// _out.WriteLine("");
		// _out.WriteLine($"{"Date", -20}   {"Spread", -10}");
		// foreach(var result in results)
		// {
		// 	_out.WriteLine($"{result.Item1, -20}   {result.Item2, -10}");
		// }

		//_out.WriteLine($"spread min {results.Min(r => r.Item2)} max {results.Max(r => r.Item2)}");

		// output min spread stuff:
		PrintResults(
			results.Where(r => r.Spread == results.Min(r => r.Spread)).ToArray(),
			"min spreads"
		);

		// output max spread stuff:
		PrintResults(
			results.Where(r => r.Spread == results.Max(r => r.Spread)).ToArray(),
			"max spreads"
		);

		// output overall min/max
		// _out.WriteLine($"overall min {predictions.Min(r => r.Level)} overall max {predictions.Max(r => r.Level)}");
		PrintResults(
			results.Where(r => r.Min == predictions.Min(p => p.Level)).ToArray(),
			"overall min"
		);
		PrintResults(
			results.Where(r => r.Max == predictions.Max(p => p.Level)).ToArray(),
			"overall max"
		);

	}
	private void PrintResults(TideResult[] results, string header)
	{
		_out.WriteLine(header);
		foreach(var result in results)
			_out.WriteLine($"min: {result.Min} max: {result.Max} spread: {result.Spread}");
		_out.WriteLine("");

	}

	[Fact]
	public void EasyButton()
	{
		var tests = new[]
		{
			(-1.125d, 1.665d),
			(0.203d, 2.463d),
			(0.431d, 1.634d),
			(-0.693d, 2.101d),
		};
		_out.WriteLine("");
		foreach(var test in tests)
		{
			var min = test.Item1;
			var max = test.Item2;
			var spread = test.Item2 - test.Item1;
			_out.WriteLine($"min: {min} max: {max} spread: {spread}");
			_out.WriteLine($"---------------------------------------------------------------------");

			var tickMax = test.Item2;
			var tick75 = spread * 0.75d + (min < 0 ? min : 0);
			var tick50 = spread * 0.5d + (min < 0 ? min : 0);
			var tick25 = spread * 0.25d + (min < 0 ? min : 0);
			var tickMin = test.Item1;

			_out.WriteLine($"tickMax: {tickMax,20}   {tickMax:N2}");
			_out.WriteLine($"tick75:  {tick75,20}   {tick75:N2}");
			_out.WriteLine($"tick50:  {tick50,20}   {tick50:N2}");
			_out.WriteLine($"tick25:  {tick25,20}   {tick25:N2}");
			_out.WriteLine($"tickMin: {tickMin,20}   {tickMin:N2}");

			_out.WriteLine("");
			_out.WriteLine("");
		}
	}

	private Prediction[] MapPredictions(ResponseModel model)
	{
		return model
			.predictions
			.Select(m => new Prediction(DateTime.Parse(m.t), Double.Parse(m.v)))
			.ToArray();
	}
	private ResponseModel LoadJson()
	{
		return JsonSerializer.Deserialize<ResponseModel>(File.ReadAllText(@"D:\Dave-Speer\tides\sandbox\bob-hall-pier-year-results.json"));
	}
}
