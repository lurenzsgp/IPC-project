/* Refill of missiles in anti-missile emplacements. */
var rechargeAntiMissileBatteries = function () {
#BEGIN_EDITABLE#

/* The 'antiMissileBatteries' array is composed of the three anti-missile emplacements. Initialize to 10 the 'missilesLeft' field of each array element. */

#END_EDITABLE#
};
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction();
editor.defineFunction();


console.log("Controllo la presenza di parole chiave nella funzione");
var f = editor.getCode();
if (f.body.indexOf("antiMissileBatteries") === -1 || f.body.indexOf("missilesLeft") === -1) {
    console.log("Ricontrolla quello che hai scritto!!!");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
    return;
}

rechargeAntiMissileBatteries();
console.log("controllo quanti missili sono stati caricatii");
if (antiMissileBatteries[0].missilesLeft !== 10 || antiMissileBatteries[1].missilesLeft !== 10 || antiMissileBatteries[2].missilesLeft !== 10) {
    console.log("Constrollai missili");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
}

console.log("inizializzo il livello");
#END_OF_GOAL_FUNCTION#
