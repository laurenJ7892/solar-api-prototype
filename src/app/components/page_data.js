import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import ImageAspectRatioIcon from '@mui/icons-material/ImageAspectRatio';
import WbShadeIcon from '@mui/icons-material/WbShade';
import ArchitectureIcon from '@mui/icons-material/Architecture';

export default function PageData({pageData, pageTitle}) {
    return (
      <>
      { pageTitle ?
        <div className="flex grid grid-rows-3 h-full w-full font-sans text-black" >
          <h2 className='flex items-center row-span-1 text-2xl text-left w-11/12 mx-auto'>
            {pageData && pageData.maxSunshineHoursPerYear ? pageTitle : ''}
            {pageData && pageData.pitchDegrees ? 'Roof Segment' : ''}
          </h2>
          <div className='flex grid grid-rows-3 row-span-2 w-full'>
            <div className='flex items-center w-11/12 mx-auto'>
              <div className='flex h-full w-1/8 items-center'>
              {pageData && pageData.maxArrayPanelsCount ? <WbSunnyIcon color='primary' /> : ''}
              {pageData && pageData.azimuthDegrees ? <ArchitectureIcon color='primary' /> : ''}
              </div>
              <div className='flex items-center text-center w-1/2 h-full mx-auto'>
              {pageData && pageData.maxSunshineHoursPerYear ? 'Sunshine hours/year' : ''}
              {pageData && pageData.pitchDegrees ? 'Pitch Degrees' : ''}
              </div>
              <div className='flex items-center text-center w-1/4 h-full mx-auto'>
                {pageData && pageData.maxSunshineHoursPerYear ? Math.round(pageData.maxSunshineHoursPerYear).toLocaleString() : ''}
                {pageData && pageData.pitchDegrees ? Math.round(pageData.pitchDegrees).toLocaleString() : ''}
              </div>
            </div>
            <div className='flex items-center w-11/12 mx-auto'>
             <div className='flex h-full w-1/8 items-center'>
             { pageData ? <ImageAspectRatioIcon color='primary' /> : '' }
              </div>
              <div className='flex items-center text-center w-1/2 h-full mx-auto'>
              {pageData ? 'Area meters2' : ''}
              </div>
                <div className='flex items-center text-center w-1/4 h-full mx-auto'>
                {pageData && pageData.maxArrayAreaMeters2 ? Math.round(pageData.maxArrayAreaMeters2).toLocaleString() : ''}
                {pageData && pageData.stats ? Math.round(pageData.stats.areaMeters2.toLocaleString()) : ''}
                </div>
            </div>
            <div className='flex items-center w-11/12 mx-auto'>
              <div className='flex h-full w-1/8 items-center'>
              {pageData && pageData.maxArrayPanelsCount ? <SolarPowerIcon color='primary' /> : ''}
              {pageData && pageData.azimuthDegrees ? <WbShadeIcon color='primary' /> : ''}
              </div>
              <div className='flex items-center text-center w-1/2 h-full mx-auto'>
              {pageData && pageData.maxArrayPanelsCount ? 'Max Panels' : ''}
              {pageData && pageData.azimuthDegrees ? 'Azimuth Degrees' : ''}
              </div>
              <div className='flex items-center text-center w-1/4 h-full mx-auto'>
              {pageData && pageData.maxArrayPanelsCount ? Math.round(pageData.maxArrayPanelsCount).toLocaleString() : ''}
              {pageData && pageData.azimuthDegrees ? Math.round(pageData.azimuthDegrees).toLocaleString() : ''}
              </div>
            </div>
          </div>
        </div>
        : '' }
      </>
    )
}
