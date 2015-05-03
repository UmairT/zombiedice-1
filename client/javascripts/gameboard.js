var socket;

var main = function() {
	"use strict";
	
	socket = io('http://localhost:3000/ingame');

	$('#stop').click(function(){
       stop();
    });
	
	//Login
	$("#lobbyreturn").click(function() {
		$(location).attr('href', "/lobby");
	});
	
	socket.on('handshake', function(sid, username, ret) {
		console.log("handshake received from " + sid);
		$("#opponentid").val(sid);
		$("#opponentname").empty();
		$("#opponentname").append(username);
		if (ret === 0) {
			socket.emit("return handshake", sid);
		}
	});

	$("div.dice1").text("Rolling...");
    $("div.dice2").text("Rolling...");
    $("div.dice3").text("Rolling...");

    setInterval(function () {
        $("div.dice1").html("<image src='images/brain_roll.jpg'>");
        $("div.dice1_label").html("BRAIN");
    }, 1000);
    
    setInterval(function () {
        $("div.dice2").html("<image src='images/shotgun_roll.jpg'>");
        $("div.dice2_label").html("SHOTGUN");
    }, 2000);
    
    setInterval(function () {
        $("div.dice3").html("<image src='images/foot_roll.jpg'>");
        $("div.dice3_label").html("FEET");
    }, 3000);

    $("div.turn").text("Turn: ");
    $("div.brains").text("Brains: 1");
    $("div.shotguns").text("Shotguns: 1");
}

$(document).ready(main);

function roll () {
    
};

function stop () {
	socket.on('stop', function(sid, username, ret) {
		
		var brains = 5;
		$("div.brains").text("Brains: " + brains);

		if (ret === 0) {
			socket.emit("stop and score", sid, brains);
		}
	});
};