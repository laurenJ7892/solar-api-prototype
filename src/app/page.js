"use client"; // This is a client component
import Image from 'next/image';
import { useState, useCallback, useRef } from 'react';
const plotty = require('plotty');
import { Autocomplete, LoadScript  } from '@react-google-maps/api';


import PageData from './components/page_data';
import { getGeoCoordinates, getSolarInformation, getBuildingInsights, getTiffLayer } from '../library/api';
import Nav from './components/nav';
import ColumnChart from './components/column_chart';
import GaugeCharts from './components/gauge_charts';
import Map from './components/maps';

const navPages = {
  1: {'navTitle': 'Data Layers'},
  2: {'navTitle': 'Flux Imagery Options'},
  3: {'navTitle': 'Building Insights', 'heading': 'Maximum Solar Potential'},
  4: {'navTitle': 'Panel Array Design', 'heading': 'Typical Installation'},
}

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [geometry, setGeometry] = useState(null);
    const [solarInfo, setSolarInfo] = useState({});
    const [buildingInsights, setBuildingInsights] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [chartData, setChartData] = useState([]);
    const [pageData, setPageData] = useState({});
    const [searchRes, setSearchRes] = useState(null);
    const [roofSegmentStats, setRoofSegmentStats] = useState([])


    const onLoad = useCallback(function callback(autocomplete) {
      setSearchRes(autocomplete);
    }, [])

    const onPlaceChanged = async () => {
      if (searchRes) {
        const place = searchRes.getPlace();
        const formattedAddress = place.formatted_address;
        getData(formattedAddress);
      } else {
        alert("Address not found!");
      }
    }

    const getData = async (address) => {
      const geo = await getGeoCoordinates(address);
      if (geo && address) {
        setGeometry(geo);
        // Solar Info contains the Image files. 
        // Building Insights contains building facts and panel design and savings.
        const solarInfo = await getSolarInformation(geo);
        const biAPI = await getBuildingInsights(geo);
        console.log(biAPI)
        if (biAPI) {
          setBuildingInsights(biAPI);
          setChartData(biAPI.solarPotential.buildingStats.sunshineQuantiles);
          setPageData(biAPI.solarPotential);
          setRoofSegmentStats(biAPI.solarPotential.roofSegmentStats)
          if (solarInfo) {
            setSolarInfo(solarInfo);
            //const { image, data } = await getTiffLayer(solarInfo);
            //renderTiffLayer(image, data);
          }
        }
      } else {
        alert('Geolocation not found.')
      }
    };


    async function renderTiffLayer(image, data) {
      if (image) {
        const canvas = document.getElementById("map");
        const plot = new plotty.plot({
          canvas,
          data: data[0],
          width: image.getWidth(),
          height: image.getHeight(),
          domain: [0, 256],
        });
        plot.render();
      } else {
        console.log('No image data');
      }
    }
    
    return (
      <>
      <LoadScript
          googleMapsApiKey ={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
      >
        <div className="flex h-100 w-full flex-row relative font-sans text-black" >
          <div className='h-screen bg-white w-1/4 overflow-y-auto'>
            <div className="grid grid-rows-4 w-100 h-screen divide-y-2">
            <Nav
                navTitle={navPages[currentPage]['navTitle']}
                setCurrentPage={setCurrentPage}
                
              />
              <div className='flex grid grid-rows-2 h-100 w-100 items-center'>
                <div className='flex grid grid-cols-3 w-11/12 justify-around items-center'>
                  <h3 className='flex items-right mx-5 items-end justify-center'>Address</h3>
                  <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                    >
                    <input
                        className='flex grow w-100 h-50px'
                        type="text"
                        placeholder="Search for the address"
                        style={{
                          boxSizing: `border-box`,
                          border: `1px solid transparent`,
                          borderRadius: `3px`,
                          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                          fontSize: `18px`,
                          outline: `none`,
                          textOverflow: `overflow-x-auto`,
                          padding: '10px 10px'
                        }}
                      />
                      </Autocomplete>
                  </div>
              </div>
              <PageData
                pageData={pageData}
                pageTitle={navPages[currentPage]['heading']}
              />
              <ColumnChart
                mapData={chartData}
                render={currentPage == 3 ? true : false}
              />
              <GaugeCharts
                 solarPotential={buildingInsights.solarPotential}
                 render={currentPage == 4 ? true : false}
              />
            </div>
          </div>
          <div className="h-screen bg-green w-3/4">
            <Map 
              geometry={geometry}
              roofSegmentStats={currentPage == 3 && roofSegmentStats ? roofSegmentStats : null}
              setChartData={setChartData}
              setPageData={setPageData}
            />
            {/* <div className="h-1/3 w-3/4">
              <canvas id="map" className="flex w-full h-full">
              </canvas>
            </div> */}
          </div>
        </div>
        </LoadScript>
      </>
    )
}
