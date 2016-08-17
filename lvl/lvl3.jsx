// Update the location and/or state of this missile of the player
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
#START_OF_GOAL_FUNCTION#

console.log("goal function");
#END_OF_GOAL_FUNCTION#
