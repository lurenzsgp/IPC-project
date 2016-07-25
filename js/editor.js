var editor = (function() {
    // varaibles
    var symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'start_goal_function':'#START_OF_GOAL_FUNCTION#',
        'end_goal_function':'#END_OF_GOAL_FUNCTION#'
    };
    var cm = {};
    var editableLines = [];
    // mi salva la funzione al momento dell'iniliziazione di editor
    var goalFunction = new Function();

    var initialize = function() {
        cm = CodeMirror.fromTextArea(document.getElementById("code"), {
          lineNumbers: true,
          mode: "javascript"
        });

        cm.setSize(600,400);
    }

    var loadCode = function (lvl) {
        $.get( "lvl/lvl" + lvl + ".jsx", function( data ) {
          data = preprocessor(data);
          cm.setValue(data);

          cm.on('beforeChange',function(cm,change) {
              if ( editableLines.indexOf(change.from.line) === -1 ) {
                  change.cancel();
              }
          });

          cm.eachLine(function (line) {
             var i = cm.getLineNumber(line);
             if (editableLines.indexOf(i) === -1) {
                 cm.addLineClass(line, "wrap", "disabled");
             }
          });
          cm.refresh();
        }, "text");

        return goalFunction;
    }

    // preprocesses code,determines the location
    // of editable lines, loads goal function
    var preprocessor = function (code) {
        editableLines = [];
        var goalString = "";
        var lineArray = code.split("\n");
        var inEditableBlock = false;
        var inGoalFunctionBlock = false;

        for (var i = 0; i < lineArray.length; i++) {
            var currentLine = lineArray[i];

            /* splice e i-- servono a eliminare dal codice i symboli aggiunti per riconoscere la sintassi */

            // process editable lines and sections
            if (currentLine.indexOf(symbols.begin_line) === 0) {
                lineArray.splice(i,1);
                i--;
                inEditableBlock = true;
            } else if (currentLine.indexOf(symbols.end_line) === 0) {
                lineArray.splice(i,1);
                i--;
                inEditableBlock = false;
            }
            // process start of GoalFunction()
              else if (currentLine.indexOf(symbols.start_goal_function) === 0) {
                lineArray.splice(i,1);
                inGoalFunctionBlock = true;
                i--;
            }
            // process end of GoalFunction()
              else if (currentLine.indexOf(symbols.end_goal_function) === 0) {
                lineArray.splice(i,1);
                inGoalFunctionBlock = false;
                i--;
            }
            // everything else
              else {
                if (inEditableBlock) {
                    editableLines.push(i);
                }
                // save goalFunction() code
                if (inGoalFunctionBlock) {
                    goalString += currentLine;
                    lineArray.splice(i,1);
                    i--;
                }
            }
            goalFunction = new Function(goalString);
        }

        return lineArray.join("\n");
    }

    return {
        initialize: initialize,
        loadCode: loadCode,
        goalFunction : goalFunction
    }
})();
