const supabase = require('../supabase/client');

const mockData = [
  { post: "#flood Need food in NYC", user: "citizen1", timestamp: new Date().toISOString() },
  { post: "#urgent Water needed in Queens", user: "citizen2", timestamp: new Date().toISOString() },
];

exports.fetchMockSocialMedia = async (disasterId, io) => {
  // Optional: push to Supabase reports table
  const reports = mockData.map((item) => ({
    disaster_id: disasterId,
    user_id: item.user,
    content: item.post,
    verification_status: 'pending',
    created_at: item.timestamp,
  }));

  await supabase.from('reports').insert(reports);

  // Emit via WebSocket
  io.emit('social_media_updated', { disasterId, reports });

  return { reports };
};
