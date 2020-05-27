export default {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'isVerified', { type: Sequelize.BOOLEAN, defaultValue: false }),
    queryInterface.changeColumn('users', 'email', { type: Sequelize.STRING, allowNull: false, unique: true }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('users', 'email', { type: Sequelize.STRING, allowNull: true, unique: false }),
    queryInterface.removeColumn('users', 'isVerified'),
  ]),
};
