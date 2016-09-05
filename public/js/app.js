var editor = {};

function startTutorial(){
	introJs().setOptions({
		'skipLabel': 'Salta',
		'showStepNumbers': 'false',
		'scrollToElement': 'true',
		steps:[
			  {
			  	intro: "<img src='img/recruit.png' class='portrait'/>Benvenuto recluta! <p>Questa piccola introduzione ti guiderà attraverso gli elementi dell'interfaccia.</p>"
			  },
              {
                element: document.querySelector('#mc-container'),
                intro: "<img src='img/recruit.png' class='portrait'/>Questo è il gioco, cliccaci sopra per iniziare il livello.",
                position: "right"
              },
              {
              	element: document.querySelector('#editor-container'),
              	intro: "<img src='img/recruit.png' class='portrait'/>Questo è l'editor. Qui dovrai modificare il codice del gioco per renderlo funzionante.",
              	position: "bottom"
              },
              {
              	element: document.querySelector('#ButtonExecCode'),
              	intro: "<img src='img/recruit.png' class='portrait'/>Clicca qui per eseguire il codice contenuto nell'editor.",
              	position: "left"
              },
              {
              	element: document.querySelector('#ButtonResetCode'),
				intro: "<img src='img/recruit.png' class='portrait'/>Clicca qui per ripristinare il codice. Attenzione! Le tue modifiche verranno perse.",
				position: "left"
              },
              {
            	element: document.querySelector('#ButtonGetHelp'),
				intro: "<img src='img/recruit.png' class='portrait'/>Clicca qui per visualizzare un suggerimento.",
				position: "left"
			  },
              {
            	element: document.querySelector('#chat-panel'),
				intro: "<img src='img/recruit.png' class='portrait'/>Questa è la chat. Qui troverai ordini e consigli su come affrontare ogni livello.",
				position: "bottom"
			  },
              {
                element: document.querySelector('#levels'),
                intro: "<img src='img/recruit.png' class='portrait'/>Qui potrai navigare tra i livelli completati.",
                position: "right"
              },
              {
                element: document.querySelector('#user'),
                intro: "<img src='img/recruit.png' class='portrait'/>Qui potrai visualizzare il tuo profilo.",
                position: "right"
              },
            ]
	}).start();
}

$(document).ready(function () {
	// attiva i popover
	$('[data-toggle="popover"]').popover();

	// attiva Intro.JS
	startTutorial();

	//attiva i tooltip di bootstrap sulla classe btn
    $('.btn').tooltip()
	
	// CodeMirror
    editor = new Editor();
    editor.loadCode(level);

	// Missile Command
    missileCommand();

	// CodeMirror: addon Panel
	editor.addPanel("bottom", "Panel per feedback ad editor");

	// CodeMirror: addon Autocomplete
	if (typeof Promise !== undefined) {
	  var comp = [
		["here", "hither"],
		["asynchronous", "nonsynchronous"],
		["completion", "achievement", "conclusion", "culmination", "expirations"],
		["hinting", "advive", "broach", "imply"],
		["function","action"],
		["provide", "add", "bring", "give"],
		["synonyms", "equivalents"],
		["words", "token"],
		["each", "every"],
	  ]

	  function synonyms(cm, option) {
		return new Promise(function(accept) {
		  setTimeout(function() {
			var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
			var start = cursor.ch, end = cursor.ch
			while (start && /\w/.test(line.charAt(start - 1))) --start
			while (end < line.length && /\w/.test(line.charAt(end))) ++end
			var word = line.slice(start, end).toLowerCase()
			for (var i = 0; i < comp.length; i++) if (comp[i].indexOf(word) != -1)
			  return accept({list: comp[i],
							 from: CodeMirror.Pos(cursor.line, start),
							 to: CodeMirror.Pos(cursor.line, end)})
			return accept(null)
		  }, 100)
		})
	  }
	}

	editor.execCode = editor.execCode.bind(editor);
	editor.resetCode = editor.resetCode.bind(editor);
    $("#ButtonExecCode").click(editor.execCode);
    $("#ButtonResetCode").click(editor.resetCode);
});

$('[data-target="#accountModal"]').click(function () {
	$.get('/getUserData', function (data) {
		var levelWidth = (data.level - 1) / 9 * 100;
		$('.progress-bar').attr("aria-valuenow", levelWidth).width(levelWidth + "%").text(data.level - 1);
		$('[name="score"]').text(data.score);
		
		//$('#imgAvatar').attr('src', 'img/avatars/' + data.username );
		
		$.ajax({
			url: 'img/avatars/' + data.username, 
			success: function(d){
				console.log(data.username);
				$('#imgAvatar').attr('src', 'img/avatars/' + data.username );
			},
			error: function(d){
				$('#imgAvatar').attr('src', 'img/default-avatar.png');
			},
		})
	});
	$.get('/getLeaderboard', function (data) {
		$('#leaderboard > tbody > tr').remove();
		$.each(data, function(index, el) {
			var i = index + 1;
			$('#leaderboard > tbody').append('<tr><th scope="row">' + i +'</th><td>' + el.username + '</td><td>' + el.score + '</td></tr>');
		});
	});
});
