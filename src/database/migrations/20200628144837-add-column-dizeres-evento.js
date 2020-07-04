module.exports = {
  up(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn('eventos', 'dizeres', {
      type: Sequelize.STRING,
    });
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeColumn('eventos', 'dizeres');
  },
};
