// Funzione per la verifica della presenza di missili nell postazioni antimissilistiche
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
console.log("controllo se l'utente ha rimosso i cicli");
var missile = 10;
f = editor.getCode();
if (f.body.indexOf("for") !== -1) {
    console.log("Devi rendere il sistema antimissilistico piu' rapido");
    missile = 1;
}

$.each(antiMissileBatteries, function( index, amb ) {
  amb.missilesLeft = missile;
});

#END_OF_GOAL_FUNCTION#
