// Update the location and/or the state of the player's missiles.
PlayerMissile.prototype.update = function() {
    if( this.state === MISSILE.active && this.y <= this.endY ) { // Target reached
#BEGIN_EDITABLE#
      this.x = this.endX;
      this.y = this.endY;
      this.state = MISSILE.exploding;
    }
    if( this.state === MISSILE.active ) {
      this.x += this.dx;
      this.y += this.dy;
  }
/*  else {
      this.explode()
    }
*/
#END_EDITABLE#
};

// Constructor for a Missile, which may be the player's missile or the enemy's missile.
// The options argument used to create the missile is expected to have startX, startY, endX, and endY to define the missile's path as well as color and trailColor for the missile's appearance
function Missile( options ) {
  this.startX = options.startX;
  this.startY = options.startY;
  this.endX = options.endX;
  this.endY = options.endY;
  this.color = options.color;
  this.trailColor = options.trailColor;
  this.x = options.startX;
  this.y = options.startY;
  this.state = MISSILE.active;
  this.width = 2;
  this.height = 2;
  this.explodeRadius = 0;
  this.explodeColor = options.explodeColor;
}

// Make PlayerMissile inherit from Missile
PlayerMissile.prototype = Object.create( Missile.prototype );
PlayerMissile.prototype.constructor = PlayerMissile;
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testMissile = new PlayerMissile( 1, 100, 100 );
testMissile.testFunction();
delete testMissile;
editor.defineFunction();
#END_OF_GOAL_FUNCTION#
