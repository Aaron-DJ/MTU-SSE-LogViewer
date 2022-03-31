import './App.css';
import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import FileSelect from './components/FileSelect';
import DataViewer from './components/DataViewer';

import mapStyles from './mapStyles';
import mapStyleLight from './mapStyleLight';
import SideMenu from './components/SideMenu';

const libraries = ["places"];

const generalSettings = {
  darkMode: true,
  showLine: true,
  showMarkers: true,
  accent: "#76ff8d",
};

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 47.1191, 
  lng: -88.5468
};
const options = {
  styles: generalSettings.darkMode ? mapStyles : mapStyleLight,
  disableDefaultUI: true,
  zoomControl: true,
};

const lineOptions = {
  strokeColor: generalSettings.accent,
  strokeOpactity: 1.0,
  strokeWeight: 10,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Handle all file reading
  // const [logs, setLogs] = useState([]); Not used right now
  const [data, setData] = useState([]);
  const [coords, setCoords] = useState([]);

  const onFileSelect = (fileData) => {
    setData(fileData);
    setCoords(fileData.map(item => ({
      lat: Number(item.Latitude), 
      lng: Number(item.Longitude)
    })));
    panTo({lat: Number(fileData[0].Latitude), lng: Number(fileData[0].Longitude)});
  }

  // Access all of the logs from /logs and store them. Works but not implemented.. logs load as not files? reserach at some point
  const onLoadLogs = (loadedLogs) => {
    // setLogs(loadedLogs);
  }

  // Handle map stuff
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Converts a speed value to a hex color value
  const mapColor = (speed, min, max) => {

    let colorScale = Math.round((speed - min) * (510) / (max - min));
    let r = 0;
    let g = 0;

    if(colorScale > 510) {
      colorScale = 510;
    }

    if(colorScale <= 255) {
      r = colorScale;
      g = 255;
    } else {
      r = 255;
      g = 255 - (colorScale - 255);
    }

    let rString = r.toString(16).length > 1 ? r.toString(16) : "0" + r.toString(16);
    let gString = g.toString(16).length > 1 ? g.toString(16) : "0" + g.toString(16);

    return "#" + rString + gString + "34";
  }

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, [])

  const resetMap = () => {
    setData([]);
    setCoords([]);
    setSelectedMarker(null);
  }

  const panTo = React.useCallback(({lat, lng} ) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(15);
  }, []);

  if(loadError) return (<div>"Error loading maps"</div>);
  if(!isLoaded) return (<div>"Loading maps"</div>);

  return (
    <div>
      <h1>MTU SSE VPT Log Viewer</h1>

      <FileSelect onUpload={onFileSelect} loadLogs={onLoadLogs}/>

      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={15} 
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {generalSettings.showMarkers ? data.map(point => (
          <Marker 
            key={new Date(point.Date_Time).toISOString()} 
            position={{lat: Number(point.Latitude), lng: Number(point.Longitude)}}
            icon={{
              // url: "/dotMarker.png",
              // scaledSize: new window.google.maps.Size(20,20),
              // origin: new window.google.maps.Point(0,0),
              // anchor: new window.google.maps.Point(10,10),
              path: window.google.maps.SymbolPath.CIRCLE, //Temp testing for a circle...
              fillColor: mapColor(point.Speed, 0, 40), // Change with speed at location map from rgb(0, 255, 0) to rgb(255, 0, 0)
              strokeColor: mapColor(point.Speed, 0, 40),
              scale: 4
            }}
            onClick={() => {
              setSelectedMarker(point);
            }}
          />
          )) : null};

          {coords && generalSettings.showLine ? <Polyline path={coords} options={lineOptions} /> : null}

          {selectedMarker ? (
            <InfoWindow 
            position={{lat: Number(selectedMarker.Latitude), lng: Number(selectedMarker.Longitude)}}
            onCloseClick={() => {
              setSelectedMarker(null);
              }}>
              <div>
                {Object.entries(selectedMarker).map((entry, i) => (
                  <p key={i}>{entry[0]}: {entry[1]}</p>
                ))};
              </div>
            </InfoWindow>
            ) : null}
      </GoogleMap>

      <DataViewer markers={data} selectedMarker={selectedMarker} />
      <SideMenu settings={generalSettings} reset={resetMap}/>

    </div>
  );
}


export default App;
