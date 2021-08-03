const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const User = require('./model/user');
const Blog = require('./model/blog');

const app = express();

// db
const sequelize = require('./util/database');

// import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

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

// database relationships
Blog.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
// User.hasMany(Blog);

// middilewares
app.use('/api', authRoutes);
app.use('/api', blogRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API is running on port ${port}`));