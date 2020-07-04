module.exports = {
  up(queryInterface) {
    // logic for transforming into the new state
    return queryInterface.addConstraint(
      'certificados',
      ['evento_id', 'usuario_id'],
      {
        type: 'unique',
        name: 'unique_certificados',
      }
    );
  },

  down(queryInterface) {
    // logic for reverting the changes
    return queryInterface.removeConstraint('certificados', 'unique_modelos');
  },
};
