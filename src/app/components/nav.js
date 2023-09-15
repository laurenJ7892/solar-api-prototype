import {useState} from 'react'
import { Pagination, Button, Slider } from '@mui/material';
const plotty = require('plotty');
import { getTiffLayer } from '../../library/api';



export default function Nav({navTitle, setCurrentPage, currentPage, solarInfo}) {
    const [ responseImage, setResponseImage] = useState(null);
    const [ loading, setLoading] = useState(false);
    const [timeframe, setTimeframe] = useState('hour');
    const { rgbUrl, dsmUrl, maskUrl , monthlyFluxUrl, hourlyShadeUrls, annualFluxUrl } = solarInfo;

    const getData = async (url, fileType) => {
      setLoading(true);
      const results = await getTiffLayer(url);
      console.log(results);
      if (results && results.length == 1) {
        const {image, data} = results[0];
        setResponseImage(image)
        const canvas = document.getElementById("map");
        const plot = new plotty.plot({
          canvas,
          data: data[0],
          width: image.getWidth(),
          height: image.getHeight(),
          domain: [0, 256]
        });
        plot.render();
      } else if (results && results.length > 1) {
        console.log(results.length)
      } else {
        alert('No images found for this layer')
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
              onClick={() => getData(rgbUrl, 'RGB')}
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
          <div className='flex w-8/12 mx-auto rounded'>
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
          <div className='fixed top-1/4 left-1/2 w-400 h-399 z-10 rounded-lg border-blue-500 border-solid border-4 m-1'>
              <canvas id="map" className="w-400 h-399">
              </canvas>
        </div>
        : ''}
      </>
    )
}