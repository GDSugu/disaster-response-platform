const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const cors = require('cors');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const disasterRoutes = require('./routes/disasters');
const socialMediaRoutes = require('./routes/socialMedia');
const geocodeRoutes = require('./routes/geocode');
const updatesRoutes = require('./routes/officialUpdates');
const verificationRoutes = require('./routes/imageVerification');

app.use(cors());
app.use(express.json());

app.use('/disasters', disasterRoutes(io));
app.use('/geocode', geocodeRoutes);
app.use('/disasters/:id/social-media', socialMediaRoutes(io));
app.use('/disasters/:id/official-updates', updatesRoutes);
app.use('/disasters/:id/verify-image', verificationRoutes);

// Default
app.get('/', (req, res) => res.send('Disaster Response API Running'));

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
