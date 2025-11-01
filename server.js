require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const txRoutes = require('./routes/tx');
const limitRoutes = require('./routes/limits');
const notifRoutes = require('./routes/notifications');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tx', txRoutes);
app.use('/api/limits', limitRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('mongo connected');
    app.listen(PORT, ()=> console.log('Server running on', PORT));
  })
  .catch(err => console.error(err));
