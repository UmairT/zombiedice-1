var socket;

var main = function() {
	"use strict";
	
	socket = io('http://localhost:3000/ingame');
	
	//Login
	$("#lobbyreturn").click(function() {
		$(location).attr('href', "/lobby");
	});
	
}

$(document).ready(main);