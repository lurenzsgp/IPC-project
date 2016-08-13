// Create a missile that will be shot at indicated location
var playerShoot = function( x, y ) {
  if( y >= 50 && y <= 370 ) {
    var source = whichAntiMissileBattery( x );
    if( source === -1 ){
      return;
    }
#BEGIN_EDITABLE#
    console.log('sto sparando');

	playerMissiles.push(
		new PlayerMissile(source, x + rand(0,150), y + rand(0,150))
	);
#END_EDITABLE#
  }
};
#START_OF_GOAL_FUNCTION#
console.log("goal function del livello di prova");
#END_OF_GOAL_FUNCTION#
