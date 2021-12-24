function qs(search_for, defaultstr) {
  var query = window.location.search.substring(1);
  var parms = query.split("&");

  for (var i = 0; i < parms.length; i++) {
    var pos = parms[i].indexOf("=");
    if (pos > 0 && search_for == parms[i].substring(0, pos)) {
      return parms[i].substring(pos + 1);
    }
  }
  return defaultstr;
}



var TheLRSURL=qs("lrs","https://record.x-in-y.com/arcproduction/xapi/");
var TheLRSLogin=qs("lrslogin","8ab2151b-dd04-478c-9a41-6075ef40d47e");
var theLRSPassword=qs("lrspassword","8ab2151b-dd04-478c-9a41-6075ef40d47e");

var AggregateURLData=TheLRSURL+"statements/aggregate";
var TheDataAuthory=btoa(TheLRSLogin+":"+theLRSPassword);
var classID=qs("classID","CSALUSNW01");

var LessonInforPointer =
"2PACX-1vSWw3xjkqyB2Tq7ITTL0OPaCWtSvDzH5HOQYpAYpSI6jkmd-UiVqJbMHVu79GhW7yxV0h6v-T5PLvsT";


var realName="";


var TheLRStheSetting={
  "async": true,
  "crossDomain": true,
  "url": AggregateURLData,
  "method": "POST",
  "headers": {
  "authorization": "Basic " + TheDataAuthory,
  "content-type": "application/json",
  "cache-control": "no-cache",
  "x-experience-api-version": "1.0.3",
  "postman-token": "f2acffd3-e37a-3578-cea0-995aa07124a8"
  },
  "processData": false,
  "data":{}
}


var C1 = qs("C1", "Angela");
var CR1 = C1;
var F1 = qs("F1", "Head");
var V1 = qs("V1", "Joanna");

var C2 = qs("C2", "");
var CR2 = C2;
var F2 = qs("F2", "Head");
var V2 = qs("V2", "Matthew");

var C3 = qs("C3", "Lee");
var CR3 = C3;
var F3 = qs("F3", "Head");
var V3 = qs("V3", "Matthew");

var C4 = qs("C4", "");
var CR4 = C4;
var F4 = qs("F4", "Head");
var V4 = qs("V4", "Matthew");

function PositionAvatars(avatardiv, avatar) {
  return;
  var c_top = qs(avatar + "top", "-1");
  var c_bottom = qs(avatar + "bottom", "-1");
  var c_right = qs(avatar + "right", "-1");
  var c_left = qs(avatar + "left", "-1");

  if (c_top != "-1") {
    $(avatardiv).css("top", c_top + "px");
    $(".Speech" + avatar).css("top", c_top + "px");
  }

  if (c_right != "-1") {
    $(avatardiv).css("right", c_right + "px");
    $(".Speech" + avatar).css("right", c_right + "px");
  }

  if (c_left != "-1") {
    $(avatardiv).css("left", c_left + "px");
    $(".Speech" + avatar).css("left", c_left + "px");
  }

  if (c_bottom != "-1") {
    $(avatardiv).css("bottom", c_bottom + "px");
    $(".Speech" + avatar).css("bottom", c_bottom + "px");
  }
}

function PositionTexts(avatardiv, avatar, target) {
  return;
  $(avatardiv).css("height", $(target).css("height"));
  $(avatardiv).css("width", $(target).css("width"));
  $(avatardiv).css("padding", $(target).css("padding"));
  $(avatardiv).css("top", $(target).css("top"));
  $(avatardiv).css("right", $(target).css("right"));
  $(avatardiv).css("left", $(target).css("left"));
  $(avatardiv).css("bottom", $(target).css("bottom"));
}

function LoadChara(id, character, format, voice) {
  var width;
  var height;
  if (id == "") return;
  var avatarWidth = qs("AW", "250");
  var avatarHeight = qs("AH", "200");
  if (format == "Head") {
    width = avatarWidth;
    height = avatarHeight;
  } else if (format == "Bust") {
    width = 375;
    height = 300;
  } else if (format == "Body") {
    width = 500;
    height = 400;
  } else if (format == "Cartoon") {
    width = 307;
    height = 397;
  }

  document.getElementById(id).style.width = width + "px";
  document.getElementById(id).style.height = height + "px";
  document.getElementById(id + "Renderer").style.width = width + "px";
  document.getElementById(id + "Renderer").style.height = height + "px";

  o[id] = {
    character: character,
    format: format,
    width: width,
    height: height,
    voice: voice,
  };
  msInit(o);
}

function loadCharasMy() {
  var Avatars = document.getElementById("talkingHeads");
  var s = '<table align="center" width="600px"><tr>';
  if (C1.length > 1) {
    s += '<td align="center">';
    s += '<div id="' + C1 + '" class="tl-agent">';
    s += '<div id="' + C1 + 'Renderer"></div>';
    s += "</div>";
    s += "</td>";
  }
  if (C2.length > 1) {
    s += '<td align="center">';
    s += '<div id="' + C2 + '" class="tr-agent">';
    s += '<div id="' + C2 + 'Renderer"></div>';
    s += "</div>";
    s += "</td>";
  }
  if (C3.length > 1) {
    s += '<td align="center">';
    s += '<div id="' + C3 + '" class="bl-agent">';
    s += '<div id="' + C3 + 'Renderer"></div>';
    s += "</div>";
    s += "</td>";
  }
  if (C4.length > 1) {
    s += '<td align="center">';
    s += '<div id="' + C4 + '" class="br-agent">';
    s += '<div id="' + C4 + 'Renderer"></div>';
    s += "</div>";
    s += "</td>";
  }
  s += "</tr></table>";
  Avatars.innerHTML = s;
  console.log(s);
  if (C1.length > 1) {
    LoadChara(C1, C1, F1, V1);
    PositionAvatars(".tl-agent", "C1");
    PositionTexts(".SpeechC1", "C1", ".tl-agent");
  }
  if (C2.length > 1) {
    LoadChara(C2, C2, F2, V2);
    PositionAvatars(".tr-agent", "C2");
    PositionTexts(".SpeechC2", "C2", ".tr-agent");
  }
  if (C3.length > 1) {
    LoadChara(C3, C3, F3, V3);
    PositionAvatars(".bl-agent", "C3");
    PositionTexts(".SpeechC3", "C3", ".bl-agent");
  }
  if (C4.length > 1) {
    LoadChara(C4, C4, F4, V4);
    PositionAvatars(".br-agent", "C4");
    PositionTexts(".SpeechC4", "C4", ".br-agent");
  }
}

function HandleCMD(id, cmd) {}

function AudioPlaying() {
  var currentAudio = document.getElementById("audio");
  return (
    currentAudio &&
    currentAudio.currentTime > 0 &&
    !currentAudio.paused &&
    !currentAudio.ended &&
    currentAudio.readyState > 2
  );
}



function GetLessons(json){
	var i;
  TheLessions=json;
	GetStudents(classID,ThestudentID);
  return;
	for (i=1;i<json.length;i++){
		var row=[json[i].ALessonTitle,
					removehtml(json[i].GUID),
					json[i].CMovie,
					json[i].Description,
					json[i].Category,
          json[i].Section,
          json[i].LessonID
        ]
	   console.log(row);
	   TheLessions.push(row);
	}
}

function GetSpreadSheetARC(GoogleID, GoogleSheet) {
	var theUrl = "https://tools.x-in-y.com/gs?json=";
	var theObj = { id: GoogleID, page: GoogleSheet,Pub:"0" };
	console.log(GoogleID);
	theUrl = theUrl + JSON.stringify(theObj);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false); // false for synchronous request
	xmlHttp.send(null);
	return xmlHttp.responseText;
}


function GetGoogleSheetData(GooglePageID,CallBak, page) {
  var GoogleID = GooglePageID;
  var GoogleSheet = page;
  var TheJSFileFromGS = GetSpreadSheetARC(GoogleID, GoogleSheet);
  if (TheJSFileFromGS != "") {
      var json = JSON.parse(GetSpreadSheetARC(GoogleID, GoogleSheet));
      var myfunc = this[CallBak];
      myfunc(json);
      return;
  }
}