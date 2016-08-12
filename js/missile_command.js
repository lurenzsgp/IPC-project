// Missile Command
var canvas = document.querySelector( 'canvas' ),
  ctx = canvas.getContext( '2d' );

// Constants
var CANVAS_WIDTH  = canvas.width,
  CANVAS_HEIGHT = canvas.height,
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

// Create cities and anti missile batteries at the start of the game
var missileCommand = function() {
// Bottom left position of city
cities.push( new City( 80,  430 ) );
cities.push( new City( 130, 430 ) );
cities.push( new City( 180, 430 ) );
cities.push( new City( 300, 430 ) );
cities.push( new City( 350, 430 ) );
cities.push( new City( 400, 430 ) );

// Top middle position of anti missile battery
antiMissileBatteries.push( new AntiMissileBattery( 35,  410 ) );
antiMissileBatteries.push( new AntiMissileBattery( 255, 410 ) );
antiMissileBatteries.push( new AntiMissileBattery( 475, 410 ) );
initializeLevel();
};



//LIVELLO: si potrebbero azzerare il numero di missili per batteria
// Reset various variables at the start of a new level
var initializeLevel = function() {
$.each( antiMissileBatteries, function( index, amb ) {
  amb.missilesLeft = 10;
});
playerMissiles = [];
enemyMissiles = [];
createEmemyMissiles();
drawBeginLevel();
};

//LIVELLO: si possono aumentare il numero di missili che arrivano
// Create a certain number of enemy missiles based on the game level
var createEmemyMissiles = function() {
var targets = viableTargets(),
    numMissiles = ( (level + 7) < 30 ) ? level + 7 : 30;
for( var i = 0; i < numMissiles; i++ ) {
  enemyMissiles.push( new EnemyMissile(targets) );
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
ctx.font = 'bold 20px consolas';
ctx.fillText( 'Score ' + score, 80, 25 );
};

// Show message before a level begins
var drawLevelMessage = function() {
ctx.fillStyle = 'white';
ctx.font = 'bold 20px consolas';
ctx.fillText( 'CLICK TO START LEVEL', 130, 180 );
ctx.fillStyle = 'white';
ctx.fillText( ' ' + level, 370, 180 );

ctx.fillText( '' + getMultiplier(), 195, 245 );
ctx.fillStyle = 'white';
ctx.fillText( 'X  POINTS', 215, 245 );

ctx.fillText( 'DEFEND', 100, 355 );
ctx.fillText( 'CITIES', 330, 355 );
};

// Show bonus points at end of a level
var drawEndLevel = function( missilesLeft, missilesBonus,
                           citiesSaved, citiesBonus ) {
drawGameState();
ctx.fillStyle = 'white';
ctx.font = 'bold 20px consolas';
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
ctx.fillStyle = 'red';
ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

// Yellow hexagon
ctx.fillStyle = 'yellow';
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

ctx.fillStyle = 'red';
ctx.font = 'bold 85px consolas';
ctx.fillText( 'THE END', 70, 260 );

ctx.fillStyle = 'yellow';
ctx.font = 'bold 26px consolas';
ctx.fillText( 'Final Score: ' + score, 80, 20 );
ctx.fillText( 'CLICK TO PLAY NEW GAME', 80, 458 );
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
ctx.lineTo( 55, 430);
ctx.lineTo( 45, 440);

ctx.lineTo( 0 ,440);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.lineTo( 70, 430 );
ctx.lineTo( 220, 430 );
ctx.lineTo( 245, 410 );
ctx.lineTo( 255, 410 );
ctx.lineTo( 275, 430 );
ctx.lineTo( 265, 440 );
ctx.lineTo( 80, 440 );
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.lineTo( 290, 430 );
ctx.lineTo( 440, 430 );
ctx.lineTo( 465, 410 );
ctx.lineTo( 475, 410 );
ctx.lineTo( 495, 430 );
ctx.lineTo( 485, 440 );
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
this.missilesLeft = 10;
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
    ( this.target[2] instanceof City ) ? this.target[2].active = false
                                    : this.target[2].missilesLeft = 0;
  }
}
if( this.explodeRadius < 0 ) {
  this.state = MISSILE.exploded;
}
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
var scale = (function() {
  var distance = Math.sqrt( Math.pow(xDistance, 2) +
                            Math.pow(yDistance, 2) ),
      // Make missile fired from central anti missile battery faster
      distancePerFrame = ( source === 1 ) ? 20 : 12;

  return distance / distancePerFrame;
})();

this.dx = xDistance / scale;
this.dy = yDistance / scale;
amb.missilesLeft--;
}

// Make PlayerMissile inherit from Missile
PlayerMissile.prototype = Object.create( Missile.prototype );
PlayerMissile.prototype.constructor = PlayerMissile;


//LIVELLO: si puo' non far esplodere il missile
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

//LIVELLO: si possono modificare le coordinate di puntamento aggiungendo un numero random
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

// Constructor for the Enemy's Missile, which is a subclass of Missile
// and uses Missile's constructor
function EnemyMissile( targets ) {
var startX = rand( 0, CANVAS_WIDTH ),
    startY = 0,
    // Create some variation in the speed of missiles
    offSpeed = rand(80, 120) / 100,
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
this.delay = rand( 0, 50 + level * 15 );
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

//LIVELLO: compromettere l'esplosione rende impossibile intercettare i missili nemici
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
// Note that at most 3 cities may be attacked in any level.
var viableTargets = function() {
var targets = [];

// Include all active cities
$.each( cities, function( index, city ) {
  if( city.active ) {
    targets.push( [city.x + 15, city.y - 10, city] );
  }
});

// Randomly select at most 3 cities to target
while( targets.length > 3 ) {
  targets.splice( rand(0, targets.length - 1), 1 );
}

// Include all anti missile batteries
$.each( antiMissileBatteries, function( index, amb ) {
  targets.push( [amb.x, amb.y, amb]);
});

return targets;
};

// Operations to be performed on each game frame leading to the
// game animation
var nextFrame = function() {
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

  !citiesSaved ? endGame( missilesLeft )
               : endLevel( missilesLeft, citiesSaved );
}
};

// Handle the end of a level
var endLevel = function( missilesLeft, citiesSaved ) {
var missilesBonus = missilesLeft * 5 * getMultiplier(),
    citiesBonus = citiesSaved * 100 * getMultiplier();

drawEndLevel( missilesLeft, missilesBonus,
              citiesSaved, citiesBonus );

// Show the new game score after 2 seconds
setTimeout( function() {
  score += missilesBonus + citiesBonus;
  drawEndLevel( missilesLeft, missilesBonus,
                citiesSaved, citiesBonus );
}, 2000 );

setTimeout( setupNextLevel, 4000 );
};

// Move to the next level
var setupNextLevel = function() {
level++;
initializeLevel();
setupListeners();
};

// Handle the end of the game
var endGame = function( missilesLeft ) {
score += missilesLeft * 5 * getMultiplier();
drawEndGame();

$( 'body' ).on( 'click', 'div', function() {
  location.reload();
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
$( '#mc-container' ).one( 'click', function() {
  startLevel();

  $( '#mc-container' ).on( 'click', function( event ) {
    playerShoot( event.pageX - this.offsetLeft,
                 event.pageY - this.offsetTop );
  });
});
};
