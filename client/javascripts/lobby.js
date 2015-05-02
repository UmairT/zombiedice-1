var main = function() {
	"use strict";
	
	var socket = io();
	
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
	$("#challengepopup #chDecline").click(function() {
		$("#challengepopup").hide();
		$("#fade").hide();
	});
	
	//update available players area
	socket.on('user join', function(username, id) {
		var $messageUser;
		console.log("Add: " + id);
		
		$messageUser = $("<li id= '" + id + "'>").text(username + " is in the lobby.");
		$messageUser.append($("<button class='players' id=plyr" + id + "' onclick='#'>").text("Challenge"));
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
			$messageUser.append($("<button class='players' id=plyr" + clients[i].sid + "' onclick='#'>").text("Challenge"));
			$("#onlineplayers").append($messageUser);
		}
	});
};

$(document).ready(main);