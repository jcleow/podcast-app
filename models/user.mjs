export default function userModel(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    profile_pic_url: {
      type: DataTypes.STRING,
    },
    email_address: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
