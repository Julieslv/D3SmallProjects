import * as d3 from "d3";

const drawScatter = async () => {
	const dataset = await d3.json("./data/my_weather_data.json");
	console.table(dataset[0]);

	/*
  1. Accessor functions
*/
	const xAccessor = (d) => d.dewPoint;
	const yAccessor = (d) => d.humidity;

	/*
  2. Creat the chart dimensions
  Using D3.min() method ignores undefined and null values, where math.min() will not and returns 0 or NAN.
  We get the smallest edge of the window to make and calculate or square, scatter plots should always be squares
*/

	const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
};
drawScatter();
