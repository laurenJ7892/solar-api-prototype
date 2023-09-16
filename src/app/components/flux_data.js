import {useState, useEffect, useCallback} from 'react'
import { Slider, Button, Select, MenuItem } from '@mui/material';
const plotty = require('plotty');

import { getTiffLayer } from '../../library/api';

export default function FluxData({solarInfo}) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(6);
    const [hour, setHour] = useState(12);
    
    const { hourlyShadeUrls } = solarInfo;

    const renderImage = useCallback(() => {
      if (width && height && images) {
        const renderData = images[hour - 1]
        var startIndex = (day - 1) * 24 * 55; // Each day has 24 entries (24 hours)
        var endIndex = startIndex + 24
        var value = renderData.slice(startIndex, endIndex);
        const canvas = document.getElementById("map");
        const plot = new plotty.plot({
          canvas,
          data: renderData,
          width: width,
          height: height,
          domain: [0, 256],
        });
        plot.render();
      }
    }, [images, hour, width, height, day])


    const getData = async (url) => {
      setLoading(true);
      try {
        const results = await getTiffLayer(url);
        if (results && results.length == 1) {
          const { image, data } = results[0];
          setWidth(image.getWidth())
          setHeight(image.getHeight())
          // Data is an array of 24 hours
          setImages(data)
          renderImage()
      } else {
          alert('No images found for this layer')
        }
      } catch(e) {
        console.log(e);
        alert('Sorry, Unable to get the Flux imagery. Please try again')
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      renderImage()
    }, [renderImage])

    return (
      <>
      <div className="flex grid grid-rows-4 h-100 w-100 font-sans text-black">
        <h2 className='flex items-center text-l text-left w-11/12 mx-auto'>
          Flux Imagery
        </h2>
        <Select
          className='flex my-2 mx-auto w-8/12'
          labelId="month-select-label"
          id="month-select"
          value={month}
          label="Month"
          onChange={(e) => setMonth(e.target.value)}
        >
          <MenuItem value={1}>Jan</MenuItem>
          <MenuItem value={2}>Feb</MenuItem>
          <MenuItem value={3}>March</MenuItem>
          <MenuItem value={4}>April</MenuItem>
          <MenuItem value={5}>May</MenuItem>
          <MenuItem value={6}>June</MenuItem>
          <MenuItem value={7}>July</MenuItem>
          <MenuItem value={8}>Aug</MenuItem>
          <MenuItem value={9}>Sep</MenuItem>
          <MenuItem value={10}>Oct</MenuItem>
          <MenuItem value={11}>Nov</MenuItem>
          <MenuItem value={12}>Dec</MenuItem>
        </Select>
        <Button
          disabled={loading}
          onClick={() => {
            getData(hourlyShadeUrls[month-1]);
          }}
        >
          Get Flux Data
        </Button>
        { images && images.length > 1 ? 
        <div className='flex w-11/12 mx-auto'>
          Change Hour
          <Slider
            step={1}
            min={1}
            max={24}
            defaultValue={12}
            marks
            disabled={loading}
            valueLabelDisplay='auto'
            onChange={(e) => setHour(e.target.value)}
          /> 
          </div>
          : ''}
        </div>
        <div className='fixed top-1/3 left-1/2 w-100 h-100 z-10 rounded-lg border-none'>
          <canvas id="map" className="w-100 h-100 border-none">
          </canvas>
        </div>
      </>
    )
}