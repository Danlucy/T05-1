// Scatter Plot Implementation
class ScatterPlot {
    constructor(containerId, data = null) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.svg = null;
        this.data = data;
        this.dimensions = {};
    }


    updateDimensions() {
        const rect = this.container.node().getBoundingClientRect();
        this.dimensions = {
            width: rect.width,
            height: Math.max(rect.height, 500),
            margin: { top: 40, right: 100, bottom: 60, left: 60 }
        };
    }

    init() {
        this.updateDimensions();
        this.container.selectAll('*').remove();
        this.render();
    }

    render() {
        // Safety check for data
        if (!this.data || !Array.isArray(this.data) || this.data.length === 0) {
            console.error('ScatterPlot: No valid data available for rendering');
            this.container.selectAll('*').remove();
            this.container
                .append('div')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('justify-content', 'center')
                .style('min-height', '500px')
                .style('color', '#e53e3e')
                .style('text-align', 'center')
                .html('<p>No data available for scatter plot</p>');
            return;
        }

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
        const xScale = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.x))
            .nice()
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.y))
            .nice()
            .range([innerHeight, 0]);

  

      

        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

    // Y Axis label
g.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -innerHeight / 2)    // center vertically
  .attr('y', -margin.left + 15)   // place just left of axis
  .style('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('fill', '#666')
  .text('Energy Consumption (W)');
// X Axis label
g.append('text')
    .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', '#666')
    .text('Star Rating');


        // Create tooltip
        // const tooltip = d3.select('body').append('div')
        //     .attr('class', 'd3-tooltip')
        //     .style('opacity', 0);

        // Add grid lines
        g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-innerHeight)
                .tickFormat('')
            )
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0.3);

        g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-innerWidth)
                .tickFormat('')
            )
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0.3);

        // Add scatter points
        g.selectAll('.dot')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
           .attr('r', 4)                 // fixed radius
.attr('fill', '#4682b4')      // fixed fill color
.attr('stroke-width', 1.5)
            .style('opacity', 0.8)
            // .style('cursor', 'pointer')
            // .on('mouseover', function(event, d) {
            //     // Highlight point
            //     d3.select(this)
            //         .transition()
            //         .duration(200)
            //         .attr('r', 6 )
            //         .style('opacity', 1);

            //     // Show tooltip
            //     tooltip.transition()
            //         .duration(200)
            //         .style('opacity', .9);
            // tooltip.html(`
            //     Star Rating: ${d.x.toFixed(2)}<br/>
            //     Energy Consumption: ${d.y.toFixed(1)}
            // `)
            //     .style('left', (event.pageX + 10) + 'px')
            //     .style('top', (event.pageY - 28) + 'px');
            // })
            // .on('mouseout', function(event, d) {
            //     d3.select(this)
            //         .transition()
            //         .duration(200)
            //         .attr('r', 4)   // reset to original radius
            //         .style('opacity', 0.8);

            //     tooltip.transition()
            //         .duration(500)
            //         .style('opacity', 0);
            // })
          .attr('r', 4);   // no animation, renders instantly


        // Add trend line (optional)
        if (this.showTrendLine) {
            const regression = this.calculateLinearRegression(this.data);
            const trendLineData = [
                { x: d3.min(this.data, d => d.x), y: regression.slope * d3.min(this.data, d => d.x) + regression.intercept },
                { x: d3.max(this.data, d => d.x), y: regression.slope * d3.max(this.data, d => d.x) + regression.intercept }
            ];

            const trendLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            g.append('path')
                .datum(trendLineData)
                .attr('fill', 'none')
                .attr('stroke', '#ff6b6b')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .attr('d', trendLine)
                .style('opacity', 0)
                .transition()
                .delay(1000)
                .duration(1000)
                .style('opacity', 0.8);
        }


        // Add correlation coefficient if trend line is shown
        if (this.showTrendLine) {
            const correlation = this.calculateCorrelation(this.data);
            legend.append('text')
                .attr('x', 0)
                .attr('y', categories.length * 25 + 20)
                .style('font-size', '10px')
                .style('fill', '#666')
                .text(`R² = ${correlation.toFixed(3)}`);
        }
    }

    // Linear regression calculation
    calculateLinearRegression(data) {
        const n = data.length;
        const sumX = d3.sum(data, d => d.x);
        const sumY = d3.sum(data, d => d.y);
        const sumXY = d3.sum(data, d => d.x * d.y);
        const sumXX = d3.sum(data, d => d.x * d.x);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    }

    // Correlation coefficient calculation
    calculateCorrelation(data) {
        const n = data.length;
        const sumX = d3.sum(data, d => d.x);
        const sumY = d3.sum(data, d => d.y);
        const sumXY = d3.sum(data, d => d.x * d.y);
        const sumXX = d3.sum(data, d => d.x * d.x);
        const sumYY = d3.sum(data, d => d.y * d.y);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return Math.pow(numerator / denominator, 2);
    }

    // Method to toggle trend line
    toggleTrendLine() {
        this.showTrendLine = !this.showTrendLine;
        this.render();
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
window.ScatterPlot = ScatterPlot;