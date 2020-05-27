export default (sequelize, DataTypes) => {
  const emailVerification = sequelize.define('emailVerification', {
    emailSentTo: DataTypes.STRING,
    emailMessage: DataTypes.TEXT,
    emailSentFrom: DataTypes.STRING,
  }, {});
  emailVerification.associate = (models) => {
    // associations can be defined here
  };
  return emailVerification;
};
