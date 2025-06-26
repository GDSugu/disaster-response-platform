const axios = require('axios');
const supabase = require('../supabase/client');
const { cacheFetch } = require('../utils/cacheHelper');

exports.verifyImageWithGemini = async (image_url) => {
  try {
    const cacheKey = `verify_image_${image_url}`;

    // 1. Check Supabase cache
    const cached = await cacheFetch(cacheKey);
    if (cached) return cached;

    // 2. Gemini prompt setup (text-only like in geocode)
    const prompt = `
      Analyze the following image URL:
      "${image_url}"
      
      Based on the filename, context, or known patterns, does this image appear to relate to a natural disaster?
      Describe what you think the image shows in one sentence.
    `;

    // 3. Gemini text model API (same as geocode)
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. Extract the result text from Gemini's response
    const resultText =
      geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response from Gemini.";

    // 5. Final result object
    const result = {
      verification_status: resultText,
      verified_at: new Date().toISOString()
    };

    // 6. Store in Supabase cache for 1 hour
    await supabase.from('cache').insert([
      {
        key: cacheKey,
        value: result,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      }
    ]);

    return result;
  } catch (error) {
    console.error('Gemini verification error:', error.response?.data || error.message);
    return { error: error.message || "Failed to verify image." };
  }
};
