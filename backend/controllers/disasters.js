const supabase = require('../supabase/client');

exports.getDisasters = async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');

  if (tag) query = query.contains('tags', [tag]);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error });
  res.json(data);
};

exports.createDisaster = async (req, res, io) => {
  const { title, location_name, description, tags, owner_id } = req.body;

  const { data, error } = await supabase
    .from('disasters')
    .insert([
      {
        title,
        location_name,
        description,
        tags,
        owner_id,
        created_at: new Date().toISOString()
      }
    ])
    .select('*'); // ✅ Required to get inserted rows

  if (error) return res.status(500).json({ error });

  io.emit('disaster_updated', data[0]); // ✅ WebSocket emit
  res.status(201).json(data[0]);
};

exports.updateDisaster = async (req, res, io) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('disasters')
    .update(updates)
    .eq('id', id)
    .select('*'); // ✅ Needed for data[0]

  if (error) return res.status(500).json({ error });

  io.emit('disaster_updated', data[0]); // ✅ Live update
  res.json(data[0]);
};

exports.deleteDisaster = async (req, res, io) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('disasters')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error });

  io.emit('disaster_updated', { id, deleted: true }); // ✅ Broadcast
  res.json({ success: true });
};
