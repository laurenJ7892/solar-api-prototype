import GeoTIFF, { fromArrayBuffer } from 'geotiff';

// Internal function
async function getData(url){
  const response = await fetch(url);
  if (response.status === 200) {
    return response.json();
  } else {
    console.log(response.error);
  }
}

export async function getGeoCoordinates(address) {
  if (address) {
    // The address as entered - delimit with %20 for spaces
    let formattedAddress = address.replace(',', '')
    formattedAddress = address.replace(/\s/g, '%20')
    const addressUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}M&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const data = await getData(addressUrl);
    if (data && data['results']) {
    // Always the first entry from the array
      const results = data['results'][0];
      return results['geometry']['location'];
    }
  }
  return null
}

export async function getTiffLayer(url) {
  url = url + `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(url);
  if (response && response.status === 200) {
    const buffer = await response.arrayBuffer();
    const tiff = await fromArrayBuffer(buffer);
    const numImages = await tiff.getImageCount();
    console.log(numImages)
    let results = []
    // On default, only first image is rendered. This will get us all.
    for (let i = 0; i < numImages; i++) {
      const image = await tiff.getImage(i);
      const data = await image.readRasters();
      results.push({image, data});
    }
    return results
  } else {
    console.log(response.error);
    return
  }
};



export async function getSolarInformation({lat, lng}) {
  const solarUrl = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${lat}&location.longitude=${lng}&radiusMeters=100&view=FULL_LAYERS&requiredQuality=HIGH&pixelSizeMeters=0.5&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  return await getData(solarUrl);
}

export async function getBuildingInsights({lat, lng}) {
  const buildingUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  return await getData(buildingUrl);
}