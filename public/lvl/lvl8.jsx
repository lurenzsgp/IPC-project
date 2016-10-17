var NUMBEROFBONUSMISSILES = 3;

// Create a certain number of bonus missiles
var createBonusMissiles = function(numberOfMissiles) {
    var targets = viableTargets();
#BEGIN_EDITABLE#

    /* You can add a total of NUMBEROFBONUSMISSILES bonus missiles to the 'enemyMissiles' array using the 'BonusMissile(targets)' constructor. */
    /* You can add elements to an array by using the 'array#push(element)' function. */

#END_EDITABLE#
};

// Reset various variables at the start of a new level
var initializeHandicapLevel = function() {
    handicapRechargeAntiMissileBatteries();
    playerMissiles = [];
    enemyMissiles = [];
    createEmemyMissiles();
    createBonusMissiles(NUMBEROFBONUSMISSILES);
    drawBeginLevel();
};
#START_OF_INIT_FUNCTION#
var penaltyCreateBonusMissiles = function(n) {
    return;
};
#END_OF_INIT_FUNCTION#
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(2);
editor.defineFunction();

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

if (count > gamelevel.missilesBonus) {
    console.log("Hai aggiunto troppi missili bonus!!!");
    createBonusMissiles = penaltyCreateBonusMissiles;
}

#END_OF_GOAL_FUNCTION#
#START_OF_SOLUTION_CODE#
createBonusMissiles = function(n) {
    var targets = viableTargets();
    for( var i = 0; i < n; i++ ) {
        enemyMissiles.push( new BonusMissile(targets) );
    }
};
#END_OF_SOLUTION_CODE#
#LINE_GENERAL#
["SOLDIER!","We have been at war for so long.","We have to distribute the remaining missiles between the anti-missile emplacements.","<b>The supplies are coming from the sky</b>, be careful not to set them off!"]
#LINE_OLDMAN#
["Creating a new missile is easy, just use the <b>new</b> command.","Be careful adding the exact number of bonus missiles..."]
#LINE_AMOUNT_DEFENSE_MISSILES#
10
#LINE_AMOUNT_BONUS_MISSILES#
4
#LINE_AMOUNT_ENEMY_MISSILES#
40
#LINE_SPEED_ENEMY_MISSILES#
2
