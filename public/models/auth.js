var Bookshelf = require('bookshelf').mysqlAuth;

module.exports = function() {
    // documentazione al link
    // http://bookshelfjs.org/#many-to-many
    // bisogna fare definire tutte le tabelle
        //     Badges:
        // - id
        // - name
        //
        // User:
        // - id
        // - username
        // - mail (può essere NULL)
        // - password
        // - level
        // - score
        //
        // UserBadges:
        // - id
        // - user
        // - badge

    var bookshelf = {};

    bookshelf.ApiUser = Bookshelf.Model.extend({
        tableName: 'users',
        userBadges: function() {
            return this.hasMany(bookshelf.ApiUserBadges);
        }
    });

    bookshelf.ApiBadges = Bookshelf.Model.extend({
        tableName: 'uadges',
        userBadges: function() {
            return this.hasMany(bookshelf.ApiUserBadges);
        }
    });

    bookshelf.ApiUserBadges = Bookshelf.Model.extend({
        tableName: 'userBadges',
        user: function() {
            return this.belongsTo(ApiUser);
        },
        badges : function() {
            return this.belongsTo(ApiBadges);
        }
    });

    return bookshelf;
}
