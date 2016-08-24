// Sistema questa funzione per rendere efficente la mira automatica... Altrimenti sprechera' tutti i tuoi missili
var pointDistance = function (p, q) {
#BEGIN_EDITABLE#
    return 1;
#END_EDITABLE#
};

#START_OF_GOAL_FUNCTION#
var penaltyFindTarget = function (missile, source) {
    return {x: rand(50, 370), y: rand(50, 370)};
};

var p = {x: rand(50, 370), y: rand(50, 370)};
var q = {x: rand(50, 370), y: rand(50, 370)};
if (pointDistance(p, q) !== Math.sqrt( Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2) ))  {
    console.log("La funzione non restituisce un risultato corretto");

    findTarget = penaltyFindTarget;
} else {
    console.log("La funzione e' corretta");
    findTarget = correctFindTarget;
}

#END_OF_GOAL_FUNCTION#
