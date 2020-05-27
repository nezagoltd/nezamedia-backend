export default {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'isVerified', { type: Sequelize.BOOLEAN }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'isVerified'),
  ]),
};
