import React from 'react';
import CanvasJSReact from '../canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class DataViewer extends React.Component {

    state = {
        open: false,
        selectedData: []
    }

    chart = null;

    toggleViewer = () => {
        if(this.props.markers.length < 1) {
            this.setState({
                open: false
            })
            return;
        }

        this.setState({
            open: !this.state.open
        })

        if(this.state.selectedData.length === 0) {
            this.setState({
                selectedData: [this.chart.axisX[0].dataInfo.min, this.chart.axisX[0].dataInfo.max]
            });
        }
        
    }

    averageData(data) {
        const avgData = {};
        const minData = {};
        const maxData = {};
        const dataList = ['Elevation', 'Speed'];

        // Filter the data to have it only read from the visible data in the graph
        const dataToParse = data.filter(pointBeforeFilter => (
                new Date(pointBeforeFilter.Date_Time).getTime() >= this.state.selectedData[0] && 
                new Date(pointBeforeFilter.Date_Time).getTime() <= this.state.selectedData[1]
            ));
            
        dataToParse.forEach((point) => {
            dataList.forEach((item) => {
                if(avgData[item] === undefined) {
                    avgData[item] = 0;
                    minData[item] = point[item];
                    maxData[item] = point[item];
                }

                if(point[item] > maxData[item]) {
                    maxData[item] = point[item];
                }

                if(point[item] < minData[item]) {
                    minData[item] = point[item];
                }

                avgData[item] += point[item];
            });
        });

        if(this.chart){
            this.chart.data[0].dataPoints.map((point) => {
                if(point.y === maxData['Speed']){
                    point.indexLabel = 'Max Speed';
                    point.markerColor = 'red';
                    point.markerType = 'triangle';
                }
                if(point.y === minData['Speed']){
                    point.indexLabel = 'Min Speed';
                    point.markerColor = 'blue';
                    point.markerType = 'triangle';
                }
                return point;
            });
        }

        dataList.forEach((list) => {
            avgData[list] /= dataToParse.length;
        });

        return {avgData, minData, maxData};
    }

  render() {      
    const chartOptions = {
        rangeChanged: function(e){
            onRangeChange(e);
        },
        zoomEnabled: true,
        backgroundColor: "#f5f5f5",
        toolTip: {
            shared: true
        },
        title: {
            text: "Log Graph",
            fontSize: 15,
            fontFamily: "Arial",
        },
        axisX:{
            title: "Time (mm:ss)",
            valueFormatString: "mm:ss"
        },
        axisY:{
            title: "Speed (MPH)"
        },
        axisY2:{
            title: "Elevation (ft)"
        },
        height: 300,
        legend: {
            horizontalAlign: "right",
            verticalAlign: "top"
        },
        data: [
        {
            type: "line",
            name: "Speed",
            showInLegend: true,
            legendText: "Speed",
            xValueFormatString:"'Time': mm:ss",
            yValueFormatString:"## mph",
            dataPoints: 
                this.props.markers.map((marker) => 
                    ({x: new Date(marker.Date_Time), y: Number(marker.Speed) })
                )
        },
        {
            type: "line",
            name: "Elevation",
            showInLegend: true,
            legendText: "Elevation",
            yValueFormatString:"### ft",
            axisYType: "secondary",
            dataPoints: 
                this.props.markers.map((marker) => 
                    ({x: new Date(marker.Date_Time), y: Number(marker.Elevation) })
                )
        }
    ],

    }

    const { avgData, minData, maxData } = this.averageData(this.props.markers);

    const onRangeChange = (e) => {
        if(e.axisX[0].viewportMinimum === null){
            this.setState({
                selectedData: [this.chart.axisX[0].dataInfo.min, this.chart.axisX[0].dataInfo.max]
            });
            return;
        }
        this.setState({
            selectedData: [e.axisX[0].viewportMinimum, e.axisX[0].viewportMaximum]
        });
    }

    return (
    <div id='dataViewerBox' className={this.state.open ? "show" : "hide"} >
        <hr id='smallBtn' onClick={this.toggleViewer}/>
        <hr id='largeBtn' onClick={this.toggleViewer}/>
        <div id='dataDiv'>
            <div id='textDiv'>
                <div id='dataHeaders'>
                    <div style={{padding: "0 0 0 20%"}}>Average</div>
                    <div style={{margin: "auto"}}>Minimum</div>
                    <div style={{padding: "0 12% 0 0"}}>Maximum</div>
                </div>
                <hr />
                <div id='dataDisplayBox'>
                    <div style={{padding: "0 0 0 1%"}}>
                        {avgData ? Object.entries(avgData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[0]}:</div>))
                            : null}
                        <div className='dataDisplayText'>Elapsed time:</div>
                        <div className='dataDisplayText'>Distance:</div>
                    </div>
                    <div style={{padding: "0 0 0 5%"}}>
                        {avgData ? Object.entries(avgData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[1].toFixed(1)}</div>))
                            : null}
                    </div>
                    <div style={{margin: "auto"}}>
                        {minData ? Object.entries(minData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[1].toFixed(1)}</div>))
                            : null}
                    </div>
                    <div style={{padding: "0 20% 0 0"}}>
                        {maxData ? Object.entries(maxData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[1].toFixed(1)}</div>))
                            : null}
                    </div>
                </div>
            </div>
            <div id='chartDiv'>
                {this.props.markers ? <CanvasJSChart options = {chartOptions} onRef={ref => this.chart = ref}/> : null}
            </div>
        </div>
    </div>
    );
  }
}
