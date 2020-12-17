export default function episodeModel(sequelize, DataTypes) {
  return sequelize.define('Episode', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    episode_number: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    artwork_filename: {
      type: DataTypes.STRING,
    },
    podcast_ext_url: {
      type: DataTypes.STRING,
    },
    podcast_series_id: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
