// Initialize the city
var initCities = function () {
#BEGIN_EDITABLE#
    /* Le coordinate delle citta' sono definite nel vettore elementPos
       dal 4º elemento in poi. */
    cities.push( new City( elementPos[8].x,  elementPos[8].y) );
#END_EDITABLE#
};
#START_OF_GOAL_FUNCTION#
console.log("inizializzo l'array delle citta'");
cities = [];

console.log("controllo se il codice utente soddisfa le richieste del livello");
var f = this.getCode();
if (f.body.indexOf('for') === -1) {
    console.log("Non e' stato utilizzato il ciclo for!");
    return;
}

console.log("invoco la funzione definita nell'editor");
initCities();

if (cities.length != 6) {
    console.log("Le citta' devono essere 6");
    return;
}

if (cities[0].x !== elementPos[3].x || cities[5].x !== elementPos[8].x) {
    console.log("Le citta' sono in posizioni sbagliate");
    return;
}

console.log("Reinizializzo il livello");
initializeLevel();
#END_OF_GOAL_FUNCTION#
