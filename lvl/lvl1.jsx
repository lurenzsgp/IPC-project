// Create a missile that will be shot at indicated location
var playerShoot = function( x, y ) {
  if( y >= 50 && y <= 370 ) {
    var source = whichAntiMissileBattery( x );
    if( source === -1 ){ // No missiles left
      return;
    }
#BEGIN_EDITABLE#
	playerMissiles.push(
		new PlayerMissile(source, x + rand(0,50), y + rand(0,50))
	);
#END_EDITABLE#
  }
};

#START_OF_GOAL_FUNCTION#
console.log("goal function del livello di prova");
#END_OF_GOAL_FUNCTION#
