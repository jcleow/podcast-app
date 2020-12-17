export default function episodeCommentModel(sequelize, DataTypes) {
  return sequelize.define('Episode_Comment', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.STRING,
    },
    episode_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Episodes',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
