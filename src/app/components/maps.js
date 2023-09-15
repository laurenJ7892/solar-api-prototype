import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polygon, Rectangle } from '@react-google-maps/api';
import { Slider } from "@mui/material";

function drawCircle(point, radius, dir) {
  let d2r = Math.PI / 180;   // degrees to radians 
  let r2d = 180 / Math.PI;   // radians to degrees 
  let earthsradius = 6378137; // 6378137 is the radius of the earth in metters
  let points = 128; // number of point to draw Circle

  // find the raidus in lat/lon 
  let rlat = (radius / earthsradius) * r2d;
  let rlng = rlat / Math.cos(point.lat * d2r);

  let extp = [];

  let start, end;
  if (dir == 1) {  // one extra here makes sure we connect the
    start = 0; end = points + 1
  } else {
    start = points + 1; end = 0
  }
  for (let i = start; (dir == 1 ? i < end : i > end); i = i + dir) {
    let theta = Math.PI * (i / (points / 2));
    const ey = point.lng + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
    const ex = point.lat + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
    extp.push({
      lat: ex,
      lng: ey,
    });
  }
  return extp;
}


export default function Map({geometry, roofSegmentStats, setChartData, setPageData, overallInfo, roofTiles, visPanel, setVisPanel }) {
  const [map, setMap] = useState(null)
  const [paths, setPaths] = useState([])
  
  function calculateBounds({center, orientation}) {
    const panelHeight = overallInfo.panelHeightMeters;
    const panelWidth = overallInfo.panelWidthMeters;
    const added_height = panelHeight / 2;
    const added_width = panelWidth / 2;

    const {latitude, longitude} = center;
    const earth = 6378.137  //radius of the earth in kilometer
    const pi = Math.PI
    const cos = Math.cos
    let m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

    let north, south, east, west;
  
    if (orientation == "PORTRAIT") {
      east = longitude + (added_height * m) / cos(latitude * (pi / 180));
      west = longitude - (added_height * m) / cos(latitude * (pi / 180));
      north = latitude + (added_width * m);
      south = latitude - (added_width * m);
    } else {
      east = longitude + (added_width * m) / cos(latitude * (pi / 180));
      west = longitude - (added_width * m) / cos(latitude * (pi / 180));
      north = latitude + (added_height * m);
      south = latitude - (added_height * m);
    }
    return {
      north,
      south,
      east,
      west
    }
  }

  const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    })
  
  
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(geometry);
    map.fitBounds(bounds);

    bounds.extend(geometry);
    let pathsCircle = [];
    pathsCircle.push(drawCircle(geometry, 20, 1));
    
    const worldCoords = [
      new google.maps.LatLng(-85.1054596961173, -180),
      new google.maps.LatLng(85.1054596961173, -180),
      new google.maps.LatLng(85.1054596961173, 180),
      new google.maps.LatLng(-85.1054596961173, 180),
      new google.maps.LatLng(-85.1054596961173, 0)
    ];

    setPaths([worldCoords, ...pathsCircle]);
    setMap(map)
  }, [geometry])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded && geometry ? (
    <>
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: '100%'
      }}
      center={geometry}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapTypeId={'satellite'}
    >
      <Polygon
      paths={paths}
      strokeColor={'#fff'}
      strokeOpacity={0}
      strokeWeight={0}
      fillColor={'#000'}
      fillOpacity={0.99}
      />
      {roofSegmentStats ? roofSegmentStats.map((element, index) => {
        const position = {
          'lat': element.center.latitude,
          'lng': element.center.longitude
        }
       return (
          <Marker
            key={index + 1}
            position={position}
            onClick={() => {
              setChartData(element.stats.sunshineQuantiles);
              setPageData(element);
            }}
          />
       )
      })
      : '' }
      {geometry ? 
          <Marker
            key={0}
            position={geometry}
            onClick={() => {
              setChartData(overallInfo.buildingStats.sunshineQuantiles);
              setPageData(overallInfo);
            }}
          />
       : '' }
      {roofTiles ? roofTiles.solarPanels.map((element, index) => {
        if (index >= visPanel) {
          return 
        } else {
          return (
            <Rectangle
              key={index + 1}
              options={{
                strokeColor: '#1e3a8a',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#bfdbfe',
                fillOpacity: 0.5,
              }}
              bounds={calculateBounds(element)}
            />
          )
        }
      }) : ''}
    </GoogleMap>
    {roofTiles ? 
    <div className="absolute left-1/2 bottom-0 w-80 bg-zinc-900 p-5 rounded">
      <h2 className="text-gray-100"> Panels </h2>
        <Slider
          marks
          step={1}
          min={0}
          max={overallInfo.maxArrayPanelsCount}
          value={visPanel ? visPanel : 1}
          onChange={(e) => setVisPanel(e.target.value)}
          valueLabelDisplay="auto"
        />
      </div>
      : ''} 
    </>
) : <></>
}
