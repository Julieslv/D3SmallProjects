import * as d3 from "d3";

async function drawLineChart() {
	// 1 access data
	const dataset = await d3.csv("./data/trials.csv");
	console.log(dataset);

	const yAccessor = (d) => d.deathsMax;
	const xAccessor = (d) => d.decadeMax;

	// 2. create the chart dimensions

	let dimensions = {
		width: window.innerWidth * 0.9,
		height: 400,
		margin: {
			top: 15,
			right: 15,
			bottom: 40,
			left: 60,
		},
	};

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	//3. Draw canvas

	const wrapper = d3
		.select("#wrapper")
		.append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height);

	const bounds = wrapper
		.append("g")
		.style(
			"transform"`translate(${dimensions.margin.left}px, ${dimensions.margin.top})`
		);

	//4. Create the scales
	const yScale = d3
		.scaleLinear()
		// chart in the min and max values for the domain
		.domain([0, 100])
		// from the height(pixel from the top [0] to the bottom[height of the chart]) of the chart to 0
		.range();
}

drawLineChart();
