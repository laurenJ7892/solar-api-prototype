This is a [Next.js](https://nextjs.org/) Solar API Prototype.


## Getting Started

First, install all dependencies for the project:

```bash
npm run install

```
Second, add the Google API key into a new file in the solar_prototype folder called .env.

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY

Don't add any apostrophe's around the key, any punctuation or spaces. Otherwise it will not work.

Make sure it is enabled for:
1. Places API to find address
2. Geocoordinates API to get latitude and longitude for each address
3. Solar API to get the Solar API information
4. Maps Javascript API so that the map loads


Third, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Deploy on a EC2 Apache

1. Run npm run Build to build the assets.
2. Add environment into secrets manager or environment variables.
3. Ensure Node 16+ is installed on the EC2 container
4. Current Application runs on localhost:3000. Update to a domain URL to listen on port 80 or configure apache to listen on port 3000. Restart Apache if you update to port 3000. 
5. Copy the project files into the container
6. SSH into the EC2 container and install packages and dependencies (npm install)
5. Run npm start to run the application
6. Unless you use a solution like PM2, the server will stop if the container stops or you close the SSH session

# For specific commands to listen on port 3000, restarting apache server etc.

https://javascript.plainenglish.io/how-to-build-and-deploy-a-next-js-app-on-aws-apache-server-7d6e05860be5 


# If you are having issues with localhost:3000 on Apache and other services. You may need to proxy the path. The link below may help you out.
https://stackoverflow.com/questions/70684478/nextjs-getting-404-with-basepath-and-apache2-proxy

#Other Notes
1. If moving from a prototype into a fully fledged service, I would strongly recommend saving the TIFF files into a DB. Google Solar API access gives you access to the same file for 30 days to reduce API calls.

2. Geotiff are memory intensive to load and extract information from. They take some time to process and download to render. All layers (except rgb) will not be visible when you open in an image viewer and show as all black. Specialist software is needed.

3. Yearly cost savings were not in the API output directly. These calculations need to be validated by the business and are calculated in the gauge_charts component via: 

``` bash
yearlyTotalSavings =  max Number of Panels * maximum Sunshine Hours Per Year * panel capacity in watts / 1000
currentSavings = selected number of panels * maximum Sunshine Hours Per Year * panel capacity in watts / 1000
```