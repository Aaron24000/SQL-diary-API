const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// db
const sequelize = require('./util/database');

// import routes
const authRoutes = require('./routes/auth');

// app middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL }));

//db middleware
sequelize.sync()
.then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
})

// middilewares
app.use('/api', authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API is running on port ${port}`));