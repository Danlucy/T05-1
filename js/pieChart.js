// Pie Chart Implementation
class DonutChart {
    constructor(containerId, data = null) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.svg = null;
        this.data = data || this.getSampleData();
        this.dimensions = {};
    }

    getSampleData() {
        return [
            { label: 'Desktop', value: 45, color: '#6366f1' },
            { label: 'Mobile', value: 35, color: '#8b5cf6' },
            { label: 'Tablet', value: 15, color: '#06b6d4' },
            { label: 'Smart TV', value: 5, color: '#10b981' }
        ];
    }

    updateDimensions() {
        const rect = this.container.node().getBoundingClientRect();
        this.dimensions = {
            width: rect.width,
            height: Math.max(rect.height, 500),
            margin: { top: 40, right: 20, bottom: 40, left: 20 }
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
        const radius = Math.min(innerWidth, innerHeight) / 2 - 20;

        // Create SVG
        this.svg = this.container
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'd3-chart');

        const g = this.svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Create pie generator
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        // Create arc generator
        const arc = d3.arc()
            .innerRadius(50)
            .outerRadius(radius);

        // Create arc for hover effect
        const arcHover = d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 10);
const presetColors = ["#6366f1", "#8b5cf6", "#06b6d4"]; // pick any 3 colors

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(this.data.map(d => d.label))
            .range(presetColors);

        // Create tooltip
        // const tooltip = d3.select('body').append('div')
        //     .attr('class', 'd3-tooltip')
        //     .style('opacity', 0);

        // Create pie slices
        const arcs = g.selectAll('.arc')
            .data(pie(this.data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // Add paths with animation
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.label))
            .style('opacity', 0.8)
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            // .style('cursor', 'pointer')
            // .on('mouseover', function(event, d) {
            //     // Hover effect
            //     d3.select(this)
            //         .transition()
            //         .duration(200)
            //         .attr('d', arcHover);

            //     // Show tooltip
            //     tooltip.transition()
            //         .duration(200)
            //         .style('opacity', .9);
            //     tooltip.html(`${d.data.label}<br/>Value: ${d.data.value}%`)
            //         .style('left', (event.pageX + 10) + 'px')
            //         .style('top', (event.pageY - 28) + 'px');
            // })
            // .on('mouseout', function() {
            //     // Remove hover effect
            //     d3.select(this)
            //         .transition()
            //         .duration(200)
            //         .attr('d', arc);

            //     // Hide tooltip
            //     tooltip.transition()
            //         .duration(500)
            //         .style('opacity', 0);
            // })
            .each(function(d) {
                this._current = { startAngle: 0, endAngle: 0 };
            })
            .transition()
            .duration(1000)
            .attrTween('d', function(d) {
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

        // Add percentage labels
        arcs.append('text')
            .attr('transform', d => {
                const centroid = arc.centroid(d);
                return `translate(${centroid})`;
            })
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .style('opacity', 0)
            .text(d => d.data.label )
            .transition()
            .delay(1000)
            .duration(500)
            .style('opacity', 1);

        // Create legend
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - margin.bottom - (this.data.length * 20)})`);

        const legendItems = legend.selectAll('.legend-item')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`)
            // .style('cursor', 'pointer')
            // .on('mouseover', function(event, d) {
            //     // Highlight corresponding pie slice
            //     g.selectAll('.arc path')
            //         .style('opacity', 0.3);
            //     g.selectAll('.arc')
            //         .filter(arcData => arcData.data.label === d.label)
            //         .select('path')
            //         .style('opacity', 1);
            // })
            // .on('mouseout', function() {
            //     // Reset all slices
            //     g.selectAll('.arc path')
            //         .style('opacity', 0.8);
            // });

        legendItems.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', d => color(d.label))
            .attr('rx', 2);

        legendItems.append('text')
            .attr('x', 18)
            .attr('y', 6)
            .attr('dy', '.35em')
            .style('font-size', '11px')
            .style('fill', '#333')
            .text(d => `${d.label} (${d.value.toFixed(1)})`);

        // Add total in center for donut chart variant
        if (this.showTotal) {
            const total = this.data.reduce((sum, d) => sum + d.value, 0);
            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '.35em')
                .style('font-size', '24px')
                .style('font-weight', 'bold')
                .style('fill', '#333')
                .text(total + '%');

            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '1.5em')
                .style('font-size', '12px')
                .style('fill', '#666')
                .text('Total');
        }
    }

    // Method to convert to donut chart
    setDonutMode(innerRadiusRatio = 0.5, showTotal = true) {
        this.donutMode = true;
        this.innerRadiusRatio = innerRadiusRatio;
        this.showTotal = showTotal;
        this.render();
    }

    // Method to convert back to pie chart
    setPieMode() {
        this.donutMode = false;
        this.showTotal = false;
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
window.PieChart = PieChart;