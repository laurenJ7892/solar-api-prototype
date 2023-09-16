import {useState} from 'react'
import { Button } from '@mui/material';



export default function Downloads({solarInfo, geometry}) {
    const [loading, setLoading] = useState(false);
    const { rgbUrl, dsmUrl, maskUrl , monthlyFluxUrl, hourlyShadeUrls, annualFluxUrl } = solarInfo;

    const getDownload = async (url, name) => {
      setLoading(true);
      try {
        const results = await getTiffLayer(url);
        //Always first first result in array
        const { image, data } = results[0]
        const blob = new Blob([image.source.arrayBuffer])
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        alert('Image Downloaded. Please check your downloads folder');
      } catch (e) {
        console.log(e);
        alert('Sorry, Unable to get the downloaded tiff file. Please try again.')
      }
      finally {
        setLoading(false);
      }
    }

    return (
      <>
      { geometry ? 
        <div className="flex grid grid-rows gap-y-2 h-11/12 w-full font-sans text-black" >
          <h2 className='flex mt-5 text-2xl text-left w-11/12 mx-auto'>
            Download files:
          </h2>
          <div className='flex grid grid-rows w-full gap-y-2'>
              <h6 className='flex text-lg w-11/12 mx-auto'>
                Please note: All files except the RGB File are not visible and load as black if you try to render in an image viewer. They need specialist mapping software such as QGIS to view. 
              </h6>
              <div className='flex w-3/4 h-auto mx-auto'>
                <div className="flex grid grid-rows-4 gap-y-1">
                  <Button
                    disabled={loading}
                    onClick={() => getDownload(rgbUrl, `rgb_file.tiff`)}
                    > 
                      RGB File 
                    </Button>
                  <Button
                    disabled={loading}
                    onClick={() => getDownload(dsmUrl, 'digital_surface_map.tiff')}
                  > 
                    Digital Surface Model (DSM) Layer
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => getDownload(maskUrl, 'surface_map.tiff')}
                  >
                    Building Mask Layer
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => getDownload(annualFluxUrl, 'annual__flux.tiff')}
                  > 
                    Annual Flux Layer
                  </Button>
                </div>
            </div>
          </div>
        </div>
      : '' }
      </>
    )
}
