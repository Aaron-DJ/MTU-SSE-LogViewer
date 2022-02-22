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
              url: "/dotMarker.png",
              scaledSize: new window.google.maps.Size(20,20),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(10,10),
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
