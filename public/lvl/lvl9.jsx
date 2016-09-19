// Enable auto-aim feature.

// Calculate the distance between the two points 'p' and 'q' using 'Math' object.
var pointDistance = function (p, q) {
#BEGIN_EDITABLE#

    return 0;
#END_EDITABLE#
};

// Constructor for the automatic defense system against Enemy's missiles.
function AutoAntiMissileDefense () {
    this.whatchedMissiles = [];
    this.pointedMissiles = [];
}

// Initializes the parameters
AutoAntiMissileDefense.prototype.initialize = function () {
    this.whatchedMissiles = [];
    this.pointedMissiles = [];
};

// Select suitable Enemy's missiles to hit
AutoAntiMissileDefense.prototype.detectMissile = function () {
    $.each(enemyMissiles, (function (index, missile) {
        if ( missile instanceof EnemyMissile && !this.pointedMissiles.includes(missile) && !this.whatchedMissiles.includes(missile) && missile.y > 50 ) {
            this.whatchedMissiles.push(missile);
        }
    }).bind(this));
};

// Prepare the defensive missile to be launched against enemy missiles
AutoAntiMissileDefense.prototype.shoot = function () {
    this.detectMissile();

    $.each(this.whatchedMissiles, (function (index, missile) {
        if (!isDefined(missile) || missile.state !== MISSILE.active) {
            return true;
        }

        // Select the nearest anti-missile defense station to target enemy missiles
        var source = whichAntiMissileBattery( missile.endX );
        if( source === -1 ){ // No missiles left
            return false;
        } else {
            this.whatchedMissiles.splice(index, 1);
            this.pointedMissiles.push(missile);
        }

        var target = findTarget(missile, source);
        playerMissiles.push( new PlayerMissile( source, target.x, target.y ) );
    }).bind(this));
};

function pitagoraTheorem(a, b) {
    return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
}

function findTarget(missile, source) {
    var distance = pointDistance({x: missile.x, y: missile.y}, {x: antiMissileBatteries[source].x, y: antiMissileBatteries[source].y});
    var t = distance / (SPEEDMISSILEDEFENSE + pitagoraTheorem(missile.dx, missile.dy) );

    while (true) {
        var yShoot = missile.y + missile.dy * t;
        var xShoot = missile.x + missile.dx * t;
        var t2 = missileSpeed(xShoot - antiMissileBatteries[source].x, yShoot - antiMissileBatteries[source].y);
        if ((t).toFixed(9) === (t2).toFixed(9)) {
            return {x: xShoot, y: yShoot + 10};
        } else {
            var distanceAttack = pointDistance({x: missile.x, y: missile.y}, {x: xShoot, y: yShoot});
            var distanceDefense = pointDistance({x: xShoot, y: yShoot}, {x: antiMissileBatteries[source].x, y: antiMissileBatteries[source].y});
            distance = distanceAttack + distanceDefense;
            t = distance / (SPEEDMISSILEDEFENSE + pitagoraTheorem(missile.dx, missile.dy) );
        }
    }
}

#START_OF_GOAL_FUNCTION#
var p = {x: rand(50, 370), y: rand(50, 370)};
var q = {x: rand(50, 370), y: rand(50, 370)};

console.log("controllo la presenza di errori nell'editor");
testFunction(p,q);
editor.defineFunction();

var penaltyFindTarget = function (missile, source) {
    return {x: rand(50, 370), y: rand(50, 370)};
};

if (pointDistance(p, q) !== Math.sqrt( Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2) ))  {
    console.log("La funzione non restituisce un risultato corretto");

    findTarget = penaltyFindTarget;
} else {
    console.log("La funzione e' corretta");
    findTarget = correctFindTarget;
}

#END_OF_GOAL_FUNCTION#
