// Create a missile that will be shot at indicated location
var playerShoot = function( x, y ) {
  if( y >= 50 && y <= 370 ) {
    var source = whichAntiMissileBattery( x );
    if( source === -1 ){
      return;
    }
#BEGIN_EDITABLE#
	playerMissiles.push( new PlayerMissile(source, x + rand(-75,75), y - rand(0, 150)));
#END_EDITABLE#
  }
};
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(100,100);
editor.defineFunction();
#END_OF_GOAL_FUNCTION#
