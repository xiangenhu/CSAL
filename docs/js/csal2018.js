var currentScripturl;
var currentMediaPath;
var currentMediaUrl;
var userInput = "";
var currnectMediapath;
var pageLevel;
var userAnswer;
var userSelectedItem;
var userAnswerSpendTime = 0;
var PresentationIDObj = {};
var PresentationHistoryObj = {};
var idleTime = 0;
var maxIdle = 0;
var repeatList = [];
var repeatTimes = 0;
var repeatStatus = false;
var waitForUserResponse = false;
var waitForMediaResponse = false;
var currentLessonInfoObj;
var nextButtonStatus = false;
var replayVideo = false;
var replayVideoTimes = 0;
var getMediaFeedBackData;
var getMediaFeedBack = false;
var pageStartTimestamp;
var mediaActions = "";
var isHasProgressBar = false;
var isHasNextButton = false;
var isHasVideo = false;
var videoId;
var getQuestionName = "";
var allLessonsInfoObj;
var talkingHeadSpeechEndTimestamp;
var ShowButtonAndWait=false;
var isQuestionPageAfterFirst=false;
var isFirstTimer=true;
var talkingheadUsing="Speak2";
var SpeakRepeatList = [];
var currentPageInfor;
var currentJSON;
var longAction=[];
var nextbtnClicked=false;
var theFirstJsonPost;
var listofMessage=[];

var enableEditing=false;
var InputFound;

var time_in_Day;
var time_in_hours;
var time_in_min;

var TheMsg="";

var trialTimes=0;


function URLToBuncer(tag){
	var scriptQueryObj={
		"guid":qs("guid",""),
		"thelocation":ASATLocation=qs("ASATLocation",location.hostname),
		"theAuthorization":qs("TheASATAuthory","VGhlU2NyaXB0c0FjY2VzczpUaGVTY3JpcHRzQWNjZXNz"),
		"theASTALRS":qs("asatlrs","https://record.x-in-y.com/thescripts/xapi"),
	}
	scriptQueryObj.tag=tag;
	return qs("ATSBase","https://asatnodejs.uc.r.appspot.com/generate?json=")+JSON.stringify(scriptQueryObj);
}


function DownloadScript(){
	var url= URLToBuncer("AutoTutorScript");
	window.open(url,'window','toolbar=no, menubar=no, resizable=yes');
}

var DebuggingMode=false;

function OpenBrowserTest(){
	var urlvarjson=getUrlVars(location.href);
	var newHostName=location.pathname;
//	newHostName=newHostName.replace("Edit","");
    var hostnameandpath=location.origin+newHostName;
	urlvarjson.asatDirect="1";
	urlvarjson.connected="1";
	urlvarjson.editing="0";
	urlvarjson.callback="0";
	var qvar=JSON.stringify(urlvarjson);
	qvar=qvar.split('"').join('');
	qvar=qvar.split(',').join('&');
	qvar=qvar.split('://').join('$$$');
	qvar=qvar.split(':').join('=');
	qvar=qvar.split('$$$').join('://');
	qvar=qvar.split('}').join('');
	qvar=qvar.split('{').join('');
//	var TheURLVariable=new URLSearchParams(urlvarjson).toString();
    var url=hostnameandpath+"?"+qvar
	window.open(url,'self');
}

function OpenBrowserEditing(){
	$("#PlayerWind").hide();
	$("#editor").show();
	return;

	var urlvarjson=getUrlVars(location.href);
	var newHostName=location.pathname;
//	newHostName=newHostName.replace("Edit","");
    var hostnameandpath=location.origin+newHostName;
	urlvarjson.asatDirect="1";
	urlvarjson.connected="1";
	urlvarjson.editing="1";
	urlvarjson.callback="1";
	var qvar=JSON.stringify(urlvarjson);
	qvar=qvar.split('"').join('');
	qvar=qvar.split(',').join('&');
	qvar=qvar.split('://').join('$$$');
	qvar=qvar.split(':').join('=');
	qvar=qvar.split('$$$').join('://');
	qvar=qvar.split('}').join('');
	qvar=qvar.split('{').join('');
//	var TheURLVariable=new URLSearchParams(urlvarjson).toString();
    var url=hostnameandpath+"?"+qvar
	window.open(url,'self');
}


function editorCallback(){
	if (editorFirst=="1"){
		$("#PlayerWind").hide();
		$("#editor").show();
	}else{
		$("#PlayerWind").show();
		$("#editor").hide();
	}
}

function getLessonOutline(){
	var TheLessonID=qs("LessonName","");
	TheLessonID=TheLessonID.toLowerCase();
	var Outlinehtml="";
	var i;
	var j;
	var ListOfLessons=systemConfig.lessonsConfig;
	for (i=0;i<ListOfLessons.length;i++){
		var theLesson=ListOfLessons[i];
		if (TheLessonID==theLesson.lessonId){
			var html="<ol>";
			html=html+"<li> Lesson ID:"+theLesson.lessonId;
			html=html+"<li> Lesson Name:"+theLesson.lessonName;
			html=html+"<li> Description:"+theLesson.lessonDes;
			html=html+"</ol>";
			html=html+"Click here to test current module: <btton onclick='OpenBrowserTest()' class='btn'>Test Current Module</btton>"
			return html;
		}
	}
}

function LeesonOutlines(){
	var html=[];
	var i;
	var j;
	var ListOfLessons=systemConfig.lessonsConfig;
	for (i=0;i<ListOfLessons.length;i++){
		var theLesson=ListOfLessons[i];
		if (theLesson.pages!=null){
		var pages=theLesson.pages;
			for (j=0; j<pages.length;j++ ){
				var thePageObj=pages[j];
				thePageObj.lessonId=theLesson.lessonId;
				thePageObj.lessonname=theLesson.lessonName;
				thePageObj.lessonDes=theLesson.lessonDes;
				html.push(JSON.stringify(thePageObj));
			}
		}
	}
	a = document.createElement('a');
	a.setAttribute("href", "data:application/xml;charset=utf-8," + html);
	a.setAttribute("download", "outline");
	a.click();
	return html;
}

function GetRuningEnv(){
	return urlvarjson=getUrlVars(location.href);
}

function FastForward(){
	
}

function AgentBusyNow(){
		var VarTHWin=document.getElementById("agentsLarge");
		var vid = VarTHWin.contentWindow.agentBusyNow();
}

function setCurrentLessonInfo(lessonID) {

	for (var i in allLessonsInfoObj) {
		var lessonStatus = false;
		if (lessonID.toLowerCase() == allLessonsInfoObj[i].lessonId) {
			var LessonInfo = allLessonsInfoObj[i];
			sessionStorage.setItem("LessonName", LessonInfo.lessonName);
			sessionStorage.setItem("LessonID", LessonInfo.lessonId);
			sessionStorage.setItem("LessonInfo", JSON.stringify(LessonInfo));
			return true;
		} else {
			sessionStorage.setItem("LessonName", null);
			sessionStorage.setItem("LessonID", null);
			sessionStorage.setItem("LessonInfo", null);

		}


	}

	return false;

}
function getRightMsg(){
	var i;
	for (i=0;i<InteractionHistory.length;i++){
		var themsg=InteractionHistory[i].msg;
		var themedia=InteractionHistory[i].CurrentMedia;
		if ((themsg!="") && (CurrentMedia.Data==themedia)){
			InteractionHistory.splice(i,1);
		//   delete InteractionHistory[i];
			return themsg		   
		}
	}
	return "";
}

function addRepeatSpeech(agent_speech)
{
	var currentAgent_Speech = agent_speech.split(":");
	if(currentAgent_Speech.length<2||currentAgent_Speech[1].trim()=="")return;
	if(SpeakRepeatList.length>0)
	{
	var lastSpeech = SpeakRepeatList[SpeakRepeatList.length-1];
	var lastAgent = lastSpeech.split(":")[0];
	if(lastAgent!=currentAgent_Speech[0])SpeakRepeatList=[];
	}
	SpeakRepeatList.push(agent_speech);
}
function loadAgent() {
   document.getElementById('agentsLarge').src = "angentsjs/speakTH.html";
			talkingheadLoaded = true; 
			
}
function getLessonInfo() {
	var URLParams = URI.parseQuery(window.location.search);
	/*if (URLParams.talkingheadOn != undefined) {
		talkingheadOn=URLParams.talkingheadOn;
		
	}*/
talkingheadOn="true";
	  if (URLParams.UID != undefined) {
		sessionStorage.setItem("UID", URLParams.UID);
		var getParaList = URLParams.UID.split("_")
		var uname = getParaList[getParaList.length - 1];
		sessionStorage.setItem("uname", URLParams.SName);

	} else {
		sessionStorage.setItem("UID", "autotutor_default_visitor");
		sessionStorage.setItem("uname", "autotutor_default_visitor");
	}
	if (URLParams.SID != undefined) {
		sessionStorage.setItem("SID", URLParams.SID);
	} else {
		sessionStorage.setItem("SID", "D1");
	}
	if (URLParams.IP != undefined) {
		sessionStorage.setItem("IP", URLParams.IP);

	} else {
		sessionStorage.setItem("IP", "null");
	}
	if (URLParams.SName != undefined) {

		sessionStorage.setItem("SName", URLParams.SName);


	} else {
		sessionStorage.setItem("SName", "User");
	}
	if (URLParams.LessonName != undefined) {
		getScriptFolder = URLParams.LessonName;
		var lessonStatus = setCurrentLessonInfo(getScriptFolder)
		if (lessonStatus == true) {
			GetScript(getScriptFolder);
		} else {
			alert("SYSTEM CONFIG ERROR!")
			return;
		}

	}
}

function GetTheEventAssigned(){
		
	$("#runningstatus" ).mousedown(function() {
	var con = navigator.connection || navigator.mozConnection || navigator.webkitConnetion;	
	$("#runningstatus").html("<center>Your Internet speed is "+ con.downlink+" out of 10.</center>");
	});
	
	$("#runningstatus" ).mouseup(function() {
		$("#runningstatus").html("<center>Click to see your internet connection status.</center>");
	});
	
	
	Learner=sessionStorage.getItem("UID");
	getLastActiveRecord(LRSURL,LRSLogin,LRSPassword,"start");
	GetSCORE(LRSURL,LRSLogin,LRSPassword);
	if (AllowFastForwarding){
		GetLastLessonStarting(LRSURL,LRSLogin,LRSPassword);
	}
	
	$("#runningstatus" ).mousedown(function() {
	var con = navigator.connection || navigator.mozConnection || navigator.webkitConnetion;	
	$("#runningstatus").html("<center>Your Internet speed is "+ con.downlink+" out of 10.</center>");
	});
	
	$("#runningstatus" ).mouseup(function() {
	$("#runningstatus").html("<center>Click to see your internet connection status.</center>");
	});
	

	$("#repeat").click(function() {
	if(talkingheadUsing=="Play")
	{
		 if (repeatList.length > 0) {
			repeatStatus = true;
			repeatTimes++;
			playList = playList.concat(repeatList);
			AngentPlay(playList);
			HideRepeatButton();
			HidePlayVideoButton()
		} else {
			alert("No agents speech can repeat at this page!")
		}
	
	}
	else if(talkingheadUsing=="Speak2")
	{
		repeatStatus = true;
		 repeatSpeakList();	
	}
	});
	
	
	$("#CloseCaption").click(function() {
		CaptionOn=!CaptionOn;
		showCC(CaptionOn);
		if (CaptionOn){ 
			 $("#CloseCaption").css("background-color", "green");
		}else{
			$("#CloseCaption").css("background-color", "black");
		}
	});
	
	
	$("#PauseBtn").click(function() {
		var buttonFaceValue=$("#PauseBtn").text();
		if  (buttonFaceValue=="Pause"){ 
			$("#PauseBtn").html("Continue");
			$("#FeedBackBtn").show();
			$("#ScoreBtn").show();
			if (allowediting){
			   $("#EditingBtn").show();
			}
			StopTimer();
		}else{
			$("#FeedBackBtn").hide();
			$("#ScoreBtn").hide();
			$("#EditingBtn").hide();
			StartTimer();
		}
		
	});
	
	
	
	$("#EditingBtn").click(function() {
		OpenBrowserEditing();
		
	});
	
	$("#ScoreBtn").click(function() {
		$("#ScorePanel").slideToggle("slow",function(){
			if ($("#ScorePanel").is(":visible")){
			GetReport(LRSURL,LRSLogin,LRSPassword);
			$("#PauseBtn").hide();
			}else{
				$("#PauseBtn").show();
			}
		})
		
	});
	
	$("#FeedBackBtn").click(function() {
		var URL="https://docs.google.com/forms/d/e/1FAIpQLSernYryLw1pTzWprJ3qn8Nxxl3RhtP2W6Sv2rpCRIvEv8TpXw/viewform?usp=pp_url&entry.183686984=";
		var optionText=JSON.stringify(currentPageInfor)
		window.open(URL+optionText);
	});
	
	
	
	
	$("#MuteBtn").click(function() {
		var VarTHWin=document.getElementById("agentsLarge");
		var vid = VarTHWin.contentWindow.MuteAudio();
	if (vid){
		$("#MuteBtn").html('Unmute');
		showCC(vid);
		$("#CloseCaption").css("background-color", "green");
	}else{
		$("#MuteBtn").html('Mute');
		$("#CloseCaption").css("background-color", "black");
		showCC(vid);
	}
	});
	
	
	$("#btNext").click(function() {
		//added by xhu
		userSelectedItem="";
		//added by xhu
		SpeakRepeatList=[];
		nextbtnClicked=true;
		nextButtonStatus = false;
		HideRepeatButton();
		HidePlayVideoButton()
		HideNextButton();
		var d = new Date();
		pageStartTimestamp = d.getTime();
		if(ShowButtonAndWait!=true)
		{
		 $("#mainFrame").attr("src", currentMediaUrl);
		  setProgressValue(currentMediaUrl);
		}
		else
		{
			ShowButtonAndWait=false;
		}		   
		clearTimeout(askClickNext);

	});
	$("#btReplayVideo").click(function() {
		if (replayVideo == false) {
			$(this).html("Stop Video");
			replayVideo = true;
			vidPlayerControl(videoId, replayVideo);
			HideRepeatButton();
			replayVideoTimes++;
		} else if (replayVideo == true) {
			$(this).html("Play Video");
			stopPlayVideo();
			replayVideo = false;
			vidplayerBusy = false;
			if(SpeakRepeatList.length>0)
			ShowRepeatButton();
		}
	});
	$("#readText").click(function() {
		if ($('#readTextImg').attr('src') == "images/SpeakBefore.png") {
			$("#readTextImg").attr("src", "images/SpeakAfter.png");
			document.getElementById('mainFrame').contentWindow.Lock();
			maxIdle = 1000000000;

			$("#audioPlayer2").attr("src", currentMediaPath + audioPath);
			document.getElementById('audioPlayer2').play();

		} else if ($('#readTextImg').attr('src') == "images/SpeakAfter.png") {
			$("#readTextImg").attr("src", "images/SpeakBefore.png");
			document.getElementById('mainFrame').contentWindow.Unlock();
			var mediaElement = document.getElementById("audioPlayer2");
			mediaElement.pause();
			mediaElement.src = '';
		}
	});
}


function GetStarted(){
	if (actions.length!=0){
		restart();
		return;
	}
   user=GetEmail();
   fullname=GetFullName();
   LearnerID={mbox:"mailto:"+user,
				 name:fullname,
				 objectType:"Agent"
				};
	DataLRS();
	loadAgent();
	showCC(false);
	Learner=sessionStorage.getItem("UID");
	getLastActiveRecord(LRSURL,LRSLogin,LRSPassword,"start");
	GetSCORE(LRSURL,LRSLogin,LRSPassword);
	if (AllowFastForwarding){
		GetLastLessonStarting(LRSURL,LRSLogin,LRSPassword);
	}
	$("#editor").hide();
	$("#containerNoImg").show();
	DebuggingMode=((qs("DEBUGGNG","0")=="1")&&(qs("RuleName","")!=""));
}

function restart(){
	actions=[];
	DataLRS();
	$("#editor").hide();
	$("#containerNoImg").show();
	showCC(false);
	getLastActiveRecord(LRSURL,LRSLogin,LRSPassword,"start");
	GetSCORE(LRSURL,LRSLogin,LRSPassword);
	if (AllowFastForwarding){
		GetLastLessonStarting(LRSURL,LRSLogin,LRSPassword);
	}
	var acePostjson = constructFirstJsontoPut(AutoTutorScript,currentScripturl,currentLessonID);
	Post(acePostjson);
}



$(document).ready(function() {
	GetTheEventAssigned();
	if (qs("editing","0")=="1"){
		onLoad1();
		return;
	}else{
	GetStarted();
	}
});

function startLesson() {
var x2 = $(window).width();
	if (x2 < 1400) {
		$("#containerNoImg").attr('style', " -ms-zoom: 0.8; -moz-transform: scale(0.8); -moz-transform-origin: 0px 0; -o-transform: scale(0.8); -o-transform-origin: 0 0; -webkit-transform: scale(0.8); -webkit-transform-origin: 0 0; ");
	}
	document.getElementById('mainscreen').style.display="block";
	document.getElementById('containerNoImg').style.backgroundImage = "url(images/TabletFrame2.png)";
	document.getElementById('containerNoImg').style.backgroundPosition="center bottom";
	document.getElementById('containerNoImg').style.backgroundRepeat = "no-repeat";
	document.getElementById('agentsLarge').style.height = "97px";
 var loadingPage = "resources/LoadingPage.html";
	$("#mainFrame").attr("src", loadingPage);
	$("#home").hide();
	$("#CloseCaption").show();
	$("#MuteBtn").show();
	$("#displayArea").hide();
	allLessonsInfoObj = getLessonsConfig();
	getLessonInfo();
}
function repeatSpeakList()
{
	if(SpeakRepeatList.length==0)return;
	agentBusy = true;
	
	for(var i=0; i<SpeakRepeatList.length;i++)
	{
			Speak2(SpeakRepeatList[i]);
	}
	
}
function constructFirstJsontoPut(TheAutoTutorScript,ThecurrentScripturl,ThelessonID){
	var acePostjson = {};
    acePostjson.ScriptURL = ThecurrentScripturl;

//	if (TheAutoTutorScript!=""){
//		var theScripts=new XMLSerializer().serializeToString(TheAutoTutorScript);
//		acePostjson.ScriptXML=theScripts;
//	}else{
//		acePostjson.ScriptURL = ThecurrentScripturl;
//	}


	acePostjson.User = sessionStorage.getItem("uname");
	acePostjson.UseDB = true;
	
	if (ThelessonID == "lesson0" || ThelessonID == "lesson00") {
		// acePostjson.ID = sessionStorage.getItem("GUID");
		acePostjson.ID = sessionStorage.getItem("UID");

	} else {
		acePostjson.ID = sessionStorage.getItem("UID");

	}
	return acePostjson;
}

function LoadLesson(lessonID) {
	var loadingPage = "resources/LoadingPage.html";
	$("#mainFrame").attr("src", loadingPage);
	
	var retriveObj={
		guid:qs("guid",""),
		source:"ScriptOnly",
		return:"scriptContent",
		authorname:"xiangenhu",
		TagName:"AutoTutorScript"}
	var aurl="https://class.x-in-y.com/retrieve?json="+JSON.stringify(retriveObj);
	
	currentScripturl = scriptFolderURL + lessonID + "/ActivityMedia/Activity.xml";
	if (qs("useGUID","1")==1){
		if (asatLRSExists=="0"){
          currentScripturl = aurl;
		}else{
			guid=qs("guid","");
			currentScripturl=URLToBuncer("AutoTutorScript");
			
		}
   
	}
	
	currentMediaPath = MediaFolderURL + lessonID + "/ActivityMedia/";
	setPresentationIDObj(lessonID, currentScripturl);
	

	var acePostjson = constructFirstJsontoPut(AutoTutorScript,currentScripturl,lessonID);
	
	replayVideoTimes = 0;
	currentJSON=acePostjson;
	Post(acePostjson);
	checkLessonConfig(lessonID, 1);


}

function checkLessonConfig(lessonID, progressValue) {
	currentLessonInfoObj = JSON.parse(sessionStorage.getItem("LessonInfo"));
	isHasProgressBar = currentLessonInfoObj.isHasProgressBar;
	isHasNextButton = currentLessonInfoObj.isHasNextButton;
	isHasVideo = currentLessonInfoObj.isHasVideo;
	videoId = currentLessonInfoObj.videoId;
	if (isHasProgressBar == true) {
		ShowProgressbar();
		setProgress(progressValue);

	} else {
		HideProgressbar();
	}

}

function setProgressValue(currentMediaUrl) {
	if (isHasProgressBar == true) {
		var List = currentMediaUrl.split("?");
		var pageNameList = List[0].split("/");
		var pageName = pageNameList[pageNameList.length - 1];
		for (var i in currentLessonInfoObj.pages) {

			if (currentLessonInfoObj.pages[i].questionPath == pageName) {
				var progressBarValue = currentLessonInfoObj.pages[i].progressBarValue;
				if (progressBarValue != "0") {
					setProgress(progressBarValue);
				}

			}
		}
	}

}

function ConstructJSONandSubmitAfteActionisDone(InputJSON){
	var acePutjson = {};
	if (InputJSON==null){
		longAction=[];
		setPresentationHistoryObj();
		var PresentationIDObjStr = JSON.stringify(PresentationIDObj);
		var PresentationHistoryObjStr = JSON.stringify(PresentationHistoryObj);
		
		acePutjson.PresentationID = PresentationIDObjStr;
		acePutjson.PresentationHistory = PresentationHistoryObjStr;
		
		if(PresentationHistoryObj.userSelectedItem=="I'm not sure.")
		{
			mediaActions="unsure";
		}
		if (currentLessonID != "lesson0") {


		   if(mediaActions=="userInputTrue")
			{
			mediaActions="";
			}
			acePutjson.ID = sessionStorage.getItem("UID");
			acePutjson.Text = userInput;
			acePutjson.Event = mediaActions;

		} else if (currentLessonID == "lesson0" || currentLessonID != "lesson00") {
			//acePutjson.ID = sessionStorage.getItem("GUID");
			acePutjson.ID = sessionStorage.getItem("UID");
			acePutjson.Text = userInput;
			acePutjson.Event = mediaActions;
		}
//		console.log(acePutjson);
		return acePutjson;
	}else{
		return InputJSON;
	}
}


function findCurrentPoint(){
	var i;
	var j;
	for (i=0;i<actions.length;i++){
		for (j=0;j<InteractionHistory.length;j++) {
			if (actions[i].Data==InteractionHistory[j].data.Data){
				var InputGot=InteractionHistory[j].input;
				InteractionHistory.splice(j, 1);
				return InputGot;
			}
		}
	}
	return null;
}

function removemovie(){
	if (InteractionHistory.length==0){
		return;
	}
	var i;
	for (i=actions.length-1;i>0;i--){
		if (actions[i].Data.indexOf("mp4")>-1){
			actions.splice(i, 1);
		}
	}
}
function stopff(){
	InteractionHistory=[];
}

function runActions() {
	if (InteractionHistory.length!=0){
		var lastadata=DateString(InteractionHistory[InteractionHistory.length-1].time);
		var thehtml="<table heigh='100%' width='100%'>";
		thehtml=thehtml+"<tr><td><p/> <p/> <h1><p/>Please Wait ....</h1></td></tr>";
		thehtml=thehtml+"<tr><td><h1>Fast Forwarding to where you have stopped</h1></td></tr>";
		thehtml=thehtml+"<tr><td valign='middle'><h2>("+lastadata+")</h2></td></tr>";
		thehtml=thehtml+"<tr><td> steps remaining: "+InteractionHistory.length.toString()+"</td></tr>";
//		thehtml=thehtml+"<tr><td><button id='stopFF' onclick='stopff()'>Stop</button> </td></tr>";
		thehtml=thehtml+"</table>";
		$('#TheFastForwardCover').html(thehtml);
		$('#TheFastForwardCover').show();
	}else{
		$('#TheFastForwardCover').hide();
	}
	if (agentBusy==true) {
		return;
	}
	if (nextButtonStatus == true) {
		if (InteractionHistory.length==0) {
			return;
		}else{
			$("#btNext").trigger('click');
		}
	}
	
	idleTime++;
	if (idleTime < maxIdle && mediaActions == "") {
		return;
	}
	
	idleTime = 0;
	maxIdle = 0;
	trialTimes++;
	if (InteractionHistory.length>1){
		if (trialTimes==10){
			InteractionHistory=removeLastElement(backupInteractionHistory,1);
			backupInteractionHistory=removeLastElement(InteractionHistory,0);
			talkingheadLoaded=true;
			GetScript(currentLessonID);
			trialTimes=0;
			return;
		}
	}
	
	
	if (actions.length != 0) {
		trialTimes=0;
//		removemovie();
		var act = actions[0].Act;
		var agent = actions[0].Agent;
		var data = actions[0].Data;
		var agentNum;
		var isSpeakingSegments = false;
//		console.log(actions[0]);
		
		var RecordObj={Act:act,Agent:agent,Data:data.split("#").join("")};
		
		longAction.push(JSON.stringify(RecordObj));
		var FeedbackHistry=parseInt(qs("FeedbackHistoryLength","5"));
		if (longAction.length>FeedbackHistry){
			longAction.splice(0,1);
		}
		
		currentPageInfor={ACEPostjson:currentJSON,PastAFewACEActions:longAction,CurrentACEAction:RecordObj};	
		
		if (agent != "Cristina" && agent != "Jordan" && agent != "System") {
			return;
		} else if (agent == "Cristina") {
			agentNum = 0;
		} else if (agent == "Jordan") {
			agentNum = 1;
		}
		switch (act) {
			case "SetValue":
				var ScoreInfo = data.split(":");
				ScoreName = ScoreInfo[0];
				Score = ScoreInfo[1];
				break;
			case "AddValue":
				var ScoreInfo = data.split(":");
				ScoreName = ScoreInfo[0];
				Score = ScoreInfo[1];
				break;
			case "ShowValue":
				var ScoreInfo = data.split(":");
				ScoreName = ScoreInfo[0];
				Score = ScoreInfo[1];

				SetScoreBoard(ScoreName, Score);

				break;
			case "Display":
			
			//    var getUserName =sessionStorage.getItem("uname");
			    var getUserName=GetFullName();
				if (actions[actions.length - 1].Act == "WaitForEvent" && actions[actions.length - 1].Data >= "60") {
					getQuestionName = data.replace(getUserName, "_user_");
				}else if (actions[actions.length - 1].Act == "WaitForEvent" && actions[actions.length - 1].Data == "30" && currentLessonID=="lesson10") {
					getQuestionName = data.replace(getUserName, "_user_");
				}
//				console.log(getQuestionName);
				appendTextToDisplayArea(data);


				break;
			case "Speak":
			//	var uname = sessionStorage.getItem("uname");
				var uname=GetFullName();
				data = data.replace("_user_",uname);
				data = agentNum + ":" + data;
				break;
			case "Play":
			    if (InteractionHistory.lengt==0){
					if(talkingheadUsing=="Play")
					{
						playList = setPlayList(agentNum, data);
						repeatList = repeatList.concat(playList);
						AngentPlay(playList);
					}
				}
				   
				break;
			case "Speak2":
				if(talkingheadUsing=="Speak2")
				{
					if (InteractionHistory.length==0){
						agentBusy = true;
					//	var SName = sessionStorage.getItem("SName");
						var SName=GetFullName();
						data = data.replace("_user_,", "#"+SName+"#");
						data = data.replace("_user_!", "#"+SName+"#");
						data = data.replace("_user_.", "#"+SName+"#");
						data = data.replace("_user_?", "#"+SName+"#");
						data = data.replace("_user_", "#"+SName+"#");
						var segments = data.split('#');
						data = agentNum + ":" + segments[0];
						var mergedSegments = "";
						var nseg;
						for(nseg = 1;nseg<segments.length;nseg++)
						{
							var segment = segments[nseg].trim();
							if(segment=="")continue;
							if(isPunctuation(segment) )continue;
							
							mergedSegments +=segments[nseg]+"#";
						}
						if(mergedSegments!="")
						{
						 actions[0].Data=mergedSegments;
						isSpeakingSegments = true;
						}
						Speak2(data);
						 //SpeakRepeatList.push(data);
						 addRepeatSpeech(data);
					}
				}
				   
				break;
			case "SpeakLater":

				break;
			case "ShowMedia":
				if (data.includes(".html") == true) {
					CurrentMedia=actions[0];
					showMedia(data); // Calling the showMedia function to load the HTML page in the main IFRAME
				} else if (data.includes("mp4") == true) {
					var datasplit = data.split("/");
					var vidId = datasplit[datasplit.length - 1];
					vidPlayerControl(vidId + ":2");
				}
				break;
			case "PauseAt":
			    pauseAtTime = parseInt(data);
				if (InteractionHistory.length!=0){
//				  pauseAtTime=1;
				}
				document.getElementById('vid').contentWindow.setPauseTime(pauseAtTime);
				break;
			case "PlayNow":
				document.getElementById('vid').contentWindow.videoPlay();
				break;
			case "Wait":
			   if (InteractionHistory.length==0){
					maxIdle = parseInt(data) * 10;
					waitForMediaResponse = true; 
				}else{
					maxIdle = parseInt(data) ;
					waitForMediaResponse = false; 
				}
				break;
			case "WaitForEvent":
				if (data > 6) {
					repeatTimes = 0;
					if(SpeakRepeatList.length>0)
					ShowRepeatButton();
					ShowPlayVideoButton();
					document.getElementById('mainFrame').contentWindow.Unlock();
					waitForUserResponse = true;
					var d = new Date();
					talkingHeadSpeechEndTimestamp = d.getTime();					
					if (mediaActions != "") {
						mediaActions = "";
					}
					userSpendTimeCounting();
					var List = currentMediaUrl.split("?");
					var pageNameList = List[0].split("/");
					if(pageNameList[pageNameList.length-1]=="L18-MainPage.html"){
					waitForUserResponse = false;
					}
					if (InteractionHistory.length!=0){
						maxIdle = parseInt(data);
					   GetWorldEvent(getRightMsg());
					}else{
						maxIdle = parseInt(data) * 10;
					}
				}
				break;
			case "WaitForInput":
				repeatTimes = 0;
				if(SpeakRepeatList.length>0)
				ShowRepeatButton();
				ShowPlayVideoButton();
				ShowTextInputDialog();
				waitForUserResponse = true;
				  var d = new Date();
					talkingHeadSpeechEndTimestamp = d.getTime();
				userSpendTimeCounting();
				maxIdle = parseInt(data) * 10;
				if (mediaActions != "") {
					mediaActions = "";
				} 
				if (InteractionHistory.length!=0){
					   GetWorldEvent(getRightMsg());
					}
				break;
			case "WaitForMediaInput":
				repeatTimes = 0;
				if(SpeakRepeatList.length>0)
				ShowRepeatButton();
				ShowPlayVideoButton();
				document.getElementById('mainFrame').contentWindow.Unlock();
				var d = new Date();
				talkingHeadSpeechEndTimestamp = d.getTime();
				waitForUserResponse = true;
				countingSpendTime = true;
				userSpendTimeCounting();
				maxIdle = parseInt(data) * 10;
				if (mediaActions != "") {
					mediaActions = "";
				}
				if (InteractionHistory.length!=0){
					   GetWorldEvent(getRightMsg());
					}
				break;
			case "WaitForNothing":
				maxIdle = 5;
				waitForUserResponse = false;
				waitForMediaResponse = false;
				break;
			case "Lock":
				document.getElementById('mainFrame').contentWindow.Lock();
				break;
			case "Unlock":
				document.getElementById('mainFrame').contentWindow.Unlock();
				break;
			case "GetMediaItem":
				document.getElementById('mainFrame').contentWindow.GetItem();
				break;
			case "ShowMediaItem":
				document.getElementById('mainFrame').contentWindow.ShowItem();
				break;
			case "ShowAudioButton":
				ShowAudioButton()
				audioPath = data;
				break;
			case "HideAudioButton":
				HideAudioButton()
				audioPath = "";
				break;
			case "GetMediaMessage":
				break;
			case "GetMediaEvent":
				/* 	
				if (InteractionHistory.length==0){
				waitForMediaResponse = true;	
				InvokeScript(act, data);
				}else{
					waitForMediaResponse = true;	
				} */	
				waitForMediaResponse = true;
				InvokeScript(act, data);
				/* if (InteractionHistory.length==0){
				}else{
				} */
				break;
			case "GetMediaFeedback":
				getMediaFeedBackData = data;
				document.getElementById('mainFrame').contentWindow.GetMediaFeedback(data);
				getMediaFeedBack = true;
				break;
			case "GetMediaSpeech":
				break;
			case "ShowMediaAnswer":
				document.getElementById('mainFrame').contentWindow.ShowMediaAnswer();
				break;
			case "End":
			if (currentLessonID == "lesson10") {
				setProgress(100);
				}			 
				showEndingPage();
				mainpageInit2();
				InitParameters();
				break;
			case "ShowButtonAndWait":
				if(data=="NextPage") {
					ShowNextButton();
					nextButtonStatus = true;
					ShowButtonAndWait=true;
					if (currentLessonID == "Lesson9")
					{
						InvokeScript("getProgressBarValue", "");
					}
				
				}
				break;	  
			default:
				break;
		}
		if(!isSpeakingSegments) actions.splice(0, 1); // remove the current action except when there are more segments to speak
	} else if (actions.length == 0 && vidplayerBusy == false && PutStatus == false) {	
	    
		if (mediaActions == "" && waitForUserResponse == true) {
			return;
		}
		if (mediaActions == "" && waitForMediaResponse == true) {
			if (InteractionHistory.length==0){
			return;
			}
		}
		var inputjs=ConstructJSONandSubmitAfteActionisDone(null);
		var savedinput=findCurrentPoint();
		
		
		Put(inputjs);
		
		PutStatus = true;
		StopTimer();
		mediaActions = "";
		userInput = "";
		userAnswerSpendTime = 0;
		waitForUserResponse = false;
		waitForMediaResponse = false;
		repeatList = [];
		SpeakRepeatList=[];
	}

}
var timer;

function StartTimer() {
	$("#PauseBtn").show();
	$("#PauseBtn").html("Pause");
	var interval=100;
	if (InteractionHistory.length!=0){
		lessonID=sessionStorage.getItem("LessonID");
		if (lessonID=="lesson1"){
		interval=100;
		}else{
			interval=1;
		}
	}
	timer = setInterval(function() {
		if (DebuggingMode){
			getACEActionAndPlay(qs("RuleName",""));
			DebuggingMode=false;
		}else{
			runActions();
		}
	}, interval);
}

function StopTimer() {
	clearInterval(timer);
}
function Speak2(data)
{
	if(talkingheadOn=="true")
	{
	document.getElementById('agentsLarge').contentWindow.callBoth(data, "Speak", "on");
	}
	else
	{
	document.getElementById('agentsLarge').contentWindow.callBoth(data, "Speak", "off");
	}
 


}
	function isPunctuation(ch)
	{
		return ch.toLowerCase() == ch.toUpperCase();
	}
function AngentSpeak(data) {
	if (talkingheadOn == true) {
		agentBusy = true;
		document.getElementById('agentsLarge').contentWindow.callBoth(data, "Speak", "on");
	} else
	if (talkingheadOn == false) {
		agentBusy = true;
		document.getElementById('agentsLarge').contentWindow.callBoth(data, "Speak", "off");
	}
}
var playList;
var playListStatus = false;

function AngentPlay(playList) {
	if (talkingheadOn == true) {
		agentBusy = true;
		document.getElementById('agentsLarge').contentWindow.callBoth(playList[0], "Play", "on");
		playList.splice(0, 1);

		if (playList.length == 0) {
			playListStatus = false;
		} else {
			playListStatus = true;
		}

	} else if (talkingheadOn == false) {
		agentBusy = true;

		document.getElementById('agentsLarge').contentWindow.callBoth(playList[0], "Play", "off");
		playList.splice(0, 1);

		if (playList.length == 0) {
			playListStatus = false;
		} else {
			playListStatus = true;
		}
	}


}

function SetScoreBoard(ScoreName, Score) {
	ShowScoreBoard();
	if (ScoreName != "JordanScore") {

		var SName = sessionStorage.getItem("SName");

		$('#scoreBoardUserNameL').html(SName);
		$('#scoreL').html(Score);

	} else {

		$('#scoreBoardUserNameR').html("Jordan");
		$('#scoreR').html(Score);
	}

}

function setPlayList(agentNum, data) {
	playList = data.split(",");
	var SID = sessionStorage.getItem("SID");
	var newPlayList = [];
	var speech;
	for (var i = 0; i < playList.length; i++) {
		if (playList[i] == "_user_") {
			speech = agentNum + ":" + SID;
		} else {
			speech = agentNum + ":" + playList[i];
		}

		newPlayList.push(speech);

	}
	return newPlayList;


}

function showScriptNextButton(data) {
	var getMediaObj = currentLessonInfoObj.pages;
	var lessonID = sessionStorage.getItem("LessonID");
	var dataURL = data.toLowerCase();
	if(dataURL.indexOf("?")>0)
	dataURL = dataURL.substring(0,dataURL.indexOf("?"));
	dataURL = dataURL.replace("media/","media\\");
	if (NextButtonOn == true && isHasNextButton == true) {
		for (var i in getMediaObj) {
			if (getMediaObj[i].Type == "ReadingPage")
			{
			 var	mediaPath = "media\\" + getMediaObj[i].MediaPath;                      
				 if (mediaPath.toLowerCase() == dataURL) 
				 {
					isQuestionPageAfterFirst=false;
				 }
			}
			if (getMediaObj[i].Type == "QuestionPage") {
				var pagePath = "media\\" + getMediaObj[i].questionPath;
				//if (pagePath.toLowerCase() == data.toLowerCase()) 
				 if (pagePath.toLowerCase() == dataURL) 
				{
				if(lessonID=="lesson8" ||  lessonID == "lesson9" || lessonID == "lesson10")
					{
					   $("#mainFrame").attr("src", currentMediaUrl);

						var d = new Date();
						pageStartTimestamp = d.getTime();
						 if(lessonID == "lesson10") // ***zc: added by z cai 11/30/2018
						 {
						  setProgress(getMediaObj[i].progressBarValue);
						 }
					}
					else
					{
						if(!isQuestionPageAfterFirst)
					{
					isQuestionPageAfterFirst=true;
					skipNextButton();
					}
					else
					{
					 ShowNextButton();
						nextButtonStatus = true;
						setProgress(getMediaObj[i].progressBarValue);
						askClickNext = setTimeout(askClickNextButton, 30000);
						}
						return;
					
					}
					
				} else if (i == (getMediaObj.length - 1)) {
					$("#mainFrame").attr("src", currentMediaUrl);

					var d = new Date();
					pageStartTimestamp = d.getTime();

				}
			}

		}
	}
	else
	{
	  $("#mainFrame").attr("src", currentMediaUrl);

						var d = new Date();
						pageStartTimestamp = d.getTime();
	
	}

}				  
function showMedia(data) {
	repeatList = [];
	SpeakRepeatList=[];
	HideRepeatButton();
	HidePlayVideoButton();
	currentMediaUrl = currentMediaPath + data;
	showScriptNextButton(data);
  /*  $("#mainFrame").attr("src", currentMediaUrl);
  
	var d = new Date();
	pageStartTimestamp = d.getTime();*/

}
function skipNextButton()
{
 nextButtonStatus = false;
		HideRepeatButton();
		HidePlayVideoButton()
		HideNextButton();
		var d = new Date();
		pageStartTimestamp = d.getTime();
		ShowButtonAndWait=false;
		
		 $("#mainFrame").attr("src", currentMediaUrl);
		  setProgressValue(currentMediaUrl);
		
}	   
var askClickNext;
function nextPage(data) {
	repeatList = [];
	SpeakRepeatList=[];
		var currentMediaUrlList1=currentMediaUrl.split("/");
	var currentMediaUrlList2=(currentMediaUrlList1[currentMediaUrlList1.length-1]).split('?');										  
	currentMediaUrl = currentMediaPath + data;
	if (NextButtonOn == true && isHasNextButton == true) {
	if(currentMediaUrlList2[0]=="L18-MainPage.html" || currentMediaUrlList2[0]=="L11Round1AMainPage.html")
	{
	
		nextButtonStatus = false;
		HideRepeatButton();
		HidePlayVideoButton()
		HideNextButton();
		var d = new Date();
		pageStartTimestamp = d.getTime();
		$("#mainFrame").attr("src", currentMediaUrl);

		//getPageName and display progress
		setProgressValue(currentMediaUrl);
	
	}
	else
	{
		showScriptNextButton(data); //modified by Cai, 10/24/2018
	 /*ShowNextButton();
		nextButtonStatus = true;

		askClickNext = setTimeout(askClickNextButton, 30000);*/
	
	}
	   

	} else {
		nextButtonStatus = false;
		HideRepeatButton();
		HidePlayVideoButton()
		HideNextButton();
		var d = new Date();
		pageStartTimestamp = d.getTime();
		$("#mainFrame").attr("src", currentMediaUrl);
	  
		//getPageName and display progress
		setProgressValue(currentMediaUrl);

	}

}
function askClickNextButton()
{
	var lessonID=sessionStorage.getItem("LessonID");
	/*if(lessonID=="lesson1" ||lessonID=="lesson2" ||lessonID=="lesson4" || lessonID=="lesson6"|| lessonID=="lesson7"|| lessonID=="lesson12" || lessonID=="lesson15"|| lessonID =="lesson17" || lessonID=="lesson18"||lessonID=="lesson20"|| lessonID =="lesson21" ||lessonID == "lesson22" || lessonID=="lesson24"||lessonID=="lesson25"||  lessonID=="lesson27" || lessonID=="lesson28"||  lessonID=="lesson29"||lessonID=="lesson30"||lessonID=="lesson31" ||  lessonID=="lesson32" || lessonID == "lesson33" )*/
	if(lessonID!="lesson10"&&lessonID!="lesson11"&&lessonID!="lesson18")
	{
		//var playList=setPlayList("0", "s1");
		// AngentPlay(playList);
		var nextButtonPrompt = "0:Please click on the next buttton to continue.";
		Speak2(nextButtonPrompt);
		 askClickNext=setTimeout(askClickNextButton, 60000);
	
	}
}
function getAgentMessage(msg){
	startLesson();
}
  function GetWorldEvent(msg) {
	 if (InteractionHistory.length==0){
		var pairData={"data":actions,"msg":msg,"CurrentMedia":CurrentMedia.Data};
		AceResponse(pairData,"interaction");
	}else{
		
		if (InteractionHistory[0].msg==msg){
		InteractionHistory.shift();
		}else{
//			InteractionHistory.shift();
		}
	}
	var msgType = typeof msg;
	idleTime = 0;
	maxIdle = 0;

	if (waitForUserResponse == true) {
		endCounting();
		HideRepeatButton();
		HidePlayVideoButton();
		if (msgType == "string") {
			var n = msg.indexOf("userAnswer_");
			var n2 = msg.indexOf("userInput_");
			if (n != -1) {
				var getUserAnswer = msg.split("_");
				mediaActions = getUserAnswer[1];
				userAnswer = mediaActions;
				userSelectedItem = getUserAnswer[2];
				if (userSelectedItem == "I'm not sure.") {
					mediaActions = "unsure";
				}
			} 
			else if(n2!=-1)
			{
				var getUserAnswer = msg.split("_");
				mediaActions = getUserAnswer[1];
				userAnswer = mediaActions;
				userInput=mediaActions
				userSelectedItem = getUserAnswer[2];
				mediaActions="userInputTrue";
			   
			
			}
			else {
				mediaActions = msg;
			}

		} else if (msgType == "object") {
			userAnswer = msg.userAnswer;
			userSelectedItem = msg.userSelectedItem;
			mediaActions = msg.userAnswer;
			var lessonID = sessionStorage.getItem("LessonID");
			if (lessonID == "lesson8") {

				getQuestionName = msg.question;
			}


		}


	} else {
		mediaActions = msg;
		var lessonID = sessionStorage.getItem("LessonID");
		if (mediaActions == mediaActions && lessonID == "lesson8") {
			repeatList = [];

		}
		if (lessonID == "lesson10" && msg == "Continue") {
			repeatList = [];
		}
	}
	if (repeatStatus == true) {
		repeatList = [];
		repeatStatus = false;
	}

}


function GetMediaFeedBackMsg(msg) {

	if (getMediaFeedBack == true) {

		getMediaFeedBack = false;
	}
	//	var uname = sessionStorage.getItem("uname");
	var uname=GetFullName();
	msg = msg.replace("_user_", uname);
	SpeakRepeatList=[];
	var feedBackInfo = msg.split(':');
	var agentFeedBack = feedBackInfo[1];
	if (agentFeedBack == "Instruction" || agentFeedBack == "TAGoodAnswer") {
		Speak2("0:"+feedBackInfo[2]);
		//SpeakRepeatList.push("0:"+feedBackInfo[2]);
		addRepeatSpeech("0:"+feedBackInfo[2]);
		}
	else if (agentFeedBack == "SAGoodAnswer" || agentFeedBack == "SABadAnswer" || agentFeedBack == "SABadAnswer") {
	   
		   Speak2("1:"+feedBackInfo[2]);
		   //SpeakRepeatList.push("1:"+feedBackInfo[2]);
		   addRepeatSpeech("1:"+feedBackInfo[2]);
		}
	}
function GetMediaFeedBackMsg_old(msg) {

	if (getMediaFeedBack == true) {

		getMediaFeedBack = false;
	}
	var feedBackInfo = msg.split(':');
	var agentFeedBack = feedBackInfo[1];
	if (agentFeedBack == "Instruction" || agentFeedBack == "TAGoodAnswer") {

		if (feedBackInfo[0] == "Cristina") {

			var test = feedBackInfo[2];

			if (test.indexOf("_user_") >= 0) {
				playList = setPlayList(0, feedBackInfo[3]);
				repeatList = repeatList.concat(playList);
				AngentPlay(playList);
			} else {
				playList = setPlayList(0, feedBackInfo[3]);
				repeatList = repeatList.concat(playList);
				AngentPlay(playList);
			}

		}

	} else if (agentFeedBack == "SAGoodAnswer" || agentFeedBack == "SABadAnswer" || agentFeedBack == "SABadAnswer") {
		if (feedBackInfo[0] == "Jordan") {


			playList = setPlayList(1, feedBackInfo[3]);
			//playList = setPlayList(1, feedBackInfo[4]);
			repeatList = repeatList.concat(playList);
			AngentPlay(playList);


		}
	}

}
function setPresentationIDObj(lessonID, currentScripturl) {
	PresentationIDObj = {};
	PresentationIDObj.lessonID = lessonID;
	PresentationIDObj.scriptPath = currentScripturl;
	PresentationIDObj.timeStemp = setTimeStemp();
	PresentationIDObj.browser = sessionStorage.getItem("browser");
	return PresentationIDObj;

}

function setPresentationHistoryObj() {
	PresentationHistoryObj = {};
	currentMediaUrl = currentMediaUrl.replace(/\\/g, "\/");
	//every time user need to answer question, system start to count repeatTimes
	PresentationHistoryObj.repeatTimes = repeatTimes;
	PresentationHistoryObj.userAnswerSpendTime = userAnswerSpendTime;
	PresentationHistoryObj.userAnswer = userAnswer;
	PresentationHistoryObj.MediaUrl = currentMediaUrl;
	PresentationHistoryObj.userSelectedItem = userSelectedItem;
	PresentationHistoryObj.userInput = userInput;
	PresentationHistoryObj.replayVideoTimes = replayVideoTimes;
	PresentationHistoryObj.UID = sessionStorage.getItem("UID");
	PresentationHistoryObj.pageStartTimestamp = pageStartTimestamp;

	//
	var getMediaObj = currentLessonInfoObj.pages;


	var List = currentMediaUrl.split("?");
	var pageNameList = List[0].split("/");
	for (var i in getMediaObj) {

		var geMediaPath = getMediaObj[i].MediaPath;
		var getQuestionPath = getMediaObj[i].questionPath;
		var getType = getMediaObj[i].Type;
		if (getType == "ReadingPage") {
			getQuestionPath = geMediaPath;
		}
		if (getQuestionPath == pageNameList[pageNameList.length - 1]) {

			if (getMediaObj[i].quesionName != undefined) {

				var questionName1 = getMediaObj[i].quesionName.trim().toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
				console.log("111111-----------"+getQuestionName)
				var questionName2 = getQuestionName.trim().toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
				if (questionName1 == questionName2) {
					if (getType == "QuestionPage") {
						PresentationHistoryObj.Type = "QuestionPage";
						PresentationHistoryObj.questionName = getMediaObj[i].quesionName;
						PresentationHistoryObj.questionID = getMediaObj[i].questionID;
						PresentationHistoryObj.questionLevel = getMediaObj[i].questionLevel;
						PresentationHistoryObj.progressBarValue = getMediaObj[i].progressBarValue;
						 if (getMediaObj[i].notCountedItem == false && userAnswer !== "" && waitForUserResponse == true) {
						  var d = new Date();
						var userAnswerTimestamp = d.getTime();

						CountTotalScore(questionName1, userAnswer, getMediaObj[i].questionLevel,PresentationHistoryObj.userSelectedItem,PresentationHistoryObj.questionID,PresentationHistoryObj.pageStartTimestamp,talkingHeadSpeechEndTimestamp,userAnswerTimestamp,PresentationHistoryObj.userAnswerSpendTime,PresentationHistoryObj.progressBarValue);
						}
						PresentationHistoryObj.newUserPerfomaceLog = TotalScoreArr;
						console.log(getMediaObj[i].questionID);
					} else if (getType == "ReadingPage") {
						PresentationHistoryObj.Type = "ReadingPage";
						PresentationHistoryObj.lessonTextType = getMediaObj[i].lessonTextType;
						PresentationHistoryObj.MediaPath = getMediaObj[i].MediaPath;
						PresentationHistoryObj.ReadingType = getMediaObj[i].ReadingType;
						PresentationHistoryObj.TextLevel = getMediaObj[i].TextLevel;
						PresentationHistoryObj.ImagePath = getMediaObj[i].ImagePath;
						PresentationHistoryObj.TextLength = getMediaObj[i].TextLength;
					}
				}
			} else {
				if (getType == "QuestionPage") {
					PresentationHistoryObj.Type = "QuestionPage";
					PresentationHistoryObj.questionID = getMediaObj[i].questionID;
					PresentationHistoryObj.questionLevel = getMediaObj[i].questionLevel;
					PresentationHistoryObj.progressBarValue = getMediaObj[i].progressBarValue;
					PresentationHistoryObj.notCountedItem = getMediaObj[i].notCountedItem;
					PresentationHistoryObj.questionLevel = getMediaObj[i].questionLevel;
					 var d = new Date();
						var userAnswerTimestamp = d.getTime();
					if (getMediaObj[i].notCountedItem == false && userAnswer !== "" && waitForUserResponse == true) {

						CountTotalScore(getMediaObj[i].questionPath, userAnswer, getMediaObj[i].questionLevel,PresentationHistoryObj.userSelectedItem,PresentationHistoryObj.questionID,PresentationHistoryObj.pageStartTimestamp,talkingHeadSpeechEndTimestamp,userAnswerTimestamp,PresentationHistoryObj.userAnswerSpendTime,PresentationHistoryObj.progressBarValue);
					}
					PresentationHistoryObj.newUserPerfomaceLog = TotalScoreArr;

				} else if (getType == "ReadingPage") {
					PresentationHistoryObj.Type = "ReadingPage";
					PresentationHistoryObj.lessonTextType = getMediaObj[i].lessonTextType;
					PresentationHistoryObj.MediaPath = getMediaObj[i].MediaPath;
					PresentationHistoryObj.ReadingType = getMediaObj[i].ReadingType;
					PresentationHistoryObj.TextLevel = getMediaObj[i].TextLevel;
					PresentationHistoryObj.ImagePath = getMediaObj[i].ImagePath;
					PresentationHistoryObj.TextLength = getMediaObj[i].TextLength;
				}


			}

//			console.log(getMediaObj[i].questionID);

		}



	}

	return PresentationHistoryObj;

}
var userAnswerSpendTime = 0

function userSpendTimeCounting() {

	userAnswerSpendTime = userAnswerSpendTime + 1
	t = setTimeout("userSpendTimeCounting()", 1000)
}

function endCounting() {
	clearTimeout(t);
	return userAnswerSpendTime;
}

function InvokeScript(funcName, funcParam) {

	if (funcParam != "") {
		try {
			document.getElementById('mainFrame').contentWindow[funcName](funcParam);
		}catch(err){
		}finally{
			document.getElementById('mainFrame').contentWindow[funcName]();
		}
	} else {
		document.getElementById('mainFrame').contentWindow[funcName]();
	}

}

function startRecover(recoveryActions, lessonID, PresentationHistory) {
	repeatTimes = PresentationHistory.repeatTimes;
	replayVideoTimes = PresentationHistory.replayVideoTimes;
	
	/* var url = scriptFolderURL + lessonID + "/html5/index.html?lessonName=" + lessonID;
	currentScripturl = scriptFolderURL + lessonID + "/ActivityMedia/Activity.xml"; */
	
	var retriveObj={
		guid:qs("guid",""),
		source:"ScriptOnly",
		return:"scriptContent",
		authorname:"xiangenhu",
		TagName:"AutoTutorScript"}
	var aurl="https://class.x-in-y.com/retrieve?json="+JSON.stringify(retriveObj);
	
	
	currentScripturl = scriptFolderURL + lessonID + "/ActivityMedia/Activity.xml";
	
	if (qs("useGUID","1")==1){
       currentScripturl = aurl;
	}
	
	setPresentationIDObj(lessonID, currentScripturl)
	LoadTalkingHead(url, lessonID)
	lessonRecovery = true;
	PutStatus == false;
	currentMediaPath = MediaFolderURL + lessonID + "/ActivityMedia/";
	actions = recoveryActions;
	agentBusy = true;
	StartTimer();
	checkLessonConfig(lessonID, PresentationHistory.progressBarValue);
}

function getLastResponse(lrsURL,LRSusername,LRSpassword,Averb){
	var verbID;
	var datasqlstringObj;
	var datasqlstring;
	
	// for ver starting by actor 
	verbID=xAPIVerbBase+Averb;
	datasqlstringObj={$and:[
	{"object.mbox":LearnerID.mbox},
	{"actor.mbox":LessonID.mbox},
	{"verb.id":verbID}]};
	
	var secondquery={$and:[{$sort:{"statement.timestamp":1}},{$limit:1}]};
	
	
	datasqlstring="query="+JSON.stringify({$and:[datasqlstringObj,secondquery]});
	
	
	
	console.log(datasqlstring);
	$.ajax
		({
		  type: "GET",
		  url: lrsURL+"/statements/search",
		  dataType: 'json',
		  headers: {
			"Authorization": "Basic " + btoa(LRSusername+":"+LRSpassword)
		  },
		  data:datasqlstring,
		  success: function (data){
			  if (data.length>1){
				    var statement=data[data.length-1];
					var extID=xAPIVerbBase+"CSAL/Data";
					var DataObj=statement.context.extensions[extID];
					lastACEResponse=DataObj.data.response;
			}
		}
	})
}



function getLastActiveRecordNew(lrsURL,LRSusername,LRSpassword,Averb){
	var verbID;
	var datasqlstringObj;
	var datasqlstring;
	
	// for ver starting by actor 
	verbID=xAPIVerbBase+Averb;
	datasqlstringObj={$and:[
	{"actor.mbox":LearnerID.mbox},
	{"object.mbox":LessonID.mbox},
	{"verb.id":verbID}]};
	var secondquery=[
	                  {"$match":{
						  "$and":[
							{"actor.mbox":LearnerID.mbox},
							{"object.mbox":LessonID.mbox},
							{"verb.id":verbID}
							]
						}
					  },					
					  {"$sort":{
						  "statement.timestamp":-1
						  }},
						  {"$limit":1
						  }
					];
	
	datasqlstring="pipeline="+JSON.stringify(secondquery);
	
	console.log(datasqlstring);
	$.ajax
		({
		  type: "POST",
		  url: lrsURL+"/statements/aggregate",
		  dataType: 'json',
		  headers: {
			"Authorization": "Basic " + btoa(LRSusername+":"+LRSpassword)
		  },
		  body:secondquery,
		  success: function (data){
			  if (data.length>0){
				  if (Averb!="start"){
					learnerStatus[Averb]=data[data.length-1].timestamp; 
					if (Averb=="action"){
					   var statement=data[data.length-1];
					   var extID=xAPIVerbBase+"CSAL/Data";
					   var DataObj=statement.context.extensions[extID];
					   console.log(JSON.stringify(DataObj.data.input));
					   lastACEjson=DataObj.data.input;
					   getLastActiveRecord(lrsURL,LRSusername,LRSpassword,"completed"); 
					   getLastActiveRecord(lrsURL,LRSusername,LRSpassword,"failed");
					   }
				  }else{
					   learnerStatus[Averb]=data[0].timestamp;
					   getLastActiveRecord(lrsURL,LRSusername,LRSpassword,"action");
					   getLastResponse(lrsURL,LRSusername,LRSpassword,"response")
				  }
		   }else{
			   learnerStatus[Averb]="NA";
			   console.log("Status:"+JSON.stringify(learnerStatus));
		   }
		}});
}



function getLastActiveRecord(lrsURL,LRSusername,LRSpassword,Averb){
	var verbID;
	var datasqlstringObj;
	var datasqlstring;
	
	// for ver starting by actor 
	verbID=xAPIVerbBase+Averb;
	datasqlstringObj={$and:[
	{"actor.mbox":LearnerID.mbox},
	{"object.mbox":LessonID.mbox},
	{"verb.id":verbID}]};
	var secondquery={$and:[{$sort:{"statement.timestamp":1}},{$limit:1}]};
	
	datasqlstring="query="+JSON.stringify({$and:[datasqlstringObj,secondquery]});
	datasqlstring="query="+JSON.stringify(datasqlstringObj)+"&limit=1";
	
	console.log(datasqlstring);
	$.ajax
		({
		  type: "GET",
		  url: lrsURL+"/statements/search",
		  dataType: 'json',
		  headers: {
			"Authorization": "Basic " + btoa(LRSusername+":"+LRSpassword)
		  },
		  data:datasqlstring,
		  success: function (data){
			  if (data.length>0){
				  if (Averb!="start"){
					learnerStatus[Averb]=data[data.length-1].timestamp; 
					if (Averb=="action"){
					   var statement=data[data.length-1];
					   var extID=xAPIVerbBase+"CSAL/Data";
					   if (statement.context!=null){
						   var DataObj=statement.context.extensions[extID];
						   console.log(JSON.stringify(DataObj.data.input));
						   lastACEjson=DataObj.data.input;
						   getLastActiveRecord(lrsURL,LRSusername,LRSpassword,"completed"); 
						   getLastActiveRecord(lrsURL,LRSusername,LRSpassword,"failed");
						}
					   }
				  }else{
					   learnerStatus[Averb]=data[0].timestamp;
					   getLastActiveRecord(lrsURL,LRSusername,LRSpassword,"action");
//					   getLastResponse(lrsURL,LRSusername,LRSpassword,"response")
				  }
		   }else{
			   learnerStatus[Averb]="NA";
			   console.log("Status:"+JSON.stringify(learnerStatus));
		   }
		}});
}



