"use client"; // This is a client component
import { useState, useCallback } from 'react';
import { Autocomplete, LoadScript  } from '@react-google-maps/api';

import PageData from './components/page_data';
import { getGeoCoordinates, getSolarInformation, getBuildingInsights, getTiffLayer } from '../library/api';
import Nav from './components/nav';
import ColumnChart from './components/column_chart';
import GaugeCharts from './components/gauge_charts';
import Map from './components/maps';
import Downloads from './components/downloads';
import FluxData from './components/flux_data';

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
    const [visPanel, setVisPanel] = useState(1)

    const resetState = () => {
      setGeometry(null);
      setSolarInfo({}); 
      setBuildingInsights({});
      setChartData([]);
      setPageData({});
      setRoofSegmentStats([]);
      setVisPanel(1);
    }


    const onLoad = useCallback(function callback(autocomplete) {
      resetState();
      setSearchRes(autocomplete);
    }, [])

    const onPlaceChanged = async () => {
      resetState();
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
        if (biAPI) {
          setBuildingInsights(biAPI);
          setChartData(biAPI.solarPotential.buildingStats.sunshineQuantiles);
          setPageData(biAPI.solarPotential);
          setRoofSegmentStats(biAPI.solarPotential.roofSegmentStats)
          if (solarInfo) {
            setSolarInfo(solarInfo);
          }
        }
      } else {
        alert('Geolocation not found for this address. Please try a new address.')
      }
    };

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
              {currentPage == 1 ? 
                <Downloads 
                  solarInfo={solarInfo}
                  geometry={geometry}
                /> 
              : ''}
               {currentPage == 2 ? 
                <FluxData 
                  solarInfo={solarInfo}
                /> 
              : ''}
              <PageData
                pageData={pageData}
                pageTitle={navPages[currentPage]['heading']}
              />
              {currentPage == 3 ? 
                <ColumnChart
                  mapData={chartData}
                />
              : '' }
              {currentPage == 4 ? 
                <GaugeCharts
                  solarPotential={buildingInsights.solarPotential}
                  visPanel={visPanel}
                />
              : '' }
            </div>
          </div>
          <div className="h-screen bg-green w-3/4">
            <Map 
              geometry={geometry}
              overallInfo={buildingInsights ? buildingInsights.solarPotential : ''}
              roofSegmentStats={currentPage == 3 && roofSegmentStats ? roofSegmentStats : null}
              setChartData={setChartData}
              setPageData={setPageData}
              roofTiles={currentPage == 4 && buildingInsights ? buildingInsights.solarPotential : ''}
              visPanel={visPanel}
              setVisPanel={setVisPanel}
            />
          </div>
        </div>
        </LoadScript>
      </>
    )
}
