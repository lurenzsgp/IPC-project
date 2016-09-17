/* Create a certain number of bonus missiles */
var createBonusMissiles = function(numberOfMissiles) {
    var targets = viableTargets();
#BEGIN_EDITABLE#

    /* You can add a total of numberOfMissiles bonus missiles to the 'enemyMissiles' array using the 'BonusMissile(targets)' constructor. */
    /* You can add elements to an array by using the 'array#push(element)' function. */

#END_EDITABLE#
};


#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(2);
editor.defineFunction();

var penaltyCreateBonusMissiles = function(n) {
    return n;
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

#END_OF_GOAL_FUNCTION#
