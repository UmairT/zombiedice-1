var main = function() {
	"use strict"
	
	var socket = io();
	
	console.log("javascript running");
	
	//Get user win/loss record
	$.getJSON("/getrecord", function (response) {
		$("#username").empty();
		$("#username").append(response.username);
		
		$("#wins").empty();
		$("#wins").append(response.wins);
		
		$("#losses").empty();
		$("#losses").append(response.losses);
		
		console.log(response);
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
	socket.on('user join', function(username) {
		console.log("player joined");
		$("#onlineplayers").append($('<li>').text(username + " is in the lobby."));
	});
	
	socket.on('in lobby', function(socketid) {
		socket.emit("current lobby", socketid);
	});
};

$(document).ready(main);