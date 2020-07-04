module.exports = {
  up(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn('modelos', 'ativo', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeColumn('modelos', 'ativo');
  },
};
