// Create a missile that will be shot at the location indicated by 'x' and 'y'.
var playerShoot = function( x, y ) {
  if( y >= 50 && y <= 370 ) {
    var source = whichAntiMissileBattery( x );
    if( source === -1 ){
      return;
    }
#BEGIN_EDITABLE#

	/* Now shoot! */
	playerMissiles.push( new PlayerMissile(source, x + rand(-75,75), y - rand(0, 150)));
#END_EDITABLE#
  }
};

// Get the mouse position
function getMousePos(canvas, evt){
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Attach event Listeners to handle the player's input
var setupListeners = function() {
    $( '#miscom' ).click(function( event ) {
        var mousePos = getMousePos(this, event);
        playerShoot( mousePos.x, mousePos.y);
    });
};

#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(100,100);
editor.defineFunction();
#END_OF_GOAL_FUNCTION#
