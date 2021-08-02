const Sequelize = require('sequelize');

const sequelize = new Sequelize('blog-site', 'root', 'Aaron240', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
