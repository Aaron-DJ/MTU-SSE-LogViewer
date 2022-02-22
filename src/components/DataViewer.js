import React from 'react';
import CanvasJSReact from '../canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class DataViewer extends React.Component {

    state = {
        open: false,
        chart: null
    }

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
        
    }

    onRangeChange = (e) => {
        console.log("User zoomed" + e);
    }

    averageData(data) {
        const avgData = {};
        const minData = {};
        const maxData = {};
        const dataList = ['Elevation', 'Speed'];

        data.forEach((point) => {
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

        dataList.forEach((list) => {
            avgData[list] /= data.length;
        });

        return {avgData, minData, maxData};
    }

  render() {
    const { avgData, minData, maxData } = this.averageData(this.props.markers);
      
    const chartOptions = {
        rangeChanged: function(e){console.log(e);},
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
            title: "Elapsed Time (mm:ss)",
            valueFormatString: "mm:ss.fff"
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
            axisYType: "secondary",
            dataPoints: 
                this.props.markers.map((marker) => 
                    ({x: new Date(marker.Date_Time), y: Number(marker.Elevation) })
                )
        }
    ],

    }

    return (
    <div id='dataViewerBox' className={this.state.open ? "show" : "hide"} >
        <hr id='smallBtn' onClick={this.toggleViewer}/>
        <hr id='largeBtn' onClick={this.toggleViewer}/>
        <div id='dataDiv'>
            <div id='textDiv'>
                <div id='dataHeaders'>
                    <div style={{padding: "0 0 0 15%"}}>Average</div>
                    <div style={{margin: "auto"}}>Minimum</div>
                    <div style={{padding: "0 15% 0 0"}}>Maximum</div>
                </div>
                <hr />
                <div id='dataDisplayBox'>
                    <div>
                        {avgData ? Object.entries(avgData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[0]}: {entry[1]}</div>))
                            : null}
                    </div>
                    <div>
                        {minData ? Object.entries(minData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[1]}</div>))
                            : null}
                    </div>
                    <div>
                        {maxData ? Object.entries(maxData).map(entry => 
                            (<div key={Math.random()} className='dataDisplayText'>{entry[1]}</div>))
                            : null}
                    </div>
                </div>
            </div>
            <div id='chartDiv'>
                {this.props.markers ? <CanvasJSChart options = {chartOptions} onRef={ref => this.setState({chart: ref})}/> : null}
            </div>
        </div>
    </div>
    );
  }
}