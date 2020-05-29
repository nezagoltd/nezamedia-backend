export default {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'provider', { type: Sequelize.STRING, defaultValue: 'Neza Media' }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'provider'),
  ]),
};
