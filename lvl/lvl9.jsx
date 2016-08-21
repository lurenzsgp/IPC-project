// Prepara il missile da lanciare contro i missili nemici
AutoAntiMissileDefense.prototype.shoot = function () {
    this.detectMissile();

    $.each(this.whatchedMissiles, (function (index, missile) {
        if (!isDefined(missile) || missile.state !== MISSILE.active) {
            return;
        }
        /* seleziono la postazione antimissilistica piu' vicina al bersaglio del missile nemico */
        var source = whichAntiMissileBattery( missile.endX );
        if( source === -1 ){ // No missiles left
            return;
        } else {
            this.whatchedMissiles.splice(index, 1);
            this.pointedMissiles.push(missile);
        }
#BEGIN_EDITABLE#

        /* Risolvo il sistema per trovare il punto in cui si incontreranno i 2 missile dopo lo stesso tempo di volo */
        var a = - Math.pow(12,2) + Math.pow(missile.dx,2) + Math.pow(missile.dy,2);
        var b = (2 * missile.x * missile.dx) + (2 * missile.y * missile.dy) - (2 * missile.dx * antiMissileBatteries[source].x) - (2 * missile.y * antiMissileBatteries[source].y);
        var c = Math.pow(missile.x,2) + Math.pow(missile.y,2) + Math.pow(antiMissileBatteries[source].x,2) + Math.pow(antiMissileBatteries[source].y,2) - (2 * antiMissileBatteries[source].x * missile.x) - (2 * missile.y * antiMissileBatteries[source].y);
        var nf = - b - Math.sqrt(Math.pow(b,2) - (4 * a * c));

        var xShoot = missile.x + missile.dx * nf;
        var yShoot = missile.y + missile.dy * nf;
        playerMissiles.push( new PlayerMissile( source, xShoot, yShoot ) );
        console.log("missile sparato");
    }).bind(this));
#END_EDITABLE#
};
#START_OF_GOAL_FUNCTION#

#END_OF_GOAL_FUNCTION#
