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


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
