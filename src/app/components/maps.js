import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api';

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


export default function Map({geometry, roofSegmentStats, setChartData, setPageData}) {
  const [map, setMap] = useState(null)
  const [paths, setPaths] = useState([])

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
            key={index}
            position={position}
            onClick={() => {
              setChartData(element.stats.sunshineQuantiles);
              setPageData(element);
            }}
          />
       )
      })
      : '' }
    </GoogleMap>
) : <></>
}
