import * as d3 from 'd3';

const drawScatter = async () => {
	const dataset = await d3.json('./data/my_weather_data.json');

	/*
  1. Accessor functions
*/
	const xAccessor = d => d.dewPoint;
	const yAccessor = d => d.humidity;
	const colourAccessor = d => d.cloudCover;

	/*
  2. Creat the chart dimensions
  Using D3.min() method ignores undefined and null values, where math.min() will not and returns 0 or NAN.
  We get the smallest edge of the window to make and calculate or square, scatter plots should always be squares
*/

	const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

	const dimensions = {
		width,
		height: width,
		margin: {
			top: 20,
			right: 20,
			bottom: 70,
			left: 70,
		},
	};
	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.right - dimensions.margin.left;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	/*
  3.Draw SVG
*/

	const wrapper = d3
		.select('#wrapper')
		.append('svg')
		.style('background', '#ffee00')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height);

	const bounds = wrapper
		.append('g')
		.style(
			'transform',
			`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
		);
	/*
      4. Create scales
    */

	const xScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice(); // takes the domain scales and makes them round numbers

	const yScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedWidth, 0]) // we invert the start point bottom is the largest pixel value, the screen is mirrored
		.nice(); // takes the domain scales and makes them round numbers

	const colorScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, colourAccessor))
		.range(['rgba(255,0,241, 0.33)', 'rgba(255,0,241, 1)']);

	/*
			5 Draw data
	*/

	/*
	// use a data join instead.
		NOTE:
		Given an array of data and a D3 selection we can attach or ‘join’
		each array element to each element of the selection.
		This creates a close relationship between your data and
		graphical elements which makes data-driven modification of the elements straightforward.
	*/
	const drawDots = (data, colour) => {};
	const dots = bounds.selectAll('circle').data(dataset);
	dots
		.join('circle')
		.attr('cx', data => xScale(xAccessor(data)))
		.attr('cy', data => yScale(yAccessor(data)))
		.attr('r', 5)
		.attr('fill', d => {
			console.log(colourAccessor(d));
			return colorScale(colourAccessor(d));
		});
	console.log(dots);

	/*
		6. Draw peripherals
	*/

	const xAxisGenerator = d3.axisBottom().scale(xScale);
	const xAxis = bounds
		.append('g')
		.call(xAxisGenerator)
		.style('transform', `translateY(${dimensions.boundedHeight}px)`);

	const xAxisLabel = xAxis
		.append('text')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', dimensions.margin.bottom - 20)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.html('Dew point (&deg;F)');

	const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);

	const yAxis = bounds.append('g').call(yAxisGenerator);

	const yAxisLabel = yAxis
		.append('text')
		.attr('x', -dimensions.boundedHeight / 2)
		.attr('y', -dimensions.margin.left + 28)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.text('Relative humidity')
		.style('transform', 'rotate(-90deg)')
		.style('text-anchor', 'middle');

	console.log(dataset[0]);
};

drawScatter();
