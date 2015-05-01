function logon() {
	username = $("#loginarea #username").val();
	pw1 = $("#loginarea #password").val();
	info = {"username":username, "password":pw1};
	
	console.log(info);
	
	$.post("/userlogin", info, function(response) {
		if (response.logon) {
			$(location).attr('href', "lobby.html");
		}
	});
}

var main = function () {
	"use strict";
    
	//Login
	$("#loginsubmit").click(function() {
		logon();
	});
};

$(document).ready(main);