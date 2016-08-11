// Editor class
var Editor = function () {
    // variables
	this.panels = {};
	this.numPanels = 0;
    this.symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'start_goal_function':'#START_OF_GOAL_FUNCTION#',
        'end_goal_function':'#END_OF_GOAL_FUNCTION#'
    };
    this.editableLines = [];
    this.enableChange = false;
    this.cm = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
		styleActiveLine: true,
	    matchBrackets: true,
		showTrailingSpace: true,
	    autoCloseBrackets: true,
		extraKeys: {"Ctrl-Space": "autocomplete"},
		gutters: ["CodeMirror-lint-markers"],
		lint: true,
        mode: "javascript"
    });
}

// functions
Editor.prototype.resize = function (h,w) {
    this.cm.setSize(w,h);
}

Editor.prototype.setHeight = function(h) {
    this.cm.setSize(this.cm.width, h);
}

Editor.prototype.setWidth = function(w) {
    this.cm.setSize(w, this.cm.height);
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

    this.enableChange = true;
    // used for reset code
    this.cm.clearHistory();

    code = this.preprocessor(code);
    this.cm.setValue(code);

    this.cm.on('beforeChange', function (cm,change) {
        if (scope.enableChange)
            return;
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
    this.enableChange = false;
}

Editor.prototype.getCode = function () {
	var line = this.cm.getValue('\n');

	// TODO le linee non sono divise ma sono una stringa unica
	while (line[0].indexOf('function') === -1) {
		line.slice();
	}

	// nome della funzione
	var part = line[0].split(" ");
	var fName = part[part.indexOf('var') + 1];

	// lista degli argomenti
	var argList = line.split('(')[1].split(')')[0].split(',');

	// corpo della funzione
	var endFunction = line.indexOf('};');
	line.splice(endFunction, line.length - endFunction);
	var code = line.join();

	return {
		name: fName,
		args: argList,
		body: code
	};
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

// addon Panels
Editor.prototype.makePanel = function(where) {
	var node = document.createElement("div");
	var id = ++this.numPanels;
	var localPanels = this.panels;
	var widget, close, label;

	node.id = "panel-" + id;
	node.className = "cm-panel " + where;

	close = node.appendChild(document.createElement("a"));
	close.setAttribute("title", "Remove me!");
	close.setAttribute("class", "remove-panel");
	close.textContent = "✖";
	CodeMirror.on(close, "click", function() {
		localPanels[node.id].clear();
	});

	this.panels = localPanels;
	label = node.appendChild(document.createElement("span"));
	label.textContent = "I'm panel n°" + id;
	return node;
}

Editor.prototype.addPanel = function(where) {
	var node = this.makePanel(where);
	this.panels[node.id] = this.cm.addPanel(node, {position: where});
}

Editor.prototype.updatePanels = function(id) {
	console.log("Removing...");
	this.panels[id].clear();
}

Editor.prototype.replacePanel = function(form) {
	var id = form.elements.panel_id.value;
	var panel = this.panels["panel-" + id];
	var node = makePanel("");

	this.panels[node.id] = this.cm.addPanel(node, {replace: panel, position: "after-top"});
	return false;
}
