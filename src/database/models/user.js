export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    sex: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
  }, {
    paranoid: true,
  });
  user.associate = (models) => {
    // associations can be defined here
  };
  return user;
};
