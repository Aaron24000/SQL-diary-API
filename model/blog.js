const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Blog = sequelize.define('blog', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
    title: {
        type: Sequelize.STRING(70),
        allowNull: false
    },
    body: {
        type: Sequelize.STRING(2000),
        allowNull: false
    }
})

module.exports = Blog;

