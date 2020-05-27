export default (sequelize, DataTypes) => {
  const emailVerification = sequelize.define('emailVerification', {
    emailSentTo: DataTypes.STRING,
    emailMessage: DataTypes.TEXT,
    emailSentFrom: DataTypes.STRING,
  }, {});
  emailVerification.associate = (models) => {
    emailVerification.belongsTo(models.user, {
      foreignKey: 'emailSentTo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return emailVerification;
};
