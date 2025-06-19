const axios = require('axios');
const supabase = require('../supabase/client');
const { cacheFetch } = require('../utils/cacheHelper');

exports.verifyImageWithGemini = async (image_url) => {
  try {
    const cacheKey = `verify_image_${image_url}`;
    const cached = await cacheFetch(cacheKey);
    if (cached) return cached;

    const prompt = `Analyze the image at ${image_url} for signs of manipulation or verify disaster context.`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const resultText = response.data.candidates[0].content.parts[0].text;

    const result = {
      verification_status: resultText,
      verified_at: new Date().toISOString(),
    };

    await supabase.from('cache').insert([
      {
        key: cacheKey,
        value: result,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    ]);

    return result;
  } catch (error) {
    return { error: error.message };
  }
};
