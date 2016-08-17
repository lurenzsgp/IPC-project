// Funzione per la ricarica dei missili nell postazioni antimissilistiche
var rechargeAntiMissileBatteries = function () {
#BEGIN_EDITABLE#
    for(var i=0; i<3; i++) {
        antiMissileBatteries[i].missilesLeft = 1;
    }
#END_EDITABLE#
};
#START_OF_GOAL_FUNCTION#
var penaltyRechargeAntiMissileBatteries = function () {
    $.each( antiMissileBatteries, function( index, amb ) {
      amb.missilesLeft = 1;
    });
};

rechargeAntiMissileBatteries();
console.log("controllo quanti missili sono stati caricatii");
if (antiMissileBatteries[0].missilesLeft > 10) {
    console.log("troppi missili");
    rechargeAntiMissileBatteries = penaltyRechargeAntiMissileBatteries;
}

console.log("inizializzo il livello");
initializeLevel();
#END_OF_GOAL_FUNCTION#
