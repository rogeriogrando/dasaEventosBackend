module.exports = {
  up(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn('modelos', 'descricao', {
      type: Sequelize.STRING,
    });
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeColumn('modelos', 'descricao');
  },
};
