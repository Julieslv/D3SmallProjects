import * as d3 from 'd3';

const drawBars = async () => {
	// 1. Access data
	const data = await d3.tsv('./data/penguins.tsv');
	// console.log(data);
	// console.log(data[0].island);

	/*
	 * NOTE: Accessor functions
	 * is a function that accepts a data point
	 * and returns the value for a specific dimension
	 */

	// 2. Create chart dimensions

	const width = 600;

	// create a dimensions object
	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 30,
			right: 20,
			bottom: 50,
			left: 20,
		},
	};
	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
	// console.log(dimensions);

	const drawHistogram = island => {
		console.log(island);

		const xAccessor = d => {
			if (d.body_mass_g !== 'NA' && d.island === island) {
				return d.body_mass_g / 100;
			}
		};

		const yAccessor = d => d.length;
		/* 		const yAccessor = d => {
			if (d.island === island) {
				console.log(d.island);
				return d.length;
			}
		}; */

		// 3. Draw the canvas/SVG
		const wrapper = d3
			.select('#wrapper')
			.append('svg')
			.style('background', '#ffee00')
			.attr('width', dimensions.width)
			.attr('height', dimensions.height);

		wrapper
			.attr('role', 'figure')
			.attr('tabindex', '0')
			.append('title')
			.text('Histogram looking at he distributions of something in 2019');

		const bounds = wrapper
			.append('g')
			.style(
				'transform',
				`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
			);

		//4. Create the scales
		// data to pixel values

		const xScale = d3
			.scaleLinear()
			.domain(d3.extent(data, xAccessor)) // unit: body_mass_g
			.range([0, dimensions.boundedWidth]) // unit: pixels
			.nice(); // make it nice

		// as in dustbin or container and array of arrays
		const binGenerator = d3
			.bin()
			.domain(xScale.domain())
			.value(xAccessor)
			.thresholds(5);

		const bins = binGenerator(data);
		console.log('BINS: ', bins);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(bins, yAccessor)])
			.range([dimensions.boundedHeight, 0])
			.nice();

		// 5, Draw data
		const binsGroup = bounds
			.append('g')
			.attr('tabindex', '0')
			.attr('role', 'list')
			.attr('aria-label', 'Histogram bars');

		const binGroups = binsGroup
			.selectAll('g')
			.data(bins)
			.join('g')
			.attr('tabindex', '0')
			.attr('role', 'listitem');
		// .attr(
		// 	'aria-label',
		// 	d =>
		// 		`There were ${yAccessor(d)} days between ${d.x0} and ${
		// 			d.x1
		// 		} ${metric} levels`
		// );
		const barPadding = 1;

		const barRects = binGroups
			.append('rect')
			.attr('x', d => xScale(d.x0) + barPadding / 2)
			.attr('y', d => yScale(yAccessor(d)))
			.attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
			.attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
			.attr('fill', '#ff008a');
		// .attr('fill', 'rgba(233, 30, 99,0.5');

		const barText = binGroups
			.filter(yAccessor)
			.append('text')
			.attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
			.attr('y', d => yScale(yAccessor(d)) - 5)
			.text(yAccessor)
			.style('text-anchor', 'middle')
			.attr('fill', '#887f00')
			.style('font-size', '12px')
			.style('font-family', 'sans-serif');

		// 6. Draw peripherals

		const mean = d3.mean(data, xAccessor);

		const meanLine = bounds
			.append('line')
			.attr('x1', xScale(mean))
			.attr('x2', xScale(mean))
			.attr('y1', -8)
			.attr('y2', dimensions.boundedHeight - 5)
			.attr('stroke', '#0D76FF')
			// .attr('stroke', '#3a0014')
			.style('stroke-dasharray', '3px 4px')
			.attr('role', 'presentation')
			.attr('aria-hidden', true);

		const meanLabel = bounds
			.append('text')
			.attr('x', xScale(mean))
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.attr('fill', '#b7ab00')
			.attr('font-size', 9)
			.style('text-transform', 'uppercase')
			.text('mean')
			.attr('role', 'presentation')
			.attr('aria-hidden', true);

		const xAxisGenerator = d3.axisBottom().scale(xScale);
		const xAxis = bounds
			.append('g')
			.call(xAxisGenerator)
			.style('transform', `translateY(${dimensions.boundedHeight}px)`);

		const xAxisLabel = xAxis
			.append('text')
			.attr('x', dimensions.boundedWidth / 2)
			.attr('y', dimensions.margin.bottom - 15)
			.attr('fill', '#887f00')
			.style('font-size', '1em')
			.text(island)
			// .text('All species')
			.style('text-transform', 'capitalize')
			.attr('role', 'presentation')
			.attr('aria-hidden', true);
	};
	const islands = [
		'Adelie Torgersen',
		'Adelie Biscoe',
		'Adelie Dream',
		'Gentoo Biscoe',
		'Chinstrap Dream',
	];

	// drawHistogram('Adelie Torgersen');
	islands.forEach(drawHistogram);
};

drawBars();
