import {useState, useEffect, useCallback} from 'react'
import { Slider, Button, Select, MenuItem } from '@mui/material';
const plotty = require('plotty');

import { getTiffLayer } from '../../library/api';
const month30Days = [9, 4, 6, 11, 2]

export default function FluxData({solarInfo}) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(6);
    const [hour, setHour] = useState(12);
    const [monthDays, setMonthDays] = useState(30)

    const { hourlyShadeUrls } = solarInfo;

    const renderImage = useCallback(() => {
      if (width && height && images) {
        // Images is an bit32 Array
        const bitMask = 1 << (day - 1);
        const renderData = images[hour - 1].map(value => (value & bitMask) > 0 ? 1 : 0);
        const canvas = document.getElementById("map");
        const plot = new plotty.plot({
          canvas,
          data: renderData,
          width: width,
          height: height,
          domain: [0, 1],
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
          if (image && data) {
            setWidth(image.getWidth())
            setHeight(image.getHeight())
            // Data is an array of 24 hours
            setImages(data)
            renderImage()
          } else {
            alert('Image not able to be rendered')
          }
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
        <h2 className='flex items-center text-lg text-center w-1/2 mx-auto'>
          Flux Imagery
        </h2>
        <div className='flex my-2 w-11/12 mx-auto justify-around'>
          <h6 className=''>Select Month</h6>
          <Select
            labelId="month-select-label"
            id="day-select"
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
        </div>
        <div className='flex my-2 w-11/12 mx-auto justify-around'>
          <h6 className=''>Select day</h6>
          <Select
            labelId="day-select-label"
            id="day-select"
            value={day}
            label="Day"
            onChange={(e) => {
              setDay(e.target.value);
              const monthDays = month30Days.includes(month) ? 30 : month == 2 ? 28 : 31;
              setMonthDays(monthDays);
            }}
          >
            {month ? Array.from({length: monthDays}, (_, i) => i + 1).map((i) => {
            return (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
            ) : ''}
          </Select>
        </div>
        <Button
          disabled={loading}
          onClick={() => {
            if (hourlyShadeUrls){
            getData(hourlyShadeUrls[month-1]);
            } else {
              alert('No Hourly Shade Urls at this address')
            }
          }}
        >
          Get Flux Data
        </Button>
        { images && images.length > 1 ? 
        <div className='flex w-11/12 mx-auto'>
          Slide to see Hourly Change
          <Slider
            step={1}
            min={1}
            max={24}
            defaultValue={12}
            marks
            disabled={loading}
            valueLabelDisplay={'auto'}
            valueLabelFormat={hour > 12 ? `${hour-12}pm` : `${hour}am`}
            onChange={(e) => setHour(e.target.value)}
          /> 
          </div>
          : ''}
        </div>
        <div className='fixed top-1/3 left-1/2 h-96 z-10 rounded-lg border-none'>
          <canvas id="map" className="w-100 h-96 border-none">
          </canvas>
        </div>
      </>
    )
}