var Bookshelf = require('bookshelf').mysqlAuth;

module.exports = function() {
    // documentazione al link: http://bookshelfjs.org/#many-to-many
    /*
    bisogna definire tutte le tabelle
        badges:
        - id
        - name

        users:
        - id
        - username
        - password
        - level
        - score

        badges_users:
        - id
        - user_id
        - badge_id
    */

    var bookshelf = {};

    bookshelf.ApiUser = Bookshelf.Model.extend({
        tableName: 'users',
        badges: function() {
            return this.hasMany(bookshelf.ApiUserBadge);
        }
    });

    bookshelf.ApiBadge = Bookshelf.Model.extend({
        tableName: 'badges',
        users: function() {
            return this.hasMany(bookshelf.ApiUserBadge);
        }
    });

	// relazione 1 a N tra utenti e badge
    bookshelf.ApiUserBadge = Bookshelf.Model.extend({
        tableName: 'badges_users',
        user: function() {
            return this.belongsTo(ApiUser);
        },
        badge: function() {
            return this.belongsTo(ApiBadge);
        }
    });

    return bookshelf;
}
