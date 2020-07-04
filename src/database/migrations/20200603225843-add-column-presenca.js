module.exports = {
  up(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn('usuario_eventos', 'presenca', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeColumn('usuario_eventos', 'presenca');
  },
};
