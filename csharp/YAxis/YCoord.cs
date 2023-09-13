namespace YAxis;

public class YCoord
{
	public static double GetCoordinateRatio(double min, double max, double value)
	{
		var spread = max - min;
		var basis = value - min;


		return basis / spread;
	}


	public static double[] GetYTicks(int ticks, double min, double max)
	{
		var tickLabels = new double[ticks];

		var spread = max - min;
		var increment = spread / (ticks - 1);

		for (int i = 0; i < ticks; i++)
			tickLabels[i] = i * increment + min;

		return tickLabels;
	}

}
