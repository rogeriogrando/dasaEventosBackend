module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'usuarios',
      [
        {
          nome: 'Rogério Grando',
          email: 'rgrando.unique@gmail.com',
          pass: '123456',
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('usuarios', null, {});
  },
};
