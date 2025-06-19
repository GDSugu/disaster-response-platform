const { GoogleGenerativeAI } = require("@google/generative-ai");
const supabase = require('../supabase/client');
const { cacheFetch } = require('../utils/cacheHelper');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.extractLocationAndGeocode = async (description) => {
  try {
    const cacheKey = `geocode_${description}`;
    const cached = await cacheFetch(cacheKey);
    if (cached) return cached;

    // 1. 🧠 Use Gemini SDK to extract location
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ SDK only supports 1.5 models

    const prompt = `Extract the most likely place name from this disaster report: "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const locationName = response.text().trim();
    if (!locationName) {
      throw new Error('Gemini SDK did not return a valid location.');
    }

    // 2. 🌍 Geocode using Google Maps API
    const mapRes = await require('axios').get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: locationName,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const coordsData = mapRes?.data?.results;
    if (!coordsData?.length) {
      throw new Error(`No coordinates found for "${locationName}".`);
    }

    const coords = coordsData[0].geometry.location;

    const resultObj = {
      location_name: locationName,
      coordinates: coords
    };

    // 3. 💾 Cache result
    await supabase.from('cache').insert([
      {
        key: cacheKey,
        value: resultObj,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      }
    ]);

    return resultObj;

  } catch (error) {
    console.error('Geocode Error (Gemini SDK):', error.message || error);
    return { error: error.message || 'Gemini SDK failed.' };
  }
};
