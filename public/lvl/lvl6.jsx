// Create a missile that will be shot at the indicated location.
var playerShoot = function( x, y ) {
    var source = whichAntiMissileBattery( x );
    if( source === -1 ){
		// No missiles left
		return;
    }
#BEGIN_EDITABLE#

    /* Old code, now useless */
    for (var i=0; i<400; i++) {
        if ( y === i) {
            /* missile height found */
            var height = i;
        }
    }

	/* When the altitude of the missile is between 50 and 370 then shoot the defensive missile */
    if( y > 10 ) {
        if( y < 400 ) {
            if( y <= 370 ) {
                if( y >= 50 ) {
                    playerMissiles.push( new PlayerMissile( source, x, y ) );
                }
            }
        }
    }
#END_EDITABLE#
};
#START_OF_INIT_FUNCTION#
playerShoot = function ( x, y ) {
    return;
}
#END_OF_INIT_FUNCTION#
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(100,100);
editor.defineFunction();

console.log("controllo la lunghezza del corpo della funzione");
var f = editor.getCode();
if (f.numLines > 8) { // 7 sono le righe del corpo della funzione
    console.log("troppe righe!!! Devono essere massimo 10");
    playerShoot = function ( x, y ) {
        return;
    }
}

console.log("controllo che nel codice non siano state modificata la finestra accettata per il click");
if (f.body.indexOf('50') === -1 || f.body.indexOf('370') === -1) {
    console.log("Attenzione!!! Hai modificato il campo di mira dei missili");
    playerShoot = function ( x, y ) {
        return;
    }
}

#END_OF_GOAL_FUNCTION#
#START_OF_SOLUTION_CODE#
playerShoot = function( x, y ) {
    if( y >= 50 && y <= 370 ) {
      var source = whichAntiMissileBattery( x );
      if( source === -1 ){
        return;
      }
      playerMissiles.push( new PlayerMissile( source, x, y ) );
    }
};
#END_OF_SOLUTION_CODE#
#LINE_GENERAL#
["Last attack fried our system memory and now there's not enough space for the system code... ","I'm not a tech guy but that code looks really bloated. ","<b>CLEAN IT UP, SOLDIER!</b>"]
#LINE_OLDMAN#
["I think you can write all that working code in a couple of lines! Try to specify all your condition together."]
#LINE_AMOUNT_DEFENSE_MISSILES#
10
#LINE_AMOUNT_BONUS_MISSILES#
0
#LINE_AMOUNT_ENEMY_MISSILES#
15
#LINE_SPEED_ENEMY_MISSILES#
2
