var editor = (function() {
    // varaibles
    var cm = {};
    var editableLines = [];

    var initialize = function() {
        cm = CodeMirror.fromTextArea(document.getElementById("code"), {
          lineNumbers: true,
          mode: "javascript"
        });

        cm.setSize(600,400);
    }

    var loadCode = function (lvl) {
        $.get( "lvl/lvl" + lvl + ".js", function( data ) {
          cm.setValue(data);

          editableLines = [3,4,5];

          cm.eachLine(function (line) {
             var i = cm.getLineNumber(line);
             if (editableLines.indexOf(i) === -1) {
                 cm.addLineClass(line, "wrap", "disabled");
             }
          });
          cm.refresh();
        }, "text");
    }

    return {
        initialize: initialize,
        loadCode: loadCode
    }
})();
