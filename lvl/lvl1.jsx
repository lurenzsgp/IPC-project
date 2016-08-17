// Calculate the missile speed
var missileSpeed = function (xDistance, yDistance) {
#BEGIN_EDITABLE#

    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );

    var distancePerFrame = 1;
#END_EDITABLE#

    return distance / distancePerFrame;
};
#START_OF_GOAL_FUNCTION#

console.log("goal function");
#END_OF_GOAL_FUNCTION#
