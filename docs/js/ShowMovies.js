function GetMovieWhenReady() {
  if (qs("MOVIE", "1") == "1") {
    if (qs("ef", "0") == "0") {
      GetGoogleSheetData(
        "https://spreadsheets.google.com/feeds/cells/" +
          qs("Emails", "1l9cLdijhas7QBfrGKni5ULg3eNcu3fhmrXqE3NsekKw") +
          "/4/public/values?alt=json-in-script&callback=GetMovies",
        "js"
      );
    }
  }
}

function CheckIfPossibleToRewind() {
  GetGoogleSheetData(
    "https://spreadsheets.google.com/feeds/cells/" +
      qs("Emails", "1l9cLdijhas7QBfrGKni5ULg3eNcu3fhmrXqE3NsekKw") +
      "/6/public/values?alt=json-in-script&callback=CheckRewind",
    "js"
  );
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
  var spData;
        var FromTools=(json.feed==null);
        if ( FromTools){ spData=json;}else{spData = json.feed.entry;}
  var i;
  for (i = 0; 3 * i < spData.length; i++) {
    var line = i * 3;
    var row = [
      spData[line].value,
      spData[line + 1].value,
      spData[line + 2].value,
    ];
    console.log(row, qs("quid", ""));
    if (qs("guid", "") == spData[line + 1].value) {
      CanRewind = spData[line + 2].value != "No";
      if (CanRewind) {
        GetALLActions(LRSURL, LRSLogin, LRSPassword, lastStartingTime);
      }
      return;
    }
  }
}

function GetMovies(json) {
  var spData;
        var FromTools=(json.feed==null);
        if ( FromTools){ spData=json;}else{spData = json.feed.entry;}
  var i;
  for (i = 0; 3 * i < spData.length; i++) {
    var line = i * 3;
    var row = [
      spData[line].value,
      spData[line + 1].value,
      spData[line + 2].value,
    ];
    console.log(row, qs("quid", ""));
    if (qs("guid", "") == spData[line + 1].value) {
      if (spData[line + 2].value != "NA") {
        MOVIEObj.MOVIELink = spData[line + 2].value;
        MOVIEObj.MOVIETitle = spData[line].value;
        MOVIEObj.PopTitle = spData[line].value;
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

function GetGoogleSheetData(filename, filetype) {
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
  var TheLRSURL = qs(
    "lrs",
    "https://record.x-in-y.com/arcproduction/xapi/"
  );
  var TheLRSLogin = qs("lrslogin", "8ab2151b-dd04-478c-9a41-6075ef40d47e");
  var theLRSPassword = qs("lrspassword", "8ab2151b-dd04-478c-9a41-6075ef40d47e");

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
