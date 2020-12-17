export default function favouriteEpisodeModel(sequelize, DataTypes) {
  return favouriteEpisodeModel.define('Favourite_Episode', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    favourited: {
      type: DataTypes.BOOLEAN,
    },
    listener_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    episode_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Episodes',
        key: 'id',
      },
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
