export default function fellowshipModel(sequelize, DataTypes) {
  return sequelize.define('Fellowship', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    following_user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    follower_user_id: {
      type: DataTypes.INTEGER,
    },
    isFollowing: {
      type: DataTypes.BOOLEAN,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
