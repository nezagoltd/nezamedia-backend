export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('emailVerifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    emailSentTo: {
      type: Sequelize.STRING,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'email',
        as: 'email',
      },
    },
    emailMessage: {
      type: Sequelize.TEXT,
    },
    emailSentFrom: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('emailVerifications'),
};
