// D3 Multi-Chart Dashboard JavaScript
// Main controller for managing multiple chart instances


let chartInstances = {};

// Initialize all charts using separate chart classes
function initializeCharts(data = null) {
    console.log('Initializing D3 charts...');

    try {
        // Chart 1: Bar Chart
    
        console.log('Chart 1 will load CSV data separately');

        // Chart 2: Line Chart
        chartInstances.chart2 = new LineChart('chart2', data);
        chartInstances.chart2.init();
        console.log('Charts 1-3 initialized, Chart 3 will load CSV data separately');

        // Chart 4: Scatter Plot will be initialized separately with CSV data
        console.log('Chart 4 will load CSV data separately');
        
        console.log('All charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
        showError('Failed to initialize charts. Please check if all chart files are loaded.');
    }
}

// Resize all charts
function resizeCharts() {
    console.log('Resizing all charts...');
    
    Object.keys(chartInstances).forEach(chartId => {
        try {
            if (chartInstances[chartId] && typeof chartInstances[chartId].resize === 'function') {
                chartInstances[chartId].resize();
            }
        } catch (error) {
            console.error(`Error resizing chart ${chartId}:`, error);
        }
    });
}

// Update chart data
function updateChartData(chartId, newData) {
    if (chartInstances[chartId] && typeof chartInstances[chartId].updateData === 'function') {
        chartInstances[chartId].updateData(newData);
    } else {
        console.warn(`Chart ${chartId} not found or doesn't support data updates`);
    }
}

// Get chart instance for external manipulation
function getChartInstance(chartId) {
    return chartInstances[chartId] || null;
}

// Destroy all charts (cleanup)
function destroyAllCharts() {
    Object.keys(chartInstances).forEach(chartId => {
        if (chartInstances[chartId] && typeof chartInstances[chartId].destroy === 'function') {
            chartInstances[chartId].destroy();
        }
    });
    chartInstances = {};
}

// Utility function to show loading state
function showChartLoading(containerId) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const loadingDiv = container
        .append('div')
        .attr('class', 'chart-loading');
    
    loadingDiv
        .append('div')
        .attr('class', 'spinner');
}

// Utility function to show error state
function showChartError(containerId, errorMessage) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    container
        .append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('min-height', '500px')
        .style('color', '#e53e3e')
        .style('text-align', 'center')
        .html(`<p>Error loading chart:<br>${errorMessage}</p>`);
}

// General error display function
function showError(message) {
    console.error(message);
    // You can add UI error display here if needed
}

// LOAD data for scatter plot
d3.csv("data/Ex5_TV_energy.csv", d3.autoType).then(data => {
    console.log('CSV data loaded:', data.length, 'records');
    
    const scatterData = data.map(d => ({
        x: d.star2,                    // X axis: Star rating
        y: d.energy_consumpt,          // Y axis: Energy consumption
    }));

    chartInstances.chart4 = new ScatterPlot('chart4', scatterData);
    chartInstances.chart4.init();
}).catch(error => {
    console.error('Error loading CSV data:', error);
    showChartError('Scatter Plot', 'Failed to load  data from CSV');
});
// LOAD data for bar chart with different CSV
d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType).then(data => {
    console.log('CSV data loaded:', data.length, 'records');
    
   const barData = data.map(d => ({
    category: d.Screen_Tech,   // matches CSV column exactly
    value: d["Mean(Labelled energy consumption (kWh/year))"] // must use bracket notation because of spaces and parentheses
}));

    chartInstances.chart1 = new BarChart('chart1', barData);
    chartInstances.chart1.init();
}).catch(error => {
    console.error('Error loading CSV data:', error);
    showChartError('Bar Chart', 'Failed to loa data from CSV');
});

// LOAD data for line chart with different CSV
d3.csv("data/Ex5_ARE_Spot_Prices.csv", d3.autoType).then(data => {
    console.log('CSV data loaded:', data.length, 'records');

const lineChartData = data.map(d => ({
  year: d["Year"],
  queenData: +d["Queensland ($ per megawatt hour)"],
  nswData: +d["New South Wales ($ per megawatt hour)"],
  saData: +d["South Australia ($ per megawatt hour)"],
  tasData: +d["Tasmania ($ per megawatt hour)"],
  snowData: +d["Snowy ($ per megawatt hour)"],
  avgData: +d["Average Price (notTas-Snowy)"]
}));

    chartInstances.chart2 = new LineChart('chart2', lineChartData);
    chartInstances.chart2.init();

}).catch(error => {
    console.error('Error loading CSV data:', error);
    showChartError('Bar Chart', 'Failed to loa data from CSV');
});


// LOAD data for donut chart with different CSV
d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType).then(data => {
    console.log('CSV data loaded:', data.length, 'records');

const donutChart = data.map(d => ({
  label: d["Screen_Tech"],
  value: d["Mean(Labelled energy consumption (kWh/year))"]
}));

console.log(donutChart);
    chartInstances.chart3 = new DonutChart('chart3', donutChart);
    chartInstances.chart3.init();

}).catch(error => {
    console.error('Error loading CSV data:', error);
    showChartError('Bar Chart', 'Failed to loa data from CSV');
});
const ChartManager = {
    // Sample data sets for testing
    sampleData: {
        barChart: [
            { category: 'Q1 Sales', value: 120 },
            { category: 'Q2 Sales', value: 190 },
            { category: 'Q3 Sales', value: 150 },
            { category: 'Q4 Sales', value: 210 }
        ],
        lineChart: [
            { date: new Date('2024-01-01'), value: 1000 },
            { date: new Date('2024-02-01'), value: 1200 },
            { date: new Date('2024-03-01'), value: 1100 },
            { date: new Date('2024-04-01'), value: 1400 },
            { date: new Date('2024-05-01'), value: 1600 },
            { date: new Date('2024-06-01'), value: 1800 }
        ],
        pieChart: [
            { label: 'Desktop', value: 40 },
            { label: 'Mobile', value: 35 },
            { label: 'Tablet', value: 20 },
            { label: 'Other', value: 5 }
        ],
        scatterPlot: [
            { x: 20, y: 30, size: 15, category: 'A', label: 'Dataset 1' },
            { x: 40, y: 50, size: 20, category: 'B', label: 'Dataset 2' },
            { x: 60, y: 40, size: 25, category: 'A', label: 'Dataset 3' },
            { x: 80, y: 70, size: 18, category: 'C', label: 'Dataset 4' }
        ]
    },
    
    // Load sample data into charts
    loadSampleData() {
        this.updateChartData('chart1', this.sampleData.barChart);
        this.updateChartData('chart2', this.sampleData.lineChart);
        this.updateChartData('chart3', this.sampleData.pieChart);
        this.updateChartData('chart4', this.sampleData.scatterPlot);
    },
    
    // Update specific chart data
    updateChartData(chartId, data) {
        updateChartData(chartId, data);
    },
    
    // Export chart as SVG
    exportChart(chartId) {
        const chartInstance = getChartInstance(chartId);
        if (chartInstance && chartInstance.svg) {
            const svgElement = chartInstance.svg.node();
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);
            
            // Create download link
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${chartId}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
};

// Export functions for global access
window.initializeCharts = initializeCharts;
window.resizeCharts = resizeCharts;
window.updateChartData = updateChartData;
window.getChartInstance = getChartInstance;
window.destroyAllCharts = destroyAllCharts;
window.showChartLoading = showChartLoading;
window.showChartError = showChartError;
window.ChartManager = ChartManager;