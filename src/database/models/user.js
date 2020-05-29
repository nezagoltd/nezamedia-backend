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
    provider: DataTypes.STRING,
  }, {
    paranoid: true,
  });
  user.associate = (models) => {
    user.hasMany(models.emailVerification, {
      foreignKey: 'emailSentTo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return user;
};
