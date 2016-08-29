// Calculate the missile speed
var missileSpeed = function (xDistance, yDistance) {
#BEGIN_EDITABLE#

    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );

    var distancePerFrame = 1;
#END_EDITABLE#

    return distance / distancePerFrame;
};
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(100,100);
editor.defineFunction();


console.log("definisco la funzione corretta");
var correctMissileSpeed = function (xDistance, yDistance) {
    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );
    var distancePerFrame = SPEEDMISSILEDEFENSE;
    return distance / distancePerFrame;
};

console.log("confronto le 2 funzioni");
if (correctMissileSpeed(100,100) > missileSpeed(100,100)) {
    console.log("funzione settata ai parametri corretti");
    missileSpeed = correctMissileSpeed;
}
#END_OF_GOAL_FUNCTION#
