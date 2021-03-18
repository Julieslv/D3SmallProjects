import * as d3 from 'd3';

async function drawBars() {
	// 1. Access data
	const dataset = await d3.json('./data/my_weather_data.json');

	const metricAccessor = d => d.humidity;
	const yAccessor = d => d.length;

	// 2. Create chart dimensions

	const width = 600;
	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 30,
			right: 10,
			bottom: 50,
			left: 50,
		},
	};
	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	// 3. Draw canvas

	const wrapper = d3
		.select('#wrapper')
		.append('svg')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height);

	const bounds = wrapper
		.append('g')
		.style(
			'transform',
			`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
		);

	// 4. Create scales

	const xScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, metricAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	const binsGenerator = d3
		.bin()
		.domain(xScale.domain())
		.value(metricAccessor)
		.thresholds(12);

	const bins = binsGenerator(dataset);

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(bins, yAccessor)])
		.range([dimensions.boundedHeight, 0])
		.nice();

	// 5. Draw data

	const binsGroup = bounds.append('g');

	const binGroups = binsGroup.selectAll('g').data(bins).join('g');
	// console.log(binsGroup);

	const barPadding = 1;
	const barRects = binGroups
		.append('rect')
		.attr('x', d => xScale(d.x0) + barPadding / 2)
		.attr('y', d => yScale(yAccessor(d)))
		.attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
		.attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
		.attr('fill', 'cornflowerblue');

	const barText = binGroups
		.filter(yAccessor)
		.append('text')
		.attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
		.attr('y', d => yScale(yAccessor(d)) - 5)
		.text(yAccessor)
		.style('text-anchor', 'middle')
		.attr('fill', 'darkgrey')
		.style('font-size', '12px')
		.style('font-family', 'sans-serif');

	const mean = d3.mean(dataset, metricAccessor);
	const meanLine = bounds
		.append('line')
		.attr('x1', xScale(mean))
		.attr('x2', xScale(mean))
		.attr('y1', -15)
		.attr('y2', dimensions.boundedHeight)
		.attr('stroke', 'maroon')
		.attr('stroke-dasharray', '2px 4px');

	const meanLabel = bounds
		.append('text')
		.attr('x', xScale(mean))
		.attr('y', -20)
		.text('mean')
		.attr('fill', 'maroon')
		.style('font-size', '12px')
		.style('text-anchor', 'middle');

	// 6. Draw peripherals

	const xAxisGenerator = d3.axisBottom().scale(xScale);

	const xAxis = bounds
		.append('g')
		.call(xAxisGenerator)
		.style('transform', `translateY(${dimensions.boundedHeight}px)`);

	const xAxisLabel = xAxis
		.append('text')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', dimensions.margin.bottom - 10)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.text('Humidity')
		.style('text-transform', 'capitalize');

	// 7. Create interactions

	const tooltip = d3.select('#tooltip');

	const onMouseEnter = (event, d) => {
		// console.log(d);
		tooltip.select('#range').text([d.x0, d.x1].join(' - '));
		tooltip.select('#count').text(d.length);

		const x =
			xScale(d.x0) +
			barPadding / 2 +
			(xScale(d.x1) - xScale(d.x0)) / 2 +
			dimensions.margin.left;
		const y = yScale(yAccessor(d)) + dimensions.margin.top;
		tooltip.style(
			'transform',
			`translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`
		); // you must put the px in  -  it will not give you an error message it will fail silently and you weill want to slit your own aorta. 🤨
		tooltip.style('opacity', '1');
	};
	const onMouseLeave = (event, d) => {
		tooltip.style('opacity', '0');
	};

	binGroups.on('mouseenter', onMouseEnter).on('mouseleave', onMouseLeave);
}
drawBars();
