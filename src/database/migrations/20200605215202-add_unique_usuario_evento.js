module.exports = {
  up(queryInterface) {
    // logic for transforming into the new state
    return queryInterface.addConstraint(
      'usuario_eventos',
      ['evento_id', 'usuario_id'],
      {
        type: 'unique',
        name: 'unique_usuario_eventos',
      }
    );
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeConstraint(
      'usuario_eventos',
      'unique_usuario_eventos'
    );
  },
};
