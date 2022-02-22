import React from 'react';

// const importAllLogs = (r) => {
//     let logs = [];
//     r.keys().map((item, i) => { 
//         logs[i] = r(item); //item.replace('./', '')
//     });
//     return logs;
// }

class FileSelect extends React.Component {
    
    state = {
        isFilePicked: false,
        selectedFile: null,
        logs: [],
    }

    componentDidMount() {
        // const logs = importAllLogs(require.context('../logs', false, /\.csv/));
        // console.log(logs);
        // this.props.loadLogs(logs);
        // this.setState({
        //     logs: logs,
        // })

        // Access logs from server, only one at a time, kinda useless
        // axios.get("http://localhost:8000/logs")
        // .then(res => {
        //     console.log(res);
        // }).catch((error) => {
        //     console.log(error.response);
        // })
    }
    
    

    changeHandler = (event) => {
        this.setState({
            isFilePicked: true,
            selectedFile: event.target.files[0]
        });
    };

    handleSubmission = () => {
        
        if(!this.state.isFilePicked) return;
        
        const reader = new FileReader();
        
        reader.onload = (evt) => {
            this.processData(evt.target.result);
        };
        reader.readAsBinaryString(this.state.selectedFile);

        // Upload file to server
        // const data = new FormData();
        // data.append('file', selectedFile);

        // axios.post("http://localhost:8000/upload", data, {
        // }).then(res => {
        //     console.log(res.statusText);
        // }).catch((error) => {
        //     console.log(error.response.data);
        // })

    
    };
    
    processData = dataString => {
        const dataStringLines = dataString.split(/[\n\r]/g);
        const headers = dataStringLines[0].split(',');

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(',');
        if (headers && row.length === headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
                if (d[0] === '"')
                d = d.substring(1, d.length - 1);
                if (d[d.length - 1] === '"')
                d = d.substring(d.length - 2, 1);
            }
            if (headers[j]) {
                obj[headers[j]] = d;
            }
            }
    
            // remove the blank rows
            if (Object.values(obj).filter(x => x).length > 0) {
            list.push(obj);
            }
        }
        
        }

        list.map((dataObject) => {
            dataObject.Elevation = Number(dataObject.Elevation);   
            dataObject.Speed = Number(dataObject.Speed);
            return dataObject;
        });
        
        // prepare columns list from headers (UNUSED)
        // const columns = headers.map(c => ({
        //     name: c,
        //     selector: c,
        // }));

        this.props.onUpload(list);
    
    }


    render() {

        return (
            <div className='fileUploadBox'>
                <input type="file" className="fileUpload" accept=".csv" onChange={this.changeHandler} />
                {Object.entries(this.state.logs).map((log) => (
                    <div key={log}>{log}</div>
                ))}                
                <button className='fileUploadBtn' onClick={this.handleSubmission}>Load</button>
            </div>
        );
    }
}

export default FileSelect