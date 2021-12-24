function GetMovieWhenReady() {
  if (qs("MOVIE", "1") == "1") {
    if (qs("ef", "0") == "0") {
      GetGoogleSheetData("2PACX-1vSWw3xjkqyB2Tq7ITTL0OPaCWtSvDzH5HOQYpAYpSI6jkmd-UiVqJbMHVu79GhW7yxV0h6v-T5PLvsT","GetMovies","4");
    }
  }
}

function CheckIfPossibleToRewind() {
  GetGoogleSheetData("2PACX-1vSWw3xjkqyB2Tq7ITTL0OPaCWtSvDzH5HOQYpAYpSI6jkmd-UiVqJbMHVu79GhW7yxV0h6v-T5PLvsT","CheckRewind","6");
}
CanRewind = false;
var MOVIEObj = {
  PopMsg: "",
  PopTitle: "",
  MOVIELink: "",
  MOVIETitle: "",
  MOVIEType: "Youtube",
  MOVIESource: "youtube",
  Start: "Start",
  End: "End",
  Duration: "Duration",
};

function GetObj(str) {
  return str.split("&");
}

function CheckRewind(json) {
  for (var i=1;i<json.length;i++){
    var guid=removehtml(json[i].GUID);
    var row=[json[i].LessonName,guid,json[i].Rewind];
    console.log(row, qs("quid", ""));
    if (qs("guid", "") ==guid) {
      CanRewind = json[i].Rewind != "No";
      if (CanRewind) {
        GetALLActions(LRSURL, LRSLogin, LRSPassword, lastStartingTime);
      }
      return;
    }
  }
}


function removehtml(str){
	return str.replace(/<\/?[\w\s]*>|<.+[\W]>/g, '');
}

function GetMovies(json) {
  
  for (var i=1;i<json.length;i++){
    var guid=removehtml(json[i].GUID);
    var row=[json[i].LessonName,guid,json[i].Movie];
    console.log(row, qs("quid", ""));
    if (qs("guid", "") ==guid) {
      HaveMovie = json[i].Movie != "NA";
      if (HaveMovie) {
        MOVIEObj.MOVIELink = json[i].Movie;
        MOVIEObj.MOVIETitle = json[i].LessonName;
        MOVIEObj.PopTitle = json[i].LessonName;
        launchMOVIE();
       return;
      }
    }
  }
}

function OpenPopUp(header, footer, bodytext, targetwin) {
  //	$("#"+targetwin).show();
  var html = "";
  html = html + '<div class="modal-content" id="PopupDialog">';
  html = html + '<div class="modal-header">';
  html = html + '<button id="Modalclosebtn" class="btn"  style="float: right;">&times;</button>';
  html = html + "<h2>" + header + "</h2>";
  html = html + "</div>";
  html = html + '<div class="modal-body" id="bodytext">';
  html = html + bodytext;
  html = html + "</div>";
  html = html + '<div class="modal-footer">';
  html = html + "<h3>" + footer + "</h3>";
  html = html + "</div>";
  html = html + "</div>";
  var popup = document.getElementById(targetwin);
  if (popup == null) {
    var popup = document.createElement("div");
    popup.class = "modal";
    popup.id = targetwin;
    $("#editor").append(popup);
    popup.innerHTML = html;
  } else {
    $("#" + targetwin).html(html);
    $("#" + targetwin).show();
  }
  $("#Modalclosebtn").click(function () {
    $("#" + targetwin).hide();
    popup.innerHTML = "";
  });
}


function GetGoogleSheetDataOld(filename, filetype) {
  if (filetype == "js") {
    //if filename is a external JavaScript file
    var fileref = document.createElement("script");
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") {
    //if filename is an external CSS file
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function GetExtraArguments() {

  var lrs = "&lrs=" + TheLRSURL;
  var lrsLogin = "&lrslogin=" + TheLRSLogin;
  var lrsPassword = "&lrspassword=" + theLRSPassword;
  var guid = "&guid=" + qs("guid", "");
  var user = "&email=" + qs("email", "");
  var GL = "&GL=0";
  var EMT = "&EMT=" + qs("EMT", "0");
  var SavetoLRS = "&xAPI=1";
  var DN = "&DN=" + location.hostname;
  var Thefullname = "&fullname=" + qs("fullname", "");
  //      var SceneTitle="&SceneTitle="+SKOTitle;
  return (
    lrs +
    GL +
    lrsLogin +
    lrsPassword +
    guid +
    user +
    SavetoLRS +
    Thefullname +
    DN +
    EMT
  );
}

function launchMOVIE() {
  var ExtraInfo = GetExtraArguments();
  var MOVIEURL = qs("MOVIELink", "../movie/movie.html?");
  var MOVIEFooter = MOVIEObj.PopMsg;
  var MOVIETitle = MOVIEObj.PopTitle;
  var MOVIELink = "MVL=" + MOVIEObj.MOVIELink;
  var MOVIEName = "&MVTitle=" + MOVIEObj.MOVIETitle;
  var MOVIEType = "&MVType=" + MOVIEObj.MOVIEType;
  var MOVIESource = "&MVType=" + MOVIEObj.MOVIESource;

  var Start = "&Start=" + MOVIEObj.Start;
  var End = "&End=" + MOVIEObj.End;
  var Duration = "&Duration=" + MOVIEObj.Duration;

  var localvar =
    MOVIELink + MOVIEName + MOVIEType + MOVIESource + Start + End + Duration;
  var PopupData = GetObj(localvar);
  MOVIEURL = MOVIEURL + localvar + ExtraInfo + "#" + MOVIEObj.MOVIESource;
  var htmlbody =
    "<iframe src='" +
    MOVIEURL +
    "' id='TheIframe' frameBorder='0' scrolling='no'></iframe>";
  OpenPopUp(MOVIETitle, MOVIEFooter, htmlbody, "popupWin");
}
function GetSpreadSheetARC(GoogleID, GoogleSheet) {
	var theUrl = "https://tools.x-in-y.com/gs?json=";
	var theObj = { id: GoogleID, page: GoogleSheet ,Pub:qs("Pub","0")};
//	console.log(GoogleID);
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