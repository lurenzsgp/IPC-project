$(document).ready(function () {
    var editor = new Editor();
    editor.resize(400,600);
    editor.loadCode(1);

    missileCommand.initialize();
    missileCommand.setupListeners();
});
