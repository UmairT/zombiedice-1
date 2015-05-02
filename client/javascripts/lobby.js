var socket;

function challengePlayer(sid) {
	console.log("inside challenge: " + sid);
	//socket.emit("challenge", sid);
}

var main = function() {
	"use strict";
	
	socket = io();
	
	//Get user win/loss record
	$.getJSON("/getrecord", function (response) {
		$("#username").empty();
		$("#username").append(response.username);
		
		$("#wins").empty();
		$("#wins").append(response.wins);
		
		$("#losses").empty();
		$("#losses").append(response.losses);
	});
	
	//Login
	$("#Logoff").click(function() {
		$.get("/logoff", function(response) {
			if (response.logoff) {
				$(location).attr('href', "index.html");
			}
		});
	});
	
	//Challenge prompt
	$("#testbutton").click(function() {
		$("#challengepopup").show();
		$("#fade").show();
	});
	
	$("#challengepopup #chDecline").click(function() {
		$("#challengepopup").hide();
		$("#fade").hide();
	});
	
	$("challengepopup #chAccept").click(function() {
		
	});
	
	$("#btnChallenge").click(function() {
		console.log("challenge button clicked");
		var sid = $("#onlineplayers").val();
		if (sid !== null) {
			socket.emit("challenge", sid);
			console.log("Challenge sent to :" + sid);
		} else {
			console.log ("nothing selected");
		}
	});
	
	//update available players area
	socket.on('user join', function(username, id) {
		var $messageUser;
		$messageUser = $("<option id= '" + id + "' value= '" + id + "'>").text(username + " is in the lobby.");
		$("#onlineplayers").append($messageUser);
	});
	
	socket.on('user left', function(id) {
		console.log("Remove: " + "#" + id);
		$("#" + id).remove();
	});

	//show the current available players
	socket.on('current lobby', function(clients) {
		var $messageUser;
		for (var i in clients) {
			$messageUser = $("<option id= '" + clients[i].sid + "' value= '" + clients[i].sid + "'>").text(clients[i].username + " is in the lobby.");
			$("#onlineplayers").append($messageUser);
		}
	});
	
	socket.on('challenge recieved', function(username, sid) {
		console.log("challenged recieved by " + username + " at " + sid);
	});
};

$(document).ready(main);