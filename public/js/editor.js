// Editor class
var self;

var Gamelevel = function () {};

var Editor = function () {
    // variables
    this.symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'line_general_chat':'#LINE_GENERAL#',
        'line_oldman_chat':'#LINE_OLDMAN#',
        'line_defense_missiles':'#LINE_AMOUNT_DEFENSE_MISSILES#',
        'line_amount_missiles':'#LINE_AMOUNT_ENEMY_MISSILES#',
        'line_speed_missiles':'#LINE_SPEED_ENEMY_MISSILES#',
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
		gutters: ["CodeMirror-lint-markers"],
		lint: true,
		lineWrapping: true,
        mode: "javascript"
    });
    this.numPanels = 0;
    this.panels = {};

	self = this;
}

// functions
Editor.prototype.resize = function (h,w) {
    this.cm.setSize(w,h);
}

Editor.prototype.loadCode = function (lvl) {
    var code = "";

    $.ajax({
      url: "lvl/lvl" + lvl + ".jsx",
      async: false,
      dataType: "text",
      success: function (data){
          code = data;
      }
    });

    // used to reset code
    this.cm.clearHistory();

	this.cm.off('beforeChange', this.enforceRestrictions);
    code = this.preprocessor(code);
    this.cm.setValue(code);

	this.cm.on('beforeChange', this.enforceRestrictions);

    this.cm.eachLine(function (line) {
        var i = self.cm.getLineNumber(line);
        if (self.editableLines.indexOf(i) === -1) {
            self.cm.addLineClass(line, "wrap", "disabled");
        }
    });

    this.cm.refresh();
	this.defineFunction();
}

Editor.prototype.getCode = function () {
	var code = this.cm.getValue("\n");
	var line = code.split("\n");

    // console.log("testo: " + code);
	while (line[0].indexOf('function') === -1) {
		line.shift();
	}

	// nome della funzione
	var part = line[0].split(" ");
	var fName = part[part.indexOf('=') - 1];

	// lista degli argomenti
	var argList = code.split('(')[1].split(')')[0].split(',');

	// rimuovo la definizione della funzione
	line.shift();

	var codeLine = [];

	while (line[0].indexOf('};') === -1) {
		var l = line.shift();
		l = l.replace(/'/g, "\\'");
		l = l.replace(/"/g, "\\\"");
		l = l.replace(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g, ""); // rimuove i commenti
		codeLine.push(l);
	}
	var nLines = codeLine.length;
	var body = codeLine.join(" ");

	return {
		name: fName,
		args: argList,
		body: body,
		numLines: nLines
	};
}

// preprocesses code, determines the location
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
        } else if (currentLine.indexOf(this.symbols.line_general_chat) === 0) {
            lineArray.splice(i,1);
            eval("Gamelevel.prototype.generalMessage = " + lineArray.splice(i,1) + ";");
            i--;
        } else if (currentLine.indexOf(this.symbols.line_oldman_chat) === 0) {
            lineArray.splice(i,1);
            eval("Gamelevel.prototype.oldmanMessage = " + lineArray.splice(i,1) + ";");
            i--;
        } else if (currentLine.indexOf(this.symbols.line_defense_missiles) === 0) {
            lineArray.splice(i,1);
            eval("Gamelevel.prototype.missilesDefense = " + lineArray.splice(i,1) + ";");
            i--;
        } else if (currentLine.indexOf(this.symbols.line_speed_missiles) === 0) {
            lineArray.splice(i,1);
            eval("Gamelevel.prototype.missilesSpeed = " + lineArray.splice(i,1) + ";");
            i--;
        } else if (currentLine.indexOf(this.symbols.line_amount_missiles) === 0) {
            lineArray.splice(i,1);
            eval("Gamelevel.prototype.missilesAmount = " + lineArray.splice(i,1) + ";");
            i--;
        }
        // everything else
        else {
            if (inEditableBlock) {
                this.editableLines.push(i);
            }
            // save goalFunction() code
            if (inGoalFunctionBlock) {

				currentLine = currentLine.replace(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g, ""); // rimuove i commenti

                goalString += currentLine;
                lineArray.splice(i,1);
                i--;
            }
        }
    }

	Gamelevel.prototype.goalFunction = new Function("f", goalString);

    return lineArray.join("\n");
};

// editable line
Editor.prototype.findEndOfSegment = function(line) {
    // Given an editable line number, returns the last line of the
    // given line's editable segment.

    if (this.editableLines.indexOf(line + 1) === -1) {
        // console.log("find end of segment");
        return line;
    }

    return this.findEndOfSegment(line + 1);
};

var shiftLinesBy = function(array, after, shiftAmount) {
    // Shifts all line numbers strictly after the given line by
    // the provided amount.

    return array.map(function(line) {
        if (line > after) {
            log('Shifting ' + line + ' to ' + (line + shiftAmount));
            return line + shiftAmount;
        }
        return line;
    });
};

// enforces editing restrictions when set as the handler
// for the 'beforeChange' event
Editor.prototype.enforceRestrictions = function(instance, change) {
    lastChange = change;

    var inEditableArea = function(c) {
        if (self.editableLines.indexOf(c.to.line) !== -1 && self.editableLines.indexOf(c.from.line) !== -1) {
            // editable lines?
            return true;
        } else {
            return false;
        }
    };

    // console.log(
    //     '---Editor input (beforeChange) ---\n' +
    //     'Kind: ' + change.origin + '\n' +
	//     'Number of lines: ' + change.text.length + '\n' +
    //     'From line: ' + change.from.line + '\n' +
    //     'To line: ' + change.to.line
    // );


    if (!inEditableArea(change)) {
        change.cancel();
    } else if (change.to.line < change.from.line ||
               change.to.line - change.from.line + 1 > change.text.length) { // Deletion
        self.updateEditableLinesOnDeletion(change);
    } else { // Insert/paste
        // First line already editable
        var newLines = change.text.length - (change.to.line - change.from.line + 1);

        if (newLines > 0) {
            if (self.editableLines.indexOf(change.to.line) < 0) {
                change.cancel();
                return;
            }

            // updating line count
            newLines = change.text.length - (change.to.line - change.from.line + 1);

            self.updateEditableLinesOnInsert(change, newLines);
        }
    }

    // console.log(self.editableLines);
}

Editor.prototype.updateEditableLinesOnInsert = function(change, newLines) {
    var lastLine = this.findEndOfSegment(change.to.line, this);

    // Shift editable line numbers after this segment
    this.editableLines = shiftLinesBy(this.editableLines, lastLine, newLines);


	if (change.origin !== 'undo' && change.origin !== 'redo')
    // console.log("Appending " + newLines + " lines");

    // Append new lines
    for (var i = lastLine + 1; i <= lastLine + newLines; i++) {
        this.editableLines.push(i);
    }
};

Editor.prototype.updateEditableLinesOnDeletion = function(changeInput) {
    // Figure out how many lines just got removed
    var numRemoved = changeInput.to.line - changeInput.from.line - changeInput.text.length + 1;
    // Find end of segment
    var editableSegmentEnd = this.findEndOfSegment(changeInput.to.line);
    // Remove that many lines from its end, one by one
    for (var i = editableSegmentEnd; i > editableSegmentEnd - numRemoved; i--) {
        // console.log('Removing\t' + i);
        this.editableLines.splice(this.editableLines.indexOf(i),1);
    }
    // Shift lines that came after
    this.editableLines = shiftLinesBy(this.editableLines, editableSegmentEnd, -numRemoved);
};

// addon Panels
Editor.prototype.makePanel = function(where, text) {
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
	label.textContent = text;
	return node;
}

Editor.prototype.addPanel = function(where, text) {
	var node = this.makePanel(where, text);
	this.panels[node.id] = this.cm.addPanel(node, {position: where});
    return node;
}

Editor.prototype.removePanels = function(id) {
	this.panels[id].clear();
}

Editor.prototype.replacePanel = function(form) {
	var id = form.elements.panel_id.value;
	var panel = this.panels["panel-" + id];
	var node = makePanel("");

	this.panels[node.id] = this.cm.addPanel(node, {replace: panel, position: "after-top"});
	return false;
}

Editor.prototype.resetCode = function () {
	this.loadCode(level);
    // riavvio il livello
    stopLevel();
    missileCommand(true);
}

Editor.prototype.applySolution = function () {
    // leggi il codice dall'editor e sostituiscilo all'interno di missile command
	var f = this.getCode();

    eval("f.body = solution" + level + ";");
	// devo ridefinire la funzione
	// console.log(f.name);
	// console.log(f.args);
	// console.log(f.body);

    eval(f.name + " = new Function('" + f.args.join(',') +"', '" + f.body +"')");
}

Editor.prototype.defineFunction = function (fName) {
    // leggi il codice dall'editor e sostituiscilo all'interno di missile command
	var f = this.getCode();

    if (fName !== undefined) {
        if (f.name.indexOf('prototype') === -1) {
            f.name = fName;
        } else {
            f.name = f.name.slice( 0, f.name.lastIndexOf('.') + 1 ) + fName;
        }
    }
	// devo ridefinire la funzione
	// console.log(f.name);
	// console.log(f.args);
	// console.log(f.body);

    eval(f.name + " = new Function('" + f.args.join(',') +"', '" + f.body +"')");
}

// Rende eseguibile la funzione scritta nell'editor e poi esegue la goal function
Editor.prototype.execCode = function () {
    try {
        this.defineFunction("testFunction");

        var f = this.getCode();
        // esegui la goal function per vedere se il livello puo' ritenersi superato
        try {
            gamelevel.goalFunction(f.name);
        } catch(e) {
            console.log(e);
            newmsg("oldman", ["I think that are some syntax or logic errors in your code...", "Or maybe it's only slow.", "Check it and try to execute it again."], {});
        }
    } catch (e) {
        console.log(e);
        newmsg("system",["FATAL ERROR OCCURED!", "I CAN'T EXECUTE YOUR CODE DUE SYNTAX ERRORS."],{});
    }


    // riavvio il livello
    stopLevel();
    missileCommand(false);

}
