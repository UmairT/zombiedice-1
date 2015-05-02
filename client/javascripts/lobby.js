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
	
	//update available players area
	socket.on('user join', function(username, id) {
		console.log("Add: " + id);
		$("#onlineplayers").append($("<li id= '" + id + "'>").text(username + " is in the lobby."));
	});
	
	socket.on('user left', function(id) {
		console.log("Remove: " + "#" + id);
		$("#" + id).remove();
	});
	
	socket.on('current lobby', function(clients) {
		console.log("current lobby");
		for (var i in clients) {
			$("#onlineplayers").append($('<li>').text(clients[i].username + " is in the lobby."));
		}
	});
};

$(document).ready(main);