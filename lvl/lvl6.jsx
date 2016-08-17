// Create a missile that will be shot at indicated location
var playerShoot = function( x, y ) {
    var source = whichAntiMissileBattery( x );
    if( source === -1 ){ // No missiles left
      return;
    }
#BEGIN_EDITABLE#
    for (var i=0; i<400; i++) {
        /* vecchio codice ormai inutile */
        if ( y === i) {
            /* altitudine missile trovata */
            var height = i;
        }
    }

    if ( y > 10 ) {
        if ( y < 400 ) {
            if( y <= 370 ) {
                if( y >= 50 ) {
                    /* do nothing */


                    /* quando il missile e' compreso tra 50 e 370 spara il missile difensivo */
                    playerMissiles.push( new PlayerMissile( source, x, y ) );
                }
            }
        }
    }
#END_EDITABLE#
};
#START_OF_GOAL_FUNCTION#
console.log("controllo la lunghezza del corpo della funzione");
var f = editor.getCode();
if (f.numLines > 7) { // 7 sono le righe del corpo della funzione
    console.log("troppe righe!!! devo essere massimo 9");
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
