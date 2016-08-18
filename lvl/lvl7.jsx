// Funzione per la ricarica dei missili nell postazioni antimissilistiche. Il vettore antiMissileBatteries e' composto dalle 3 postazioni antimissilistiche. Inizializza a 10 il campo missilesLeft di ogni elemento del vettore.
var rechargeAntiMissileBatteries = function () {
#BEGIN_EDITABLE#

#END_EDITABLE#
};
#START_OF_GOAL_FUNCTION#
console.log("Controllo la presenza di parole chiave nella funzione");
var f = editor.getCode();
if (f.body.indexOf("antiMissileBatteries") === -1 || f.body.indexOf("missilesLeft") === -1) {
    console.log("Ricontrolla quello che hai scritto!!!");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
    return;
}

rechargeAntiMissileBatteries();
console.log("controllo quanti missili sono stati caricatii");
if (antiMissileBatteries[0].missilesLeft > 10 || antiMissileBatteries[1].missilesLeft > 10 || antiMissileBatteries[2].missilesLeft > 10) {
    console.log("troppi missili");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
}

console.log("inizializzo il livello");
initializeLevel();
#END_OF_GOAL_FUNCTION#
