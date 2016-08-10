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

    this.cm.on('change', this.trackUndoRedo);
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

    // this.cm.on('beforeChange', function (cm,change) {
    //     if (scope.enableChange)
    //         return;
    //     if (scope.editableLines.indexOf(change.from.line) === -1 ) {
    //         change.cancel();
    //     }
    // });

    this.cm.eachLine(function (line) {
        var i = scope.cm.getLineNumber(line);
        if (scope.editableLines.indexOf(i) === -1) {
            scope.cm.addLineClass(line, "wrap", "disabled");
        }
    });

    this.cm.refresh();
    this.enableChange = false;
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

// editable line
Editro.prototype.findEndOfSegment = function(line) {
    // Given an editable line number, returns the last line of the
    // given line's editable segment.

    if (this.editableLines.indexOf(line + 1) === -1) {
        return line;
    }

    return findEndOfSegment(line + 1);
};

Editor.prototype.shiftLinesBy = function(array, after, shiftAmount) {
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
        if (scope.enableChange)
                return true;
        var lineNum = c.to.line;
        if (this.editableLines.indexOf(lineNum) !== -1 && this.editableLines.indexOf(c.from.line) !== -1) {
            // editable lines?
            return true;
        } else {
            return false;
        }
    };

    log(
        '---Editor input (beforeChange) ---\n' +
        'Kind: ' + change.origin + '\n' +
        'Number of lines: ' + change.text.length + '\n' +
        'From line: ' + change.from.line + '\n' +
        'To line: ' + change.to.line
    );

    if (!inEditableArea(change)) {
        change.cancel();
    } else if (change.to.line < change.from.line ||
               change.to.line - change.from.line + 1 > change.text.length) { // Deletion
        this.updateEditableLinesOnDeletion(change);
    } else { // Insert/paste
        // First line already editable
        var newLines = change.text.length - (change.to.line - change.from.line + 1);

        if (newLines > 0) {
            if (this.editableLines.indexOf(change.to.line) < 0) {
                change.cancel();
                return;
            }

            // updating line count
            newLines = change.text.length - (change.to.line - change.from.line + 1);

            this.updateEditableLinesOnInsert(change, newLines);
        }
    }

    log(editableLines);
}

Editor.prototype.updateEditableLinesOnInsert = function(change, newLines) {
    var lastLine = findEndOfSegment(change.to.line);

    // Shift editable line numbers after this segment
    this.editableLines = this.shiftLinesBy(this.editableLines, lastLine, newLines);


    log("Appending " + newLines + " lines");

    // Append new lines
    for (var i = lastLine + 1; i <= lastLine + newLines; i++) {
        this.editableLines.push(i);
    }
};

Editor.prototype.updateEditableLinesOnDeletion = function(changeInput) {
    // Figure out how many lines just got removed
    var numRemoved = changeInput.to.line - changeInput.from.line - changeInput.text.length + 1;
    // Find end of segment
    var editableSegmentEnd = findEndOfSegment(changeInput.to.line);
    // Remove that many lines from its end, one by one
    for (var i = editableSegmentEnd; i > editableSegmentEnd - numRemoved; i--) {
        log('Removing\t' + i);
        this.editableLines.remove(i);
    }
    // Shift lines that came after
    editableLines = this.shiftLinesBy(this.editableLines, editableSegmentEnd, -numRemoved);

};

// beforeChange events don't pick up undo/redo
// so we track them on change event
Editor.prototype.trackUndoRedo = function(instance, change) {
    if (change.origin === 'undo' || change.origin === 'redo') {
        this.enforceRestrictions(instance, change);
    }
}

//---------------------

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
