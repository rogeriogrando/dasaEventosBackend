module.exports = {
  up(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn('modelos', 'padrao', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeColumn('modelos', 'padrao');
  },
};
