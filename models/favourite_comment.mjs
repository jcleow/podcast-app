export default function favouriteCommentModel(sequelize, DataTypes) {
  return sequelize.define('Favourite_Comment', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    favourited: {
      type: DataTypes.BOOLEAN,
    },
    episode_comment_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Episode_Comments',
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
