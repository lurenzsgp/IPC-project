// Ormai sono tanti giorni che siamo in guerra. Abbiamo distribuito i missili rimasti tra le postazioni antimissilistiche. I rifornimenti stanno arrivando dal cielo, attento a non farli esplodere
// Create a certain number of bonus missiles
var createBonusMissiles = function(n) {
#BEGIN_EDITABLE#
    var targets = viableTargets();
    for( var i = 0; i < n; i++ ) {
        enemyMissiles.push( new BonusMissile(targets) );
    }
#END_EDITABLE#
};


#START_OF_GOAL_FUNCTION#
// TODO controllare il numero di missili bonus creati all'interno dell'array enemyMissiles

#END_OF_GOAL_FUNCTION#
