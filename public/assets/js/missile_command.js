// TODO controllare i punteggi

// Missile Command
var canvas = document.querySelector( 'canvas' ),
  ctx = canvas.getContext( '2d' );

// Constants
var CANVAS_WIDTH  = canvas.width,
  CANVAS_HEIGHT = canvas.height,
  SPEEDMISSILEDEFENSE = 12,
  MISSILE = {
    active: 1,
    exploding: 2,
    imploding: 3,
    exploded: 4
  };

// Variables
var score = 0,
  level = 1,
  cities = [],
  antiMissileBatteries = [],
  playerMissiles = [],
  enemyMissiles = [],
  timerID;

var contrAerea;

var elementPos = [{x: 35, y:410}, {x: 255, y:410}, {x: 475, y:410},
    {x: 80, y:430}, {x: 130, y:430}, {x: 180, y:430}, {x: 300, y:430}, {x: 350, y:430}, {x: 400, y:430}, ];
// Create cities and anti missile batteries at the start of the game
var missileCommand = function() {
    if (3 < level && level < 7) {
        initRefactLevel();
    } else if (6 < level && level < 10) {
        initDesignLevel();
    } else {
        initDebugLevel();
    }

    setupListeners();
};

var initDebugLevel = function () {
    cities = [];
    antiMissileBatteries = [];
    // Bottom left position of city
    cities.push( new City( elementPos[3].x,  elementPos[3].y) );
    cities.push( new City( elementPos[4].x,  elementPos[4].y) );
    cities.push( new City( elementPos[5].x,  elementPos[5].y) );
    cities.push( new City( elementPos[6].x,  elementPos[6].y) );
    cities.push( new City( elementPos[7].x,  elementPos[7].y) );
    cities.push( new City( elementPos[8].x,  elementPos[8].y) );

    // Top middle position of anti missile battery
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[0].x,  elementPos[0].y) );
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[1].x,  elementPos[1].y) );
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[2].x,  elementPos[2].y) );
    initializeLevel();
};

var initCities = function () {
    return;
}

var initRefactLevel = function () {
    cities = [];
    antiMissileBatteries = [];

    if (level === 4) {
        initCities();
    } else {
        // Bottom left position of city
        cities.push( new City( elementPos[3].x,  elementPos[3].y) );
        cities.push( new City( elementPos[4].x,  elementPos[4].y) );
        cities.push( new City( elementPos[5].x,  elementPos[5].y) );
        cities.push( new City( elementPos[6].x,  elementPos[6].y) );
        cities.push( new City( elementPos[7].x,  elementPos[7].y) );
        cities.push( new City( elementPos[8].x,  elementPos[8].y) );
    }
    // Top middle position of anti missile battery
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[0].x,  elementPos[0].y) );
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[1].x,  elementPos[1].y) );
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[2].x,  elementPos[2].y) );

    initializeLevel();

    if (level === 5 || level === 6) {
        editor.execCode(true);
    }
};

var initDesignLevel = function () {
    cities = [];
    antiMissileBatteries = [];
    // Bottom left position of city
    cities.push( new City( elementPos[3].x,  elementPos[3].y) );
    cities.push( new City( elementPos[4].x,  elementPos[4].y) );
    cities.push( new City( elementPos[5].x,  elementPos[5].y) );
    cities.push( new City( elementPos[6].x,  elementPos[6].y) );
    cities.push( new City( elementPos[7].x,  elementPos[7].y) );
    cities.push( new City( elementPos[8].x,  elementPos[8].y) );

    // Top middle position of anti missile battery
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[0].x,  elementPos[0].y) );
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[1].x,  elementPos[1].y) );
    antiMissileBatteries.push( new AntiMissileBattery(  elementPos[2].x,  elementPos[2].y) );

    if (level === 7) {
        var f = editor.getCode();
        if (f.body.indexOf("antiMissileBatteries") === -1 || f.body.indexOf("missilesLeft") === -1) {
            rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
        }
    }

    if (level >= 8) {
        if (level === 9) {
            contrAerea = new AutoAntiMissileDefense();
            editor.execCode(true);
        }
        initializeHandicapLevel();
    } else {
        initializeLevel();
    }
};

var handicapRechargeAntiMissileBatteries = function () {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft = 5;
    });
};

var penaltyRechargeAntiMissileBatteries = function () {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft = 1;
    });
};

var rechargeAntiMissileBatteries = function () {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft = 10;
    });
};

// Reset various variables at the start of a new level
var initializeLevel = function() {
    rechargeAntiMissileBatteries();
    playerMissiles = [];
    enemyMissiles = [];
    createEmemyMissiles();
    drawBeginLevel();
};

// Reset various variables at the start of a new level
var initializeHandicapLevel = function() {
    handicapRechargeAntiMissileBatteries();
    playerMissiles = [];
    enemyMissiles = [];
    createEmemyMissiles();
    createBonusMissiles(3);
    drawBeginLevel();
    if (isDefined(contrAerea)) {
        contrAerea.initialize();
    }
};

// Create a certain number of enemy missiles based on the game level
var createEmemyMissiles = function() {
    var targets = viableTargets(),
        numMissiles = ( level !== 9 ) ? level + 14 : 30;
    for( var i = 0; i < numMissiles; i++ ) {
        enemyMissiles.push( new EnemyMissile(targets) );
    }
};

// Create a certain number of bonus missiles
var createBonusMissiles = function(n) {
    var targets = viableTargets();
    for( var i = 0; i < n; i++ ) {
        enemyMissiles.push( new BonusMissile(targets) );
    }
};

// Get a random number between min and max, inclusive
var rand = function( min, max ) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
};

// Show various graphics shown on most game screens
var drawGameState = function() {
    drawBackground();
    drawCities();
    drawAntiMissileBatteries();
    drawScore();
};

var drawBeginLevel = function() {
    drawGameState();
    drawLevelMessage();
};

// Show current score
var drawScore = function() {
    ctx.fillStyle = 'white';
    ctx.font =  '20px monaco, consolas';
    ctx.fillText( 'game.score = ' + score, 50, 25 );
};

// Show message before a level begins
var drawLevelMessage = function() {
    ctx.fillStyle = '#6d6';
    ctx.font =  '20px monaco, consolas';
    ctx.fillText( 'onclick(lvl.start())', 130, 150 );
    ctx.fillStyle = 'white';
    ctx.fillText( 'lvl == ' + level, 160, 180 );

    ctx.fillText( '' + getMultiplier(), 160, 215 );
    ctx.fillStyle = 'white';
    ctx.fillText( '  * points.count()', 160, 215 );

    ctx.font = 'bold 20px monaco, consolas';
    ctx.fillStyle = '#d66';
    ctx.fillText( '>>>cities.defend()<<<', 130, 285 );
};

// Show bonus points at end of a level
var drawEndLevel = function( missilesLeft, missilesBonus, citiesSaved, citiesBonus ) {
    drawGameState();
    ctx.fillStyle = 'white';
    ctx.font = '20px monaco, consolas';
    ctx.fillText( 'BONUS POINTS', 150, 149 );
    ctx.fillStyle = 'white';
    ctx.fillText( '' + missilesBonus, 170, 213 );
    ctx.fillStyle = 'white';
    ctx.fillText( 'Missiles Left: ' + missilesLeft, 230, 213 );
    ctx.fillStyle = 'white';
    ctx.fillText( '' + citiesBonus, 170, 277 );
    ctx.fillStyle = 'white';
    ctx.fillText( 'Cities Saved: ' + citiesSaved, 230, 277 );
};

// Show simple graphic at end of game
var drawEndGame = function() {
    ctx.fillStyle = '#635e77';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    // Yellow hexagon
    ctx.fillStyle = '#a24a4a';
    ctx.beginPath();
    ctx.moveTo( 255, 30  );
    ctx.lineTo( 396, 89  );
    ctx.lineTo( 455, 230 );
    ctx.lineTo( 396, 371 );
    ctx.lineTo( 255, 430 );
    ctx.lineTo( 114, 371 );
    ctx.lineTo( 55,  230 );
    ctx.lineTo( 114, 89  );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '60px monaco, consolas';
    ctx.fillText( 'game == over', 70, 260 );

    ctx.fillStyle = 'yellow';
    ctx.font = '26px monaco, consolas';
    ctx.fillText( 'game.score == ' + score, 80, 20 );
    ctx.fillText( 'onclick(game.restart())', 80, 458 );
};

// Draw all active cities
var drawCities = function() {
    $.each( cities, function( index, city ) {
      if( city.active ) {
        city.draw();
      }
    });
};

// Draw missiles in all anti missile batteries
var drawAntiMissileBatteries = function() {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.draw();
    });
};

// Get the factor by which the score earned in a level will
// be multiplied by (maximum factor of 6)
var getMultiplier = function() {
    return ( level > 10 ) ? 6 : Math.floor( (level + 1) / 2 );
};

// Show the basic game background
var drawBackground = function() {
    // Black background -> gradient sky

    var grd=ctx.createLinearGradient(0,1000,0,0);
    grd.addColorStop(0,"#a44");
    grd.addColorStop(1,"#134");

    ctx.fillStyle = grd;
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    // Yellow area at bottom of screen for cities and
    // anti missile batteries


    var grdd=ctx.createLinearGradient(0,340,0,550);
    grdd.addColorStop(0,"tan");
    grdd.addColorStop(1,"orange");

    ctx.fillStyle = grdd;
    ctx.beginPath();
    ctx.moveTo( 0, 460 );
    ctx.lineTo( 0,  430 );
    ctx.lineTo( 25, 410 );
    ctx.lineTo( 45, 410 );
    ctx.lineTo( 70, 430 );
    ctx.lineTo( 220, 430 );
    ctx.lineTo( 245, 410 );
    ctx.lineTo( 265, 410 );
    ctx.lineTo( 290, 430 );
    ctx.lineTo( 440, 430 );
    ctx.lineTo( 465, 410 );
    ctx.lineTo( 485, 410 );
    ctx.lineTo( 510, 430 );
    ctx.lineTo( 510, 460 );
    ctx.closePath();
    ctx.fill();
    //sand dunes shadows
    ctx.fillStyle = '#fdce7e';
    ctx.beginPath();
    ctx.lineTo( 0, 430 );
    ctx.lineTo( 25, 410 );
    ctx.lineTo( 35, 410 );
    ctx.lineTo( 60, 435);
    ctx.lineTo( 55, 440);

    ctx.lineTo( 0 ,440);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.lineTo( 70, 430 );
    ctx.lineTo( 220, 430 );
    ctx.lineTo( 245, 410 );
    ctx.lineTo( 255, 410 );
    ctx.lineTo( 280, 435 );
    ctx.lineTo( 275, 440 );
    ctx.lineTo( 85, 440 );
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.lineTo( 290, 430 );
    ctx.lineTo( 440, 430 );
    ctx.lineTo( 465, 410 );
    ctx.lineTo( 475, 410 );
    ctx.lineTo( 500, 435 );
    ctx.lineTo( 495, 440 );
    ctx.lineTo( 305, 440 );
    ctx.closePath();
    ctx.fill();
};


// Constructor for a City
function City( x, y ) {
	this.x = x;
	this.y = y;
	this.active = true;
}

// Show a city based on its position
City.prototype.draw = function() {
	var x = this.x,
		y = this.y;

	ctx.fillStyle = '#833';
	ctx.beginPath();
	ctx.moveTo( x, y );
	ctx.lineTo( x, y - 10 );
	ctx.lineTo( x + 10, y - 10 );
	ctx.lineTo( x + 15, y - 15 );
	ctx.lineTo( x + 20, y - 10 );
	ctx.lineTo( x + 30, y - 10 );
	ctx.lineTo( x + 35, y - 5);
	ctx.lineTo( x + 30, y );
	ctx.lineTo( x + 5, y + 5);
	ctx.closePath();
	ctx.fill();

	//city shadows
	ctx.fillStyle = '#411';
	ctx.beginPath();
	x = x+5;
	y = y+5;
	ctx.moveTo( x , y );
	ctx.lineTo( x, y - 10 );
	ctx.lineTo( x + 10, y - 10 );
	ctx.lineTo( x + 15, y - 15 );
	ctx.lineTo( x + 20, y - 10 );
	ctx.lineTo( x + 30, y - 10 );
	ctx.lineTo( x + 30, y );
	ctx.closePath();
	ctx.fill();
};

// Constructor for an Anti Missile Battery
function AntiMissileBattery( x, y ) {
	this.x = x;
	this.y = y;
	this.missilesLeft = 1;
}

AntiMissileBattery.prototype.hasMissile = function() {
	return !!this.missilesLeft;
};

// Show the missiles left in an anti missile battery
AntiMissileBattery.prototype.draw = function() {
	var x, y;
	var delta = [ [0, 0], [-6, 6], [6, 6], [-12, 12], [0, 12],
				  [12, 12], [-18, 18], [-6, 18], [6, 18], [18, 18] ];

	for( var i = 0, len = this.missilesLeft; i < len; i++ ) {
	  x = this.x + delta[i][0] + 2;
	  y = this.y + delta[i][1] + 2;

	  // Draw a missile-launcher
	  ctx.fillStyle = '#8f3f3f';
	  ctx.beginPath();
	  ctx.moveTo( x, y );
	  ctx.lineTo( x - 5, y + 5);
	  ctx.lineTo( x , y + 7);
	  ctx.closePath();
	  ctx.fill();

	  ctx.fillStyle = '#441111';
	  ctx.beginPath();
	  ctx.moveTo(x,y);
	  ctx.lineTo( x , y + 7);
	  ctx.lineTo( x + 5, y + 5);
	  ctx.closePath();
	  ctx.fill();
	}
};

// Constructor for a Missile, which may be the player's missile or
// the enemy's missile.
// The options argument used to create the missile is expected to
// have startX, startY, endX, and endY to define the missile's path
// as well as color and trailColor for the missile's appearance
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
}

// Draw the path of a missile or an exploding missile
Missile.prototype.draw = function() {
	if( this.state === MISSILE.active ){
	  ctx.strokeStyle = this.trailColor;
	  ctx.lineWidth = 2;
	  ctx.beginPath();
	  ctx.moveTo( this.startX, this.startY );
	  ctx.lineTo( this.x, this.y );
	  ctx.stroke();

	  ctx.fillStyle = this.color;
	  ctx.fillRect( this.x - 1, this.y - 1, this.width, this.height );
	} else if( this.state === MISSILE.exploding ||
			   this.state === MISSILE.imploding ) {
	  //explosion color
	  ctx.fillStyle = 'rgba(250,180,150,0.5)';
	  ctx.beginPath();
	  ctx.arc( this.x, this.y, this.explodeRadius, 0, 2 * Math.PI );
	  ctx.closePath();

	  explodeOtherMissiles( this, ctx );

	  ctx.fill();
	}
};

// Show the missiles left in an anti missile battery
AntiMissileBattery.prototype.draw = function() {
    var x, y;
    var delta = [ [0, 0], [-6, 6], [6, 6], [-12, 12], [0, 12],
                  [12, 12], [-18, 18], [-6, 18], [6, 18], [18, 18] ];

    for( var i = 0, len = this.missilesLeft; i < len; i++ ) {
        x = this.x + delta[i][0];
        y = this.y + delta[i][1];

        // Draw a missile
        ctx.strokeStyle = 'brown';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo( x, y );
        ctx.lineTo( x, y + 8 );
        ctx.moveTo( x - 2, y + 10 );
        ctx.lineTo( x - 2, y + 6 );
        ctx.moveTo( x + 2, y + 10 );
        ctx.lineTo( x + 2, y + 6 );
        ctx.stroke();
    }
};

  // Constructor for a Missile, which may be the player's missile or
  // the enemy's missile.
  // The options argument used to create the missile is expected to
  // have startX, startY, endX, and endY to define the missile's path
  // as well as color and trailColor for the missile's appearance
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
}

// Draw the path of a missile or an exploding missile
Missile.prototype.draw = function() {
    if( this.state === MISSILE.active ){
      ctx.strokeStyle = this.trailColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo( this.startX, this.startY );
      ctx.lineTo( this.x, this.y );
      ctx.stroke();

      ctx.fillStyle = this.color;
      ctx.fillRect( this.x - 1, this.y - 1, this.width, this.height );
    } else if( this.state === MISSILE.exploding ||
               this.state === MISSILE.imploding ) {
      ctx.fillStyle = 'rgba(255,255,0,0.5)';
      ctx.beginPath();
      ctx.arc( this.x, this.y, this.explodeRadius, 0, 2 * Math.PI );
      ctx.closePath();

      explodeOtherMissiles( this, ctx );

      ctx.fill();
    }
};

// Handle update to help with animating an explosion
Missile.prototype.explode = function() {
    if( this.state === MISSILE.exploding ) {
        this.explodeRadius++;
    }
    if( this.explodeRadius > 30 ) {
        this.state = MISSILE.imploding;
    }
    if( this.state === MISSILE.imploding ) {
        this.explodeRadius--;
        if( this.groundExplosion ) {
            if ( this instanceof BonusMissile) {
                this.bonus();
            } else {
                ( this.target[2] instanceof City ) ? this.target[2].active = false : this.target[2].missilesLeft = 0;
            }
        }
    }
    if( this.explodeRadius < 0 ) {
        this.state = MISSILE.exploded;
    }
};

// Calculate the missile speed
// the time with missile reach the point
var missileSpeed = function (xDistance, yDistance) {
    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );

    var distancePerFrame = SPEEDMISSILEDEFENSE;

    return distance / distancePerFrame;
};

// Constructor for the Player's Missile, which is a subclass of Missile
// and uses Missile's constructor
function PlayerMissile( source, endX, endY ) {
    // Anti missile battery this missile will be fired from
    var amb = antiMissileBatteries[source];

    Missile.call( this, { startX: amb.x,  startY: amb.y,
                          endX: endX,     endY: endY,
                          color: 'brown', trailColor: '#833' } );

    var xDistance = this.endX - this.startX,
        yDistance = this.endY - this.startY;
    // Determine a value to be used to scale the orthogonal directions
    // of travel so the missiles travel at a constant speed and in the
    // right direction
    var scale = missileSpeed(xDistance, yDistance);

    this.dx = xDistance / scale;
    this.dy = yDistance / scale;
    amb.missilesLeft--;
}

// Make PlayerMissile inherit from Missile
PlayerMissile.prototype = Object.create( Missile.prototype );
PlayerMissile.prototype.constructor = PlayerMissile;


// Update the location and/or state of this missile of the player
PlayerMissile.prototype.update = function() {
    if( this.state === MISSILE.active && this.y <= this.endY ) {
      // Target reached
      this.x = this.endX;
      this.y = this.endY;
      this.state = MISSILE.exploding;
    }
    if( this.state === MISSILE.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
};

// Create a missile that will be shot at indicated location
var playerShoot = function( x, y ) {
    if( y >= 50 && y <= 370 ) {
      var source = whichAntiMissileBattery( x );
      if( source === -1 ){ // No missiles left
        return;
      }
      playerMissiles.push( new PlayerMissile( source, x, y ) );
    }
};

// Costruttore del sistema di difesa automatica verso i missili nemici
function AutoAntiMissileDefense () {
    this.whatchedMissiles = [];
    this.pointedMissiles = [];
};

// Inizializza i parametri
AutoAntiMissileDefense.prototype.initialize = function () {
    this.whatchedMissiles = [];
    this.pointedMissiles = [];
};

// Seleziona i missili idonei per essere colpiti
AutoAntiMissileDefense.prototype.detectMissile = function () {
    $.each(enemyMissiles, (function (index, missile) {
        if (missile instanceof EnemyMissile && !this.pointedMissiles.includes(missile) && !this.whatchedMissiles.includes(missile) && missile.y > 50 ) {
            this.whatchedMissiles.push(missile);
        }
    }).bind(this));
};

// Prepara il missile da lanciare contro i missili nemici
AutoAntiMissileDefense.prototype.shoot = function () {
    this.detectMissile();

    $.each(this.whatchedMissiles, (function (index, missile) {
        if (!isDefined(missile) || missile.state !== MISSILE.active) {
            return true;
        }
        // seleziono la postazione antimissilistica piu' vicina al bersaglio del missile nemico
        var source = whichAntiMissileBattery( missile.endX );
        if( source === -1 ){ // No missiles left
            return false;
        } else {
            this.whatchedMissiles.splice(index, 1);
            this.pointedMissiles.push(missile);
        }

        // TODO il missile e' sparato nella direzione giusta ma fuori schermo
        var target = findTarget(missile, source);
        playerMissiles.push( new PlayerMissile( source, target.x, target.y ) );
    }).bind(this));
};

var pitagoraTheorem = function (a, b) {
    return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
};

var pointDistance = function (p, q) {
    return Math.sqrt( Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2) );
};

function correctFindTarget (missile, source) {
    var distance = pointDistance({x: missile.x, y: missile.y}, {x: antiMissileBatteries[source].x, y: antiMissileBatteries[source].y});
    // Math.sqrt( Math.pow(missile.x - antiMissileBatteries[source].x, 2) + Math.pow(missile.y - antiMissileBatteries[source].y, 2) );
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
    return {x: rand(50, 370), y: rand(50, 370)};
}

findTarget = correctFindTarget;

// Constructor for the Enemy's Missile, which is a subclass of Missile
// and uses Missile's constructor
function EnemyMissile( targets ) {
    var startX = rand( 0, CANVAS_WIDTH ),
        startY = -1,
        // Create some variation in the speed of missiles
        offSpeed = rand(80, 160) / 100,
        // Randomly pick a target for this missile
        target = targets[ rand(0, targets.length - 1) ],
        framesToTarget;

    Missile.call( this, { startX: startX,  startY: startY,
                          endX: target[0], endY: target[1],
                          color: 'yellow', trailColor: '#aaa' } );

    framesToTarget = ( 650 - 30 * level ) / offSpeed;
    if( framesToTarget < 20 ) {
      framesToTarget = 20;
    }
    this.dx = ( this.endX - this.startX ) / framesToTarget;
    this.dy = ( this.endY - this.startY ) / framesToTarget;

    this.target = target;
    // Make missiles heading to their target at random times
    this.delay = rand( 0, 50 + level * 20 );
    this.groundExplosion = false;
}

// Make EnemyMissile inherit from Missile
EnemyMissile.prototype = Object.create( Missile.prototype );
EnemyMissile.prototype.constructor = EnemyMissile;

// Update the location and/or state of an enemy missile.
// The missile doesn't begin it's flight until its delay is past.
EnemyMissile.prototype.update = function() {
    if( this.delay ) {
      this.delay--;
      return;
    }
    if( this.state === MISSILE.active && this.y >= this.endY ) {
      // Missile has hit a ground target (City or Anti Missile Battery)
      this.x = this.endX;
      this.y = this.endY;
      this.state = MISSILE.exploding;
      this.groundExplosion = true;
    }
    if( this.state === MISSILE.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
};

// Constructor for the Bonus's Missile, which is a subclass of Missile
// and uses Missile's constructor
function BonusMissile( targets ) {
    var startX = rand( 0, CANVAS_WIDTH ),
        startY = -1,
        // Create some variation in the speed of missiles
        offSpeed = rand(200, 250) / 100,
        // Randomly pick a target for this missile
        target = targets[ rand(0, targets.length - 1) ],
        framesToTarget;

    Missile.call( this, { startX: startX,  startY: startY,
                          endX: target[0], endY: target[1],
                          color: 'blue', trailColor: '#00ffff' } );

    framesToTarget = ( 650 - 30 * level ) / offSpeed;
    if( framesToTarget < 20 ) {
      framesToTarget = 20;
    }
    this.dx = ( this.endX - this.startX ) / framesToTarget;
    this.dy = ( this.endY - this.startY ) / framesToTarget;
    this.bonuscatched = false;
    this.target = target;
    // Make missiles heading to their target at random times
    this.delay = 20 + rand( 0, 50 + level * 20 );
    this.groundExplosion = false;
}

// Make BonusMissile inherit from Missile
BonusMissile.prototype = Object.create( Missile.prototype );
BonusMissile.prototype.constructor = BonusMissile;

// Update the location and/or state of an enemy missile.
// The missile doesn't begin it's flight until its delay is past.
BonusMissile.prototype.update = function() {
    if( this.delay ) {
      this.delay--;
      return;
    }
    if( this.state === MISSILE.active && this.y >= this.endY ) {
      // Missile has hit a ground target (City or Anti Missile Battery)
      this.x = this.endX;
      this.y = this.endY;
      this.state = MISSILE.exploding;
      this.groundExplosion = true;
    }
    if( this.state === MISSILE.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
};

BonusMissile.prototype.bonus = function () {
    if (!this.bonuscatched) {
        this.bonuscatched = true;
        // bonus in punti
        addMissile(3);
    }
}

var addMissile = function (n) {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft += n;
      if (amb.missilesLeft > 10) {
          amb.missilesLeft = 10;
      }
    });
}

// When a missile that did not hit the ground is exploding, check if
// any enemy missile is in the explosion radius; if so, cause that
// enemy missile to begin exploding too.
var explodeOtherMissiles = function( missile, ctx ) {
	if( !missile.groundExplosion ){
	  $.each( enemyMissiles, function( index, otherMissile ) {
		if( ctx.isPointInPath( otherMissile.x, otherMissile.y ) &&
			otherMissile.state === MISSILE.active ) {
		  score += 25 * getMultiplier();
		  otherMissile.state = MISSILE.exploding;
		}
	  });
	}
};

// Get targets that may be attacked in a game Level. All targets
// selected here may not be attacked, but no target other than those
// selected here will be attacked in a game level.
var viableTargets = function() {
    var targets = [];

    // Include all active cities
    $.each( cities, function( index, city ) {
      if( city.active ) {
        targets.push( [city.x + 15, city.y - 10, city] );
      }
    });

    // Include all anti missile batteries
    $.each( antiMissileBatteries, function( index, amb ) {
      targets.push( [amb.x, amb.y, amb]);
    });

    return targets;
};

// Operations to be performed on each game frame leading to the
// game animation
var nextFrame = function() {
    if (isDefined(contrAerea)) {
        contrAerea.shoot();
    }
	drawGameState();
	updateEnemyMissiles();
	drawEnemyMissiles();
	updatePlayerMissiles();
	drawPlayerMissiles();
	checkEndLevel();
};

// Check for the end of a Level, and then if the game is also ended
var checkEndLevel = function() {
    if( !enemyMissiles.length ) {
        // Stop animation
        stopLevel();
        $( '.container' ).off( 'click' );
        var missilesLeft = totalMissilesLeft(),
          citiesSaved  = totalCitiesSaved();

        $("#ButtonExecCode").prop("disabled",false);
        $("#ButtonResetCode").prop("disabled",false);

        !citiesSaved ? endGame( missilesLeft ) : endLevel( missilesLeft, citiesSaved );
    }
};

// Handle the end of a level
var endLevel = function( missilesLeft, citiesSaved ) {
    var missilesBonus = missilesLeft * 5 * getMultiplier(),
        citiesBonus = citiesSaved * 100 * getMultiplier();
    var nextLevel = true;

    drawEndLevel( missilesLeft, missilesBonus,
                  citiesSaved, citiesBonus );

    // Show the new game score after 2 seconds
    setTimeout( function() {
      score += missilesBonus + citiesBonus;
      drawEndLevel( missilesLeft, missilesBonus,
                    citiesSaved, citiesBonus );
    }, 2000 );

    if (citiesSaved !== 6) {
        nextLevel = false;
        console.log("Riprova, non devi perdere nessuna torretta");
    }
    setTimeout( setupNextLevel, 4000, nextLevel );
};

// Move to the next level
var setupNextLevel = function(next) {
    if (next) {
        level++;
        editor.loadCode(level);
    }
    missileCommand();
};

// Handle the end of the game
var endGame = function( missilesLeft ) {
    score += missilesLeft * 5 * getMultiplier();
    drawEndGame();

    $( '#mc-container' ).one( 'click', function() {
        // possibilita' di penalita' nel punteggio
        missileCommand();
        });
    };

    // Get missiles left in all anti missile batteries at the end of a level
var totalMissilesLeft = function() {
    var total = 0;
    $.each( antiMissileBatteries, function(index, amb) {
      total += amb.missilesLeft;
    });
    return total;
};

// Get count of undestroyed cities
var totalCitiesSaved = function() {
	var total = 0;
	$.each( cities, function(index, city) {
	  if( city.active ) {
		total++;
	  }
	});
	return total;
};

// Update all enemy missiles and remove those that have exploded
var updateEnemyMissiles = function() {
	$.each( enemyMissiles, function( index, missile ) {
	  missile.update();
	});
	enemyMissiles = enemyMissiles.filter( function( missile ) {
	  return missile.state !== MISSILE.exploded;
	});
};

// Draw all enemy missiles
var drawEnemyMissiles = function() {
	$.each( enemyMissiles, function( index, missile ) {
	  missile.draw();
	});
};

// Update all player's missiles and remove those that have exploded
var updatePlayerMissiles = function() {
	$.each( playerMissiles, function( index, missile ) {
	  missile.update();
	});
	playerMissiles = playerMissiles.filter( function( missile ) {
	  return missile.state !== MISSILE.exploded;
	});
};

// Draw all player's missiles
var drawPlayerMissiles = function() {
	$.each( playerMissiles, function( index, missile ) {
	  missile.draw();
	});
};

// Stop animating a game level
var stopLevel = function() {
	clearInterval( timerID );
};

// Start animating a game level
var startLevel = function() {
	var fps = 30;
	timerID = setInterval( nextFrame, 1000 / fps );
};

// Determine which Anti Missile Battery will be used to serve a
// player's request to shoot a missile. Determining factors are
// where the missile will be fired to and which anti missile
// batteries have missile(s) to serve the request
var whichAntiMissileBattery = function( x ) {
	var firedToOuterThird = function( priority1, priority2, priority3) {
	  if( antiMissileBatteries[priority1].hasMissile() ) {
		return priority1;
	  } else if ( antiMissileBatteries[priority2].hasMissile() ) {
		return priority2;
	  } else {
		return priority3;
	  }
	};

	var firedtoMiddleThird = function( priority1, priority2 ) {
	  if( antiMissileBatteries[priority1].hasMissile() ) {
		return priority1;
	  } else {
		return priority2;
	  }
	};

	if( !antiMissileBatteries[0].hasMissile() &&
		!antiMissileBatteries[1].hasMissile() &&
		!antiMissileBatteries[2].hasMissile() ) {
	  return -1;
	}
	if( x <= CANVAS_WIDTH / 3 ){
	  return firedToOuterThird( 0, 1, 2 );
	} else if( x <= (2 * CANVAS_WIDTH / 3) ) {
	  if ( antiMissileBatteries[1].hasMissile() ) {
		return 1;
	  } else {
		return ( x <= CANVAS_WIDTH / 2 ) ? firedtoMiddleThird( 0, 2 )
										 : firedtoMiddleThird( 2, 0 );
	  }
	} else {
	  return firedToOuterThird( 2, 1, 0 );
	}
};

// Attach event Listeners to handle the player's input
var setupListeners = function() {
    $( '#miscom' ).unbind();
    $( '#mc-container' ).one( 'click', function() {
      startLevel();

      $("#ButtonExecCode").prop("disabled",true);
      $("#ButtonResetCode").prop("disabled",true);

      $( '#miscom' ).unbind().click(function( event ) {
        var mousePos = getMousePos(this, event);
        playerShoot( mousePos.x, mousePos.y);
      });

    });
};

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  return{
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
};

function isDefined (x) {
    var undef;
    return x !== undef;
};