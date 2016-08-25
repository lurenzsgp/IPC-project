var bookshelf = require('bookshelf').mysqlAuth;

module.exports = function() {
    // documentazione al link
    // http://bookshelfjs.org/#many-to-many
    /* bisogna definire tutte le tabelle
        badges:
        - id
        - name
        
        users:
        - id
        - username
        - mail (puo' essere NULL)
        - password
        - level
        - score
        
        badges_users:
        - id
        - user_id
        - badge_id
    */

    var bookshelf = {};

	// 1-to-N
//     bookshelf.ApiUsers = bookshelf.Model.extend({
//         tableName: 'users',
//         badges: function() {
//             return this.hasMany(bookshelf.ApiUserBadges);
//         }
//     });
// 
//     bookshelf.ApiBadges = bookshelf.Model.extend({
//         tableName: 'badges',
//         users: function() {
//             return this.hasMany(bookshelf.ApiUserBadges);
//         }
//     });
// 
//     bookshelf.ApiUserBadges = bookshelf.Model.extend({
//         tableName: 'badges_users',
//         user: function() {
//             return this.belongsTo(ApiUsers);
//         },
//         badges: function() {
//             return this.belongsTo(ApiBadges);
//         }
//     });

	// N-to-N
    bookshelf.ApiUsers = bookshelf.Model.extend({
        tableName: 'users',
        badges: function() {
            return this.belongsToMany(bookshelf.ApiBadges);
        }
    });

    bookshelf.ApiBadges = bookshelf.Model.extend({
        tableName: 'badges',
        users: function() {
            return this.belongsToMany(bookshelf.ApiUsers);
        }
    });

    return bookshelf;
}
