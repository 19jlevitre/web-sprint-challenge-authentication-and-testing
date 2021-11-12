const db = require('../data/dbConfig')

function findBy(filter) {
    return db('users')
    .where(filter)
}

function findById(id) {
    return db('users')
    .where('id', id).first();
}

function add(user) {
    return db('users').insert(user)
    .then(([id]) => {
        return findById(id)
    })
    
}

module.exports = {
    add,
    findBy,
    findById
}