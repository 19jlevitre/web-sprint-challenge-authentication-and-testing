exports.up = function(knex) {
    return knex.schema.createTable('jokes', jokes => {
        jokes.string('id', 255).notNullable().unique();
        jokes.string('joke', 255).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('jokes');
};
