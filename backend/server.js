// backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

const publicationRoutes = require('./routes/publicationRoutes');
app.use('/api/publications', publicationRoutes);


const blogRoutes = require('./routes/BlogRoutes');
app.use('/api/blogs', blogRoutes);





const galleryRoutes = require('./routes/galleryRoutes');
app.use('/api/gallery', galleryRoutes);


const teachingRoutes = require('./routes/TeachingRoutes');
app.use('/api/teaching', teachingRoutes);




const fundingRoutes = require('./routes/FundingRoutes');
app.use('/api/fundings', fundingRoutes);



const profileRoutes = require('./routes/ProfileRoutes');
app.use('/api/profile', profileRoutes);


const ContactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', ContactRoutes);



const SettingRoutes = require('./routes/SettingRoutes');
app.use('/api/settings', SettingRoutes);


const ViewProfileRoutes = require('./routes/ViewProfileRoutes'); // New Route
app.use('/api/viewprofile', ViewProfileRoutes); // New Route

// Serve frontend in production (optional)
// Uncomment the following if you build the frontend and serve it from the backend
/*
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
    });
}
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
