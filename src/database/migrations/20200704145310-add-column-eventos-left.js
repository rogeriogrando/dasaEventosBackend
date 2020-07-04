module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('eventos', 'assinatura_left_id', {
      type: Sequelize.INTEGER,
      references: { model: 'assinaturas', key: 'id' },
    });
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeColumn('eventos', 'assinatura_left_id');
  },
};
