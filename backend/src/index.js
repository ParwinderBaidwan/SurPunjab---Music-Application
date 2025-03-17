import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'

import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT  || 5500;

app.use(express.json()); // to parse the json data from the body

// it is method 
// app.get('/', (req, res) => {
//   res.send('Server is ready');
// });

app.use(clerkMiddleware());   // this will add auth to request object => req.auth -> it will access to fields like req.auth.userId which user is logged in
// clerkMiddleware() function checks the request 's cookies and headers for a session JWT and , it found, attaches the Auth object to the request object under the auth key.

// we will create routes on this page
app.use('/api/users' , userRoutes);
app.use('/api/admin' , adminRoutes);
app.use('/api/auth' , authRoutes);
app.use('/api/songs' , songRoutes); // to fetch the songs
app.use('/api/albums' , albumRoutes); // to fetch the albums
app.use('/api/stats', statRoutes); 

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});