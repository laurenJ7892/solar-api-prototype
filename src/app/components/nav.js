import {useState} from 'react'
import { Pagination, Button, Slider } from '@mui/material';
const plotty = require('plotty');
import { getTiffLayer } from '../../library/api';



export default function Nav({navTitle, setCurrentPage, currentPage, solarInfo}) {
    const [ responseImage, setResponseImage] = useState(null);
    const [ loading, setLoading] = useState(false);
    const [timeframe, setTimeframe] = useState('hour');
    const { rgbUrl, dsmUrl, maskUrl , monthlyFluxUrl, hourlyShadeUrls, annualFluxUrl } = solarInfo;

    const getData = async (url) => {
      setLoading(true);
      const results = await getTiffLayer(url);
      console.log(results)
      if (results && results.length == 1) {
        const {image, data} = results[0];
        setResponseImage(image)
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
        alert('No image data');
      }
      setLoading(false);
    }

    return (
      <>
       <div className='flex grid grid-rows-3 gap-2 w-full h-3/4 '>
          <div className='flex text-black items-center justify-center my-auto m-0'>
            <h4 className='m-0 text-center'>{navTitle}</h4>
          </div>
          <Pagination
            className='flex items-center justify-center m-0 w-100 my-auto h-1/4'
            count={4}
            color="primary"
            hideNextButton={true}
            hidePrevButton={true}
            onClick={(e) => setCurrentPage(e.target.innerText)}
          />
          { currentPage == 1 ? 
          <div className="flex grid grid-rows-4 h-100 gap-y-6">
            <Button
              disabled={loading}
              onClick={() => getData(rgbUrl)}
              > Rgb Layer </Button>
            <Button
              disabled={loading}
              onClick={() => getData(dsmUrl)}
            > Dsm Layer
            </Button>
            <Button
              disabled={loading}
              onClick={() => getData(annualFluxUrl)}
            > Flux Layer
            </Button>
            <Button
              disabled={loading}
              onClick={() => getData(maskUrl)}
            >
            Mask Layer
            </Button>
          </div> : 
          currentPage == 2 ? 
          <div className='flex w-8/12 mx-auto rounded border-gray-300'>
            Hourly Shade Urls
            <Slider
              step={1}
              min={0}
              max={timeframe == 'month' ? 11 : 23}
              defaultValue={0}
              marks
              disabled={loading}
              valueLabelDisplay='auto'
              onChange={(e) => {
                setLoading(true);
                if (timeframe != 'month') {
                  getData(hourlyShadeUrls[e.target.value])
                } else {
                  getData(monthlyFluxUrl)
                }
                setLoading(false);
              }}
            />
          </div>
          : ''}
        </div>
        { responseImage && (currentPage == 1 || currentPage == 2) ? 
          <div className='fixed block start-5 top-96 z-10 mx-auto rounded-lg'>
            <div className="h-1/3 w-100">
              <canvas id="map" className="flex w-full h-full">
              </canvas>
            </div>
        </div>
        : ''}
      </>
    )
}