// Ormai sono tanti giorni che siamo in guerra. Abbiamo distribuito i missili rimasti tra le postazioni antimissilistiche. I rifornimenti stanno arrivando dal cielo, attento a non farli esplodere
// Create a certain number of bonus missiles
var createBonusMissiles = function(numberOfMissiles) {
    var targets = viableTargets();
#BEGIN_EDITABLE#
    /* aggiungi numberOfMissiles missili bonus al vettore enemyMissiles usando il costruttore BonusMissile(targets) puoi aggiungere elementi a un vettore attraverso il metodo push(elemento) */

#END_EDITABLE#
};


#START_OF_GOAL_FUNCTION#
var penaltyCreateBonusMissiles = function(n) {
    return;
};

console.log("Controllo che il numero di missili sia in funzione del parametro");
var f = editor.getCode();
if (f.body.indexOf("numberOfMissiles") === -1) {
    console.log("Devi utilizzare il parametro passato!!!");
    createBonusMissiles = penaltyCreateBonusMissiles;
}

console.log("Controllo il numero di missili bonus creati");
enemyMissiles = [];
createBonusMissiles(3);
var count = 0;
$.each(enemyMissiles, function ( index, missile) {
    if (missile instanceof BonusMissile) {
        count ++;
    }
});

if (count > 3) {
    console.log("Hai aggiunto troppi missili bonus!!!");
    createBonusMissiles = penaltyCreateBonusMissiles;
}

initializeHandicapLevel();
#END_OF_GOAL_FUNCTION#
