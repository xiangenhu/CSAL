
var GoogleProfile
var GoogleoAuthKey="740713705307-04nuv9pvhvelqfenktir755en2knrate.apps.googleusercontent.com";
var webClientSecrete="ASAyWFWWdUNo_25quHTb07i5";
var TheFullName ="";
var TheEmail ="";
var GoogleLogin=false;
function InsertGoogleLogin(){
	if (document.getElementById("GoogleLoginBtn")!=null){
		return;
	}
	var Metalink = document.createElement('meta');
	Metalink.name="google-signin-client_id";
	Metalink.content =GoogleoAuthKey;
	document.getElementsByTagName('head')[0].appendChild(Metalink);
	
	const script = document.createElement('script');
	script.src = 'https://apis.google.com/js/platform.js';
	script.async=true;
	script.defer=true;
	document.body.appendChild(script);
	document.body.innerHTML += '<div class="g-signin2" data-onsuccess="onSignIn" data-onfailure="onSignInFailure" id="GoogleLoginBtn"></div>';
}

function onSignIn(googleUser) {
	GoogleProfile = googleUser.getBasicProfile();
	TheFullName = GoogleProfile.getName();
	TheEmail = GoogleProfile.getEmail();
	$("#GoogleLoginBtn").hide();
	console.log(TheFullName);
	console.log(TheEmail);
	GoogleLogin=true;
    $("#ThePanel").show();
}


$(document).ready(function(){
	if (qs("GL","1")=="1"){
		InsertGoogleLogin();
	}
})
