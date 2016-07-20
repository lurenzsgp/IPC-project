var editor = (function() {
    // varaibles
    var ed = new Object;

    var initialize = function() {
        ed = CodeMirror.fromTextArea(document.getElementById("code"), {
          lineNumbers: true,
          extraKeys: {"Ctrl-Space": "autocomplete"},
          mode: {name: "javascript", globalVars: true}
        });
        ed.setSize(600,400);
    }

    var loadCode = function (lvl) {
        $.get( "lvl/lvl" + lvl + ".js", function( data ) {
          ed.setValue(data);
        // ed.setValue("inserisco il codice del livello 1!!")
    }, "text");
    }

    return {
        initialize: initialize,
        loadCode: loadCode
    }
})();
