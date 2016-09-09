// Function to check for the presence of missiles in anti-missile emplacements
AntiMissileBattery.prototype.hasMissile = function() {
    var rocket = false;
#BEGIN_EDITABLE#
    for (var i=100000; i > 0; i--) {
        for (var j=0; j < 5000; j++) {
            if (i === j){
                rocket = !!this.missilesLeft;
            }
        }
    }
#END_EDITABLE#
    return rocket;
};
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testBattery = new AntiMissileBattery(elementPos[0].x,  elementPos[0].y);
testBattery.testFunction();
delete testBattery;
editor.defineFunction();

console.log("controllo se l'utente ha rimosso i cicli");
var missile = 10;
f = editor.getCode();
if (f.body.indexOf("for") !== -1) {
    console.log("Devi rendere il sistema di ricarica antimissilistico piu' rapido");
    missile = 1;
}

$.each(antiMissileBatteries, function( index, amb ) {
  amb.missilesLeft = missile;
});

if (missile === 1) {
    throw "myException"; 
}

#END_OF_GOAL_FUNCTION#
