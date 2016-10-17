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
#START_OF_INIT_FUNCTION#

#END_OF_INIT_FUNCTION#
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(100,100);
editor.defineFunction();
#END_OF_GOAL_FUNCTION#
#START_OF_SOLUTION_CODE#
playerShoot = function( x, y ) {
    if( y >= 50 && y <= 370 ) {
        var source = whichAntiMissileBattery( x );
        if( source === -1 ){
            return;
        }
        playerMissiles.push( new PlayerMissile(source, x, y));
    }
};
#END_OF_SOLUTION_CODE#
#LINE_GENERAL#
["Soldier! Our missiles are <b>not hitting their targets.</b> ","I don't know...","Maybe a sabotage from the Enemy...","Or maybe our shooters are all drunk...","I don't care, <b>FIX IT NOW!</b>"]
#LINE_OLDMAN#
["It looks like someone pulled a prank on you and made the missiles go random... haha!"]
#LINE_AMOUNT_DEFENSE_MISSILES#
10
#LINE_AMOUNT_BONUS_MISSILES#
0
#LINE_AMOUNT_ENEMY_MISSILES#
15
#LINE_SPEED_ENEMY_MISSILES#
2
