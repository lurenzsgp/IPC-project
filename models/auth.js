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

//     bookshelf.ApiUser = bookshelf.Model.extend({
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
//         tableName: 'userBadges',
//         user: function() {
//             return this.belongsTo(ApiUser);
//         },
//         badges: function() {
//             return this.belongsTo(ApiBadges);
//         }
//     });

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
