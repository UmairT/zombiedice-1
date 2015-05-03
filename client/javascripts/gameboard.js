var socket;

var main = function() {
	"use strict";
	
	socket = io('http://localhost:3000/ingame');
	
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
}

$(document).ready(main);