const jokes = require('../../api/jokes/jokes-data')
exports.seed = function(knex) {

  return knex('jokes').truncate()
    .then(function () {
      
      return knex('jokes').insert(jokes);
    });
};
