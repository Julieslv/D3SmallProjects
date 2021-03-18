import * as d3 from 'd3';
import { csv } from 'd3';
import { parse } from 'upath';

const drawChart = async () => {
	// 1. Access data
	const dataset = await d3.csv('./data/bob_ross_paintings.csv');
	console.log(dataset[20]);

	/*
    1. Accessor functions
  */

	const xAccessor = d => d.episode;
	const yAccessor = d => d.num_colors;
	const colourAccessor = d => {
		let color_hex = d.color_hex;
		color_hex = color_hex.substr(2, color_hex.length - 3);
		color_hex = color_hex.replace(/'/g, '');
		color_hex = color_hex.split(',');
		return color_hex;
	};

	/*
  2. Create the chart dimensions
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
		.style('background', '#eeeeee')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height);

	// add to the definition each image to map
	const defs = wrapper.append('svg:defs');

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

	// console.log(colourAccessor);
	const colorScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, colourAccessor))
		.range(['rgba(255,0,241, 0.33)', 'rgba(255,0,241, 1)']);
	//rgba(255, 238, 0, 1) #ffee00
	// console.log(colourAccessor);

	// as in dustbin or container and array of arrays
	const binGenerator = d3
		.bin()
		.domain(xScale.domain())
		.value(xAccessor)
		.thresholds(5);

	const bins = binGenerator(dataset);
	// console.log('BINS: ', bins);
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
	const size = 50;

	const drawDots = (data, colour) => {};

	const pattern = defs
		.selectAll('pattern')
		.data(dataset)
		.enter()
		.append('pattern')
		.attr('id', (d, i) => `img_${i}`)
		.attr('width', 1)
		.attr('height', 1)
		.attr('patternUnits', 'objectBoundingBox')
		.append('image')
		.attr('x', 0)
		.attr('y', -size / 2)
		.attr('width', size * 3)
		.attr('height', size * 3)
		.attr('xlink:href', d => d.img_src);

	const dots = bounds.selectAll('circle').data(dataset);
	dots
		.join('circle')
		.transition()
		.attr('cx', data => xScale(xAccessor(data)))
		.attr('cy', data => yScale(yAccessor(data)))
		.attr('r', size)
		// .attr('fill', '#fff')
		.style('fill', (d, i) => `url(#img_${i})`);
	// .selectAll(colourAccessor)
	// .join('circle')
	// .attr('cx', (data, index) => {
	// 	console.log(data);
	// 	return 10 + index * 2;
	// })
	// .attr('cy', (data, index) => 10 + index * 2.5)
	// .attr('r', 10)
	// .style('fill', 'red');

	/* Fill the background with an image. */
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
		.html('Film season');

	const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);

	const yAxis = bounds.append('g').call(yAxisGenerator);

	const yAxisLabel = yAxis
		.append('text')
		.attr('x', -dimensions.boundedHeight / 2)
		.attr('y', -dimensions.margin.left + 28)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.text('Unique colours')
		.style('transform', 'rotate(-90deg)')
		.style('text-anchor', 'middle');
};
drawChart();
