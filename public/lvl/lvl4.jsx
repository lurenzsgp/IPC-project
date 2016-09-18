var elementPos = [{x: 35, y:410}, {x: 255, y:410}, {x: 475, y:410}, {x: 80, y:430}, {x: 130, y:430}, {x: 180, y:430}, {x: 300, y:430}, {x: 350, y:430}, {x: 400, y:430} ];

// Initialize the six cities.
var createCities = function () {
#BEGIN_EDITABLE#

	/* Cities coordinates are defined in the 'elementPos' array starting from the 3rd element. */
    cities.push( new City( elementPos[8].x,  elementPos[8].y) );
#END_EDITABLE#
};

// Constructor for a City
function City( x, y ) {
	this.x = x;
	this.y = y;
	this.active = true;
}
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction();
editor.defineFunction();

console.log("inizializzo l'array delle citta'");
cities = [];

console.log("controllo se il codice utente soddisfa le richieste del livello");
var f = this.getCode();
if (f.body.indexOf('for') === -1) {
    console.log("Non e' stato utilizzato il ciclo for!");
    return;
}


console.log("invoco la funzione definita nell'editor");
createCities();

if (cities.length != 6) {
    console.log("Le citta' devono essere 6");
    return;
}

if (cities[0].x !== elementPos[3].x || cities[5].x !== elementPos[8].x) {
    console.log("Le citta' sono in posizioni sbagliate");
    return;
}

#END_OF_GOAL_FUNCTION#
