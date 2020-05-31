export default {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'provider', { type: Sequelize.STRING, defaultValue: 'Neza Media' }),
    queryInterface.addColumn('users', 'socialMediaId', { type: Sequelize.STRING, allowNull: true }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'socialMediaId'),
    queryInterface.removeColumn('users', 'provider'),
  ]),
};
