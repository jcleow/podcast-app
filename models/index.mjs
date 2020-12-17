import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

import episodeCommentModel from './episode_comment.mjs';
import episodeModel from './episode.mjs';
import favouriteCommentModel from './favourite_comment.mjs';
import fellowshipModel from './fellowship.mjs';
import genreModel from './genre.mjs';
import playlistModel from './playlist.mjs';
import seriesModel from './series.mjs';
import subgenreModel from './subgenre.mjs';
import userModel from './user.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.EpisodeComment = episodeCommentModel(sequelize, Sequelize.DataTypes);
db.Episode = episodeModel(sequelize, Sequelize.DataTypes);
db.FavouriteComment = favouriteCommentModel(sequelize, Sequelize.DataTypes);
db.Fellowship = fellowshipModel(sequelize.Sequelize.DataTypes);
db.Genre = genreModel(sequelize, Sequelize.DataTypes);
db.Playlist = playlistModel(sequelize, Sequelize.DataTypes);
db.Series = seriesModel(sequelize, Sequelize.DataTypes);
db.Subgenre = subgenreModel(sequelize, Sequelize.DataTypes);
db.User = userModel(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define the relationships between each of the models
db.Series.hasMany(db.Episode);
db.Episode.belongsTo(db.Episode);

db.User.hasMany(db.FavouriteComment);
db.User.hasMany(db.Fellowship);

export default db;
