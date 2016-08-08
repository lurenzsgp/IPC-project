// Editor class
var Editor = function () {
    // varaibles
    this.symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'start_goal_function':'#START_OF_GOAL_FUNCTION#',
        'end_goal_function':'#END_OF_GOAL_FUNCTION#'
    };
    this.editableLines = [];
    this.cm = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
		styleActiveLine: true,
	    matchBrackets: true,
		showTrailingSpace: true,
	    autoCloseBrackets: true,
		extraKeys: {"Ctrl-Space": "autocomplete"},
        mode: "javascript"
    });
}

Editor.prototype.resize = function (h,w) {
    this.cm.setSize(w,h);
}

Editor.prototype.loadCode = function (lvl) {
    var code = "";
    var scope = this; // serve a fissare lo scope per utilizzare variabili della classe all'interno di funzioni che cambiano il contesto
    $.ajax({
      url: "lvl/lvl" + lvl + ".jsx",
      async: false,
      dataType: "text",
      success: function (data){
          code = data;
      }
    });

    code = this.preprocessor(code);
    this.cm.setValue(code);

    this.cm.on('beforeChange',function(cm,change) {
        if (scope.editableLines.indexOf(change.from.line) === -1 ) {
            change.cancel();
        }
    });

    this.cm.eachLine(function (line) {
        var i = scope.cm.getLineNumber(line);
        if (scope.editableLines.indexOf(i) === -1) {
            scope.cm.addLineClass(line, "wrap", "disabled");
        }
    });

    this.cm.refresh();
}


// preprocesses code,determines the location
// of editable lines, loads goal function
Editor.prototype.preprocessor = function (code) {

    this.editableLines = [];
    var goalString = "";
    var lineArray = code.split("\n");
    var inEditableBlock = false;
    var inGoalFunctionBlock = false;

    for (var i = 0; i < lineArray.length; i++) {
        var currentLine = lineArray[i];

        // process editable lines and sections
        if (currentLine.indexOf(this.symbols.begin_line) === 0) {
            lineArray.splice(i,1);
            i--;
            inEditableBlock = true;
        } else if (currentLine.indexOf(this.symbols.end_line) === 0) {
            lineArray.splice(i,1);
            i--;
            inEditableBlock = false;
        }
        // process start of GoalFunction()
        else if (currentLine.indexOf(this.symbols.start_goal_function) === 0) {
            lineArray.splice(i,1);
            inGoalFunctionBlock = true;
            i--;
        }
        // process end of GoalFunction()
        else if (currentLine.indexOf(this.symbols.end_goal_function) === 0) {
            lineArray.splice(i,1);
            inGoalFunctionBlock = false;
            i--;
        }
        // everything else
        else {
            if (inEditableBlock) {
                this.editableLines.push(i);
            }
            // save goalFunction() code
            if (inGoalFunctionBlock) {
                goalString += currentLine;
                lineArray.splice(i,1);
                i--;
            }
        }

        Editor.prototype.goalFunction = new Function(goalString);
    }

    return lineArray.join("\n");
}

