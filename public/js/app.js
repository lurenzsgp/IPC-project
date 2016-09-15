var editor = {};
var DEFAULT_TYPE_IT_SPEED = 50;
var DEFAULT_TYPE_IT_DELAY = 500;

function startTutorial(){
	introJs().setOptions({
		'skipLabel': 'Skip',
		'showStepNumbers': 'false',
		'scrollToElement': 'true',
		steps:[
			  {
			  	intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<h4>Greetings, Recruit!<h4>"+
			  		"<p>Welcome to <strong>Fortress Bastiani</strong>.</p>" +
			  		"<p>Your job here is to fix and operate the anti-missile system. I'll give you a quick introduction so you can get to work as soon as possible.</p>"+
			  		"<p>We don't have much time, the Enemy will strike soon!</p>" +
		  		"</div>"
			  },
              {
                element: document.querySelector('#mc-container'),
                intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>Missile Command Interface.</b></p>"+
			  		"<p>Click on it to control the antimissile batteries and stop the attacks.</p>" +
		  		"</div>",
                position: "right"
              },
              {
              	element: document.querySelector('#editor-container'),
              	intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>Editor</b>.</p>" +
			  		"<p>Here you can look at the system code and fix its problems in order to stop the attacks.</p>"+
		  		"</div>",
              	position: "bottom"
              },
              {
              	element: document.querySelector('#ButtonExecCode'),
              	intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This button allows you to <b>execute</b> the code once you modify it.</p>" +
		  		"</div>",
              	position: "left"
              },
              {
              	element: document.querySelector('#ButtonResetCode'),
				intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This button allows you to <b>revert</b> back to the original code if your changes don't satisfy you.</p>" +
		  		"</div>",
				position: "left"
              },
              {
            	element: document.querySelector('#ButtonGetHelp'),
				intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>In case you are stuck you can ask the old mechanic. I'm sure he can give you some <b>help</b>.</p>" +
		  		"</div>",
				position: "left"
			  },
              {
            	element: document.querySelector('#chat-panel'),
				intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>message area</b>, where you will recieve your orders directly from me.</p>" +
		  		"</div>",
				position: "bottom"
			  },
              {
                element: document.querySelector('#levels'),
                intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>Here you will find all the <b>levels</b> already completed.</p>" +
		  		"</div>",
                position: "right"
              },
              {
                element: document.querySelector('#user'),
                intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>profile page</b>.</p>"+
			  		"<p>Here you will find all of your personal information and progress.</p>" +
		  		"</div>",
                position: "right"
              },
              {
                intro: "<img src='img/general.png' class='portrait general'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>That's all for now.</p>"+
			  		"<p>Go defeat these <b>Barbarians</b>!</p>"+
		  		"</div>",
                position: "bottom"
              }
            ]
	}).oncomplete(function() {
		unlockBadge("Tutorial", "Tutorial complete");
		loadChat();
	}).onexit(function() {
		loadChat();
	}).start();
}

$(document).ready(function () {
	// attiva i popover
	$('[data-toggle="popover"]').popover();

	// attiva Intro.JS o carica la chat del livello corrente
	if (level === 1) {
		startTutorial();
	} else {
		loadChat();
	}

	//attiva i tooltip di bootstrap sulla classe btn
    $('.btn').tooltip()

	// CodeMirror
    editor = new Editor();
    editor.loadCode(level);

	// Missile Command
    missileCommand();

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
    $("#ButtonExecCode").click(function() {
	    var panel = editor.addPanel("bottom", "Code updated.");
		window.setTimeout(editor.removePanels.bind(editor), 3000, panel.id);
		editor.execCode();
	});
    $("#ButtonResetCode").click(function () {
		var panel = editor.addPanel("bottom", "Code reloaded.");
		window.setTimeout(editor.removePanels.bind(editor), 3000, panel.id);
		editor.resetCode();
	});
});

$("#level-selector").find('.btn').click( function() {
	$(".btn-primary").removeClass('btn-primary');
	$(this).addClass('btn-primary');

	var lvl = $(this).text();

	$('.level-description').children('h3').html("Level " + lvl.toString());
	$(".level-description").children("p").html("");

	$.getJSON("lvl/levels-chat.json", function(data){
		$.each(data.text[lvl - 1], function(index, value){
			$(".level-description").append("<p>" + value +"</p>");
		});
	});
});

$("#load-level-btn").click(function(){
	editor.applySolution();
	var lvl = $(".btn-primary").text();
	level = parseInt(lvl);

	loadChat();
	editor.loadCode(level);
	missileCommand(true);
});

function loadChat() {
	$("#chat-panel > .panel-heading").html("Level " + level);
	$("#chat-body").html("");
	
	// get chat texts from JSON file
	if (level === 1) {
		// livello 1: primo messaggio del generale + introduzione del vecchio pazzo
		$.getJSON("lvl/levels-chat.json", function(data) {
			newmsg("general", data.text[level - 1], {
				'callback': function() {
					$.getJSON("lvl/hints-chat.json", function(hints) {
						newmsg("oldman", hints.text[0], {
							'startDelay': 1500
						});
					});
				}
			});
		});
	} else if (level !== 10) {
		// livelli 2-9: messaggi del generale relativi ai diversi livelli
		$.getJSON("lvl/levels-chat.json", function(data) {
			newmsg("general", data.text[level - 1], {});
		});
	} else {
		// livello 10: messaggi conclusivi del generale
		$.getJSON("lvl/final-chat.json", function(data) {
			newmsg("general", data.text[0], {
				'callback': function() {
					newmsg("general", data.text[1], {
						'startDelay': 1000,
						'callback': function() {
							newmsg("general", data.text[2], {
								'startDelay': 1200
							});
						}
					});
				}
			});
		});
	}
}

function loadHints() {
	$("#chat-panel > .panel-heading").html("Level " + level);
	
	// get hints text from JSON file
	$.getJSON("lvl/hints-chat.json", function(data){
		var txt = data.text[level];
		newmsg("oldman", txt, {});
	});
}

$('#user').click(function () {
	var levelWidth = (maxLevel - 1) / 9 * 100;
	$('.progress-bar').attr("aria-valuenow", levelWidth).width(levelWidth + "%").text(Math.round(levelWidth) + "%");
	$('[name="score"]').text(score + " pts");
	$('#imgAlert').hide();

	$.get('/getUserBadge', function(data) {
		$.each(data, function (index, el) {
			enableBadge(el.name);
		});
	});

	$.get('/getLeaderboard', function (data) {
		$('#leaderboard > tbody > tr').remove();
		$.each(data, function(index, el) {
			var i = index + 1;
			$('#leaderboard > tbody').append('<tr><th scope="row">' + i +'</th><td>' + el.username + '</td><td>' + el.score + '</td></tr>');
		});
	});
});


$(function(){
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});

$('#buttonDeleteAvatar').click( function(){
	$.get('/deleteAvatar', function(data){
		if (data.error) {
			$('#imgAlert').removeClass().addClass('alert alert-dismissible fade in alert-danger');
			$('#imgAlert > p').text(data.message);
			$('#imgAlert').show();
		}else{
			$('#imgAlert').removeClass().addClass('alert alert-dismissible fade in alert-success');
			$('#imgAlert > p').text(data.message);
			$('#imgAlert').show();
			$('#imgAvatar').delay(800).attr('src', 'img/recruit.png');
		}
	});
});

$('#inputAvatarFile').on("change", function(){
var data = new FormData($('#formUpdateAvatar')[0]);
console.log("Updating the user's avatar...");

	jQuery.ajax({
		url: '/updateAvatar',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(data){
			if (data.error) {
				$('#imgAlert').removeClass().addClass('alert alert-dismissible fade in alert-danger');
				$('#imgAlert > p').text(data.message);
				$('#imgAlert').show();
			}else{
				$('#imgAlert').removeClass().addClass('alert alert-dismissible fade in alert-success')
				$('#imgAlert > p').text(data.message);
				$('#imgAlert').show();
				$('#imgAvatar').delay(800).attr('src', 'img/avatars/' + data.username + "?" + new Date().getTime());
			}
		}
	});
});

$('#levels').click(function () {
	var button = $('#level-selector > div > a');
	$.each(button, function (index, el) {
		if (index < level ) {
			$(el).removeClass('disabled');
		}
	})
});

// rende graficamente sbloccato il badge utente
function enableBadge (name) {
	$('[name="' + name + '"]').removeClass('badge-lock');
}

function unlockBadge (badgeId, badgeDescription) {
	$.post('/checkBadge', { name: badgeId}, function (badge) {
		if (!badge.unlock) {
			$.post('/unlockBadge', { name: badgeId});
			$("#badgesModal").modal();
			$("#badge-description").append(badgeDescription);
		}
	})
}

function newmsg (character, strings, options) {
	var portrait = "<img class='" + character + " portrait' src='/img/" + character + ".png'/>";
	var div = "<div class='msg " + character + "'>" + portrait + "<span></span>" +"</div>"
	var chat = $('#chat-body');
	
	chat.append(div);
	chat.scrollTop(chat.height());
	if (options['callback']) {
		chat.find("span").last().typeIt({
			strings: strings,
			speed: options['speed'] ? options['speed'] : DEFAULT_TYPE_IT_SPEED,
			startDelay: options['startDelay'] ? options['startDelay'] : DEFAULT_TYPE_IT_DELAY,
			callback: options['callback']
		});
	} else {
		chat.find("span").last().typeIt({
			strings: strings,
			speed: options['speed'] ? options['speed'] : DEFAULT_TYPE_IT_SPEED,
			startDelay: options['startDelay'] ? options['startDelay'] : DEFAULT_TYPE_IT_DELAY
		});
	}

}	
