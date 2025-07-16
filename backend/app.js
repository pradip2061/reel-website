const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./database');
const AuthenticationRouter = require('./Router/AuthenticationRouter');
const uploadvideoRouter = require('./Router/UploadVideoRouter');

const app = express();
connectToDatabase();

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/videowatch', AuthenticationRouter);
app.use('/videowatch', uploadvideoRouter);

module.exports = app;
