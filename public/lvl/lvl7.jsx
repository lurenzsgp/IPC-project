var antiMissileBatteries = [];

// Refill of missiles in anti-missile emplacements.
var rechargeAntiMissileBatteries = function () {
#BEGIN_EDITABLE#

	/* The 'antiMissileBatteries' array is composed of the three anti-missile emplacements. Initialize to 10 the 'missilesLeft' field of each array element. */

#END_EDITABLE#
};

// Constructor for an Anti-Missile Battery
function AntiMissileBattery( x, y ) {
	this.x = x;
	this.y = y;
	this.missilesLeft = 1;
}

// Initialize the 'antiMissileBatteries' array with 3 element
var createAntimissileBattery = function () {
    antiMissileBatteries.push( new AntiMissileBattery( elementPos[0].x, elementPos[0].y) );
    antiMissileBatteries.push( new AntiMissileBattery( elementPos[1].x, elementPos[1].y) );
    antiMissileBatteries.push( new AntiMissileBattery( elementPos[2].x, elementPos[2].y) );
};
#START_OF_INIT_FUNCTION#
function penaltyRechargeAntiMissileBatteries () {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft = 1;
    });
};
rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
#END_OF_INIT_FUNCTION#
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction();
editor.defineFunction();

console.log("Controllo la presenza di parole chiave nella funzione");
var f = editor.getCode();
if (f.body.indexOf("antiMissileBatteries") === -1 || f.body.indexOf("missilesLeft") === -1) {
    console.log("Ricontrolla quello che hai scritto!!!");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
    return;
}

rechargeAntiMissileBatteries();
console.log("controllo quanti missili sono stati caricatii");
if (antiMissileBatteries[0].missilesLeft !== 10 || antiMissileBatteries[1].missilesLeft !== 10 || antiMissileBatteries[2].missilesLeft !== 10) {
    console.log("Constrollai missili");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
}

console.log("inizializzo il livello");
#END_OF_GOAL_FUNCTION#

#START_OF_SOLUTION_CODE#
rechargeAntiMissileBatteries = function () {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft = gamelevel.missilesDefense;
    });
};
#END_OF_SOLUTION_CODE#
#LINE_GENERAL#
["The ammunition of the day finally arrived...","But our warehouse workers are on strike!"," ","Recruit, program the drone in order to <b>automatically restock</b> the defense stations!"]
#LINE_OLDMAN#
["Try telling the drone how many missiles to put in each antimissile battery.","Each battery can be identified with an index."]
#LINE_AMOUNT_DEFENSE_MISSILES#
10
#LINE_AMOUNT_BONUS_MISSILES#
0
#LINE_AMOUNT_ENEMY_MISSILES#
15
#LINE_SPEED_ENEMY_MISSILES#
2
