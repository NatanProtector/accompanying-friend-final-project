const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getMongoURI } = require('./utils/env_variables');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
.connect(getMongoURI())
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:' , err));

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is up and running!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});