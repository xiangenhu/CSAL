function qsp(search_for, defaultstr) {
  var query = parent.location.search.substring(1);
  var parms = query.split("&");

  for (var i = 0; i < parms.length; i++) {
    var pos = parms[i].indexOf("=");
    if (pos > 0 && search_for == parms[i].substring(0, pos)) {
      return parms[i].substring(pos + 1);
    }
  }
  return defaultstr;
}
var email = qs("UID", "");
var fullname = qs("SN", "");
var connected = qs("connected", "0");
var GLogin = GL;
var AllowEditing = qs("editing", "0");

var theHREF = location.origin + location.pathname;

var app = qs("app", DefaultAPP);
var guid = qs("guid", Defaultguid);
var GoogleSplidesCommon1 = "https://docs.google.com/presentation/d/e/";
var AppRoot = "";
var cookieName = app + "_name";
var footer = qs("footer", "0");
var SampleGUID = qs("SampleGUID", "");

var GoogleSplidesCommon2 = "/pub?start=false&loop=false&delayms=3000";

var whynameurl =
  GoogleSplidesCommon1 +
  qs(
    "whynameurl",
    "2PACX-1vT3yLczIJ2PYA0NYrtlGWOyyZIAaimDAcMXVszxOUGBrSFycqIn1rbHM_HJ8hor1Cl8U0KC8VxJX5iY"
  ) +
  GoogleSplidesCommon2;

var whoweareusurl =
  GoogleSplidesCommon1 +
  qs(
    "whoweareusurl",
    "2PACX-1vRItjUTN3b1KhxtxpVYWEjNEVRzL7rLHK_qS5rEPa3m02FLd45uFwjenUmVolB5HAhU__PiCo4aR7_0"
  ) +
  GoogleSplidesCommon2;
var WhatisAutoTutorURL =
  GoogleSplidesCommon1 +
  qs(
    "WhatisAutoTutorURL",
    "2PACX-1vTz-LA4ZoAezGWvT19wpafaaLLf7bmPVyMhHbgvT7Sn5yYsDgCHU9X5F_TZ2W0vgPFF1gZMNuWvdsjP"
  ) +
  GoogleSplidesCommon2;
var UsefulLinksURL =
  GoogleSplidesCommon1 +
  qs(
    "UsefulLinksURL",
    "2PACX-1vTz-LA4ZoAezGWvT19wpafaaLLf7bmPVyMhHbgvT7Sn5yYsDgCHU9X5F_TZ2W0vgPFF1gZMNuWvdsjP"
  ) +
  GoogleSplidesCommon2;
var snapshotURL =
  GoogleSplidesCommon1 +
  qs(
    "snapshotURL",
    "2PACX-1vR7xgPa4mOrI7j_qti5uyBKUaeNtoT5xdiSaxNVVSfuGSpzj-9HMLM5fQ-aNqnLz9DJue0ZZIiwH8gk"
  ) +
  GoogleSplidesCommon2;

var feedbackURL = "https://forms.gle/C33M68S65gujCWSk7";

var RememberEmailURL =
  GoogleSplidesCommon1 +
  qs(
    "RememberEmailURL",
    "2PACX-1vSTPAqYkkgrrImMxf2uXNeC4wgM105aS49f-E6EimF6_N3km0U5GBnscZUKCkByIHBQHeDd6mm2LfWG"
  ) +
  GoogleSplidesCommon2;

function GetURL(anApp) {
  var url;
  var caseFile = qs("caseFile", "");
  if (anApp == "csal") {
    url =
      "https://ace.autotutor.org/at2017/csal2018.html?" +
      "LessonName=" +
      qs("LN", "lesson6") +
      "&UID=" +
      youremail +
      "&SName=" +
      yourname +
      "&ssid=" +
      qsp("aicc_sid", "Missing");
    return url;
  } else if (anApp == "aries") {
    AppRoot = qs("appRoot", "https://app.skoonline.org/aries/");
    var urlvariable =
      "guid=" +
      guid +
      "&SName=" +
      fullname +
      "&DEBUGGING=" +
      qs("DEBUGGING", "0") +
      "&UID=" +
      email +
      "&aceurl=" +
      qs("aceurl", "https://ace.autotutor.org/aceapi2017/api/aceaction") +
      "&editing=" +
      AllowEditing +
      "&SampleGUID=" +
      SampleGUID +
      "&caseFile=" +
      caseFile;
    url = AppRoot + app + ".html?" + urlvariable;
    return url;
  } else if (anApp.indexOf("SKOEXPC2") == 0) {
    doOverall1 = qs("doOverall1", doOverall1);
    var path = location.protocol + "//" + location.host + location.pathname;
    path = path.replace("index.html", "");
    AppRoot = qs("appRoot", path);

    var urlvariable =
      "guid=" +
      guid +
      "&fullname=" +
      qs("fullname", fullname) +
      "&user=" +
      qs("user", email) +
      "&starting=" +
      qs("starting", "0") +
      "&ST=" +
      qs("ST", "ID") +
      "&doOverall1=" +
      doOverall1 +
      "&editing=" +
      AllowEditing +
      "&connected=" +
      connected +
      "&SampleGUID=" +
      SampleGUID +
      "&DEBUGGING=" +
      qs("DEBUGGING", "0") +
      "&tophref=" +
      theHREF +
      "&TargetUser=" +
      qs("TargetUser", "augtest23@gmail.com");
    url = AppRoot + app + ".html?" + urlvariable;
    return url;
  } else if (anApp.indexOf("SKOEXPC1") == 0) {
    doOverall1 = qs("doOverall1", doOverall1);
    var path = location.protocol + "//" + location.host + location.pathname;
    path = path.replace("index.html", "");
    AppRoot = qs("appRoot", path);

    var urlvariable =
      "guid=" +
      guid +
      "&fullname=" +
      qs("fullname", fullname) +
      "&user=" +
      qs("user", email) +
      "&starting=" +
      qs("starting", "0") +
      "&ST=" +
      qs("ST", "ID") +
      "&connected=" +
      connected +
      "&DEBUGGING=" +
      qs("DEBUGGING", "0") +
      "&SampleGUID=" +
      SampleGUID +
      "&doOverall1=" +
      doOverall1 +
      "&editing=" +
      AllowEditing +
      "&tophref=" +
      theHREF;
    url = AppRoot + app + ".html?" + urlvariable;
    return url;
  } else if (anApp.indexOf("SKO") == 0) {
    doOverall1 = qs("doOverall1", doOverall1);
    if (qs("ATEXP", "0") == "1") {
      var path = location.protocol + "//" + location.host + location.pathname;
      path = path.replace("index.html", "");
      AppRoot = qs("appRoot", path);
    } else {
      AppRoot = qs("appRoot", "https://atdev.autotutor.org/pub/SKO/");
    }
    var urlvariable =
      "guid=" +
      guid +
      "&fullname=" +
      qs("fullname", fullname) +
      "&user=" +
      qs("user", email) +
      "&SampleGUID=" +
      SampleGUID +
      "&starting=" +
      qs("starting", "0") +
      "&ST=" +
      qs("ST", "ID") +
      "&ef=" +
      qs("ef", "0") +
      "&GL=1" +
      "&DEBUGGING=" +
      qs("DEBUGGING", "0") +
      "&StartingMovie=" +
      qs("StartingMovie", "0") +
      "&connected=" +
      connected +
      "&doOverall1=" +
      doOverall1 +
      "&editing=" +
      AllowEditing +
      "&tophref=" +
      theHREF;
    url = AppRoot + app + ".html?" + urlvariable;
    return url;
  } else if (anApp.indexOf("newcsal") == 0) {
    setfooter("0");
    AppRoot = qs("appRoot", "https://csal.autotutor.org/");
    urlvariable =
      "LessonName=" +
      qs("LN", "Lesson0") +
      "&UID=" +
      email +
      "&DEBUGGING=" +
      qs("DEBUGGING", "0") +
      "&connected=" +
      connected +
      "&SName=" +
      fullname +
      "&SampleGUID=" +
      SampleGUID +
      "&siteName=" +
      qs("siteName", "https://adulted.autotutor.org/") +
      "&classID=" +
      qs("classID", "") +
      "&objID=" +
      qs("objID", "") +
      "&secodEmail=" +
      qs("secodEmail", "") +
      "&lessonTitle=" +
      qs("lessonTitle", "") +
      "&email=" +
      email +
      "&ef=" +
      qs("ef", "0") +
      "&editing=" +
      AllowEditing +
      "&CaptureScreen="+qs("CaptureScreen","0")+
      "&verbose=" +
      qs("verbose", "0") +
      "&aceurl=" +
      qs("aceurl", "https://ace.autotutor.org/aceapi2017/api/aceaction") +
      // Will Change Later
      "&asatlrs=" +
      qs("asatlrs", "https://record.x-in-y.com/scripts/xapi/") +
      "&asatlrslogin=" +
      qs("asatlrslogin", "asatScripts") +
      "&asatlrspassword=" +
      qs("asatlrspassword", "asatScripts") +
      "&lrs=" +
      qs("lrs", "https://record.x-in-y.com/arcproduction/xapi/") +
      "&lrslogin=" +
      qs("lrslogin", "8ab2151b-dd04-478c-9a41-6075ef40d47e") +
      "&lrspassword=" +
      qs("lrspassword", "8ab2151b-dd04-478c-9a41-6075ef40d47e") +
      // Will Change Later
      "&fullname=" +
      fullname +
      "&school=" +
      qs("school", "https://class.x-in-y.com") +
      "&ssid=" +
      qs("aicc_sid", "Missing") +
      "&LN=" +
      qs("LN", "Lesson0") +
      "&guid=" +
      guid;

    url = AppRoot + app + ".html?" + urlvariable;
    return url;
  }
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function eraseCookie() {
  document.cookie = cookieName + "=; Max-Age=-99999999;";
}

function myFunction() {
  email = $("#youremail").val();
  fullname = $("#yourname").val();

  if ((email == "" && fullname == "") || fullname == "") {
    alert("need your name and email address");
    return;
  } else if (email == "") {
    alert(
      "If you don't have an email, you can enter a unique string instead.\n\n Suggested email:  " +
        fullname.toLowerCase() +
        "_at" +
        app +
        "@" +
        app +
        ".autotutor.org"
    );
    return;
  }
  if (qs("remail", "1") == "0") {
    let pos = email.search("@");
    switch (pos) {
      case -1:
        email = email.toLowerCase() + "@" + app + ".autotutor.com";
        break;
      default:
        email =
          email.toLowerCase().slice(0, pos) + "@" + app + ".autotutor.com";
    }
  }

  $("#AskInformation").hide();
  var url;
  var urlvariable;
  url = GetURL(app);
  $("#player").attr("src", url);
  if ($("#remembernameemail").prop("checked")) {
    setCookie(app + "_name", fullname, 7);
    setCookie(app + "_email", email, 7);
  }
}

function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  fullname = profile.getName();
  email = profile.getEmail();
  //	fullname=fullname.split(" ")[0];
  $("#GoogleLoginBtn").hide();
  console.log(fullname);
  console.log(email);
  var url = GetURL(app);
  $("#player").attr("src", url);
}

function onSignOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut();
}

function explainName() {
  window.open(whynameurl);
}

function explainEmail() {
  window.open(whyemailurl);
}

function whoweare() {
  window.open(whoweareusurl);
}

function WhatisAutoTutor() {
  window.open(WhatisAutoTutorURL);
}
function Snapshot() {
  window.open(snapshotURL);
}
function UsefulLinks() {
  window.open(UsefulLinksURL);
}

function SendFeedback() {
  window.open(feedbackURL);
}

function RememberEmail() {
  window.open(RememberEmailURL);
}

function setfooter(haveFooter) {
  return;
  if (haveFooter == "1") {
    document.body.innerHTML +=
      '<div align="center" id="footer"><input value="Who We Are" type="button" onclick="whoweare()"/> <input value="What is AutoTutor?" type="button" onclick="WhatisAutoTutor()"/>  <input value="A Snapshot" type="button" onclick="Snapshot()"/> <input value="Useful Links" type="button" onclick="UsefulLinks()"/> <input value="Send feedback" type="button" onclick="SendFeedback()"/><input value="Logout" type="button" onclick="eraseCookie()"/></div>';
  }
}

$(document).ready(function () {
  // Starting from UM this will popup to a new windwow
  var newServer = "https://atdev.autotutor.org/pub/SKO/index.html?GL=1&";
  var newhref = newServer + window.location.href.split("?")[1];
  if (app.indexOf("SKO") == 0 && newhref.indexOf("d2lSessionVal") > -1) {
    console.log(newhref);
    var popup = window.open(newhref, "popup", "fullscreen");
    if (
      popup.outerWidth < screen.availWidth ||
      popup.outerHeight < screen.availHeight
    ) {
      popup.moveTo(0, 0);
      popup.resizeTo(screen.availWidth, screen.availHeight);
    }
    return;
  }
  setfooter(footer);
  if (app.indexOf("SKO") != -1) {
    var pw = 840;
    var ph = 650;

    $("#player").height(ph);
    $("#player").width(pw);
    var ML = -Math.floor(parseInt(pw) / 2);
    var MT = -Math.floor(parseInt(ph) / 2);

    $("#player").css("margin-left", ML);
    $("#player").css("margin-top", MT);
  } else {
    var pw = 840;
    var ph = 650;

    $("#player").height(ph);
    $("#player").width(pw);
    var ML = -Math.floor(parseInt(pw) / 2);
    var MT = -Math.floor(parseInt(ph) / 2);

    $("#player").css("margin-left", ML);
    $("#player").css("margin-top", MT);
  }

  if (qs("GL", GL) == "2") {
    if (qs("NS", NS) == "1") {
      fullname = qs("fullname", "Sam Scholar");
      email = qs("email", "guest@autotutor.org");
    } else {
      fullname = getCookie(app + "_name");
      email = getCookie(app + "_email");
    }
    if (fullname || email) {
      if (fullname) {
        console.log("Get Cookie name " + fullname);
      }
      if (email) {
        console.log("Get Cookie email" + email);
      }
      var url = GetURL(app);
      var isSafari =
        navigator.vendor.match(/apple/i) &&
        !navigator.userAgent.match(/crios/i) &&
        !navigator.userAgent.match(/fxios/i);
      if (isSafari) {
        var confirmed = confirm(
          "You are using Safari, you may experience some issues with the Avatars. Use Chrome if that happend."
        );
        if (!confirmed) {
          return;
        } else {
          //		window.open(url,"_self");
          //			return;
        }
      } else {
        //	  	window.open(url,"_self");
        //	    return;
      }
      $("#player").attr("src", url);
    } else {
      document.body.innerHTML +=
        '<div id="AskInformation"><br/> &nbsp;&nbsp;&nbsp; Your Name <input type="text" id="yourname"> <input type="button" onclick="explainName()" value="?"><br/><br/> &nbsp;&nbsp;&nbsp; Your Email <input type="text" id="youremail"> <input type="button" onclick="explainEmail()" value="?"> <br/> <br/> &nbsp;&nbsp; <input type="checkbox" value="remember" id="remembernameemail"> <label for="remembernameemail">Remember my name and email。</label> <input type="button" onclick="RememberEmail()" value="?"> <br/><p align="right"><input type="button" onclick="myFunction()" value="Start">&nbsp;&nbsp;&nbsp;</p></div>';
    }
    // insert name and email
  } else if (qs("GL", GLogin) == "1") {
    var Metalink = document.createElement("meta");
    Metalink.name = "google-signin-client_id";
    Metalink.content =
      "583287928734-jdsedg4n8cu2m6m664u0tbj2671qpv6s.apps.googleusercontent.com";
    document.getElementsByTagName("head")[0].appendChild(Metalink);

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    document.body.innerHTML +=
      '<div class="g-signin2" data-onsuccess="onSignIn" data-onfailure="onSignInFailure" id="GoogleLoginBtn"></div>';
  } else {
    var url = GetURL(app);
    $("#player").attr("src", url);
  }
});
