var Bookshelf = require('bookshelf').mysqlAuth;

module.exports = function() {
    // documentazione al link
    // http://bookshelfjs.org/#many-to-many
    // bisogna fare definire tutte le tabelle
        // Badges:
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
        // - user_id
        // - badge_id

    var bookshelf = {};

    bookshelf.ApiUser = Bookshelf.Model.extend({
        tableName: 'Users',
        UserBadges: function() {
            return this.hasMany(ApiUserBadges);
        }
    });

    bookshelf.ApiBadges = bookshelf.Model.extend({
        tableName: 'Badges',
        UserBadges: function() {
            return this.hasMany(ApiUserBadges);
        }
    });

    bookshelf.ApiUserBadges = bookshelf.Model.extend({
        tableName: 'UserBadges',
        User: function() {
            return this.belongsTo(ApiUser);
        },
        Badges : function() {
            return this.belongsTo(ApiBadges);
        }
    });

    return bookshelf;
}
