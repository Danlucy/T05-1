// Bar Chart Implementation
class BarChart {
    constructor(containerId, data = null) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.svg = null;
        this.data = data ;
        this.dimensions = {};
    }

  

    updateDimensions() {
        const rect = this.container.node().getBoundingClientRect();
        this.dimensions = {
            width: rect.width,
            height: Math.max(rect.height, 500),
            margin: { top: 40, right: 30, bottom: 60, left: 60 }
        };
    }

    init() {
        this.updateDimensions();
        this.container.selectAll('*').remove();
        this.render();
    }

    render() {
        const { width, height, margin } = this.dimensions;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG
        this.svg = this.container
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'd3-chart');

        const g = this.svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(this.data.map(d => d.category))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value)])
            .range([innerHeight, 0]);

        // Create color scale
        const colorScale = d3.scaleOrdinal()
            .domain(this.data.map(d => d.category))
            .range(d3.schemeCategory10);

        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        // Add axis labels
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (innerHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Mean(Labelled energy consumption (kWh/year))');

        g.append('text')
            .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Screen Technology');

        // Create tooltip
        // const tooltip = d3.select('body').append('div')
        //     .attr('class', 'd3-tooltip')
        //     .style('opacity', 0);

        // Add bars
        g.selectAll('.bar')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.category))
            .attr('width', xScale.bandwidth())
            .attr('y', innerHeight)
            .attr('height', 0)
            .attr('fill', d => colorScale(d.category))
            .style('opacity', 0.8)
            // .on('mouseover', (event, d) => {
            //     tooltip.transition()
            //         .duration(200)
            //         .style('opacity', .9);
            //     tooltip.html(`${d.category}<br/>Value: ${d.value}`)
            //         .style('left', (event.pageX + 10) + 'px')
            //         .style('top', (event.pageY - 28) + 'px');
            // })
            // .on('mouseout', () => {
            //     tooltip.transition()
            //         .duration(500)
            //         .style('opacity', 0);
            // })
            .transition()
            .duration(800)
            .attr('y', d => yScale(d.value))
            .attr('height', d => innerHeight - yScale(d.value));

        // Add value labels on top of bars
        g.selectAll('.value-label')
            .data(this.data)
            .enter()
            .append('text')
            .attr('class', 'value-label')
            .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('fill', '#333')
            .style('opacity', 0)
            .text(d => d.value.toFixed(2))
            .transition()
            .delay(800)
            .duration(400)
            .style('opacity', 1);
    }

    updateData(newData) {
        this.data = newData;
        this.render();
    }

    // resize() {
    //     this.init();
    // }

    destroy() {
        if (this.svg) {
            this.svg.remove();
        }
        // Remove tooltip if it exists
        // d3.selectAll('.d3-tooltip').remove();
    }
}

// Export for global access
window.BarChart = BarChart;