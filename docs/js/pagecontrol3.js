var AudioButtonOn, DisplayAreaOn, HomeButtonOn, NextButtonOn, PlayVideoButtonOn, ProgressBarOn, RepeatButtonOn, ScoreBoardOn, TextInputDialogOn, talkingheadOn;

var currentLessonStatus = false;
var currentLessonID;
var domainURL = location.origin;
//var scriptFolderURL = "https://ace.autotutor.org/at2017/scripts/";

var scriptFolderURL = qs("DURL",domainURL)+"/Scripts/";

var MediaFolderURL = qs("MURL",domainURL)+"/Scripts/";

var talkingheadLoaded = false;
var CaptionOn=(qs("CaptionOn","0")==1);
var agentBusy = false;







function AgentBusyNow(){
		if (!agentBusy){
			return agentBusy
		}else{
			var VarTHWin=document.getElementById("agentsLarge");
			var avatarbusy=VarTHWin.contentWindow.agentBusyNow();
			return avatarbusy;
		}
		
}

var lessonRecovery = false;

$(document).ready(function() {
    getSystemConfig();
    InitTalkingHead();
    InitParameters();
    //HideHomeButton();
    $("#home").click(function() {
        mainpageInit();
        InitTalkingHead();
        InitParameters();
        if (vidplayerBusy == true) {
            vidplayerBusy = false;
            stopPlayVideo();
        }

    });

    $('#textInput').keydown(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            //Use the timeout so this function can return (or the dialog
            //won't properly close)
            setTimeout(function() {
                $('#textInputSubmit').click()
            }, 55);
            return false;
        }
    });

    $('#textInputSubmit').click(function(evt) {
        evt.preventDefault();

        userInput = $('#textInput').val();

        if (userInput != "") {
            maxIdle = 0;
            waitForUserResponse = false;
            HideTextInputDialog();

        }


    });


});

function getSystemConfig() {
    var sysObj = systemConfig.SystemConfig;
    AudioButtonOn = sysObj.AudioButtonOn;
    DisplayAreaOn = sysObj.DisplayAreaOn;
    HomeButtonOn = sysObj.HomeButtonOn;
    NextButtonOn = sysObj.NextButtonOn;
    PlayVideoButtonOn = sysObj.PlayVideoButtonOn;
    ProgressBarOn = sysObj.ProgressBarOn;
    RepeatButtonOn = sysObj.RepeatButtonOn;
    ScoreBoardOn = sysObj.ScoreBoardOn;
    TextInputDialogOn = sysObj.TextInputDialogOn;
    talkingheadOn = sysObj.talkingheadOn;
    RecoverableOn = sysObj.RecoverableOn;
    mainpageInit();


}

function getRecoverableStatus() {

    return RecoverableOn;
}

function getLessonsConfig() {
    var lessonsObj = systemConfig.lessonsConfig;
    return lessonsObj;
}

function mainpageInit() {

    if (DisplayAreaOn == true) {

        ShowDisplayArea();
    } else {
        HideDisplayArea();
    }
    if (HomeButtonOn == true) {

        ShowHomeButton();
    } else {
        HideHomeButton();
    }
    if (talkingheadOn == true) {

        ShowTalkinghead();
    } else {
        HideTalkinghead();
    }
    HideAudioButton();
    HideNextButton();
    HidePlayVideoButton();
    HideProgressbar();
    HideRepeatButton();
    HideScoreBoard();
    HideTextInputDialog();
    StopTimer();
    clearDisplayArea();

    var uname = sessionStorage.getItem("uname");
    var GUID = sessionStorage.getItem("GUID");
    var UID = sessionStorage.getItem("UID");
	if(GUID==UID)
	{
		
		 $("#mainFrame").attr("src", "resources/csal/startPage.html");
	}
	else
	{
			 if (uname == "" ) {
        $("#mainFrame").attr("src", "resources/csal/startPage.html");
    } else if (uname == undefined ) {
        $("#mainFrame").attr("src", "resources/csal/startPage.html");
    } else {
        $("#mainFrame").attr("src", "resources/csal/CSALScreenPage.html");
    }
		
		
	}
   

}
function mainpageInit2() {

    if (DisplayAreaOn == true) {

        ShowDisplayArea();
    } else {
        HideDisplayArea();
    }
    if (HomeButtonOn == true) {

        ShowHomeButton();
    } else {
        HideHomeButton();
    }
    if (talkingheadOn == true) {

        ShowTalkinghead();
    } else {
        HideTalkinghead();
    }
    HideAudioButton();
    HideNextButton();
    HidePlayVideoButton();
    HideProgressbar();
    HideRepeatButton();
    HideScoreBoard();
    HideTextInputDialog();
    StopTimer();
    clearDisplayArea();

}

function InitTalkingHead() {
	
    //var url = scriptFolderURL + "lesson0" + "/html5/index.html?lessonName=lesson0";
    var url = "angentsjs/speakTH.html";

    //LoadTalkingHead(url, "lesson0")
}

function InitParameters() {
    actions = [];
    nextButtonStatus = false;
    idleTime = 0;
    maxIdle = 0;
    agentBusy = false;
	//
	repeatTimes=0;
	userAnswerSpendTime=0
	userAnswer="";
	currentMediaUrl="";
	userSelectedItem="";
	userInput="";
	replayVideoTimes=0;
	var TotalScoreArr=[];
           
}

function clearDisplayArea() {
  //  $("#speechArea").html("");
	
    $("#caption").html("");
}

function appendTextToDisplayArea(data) {

	$("#speechArea").append(data + "\n\n");
	var textarea = document.getElementById('speechArea');
	textarea.scrollTop = textarea.scrollHeight;
	
	var displayText=data.split("#").join(" ");
	displayText= displayText.split(":").join(": ");
    var TestArary=displayText.split(":");
    displayText="<b>"+TestArary[0]+":</b> <i>"+TestArary[1]+"</i>";
	$("#caption").append("<li>"+displayText + "</li>");

	var textarea = document.getElementById('caption');
	textarea.scrollTop = textarea.scrollHeight;
	var name1="Cristina:";
	var name2="Jordan:";

	if (displayText.indexOf(name1)>=0){
	   $("#caption1").html(TestArary[1]);
	   var textarea1 = document.getElementById('caption1');
	   textarea1.scrollTop = textarea1.scrollHeight;

	}else if (displayText.indexOf(name2)>=0){
	   $("#caption2").html(TestArary[1]);
	   var textarea2 = document.getElementById('caption2');
	   textarea2.scrollTop = textarea2.scrollHeight;
	}
		
	
}

function ShowTalkinghead() {
    $("#agentFrame").css('visibility', 'visible');
}

function HideTalkinghead() {
    $("#agentFrame").css('visibility', 'hidden');
}

function ShowDisplayArea() {
    $("#displayArea").css('visibility', 'visible');
}

function HideDisplayArea() {
    $("#displayArea").css('visibility', 'hidden');
}

function ShowHomeButton() {
    $("#home").css('visibility', 'visible');
}

function HideHomeButton() {
    $("#home").css('visibility', 'hidden');
}

function ShowScoreBoard() {
    $("#displayScoreBoard").css('visibility', 'visible');
}

function HideScoreBoard() {
    $("#displayScoreBoard").css('visibility', 'hidden');
}

function ShowRepeatButton() {
    if (RepeatButtonOn == true) {
        $("#repeat").css('visibility', 'visible');

    } else {
        HideRepeatButton();
    }

}

function showCC(showOn){
	if (showOn){
			$("#caption").show();
			$("#caption1").show();
			$("#caption2").show();
		}else{
			$("#caption").hide();
			$("#caption1").hide();
			$("#caption2").hide();
		}
}



function HideRepeatButton() {
    $("#repeat").css('visibility', 'hidden');
}

function ShowPlayVideoButton() {
    if (PlayVideoButtonOn == true) {
        if (isHasVideo === true) {
            $("#btReplayVideo").css('visibility', 'visible');
        } else {
            $("#btReplayVideo").css('visibility', 'hidden');
        }


    } else {
        $("#btReplayVideo").css('visibility', 'hidden');
    }


}

function HidePlayVideoButton() {
    $("#btReplayVideo").css('visibility', 'hidden');
}

function ShowNextButton() {
    if (NextButtonOn == true) {
        $("#btNext").css('visibility', 'visible');
		 /* if (InteractionHistory.length!=0){			
	        $("#btNext").trigger('click');
			nextButtonStatus = false;
			runActions();
			GetWorldEvent(InteractionHistory[0].msg);
		}  */
    } else {
        HideNextButton()
    }

}

function HideNextButton() {

    $("#btNext").css('visibility', 'hidden');
}

function ShowAudioButton() {
    $("#readText").css('visibility', 'visible');
}

function HideAudioButton() {
    $("#readText").css('visibility', 'hidden');
}

function ShowProgressbar() {
    if (ProgressBarOn == true) {
        $("#PB").css('visibility', 'visible');
    } else {
        $("#PB").css('visibility', 'hidden');
    }

}

function HideProgressbar() {

    $("#PB").css('visibility', 'hidden');
}

function ShowTextInputDialog() {
    $("#textInputDialog").css('visibility', 'visible');

}

function HideTextInputDialog() {
    $("#textInputDialog").css('visibility', 'hidden');
}

function ShowMainFrame() {
    $("#mainFrame").css('visibility', 'visible');
}

function HideMainFrame() {
    $("#mainFrame").css('visibility', 'hidden');
}

function PlaySound(sound) {

    var soundPath = "sounds/" + sound;
    var audio = new Audio(soundPath);
    audio.play();
}

function GetScript(lessonID) {

    if (lessonID == "" || lessonID == undefined) return;
    currentLessonStatus = true;
    currentLessonID = lessonID;
    if (talkingheadLoaded == false) {

        var url = scriptFolderURL + lessonID + "/html5/index.html?lessonName=" + lessonID;
        LoadTalkingHead(url, lessonID)
    } else {
        talkingheadLoaded = false;
        currentLessonStatus = false;
        LoadLesson(lessonID);
    }

}

function LoadTalkingHead(url, lessonID) {
    $.ajax({
        url: url,
        type: 'HEAD',
        error: function() {
            //file not exists 
        },
        success: function() {
            document.getElementById('agentsLarge').src = url;
            sessionStorage.setItem("currentTalkingHead", lessonID);

        },
        error: function() {

            alert("System Error");


        }
    });
}

function talkingheadSwitchControl() {
    if (talkingheadOn == false) {

        ShowTalkinghead();
		
        talkingheadOn = true;


    } else if (talkingheadOn == true) {
        HideTalkinghead();
		 document.getElementById('agents').contentWindow.Stop();
		
        talkingheadOn = false;

    }

}

function diaplayAreahControl() {
    if (DisplayAreaOn == false) {

        ShowDisplayArea();
        DisplayAreaOn = true;


    } else if (DisplayAreaOn == true) {
        HideDisplayArea();
        DisplayAreaOn = false;

    }

}
////talkinghead receiver

window.addEventListener('message', receiveMessage, false);

function receiveMessage(evt) {
    if (evt.origin === domainURL) {
        getValue(evt.data)

    }
}

function getValue(info) {

    if (info == "9") {

        if (currentLessonStatus == true && lessonRecovery == false) {
            talkingheadLoaded = true;
            GetScript(currentLessonID);
        } else if (lessonRecovery == true) {
            agentBusy = false;
            lessonRecovery = false;
        } else {

            talkingheadLoaded = false;

        }


    } else if (infor = "0") {
        if (playListStatus == true) {

            AngentPlay(playList);

        } else {
            if (repeatStatus == true) {
                repeatStatus = false;
                ShowRepeatButton();
                ShowPlayVideoButton();
            }
            agentBusy = false;
        }

    }

}
//local video player
var vidplayerBusy = false;
var pauseAtTime = 1000000000;

function getLocalVideoState(event) {

    var LocalVideoState = event;
    if (event == 1) {
        vidplayerBusy = true;

    } else if (event == 2) {
        mediaActions = "VideoPause";
        vidplayerBusy = false;

    }
    if (LocalVideoState == "0") {
        mediaActions = "VideoEnd";
        vidplayerBusy = false;
        $("#videoDiv").css('z-index', '-10');
        $("#videoDiv").css('visibility', 'hidden');
    }
	if(replayVideo==true)
	{
		mediaActions = "";
		vidplayerBusy = false;
	}
	else
	{
		
		
	}
}

//function that loads new video and plays them
function vidPlayerControl(vidId) {

    str = vidId.split(':')
    Vid = str[0];
    VideoType = str[1];
    if (VideoType == 2) {
        $("#videoDiv").css('z-index', '15');
        $("#videoDiv").css('visibility', 'visible');
        // myLocalVideoPlayer(Vid);
        document.getElementById('vid').contentWindow.setPauseTime(pauseAtTime);
        document.getElementById('vid').contentWindow.myLocalVideoPlayer(Vid, replayVideo);
    }
}

function stopPlayVideo() {


    document.getElementById('vid').contentWindow.videoPause();
    document.getElementById('vid').contentWindow.myLocalVideoPlayer('', replayVideo);
    vidplayerBusy = false;
    $("#videoDiv").css('z-index', '-10');
    $("#videoDiv").css('visibility', 'hidden');
}

function setTimeStemp() {

    var d = new Date();
    var timeStamp = d.getTime();
    return timeStamp;
}