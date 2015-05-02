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
	
	//update available players area
	socket.on('user join', function(username, id) {
		var $messageUser;
		console.log("Add: " + id);
		
		$messageUser = $("<li id= '" + id + "'>").text(username + " is in the lobby.");
		//$messageUser.append($("<button class= 'players' id= 'plyr" + id + "' onclick='challengePlayer(" + String(id) + ")'>").text("Challenge"));
		$messageUser.append($("<button onclick='" + socket.emit('challenge', id) + "'>").text("Challenge"));
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
			$messageUser = $("<li id= '" + clients[i].sid + "'>").text(clients[i].username + " is in the lobby.");
			//$messageUser.append($("<button class='players' id='plyr" + clients[i].sid + "' onclick='challengePlayer(" + String(clients[i].sid) + ")'>").text("Challenge"));
			$messageUser.append($("<button onclick='" + socket.emit('challenge', clients[i].sid) +"'>").text("Challenge"));
			$("#onlineplayers").append($messageUser);
		}
	});
};

$(document).ready(main);