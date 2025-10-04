// Line Chart Implementation
class LineChart {
    constructor(containerId, data = null) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.svg = null;
        this.data = data || this.getSampleData();
        this.dimensions = {};
    }

    getSampleData() {
        return [
            { date: new Date('2024-01-01'), value: 100 },
            { date: new Date('2024-02-01'), value: 150 },
            { date: new Date('2024-03-01'), value: 120 },
            { date: new Date('2024-04-01'), value: 180 },
            { date: new Date('2024-05-01'), value: 160 },
            { date: new Date('2024-06-01'), value: 200 },
            { date: new Date('2024-07-01'), value: 175 },
            { date: new Date('2024-08-01'), value: 220 },
            { date: new Date('2024-09-01'), value: 190 },
            { date: new Date('2024-10-01'), value: 250 }
        ];
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

        const xScale = d3.scaleBand()
            .domain(this.data.map(d => d.year))
            .range([0, innerWidth])
            .padding(0.1);


            const yMax = d3.max(this.data, d => 
                d3.max([
                    d.queenData,
                    d.nswData,
                    d.saData,
                    d.tasData,
                    d.snowData,
                    d.avgData
                ])
            );
        const yScale = d3.scaleLinear()
            .domain([0,yMax])
            .nice()
            .range([innerHeight, 0]);

            const bottomAxis = d3.axisBottom(xScale);
            
            const leftAxis = d3.axisLeft(yScale);

            g.append("g")
            .attr("class", "axis-x")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(bottomAxis).selectAll("text");

            g.append('g')
            .attr('class', 'y-axis')
            .call(leftAxis).selectAll("text");


//label for y axis
        g.append('text')
            .attr('x', -innerHeight / 2 )
            .attr('y', -margin.left +20)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('fill', '#333')
            .text('$ per megawatt hour');
            //label for x axis


        g.append('text')
            .attr('x', innerWidth / 2 )
            .attr('y', innerHeight + margin.bottom - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#333')
            .text('Year');


            const seriesKeys = [
            { key: "queenData", label: "Queensland" },
            { key: "nswData", label: "NSW" },
            { key: "saData", label: "South Australia" },
            { key: "tasData", label: "Tasmania" },
            { key: "snowData", label: "Snowy" },
            { key: "avgData", label: "Average" }
            ];
            const seriesData = seriesKeys.map(s => ({
            name: s.label,
            values: this.data.map(d => ({
                year: d.year,
                value: d[s.key]
            }))
            }));


            //LEGENDS
            const legend = this.svg.append("g")
  .attr("transform", `translate(${margin.left},20)`);

legend.selectAll("text")
  .data(seriesData)
  .enter()
  .append("text")
  .attr("x", (d, i) => i * 120)
  .attr("y", 0)
  .text(d => d.name)
  .attr("fill", (d, i) => d3.schemeTableau10[i]);

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.year)+ xScale.bandwidth() / 2)
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

            //DRAW all lines
g.selectAll(".line-series")
  .data(seriesData)
  .enter()
  .append("path")
    .attr("class", "line-series")
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", (d, i) => d3.schemeTableau10[i]) // auto color
    .attr("d", d => line(d.values));


   //hover tooltip
  // .on('mouseover', (event, d) => {
            //     tooltip.transition()
            //         .duration(200)
            //         .style('opacity', .9);
            //     tooltip.html(`Date: ${d3.timeFormat('%b %d, %Y')(d.date)}<br/>Revenue: $${d.value}`)
            //         .style('left', (event.pageX + 10) + 'px')
            //         .style('top', (event.pageY - 28) + 'px');
            // })
            // .on('mouseout', () => {
            //     tooltip.transition()
            //         .duration(500)
            //         .style('opacity', 0);
            // })



        // Add hover effects
        // g.selectAll('.dot')
        //     .on('mouseenter', function() {
        //         d3.select(this)
        //             .transition()
        //             .duration(200)
        //             .attr('r', 8);
        //     })
        //     .on('mouseleave', function() {
        //         d3.select(this)
        //             .transition()
        //             .duration(200)
        //             .attr('r', 5);
        //     });
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
window.LineChart = LineChart;