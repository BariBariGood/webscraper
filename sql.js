const {Sequelize, DataTypes, Model} = require('sequelize');

const sequelize = new Sequelize('postgres://xzuwmakr:y0pQD7QCNBIDi6PCfTl3zLHZ_c57hGiY@heffalump.db.elephantsql.com/xzuwmakr');

class User extends Model {
  static fetchUserByID(id)  {
    return User.findOne({where: {id}});
  }
}

class Tweet extends Model {
  static fetchTweetByID(id) {
    return Tweet.findOne({where: {id}});
  }

  static addTweet(text, likes) {
    Tweet.create({text, likes});
  }
}

function init() {
  User.init({
    username: {
      type: DataTypes.STRING,
      notNull: true
    }
  });

  Tweet.init({
    text: {
      type: DataTypes.STRING,
      notNull: true
    },
    likes: {
      type: DataTypes.INTEGER,
      notNull: true
    }
  });

  User.sync({alter: true});
  Tweet.sync({alter: true});
}

module.exports = {
  init,
  User
};