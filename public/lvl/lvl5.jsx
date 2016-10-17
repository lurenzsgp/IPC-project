// Check for the presence of missiles in anti-missile emplacements.
AntiMissileBattery.prototype.hasMissile = function() {
    var anyRockets = false;
#BEGIN_EDITABLE#

    for (var i=100000; i > 0; i--) {
        for (var j=0; j < 5000; j++) {
            if (i === j) {
				/* Are there missiles left in the defense stations? */
                anyRockets = !!this.missilesLeft;
            }
        }
    }
#END_EDITABLE#
    return anyRockets;
};

// Constructor for an Anti Missile Battery
function AntiMissileBattery( x, y ) {
	this.x = x;
	this.y = y;
	this.missilesLeft = 1;
}
#START_OF_INIT_FUNCTION#

#END_OF_INIT_FUNCTION#
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testBattery = new AntiMissileBattery(elementPos[0].x,  elementPos[0].y);
testBattery.testFunction();
delete testBattery;
editor.defineFunction();

console.log("controllo se l'utente ha rimosso i cicli");
f = editor.getCode();
if (f.body.indexOf("for") !== -1) {
    console.log("Devi rendere il sistema di ricarica antimissilistico piu' rapido");
    throw "myException";
}

#END_OF_GOAL_FUNCTION#
#START_OF_SOLUTION_CODE#
AntiMissileBattery.prototype.hasMissile = function() {
                return !!this.missilesLeft;
};
#END_OF_SOLUTION_CODE#
#LINE_GENERAL#
["You know why we're going to lose this war? ","Because THE ENEMY is fast and efficient! ","Our system instead is <b>slow</b> and stupid.","It's your fault! <b>DO SOMETHING ABOUT IT!</b>"]
#LINE_OLDMAN#
["You see all those loops there? Do you think is there any reason to be there?"]
#LINE_AMOUNT_DEFENSE_MISSILES#
10
#LINE_AMOUNT_BONUS_MISSILES#
0
#LINE_AMOUNT_ENEMY_MISSILES#
15
#LINE_SPEED_ENEMY_MISSILES#
2
