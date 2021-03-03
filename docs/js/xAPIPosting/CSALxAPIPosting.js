function qs(search_for,defaultstr) {
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	
	for (var i = 0; i<parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0  && search_for == parms[i].substring(0,pos)) {
			return parms[i].substring(pos+1);
			}
		}
		return defaultstr;
}



var TheSetting={
	"async": true,
	"crossDomain": true,
	"url": asatlrs+"/statements/aggregate",
	"method": "POST",
	"headers": {
		"Authorization": "Basic "+getCSALTheDataAuthory(),
	  "content-type": "application/json",
	  "cache-control": "no-cache",
	  "postman-token": "0ccc8805-b634-5c18-36c2-9f22c589c0c9"
	},
	"processData": false,
	"data": ""
  }

var MoodleVar={"classID":qs("classID",""),
               "objID":qs("objID","") ,
               "lessonTitle":decodeURIComponent(qs("lessonTitle","")),
               "secodEmail":decodeURIComponent(qs("secodEmail","")),
               "siteName":decodeURIComponent(qs("siteName","")) 
			};
var last_action="";
var last_questionID=""

var started=false;
var accumlateScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0},"Final":{"success":0,"failure":0}};

var totalScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0},"Final":{"success":0,"failure":0}};

var ITProfile=qs("ITProfile","https://app.skoonline.org/ITSProfile/");
var LRSURL=qs("lrs","https://record.x-in-y.com/csaldata2021/xapi/");
var LRSLogin=qs("lrslogin","CSALData");
var LRSPassword=qs("lrspassword","CSALData");

var xAPIVerbBase=qs("verbbase",ITProfile);

var wrapper;


function getCSALTheDataAuthory(){
		var TheLRSLogin=qs("lrslogin","CSALData");
		var theLRSPassword=qs("lrspassword","CSALData");
		return qs("TheCASLDataAuthory",btoa(TheLRSLogin+":"+theLRSPassword));
	}

var SKOSchool="AutoTutorARC:"+qs("client","moodle");
var sessionID="http://"+qs("ssid","anAICC_sid");
var TheSchool=qs("school","https://class.x-in-y.com");
var SKOTitle=decodeURIComponent(qs("LessonName","alesson")+qs("ver","_github"));


function GetEmail(){
	if (GoogleLogin){
		return userEmail;
	}else{
		return decodeURIComponent(qs("user",qs("UID","csalguest@csal.autotutor.org")));
	}
}
var user=GetEmail();



function GetFullName(){
	if (GoogleLogin){
		return Theauthorname;
	}else{
		return decodeURIComponent(qs("fullname",qs("SName","John Doe")));
	}
}
var fullname=GetFullName();

var SKOGuid=qs("guid",SKOTitle);

// var allowedTextLevels=["Hard","Medium","Easy","Final",""];
var allowedTextLevels=["Hard","Medium","Easy"];

var InteractionHistory=[];
var backupInteractionHistory=[];

var AllowFastForwarding=(qs("AllowFastForwarding","1")=="1");

var lastStartingTime;
var lastActionTime;

var LearnerID={mbox:"mailto:"+user,
				 name:fullname,
				 objectType:"Agent"
				};
					

function UpdateTotalScore(){
	totalScore.Hard.failure=totalScore.Hard.failure+accumlateScore.Hard.failure;
	totalScore.Medium.failure=totalScore.Medium.failure+accumlateScore.Medium.failure;
	totalScore.Easy.failure=totalScore.Easy.failure+accumlateScore.Easy.failure;
	totalScore.TA.failure=totalScore.TA.failure+accumlateScore.TA.failure;
	
	totalScore.Hard.success=totalScore.Hard.success+accumlateScore.Hard.success;
	totalScore.Medium.success=totalScore.Medium.success+accumlateScore.Medium.success;
	totalScore.Easy.success=totalScore.Easy.success+accumlateScore.Easy.success;
	totalScore.TA.success=totalScore.TA.success+accumlateScore.TA.success;
	
	
}



function CompileScroe(PresentationHistory){
	if (PresentationHistory.userAnswer==null){
		return ""
	}
	var QuestLevel="";
	if (PresentationHistory.questionLevel!=null){
		QuestLevel=PresentationHistory.questionLevel;
	}
	var scoreLabel=QuestLevel.trim();
		if (QuestLevel.indexOf("L1")==0) {
			scoreLabel="Easy";
		}else if(QuestLevel.indexOf("L2")==0) {
			scoreLabel="Medium";
		}else if (QuestLevel.indexOf("L3")==0) {
			scoreLabel="Hard";
		} else if (QuestLevel.indexOf("TPM0")==0) {
			scoreLabel="Easy";
		} else if (QuestLevel.indexOf("TPM1")==0) {
			scoreLabel="Medium";
		} else if (QuestLevel.indexOf("TPM2")==0) {
			scoreLabel="Hard";
		}else if (QuestLevel.indexOf("Easy")==0) {
			scoreLabel="Easy";
		} else if (QuestLevel.indexOf("Medium")==0) {
			scoreLabel="Medium";
		} else if (QuestLevel.indexOf("Hard")==0) {
			scoreLabel="Hard";
		}else {
			scoreLabel="Medium";
		}
	
	var userAnswer="";
	if (PresentationHistory.userAnswer!=null){
		userAnswer=PresentationHistory.userAnswer;
	}
	/* if (PresentationHistory.newUserPerfomaceLog!=null){
		if (PresentationHistory.newUserPerfomaceLog.length>0){
			userAnswer=PresentationHistory.newUserPerfomaceLog[0].userAnswer;
		}
	} */
	var inLabel=allowedTextLevels.includes(scoreLabel);
	if (inLabel==false){
		alert("Please take a picture of the screen and send to Dr. Hu. Error message "+scoreLabel);
		scoreLabel="";
	}
	
	
	if (scoreLabel==""){
		if (userAnswer=="Correct"){
			accumlateScore.TA.success= accumlateScore.TA.success+1;
			totalScore.TA.success=totalScore.TA.success+1;
		} else {
			accumlateScore.TA.failure= accumlateScore.TA.failure+1;
			totalScore.TA.failure=totalScore.TA.failure+1;
		}
	}else{
		if (userAnswer=="Correct"){
			accumlateScore[scoreLabel].success= accumlateScore[scoreLabel].success+1;
			totalScore[scoreLabel].success= totalScore[scoreLabel].success+1;
		} else {
			accumlateScore[scoreLabel].failure=accumlateScore[scoreLabel].failure+1;
			totalScore[scoreLabel].failure=totalScore[scoreLabel].failure+1;
		}	
	}
	console.log("**** User Answer **** "+userAnswer);
	return userAnswer;
}	
	
				
var TheLessonIDforXAPI={mbox:"mailto:"+SKOGuid+"@"+ASATLocation,
				 name:SKOTitle,
				 objectType:"Agent"
				};

function ComposewithContextActivities(AnActor,
                verbObj,
				ResultObj,
				activityObj,
				AContextActivities,
				Extdata){
	
	var contextActivities={};
	if (AContextActivities!=[]){
		var otherObj={};
		otherObj.objectType="Activity";
		otherObj.id=ITProfile+"Extensions/other";
		otherObj.definition={};
		var AssessmentURI=ITProfile+"Extensions/other/Assessment";
		var theEXt={};
		theEXt[AssessmentURI]=AContextActivities;
		otherObj.definition.extensions={};
		otherObj.definition.extensions=theEXt;
		contextActivities={grouping:[{id:SKOSchool},{id:sessionID}],"other":[otherObj]};
	}else{
		contextActivities={grouping:[{id:SKOSchool},{id:sessionID}]};
	}
	var exturl=ITProfile+"CSAL/Data";
	var PresentationHistory="";
	if (Extdata.extensions[exturl].data.input.PresentationHistory!=null){
		PresentationHistory=JSON.parse(Extdata.extensions[exturl].data.input.PresentationHistory);
	}
	
	if (PresentationHistory.userSelectedItem==""){
		return null;
	}
	
	if ((last_action==PresentationHistory.userSelectedItem)&&(last_questionID==PresentationHistory.questionID)){
		return null;
	}
	
	if (PresentationHistory==null) {
		return null;
	}
	
	var Answer=CompileScroe(PresentationHistory);
	
	var resultsSuccess=(Answer=="Correct");
	
	var resultExt={};
//	PresentationHistory.input=Extdata.extensions[exturl].data.input;
	
	resultExt[ITProfile+"CSAL/Result"]=PresentationHistory; 
	
	PresentationHistory.Score={"this":accumlateScore,"total":totalScore}
	var aResultObj={"success":resultsSuccess,"response":PresentationHistory.userSelectedItem,"extensions":resultExt};
	var contextObj={"contextActivities":contextActivities,"extensions":Extdata.extensions};
	contextObj={};
	var parts = {
		actor: AnActor,
		verb: verbObj,
		object: activityObj,
		result: aResultObj,
		context:contextObj
		};
		last_action=PresentationHistory.userSelectedItem;
		last_questionID=PresentationHistory.questionID;
	return parts;
	}

function calculateAllScores(response){
	var i;
	var AllHard="";
	var AllMedium="";
	var AllEasy="";
	var Sumall;
    var ThetotalScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0},"Final":{"success":0,"failure":0}};
	for (i=0;i<response.length;i++){
		if (response[i].lastScore!=null){
			
			ThetotalScore.Hard.success=ThetotalScore.Hard.success+response[i].lastScore.Hard.success;
			ThetotalScore.Hard.failure=ThetotalScore.Hard.failure+response[i].lastScore.Hard.failure;
			
			ThetotalScore.Medium.success=ThetotalScore.Medium.success+response[i].lastScore.Medium.success;
			ThetotalScore.Medium.failure=ThetotalScore.Medium.failure+response[i].lastScore.Medium.failure;
			
			
			ThetotalScore.Easy.success=ThetotalScore.Easy.success+response[i].lastScore.Easy.success;
			ThetotalScore.Easy.failure=ThetotalScore.Easy.failure+response[i].lastScore.Easy.failure;
			
		}
	}
	Sumall=ThetotalScore.Hard.success+ThetotalScore.Hard.failure;
	AllHard= ThetotalScore.Hard.success.toString()+" of "+Sumall.toString();
	$("#AllHard").html(AllHard);
	
	Sumall=ThetotalScore.Medium.success+ThetotalScore.Medium.failure;
	AllMedium= ThetotalScore.Medium.success.toString()+" of "+Sumall.toString();
	$("#AllMedium").html(AllMedium);
	
	
	Sumall=ThetotalScore.Easy.success+ThetotalScore.Easy.failure;
	AllEasy= ThetotalScore.Easy.success.toString()+" of "+Sumall.toString();
	$("#AllEasy").html(AllEasy);
}


function GetAllScores(lrsURL,LRSusername,LRSpassword){
	var queryBody=AllScoreJSON;
			var settings = {
		   "url": lrsURL+"statements/aggregate",
		   "method": "POST",
		   "timeout": 0,
		   "headers": {
			"Authorization": "Basic "+ getCSALTheDataAuthory(),
			"Content-Type": "application/json"
		  },
		  "data": JSON.stringify(queryBody),
		};
		
	$.ajax(settings).done(function (response){ 
	calculateAllScores(response);
	})	
}

function GetLastRecordedAction(lrsURL,LRSusername,LRSpassword) {
	var queryBody=GetLastActionJSON(LearnerID.mbox,TheLessonIDforXAPI.mbox);
			var settings = {
		   "url": lrsURL+"statements/aggregate",
		   "method": "POST",
		   "timeout": 0,
		   "headers": {
			"Authorization": "Basic "+getCSALTheDataAuthory(),
			"Content-Type": "application/json"
		  },
		  "data": JSON.stringify(queryBody),
		};
		
	$.ajax(settings).done(function (response){ 
	//GetALLActions(lrsURL,LRSusername,LRSpassword);
	if (response.length>0){
	LastActionTime=response[0].time;
	console.log(LastActionTime);
	}
	})
}

function PostWorldEvent(eventType,msg){
	
	var AnActor=TheLessonIDforXAPI;	
	var verb="CSALMsg";			
	var verbObj={
			id:xAPIVerbBase+verb,
			display:{
				 "en":verb 
			}
		};
	var activityObj=LearnerID;
	var Extdata={};
    var ResultObj={"response":eventType+":"+msg};
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}

function GetLastLessonStarting(lrsURL,LRSusername,LRSpassword){
	
	var queryBody=GetLastStartingTime(LearnerID.mbox,TheLessonIDforXAPI.mbox);
			var settings = {
		   "url": lrsURL+"statements/aggregate",
		   "method": "POST",
		   "timeout": 0,
		   "headers": {
			"Authorization": "Basic "+ getCSALTheDataAuthory(),
			"Content-Type": "application/json"
		  },
		  "data": JSON.stringify(queryBody),
		};
	$.ajax(settings).done(function (response){ 
	if (response.length>0){
		lastStartingTime=response[0].time;
		console.log(lastStartingTime);
		GetALLActions(lrsURL,LRSusername,LRSpassword,lastStartingTime);
	}else{
		GetMovieWhenReady();
		return;
	}
	})
	
}



function ToodayVoice() {
  var d = new Date();
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var say="Today is "+ weekday[d.getDay()]+", "+ months[d.getMonth()]+" "+d.getDate();
  return say;
}

function DateString(dateStr){
	var d = new Date(dateStr);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var say=weekday[d.getDay()]+", "+ months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
  return say;
}


function Greetings(){
	var myDate = new Date();
    var hrs = myDate.getHours();

    var greet;

    if (hrs < 12)
        greet =' Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening';
	
	return greet;
}

function GetDuration(t2,t1){
	var date1=new Date(t1);
	var date2=new Date(t2);
	var duration=date2-date1;
	var time_in_Day=Math.floor((duration)/(1000*60*60*24));
	var time_in_hours=Math.floor((duration)/(1000*60*60));
	var time_in_min=Math.floor((duration)/(1000*60));
	return time_in_min.toString()+" minutes";
	}
	
function moveforward(){
	if (document.getElementById('startover').checked){
		InteractionHistory=[];
		$("#myMessage").hide();
	}else if (document.getElementById('continue').checked){
		$("#myMessage").hide();
	}else{
		alert(fullname.split(' ')[0]+", Need to make your mind!");
	}
}

function removeLastElement(anArray,k){
	var i;
	var returnArray=[];
	for (i=0;i<anArray.length-k;i++){
		returnArray.push(anArray[i])
	}
	return returnArray;
}

function GetALLActions(lrsURL,LRSusername,LRSpassword,atimestamp){
		var queryBody=GetInteractionHistorxAPIJSON(LearnerID.mbox,TheLessonIDforXAPI.mbox,atimestamp);
			var settings = {
		   "url": lrsURL+"statements/aggregate",
		   "method": "POST",
		   "timeout": 0,
		   "headers": {
			"Authorization": "Basic "+getCSALTheDataAuthory(),
			"Content-Type": "application/json"
		  },
		  "data": JSON.stringify(queryBody),
		};
		
	$.ajax(settings).done(function (response){ 
	if (response.length>0){
		InteractionHistory=response;
		backupInteractionHistory=removeLastElement(response,0);
		var html='';
		var starting=DateString(atimestamp);
		var ending=DateString(InteractionHistory[InteractionHistory.length-1].time);
		LastActionTime=ending;
		if (starting==ending){
			ending=" the same day";
		}
		var timemin=GetDuration(InteractionHistory[InteractionHistory.length-1].time,atimestamp)
		html=html+"  My record shows that you started this lesson eariler. It was "+starting+". You stopped on "+ ending+" "+"for the total of "+timemin;
		var footer="What do you want to do next? <ul><li>Start over from the start. <input type='radio' name='choice' id='startover'>  <li>Continue from where you have stopped.<input type='radio' name='choice' id='continue' ></ul>"+"<p align='right'><button onclick='moveforward()'> Move forward </button><p/>";
		if (qs("editing","0")=="0"){
			OpenModal(fullname.split(' ')[0]+ ", "+Greetings()+" and Welcome Back!",footer,html);   
		}
		}
	})		
}




function getACEActionAndPlay(ActionName){
	var jsonstr=[
		{"$match":
			{"statement.actor.mbox":"mailto:"+SKOGuid+"@"+ASATLocation,
			 "statement.verb.id":"https://app.skoonline.org/ITSProfile/response"
			}
			},
		{"$sort":{"statement.timestamp":-1}},
		{"$limit":100}, 
		 {"$project":
			{"ContexExt":"$statement.context.extensions.https://app.skoonline.org/ITSProfile/CSAL/Data"
			}
		},
		 {"$project":
			{"Transactions":"$ContexExt.data.response.ACEActions"
			}
		}
	 ]
	 var settings = {
		"async": true,
		"crossDomain": true,
		"url": asatlrs+"/statements/aggregate",
		"method": "POST",
		"headers": {
			"Authorization": "Basic "+getCSALTheDataAuthory(),
		  "content-type": "application/json",
		  "cache-control": "no-cache",
		  "postman-token": "0ccc8805-b634-5c18-36c2-9f22c589c0c9"
		},
		"processData": false,
		"data": JSON.stringify(jsonstr)
	  }
	  $.ajax(settings).done(function (response) {
		var i;
		for (i=1; i<response.length;i++){
			var theactions=response[i].Transactions;
			var j;
			if (theactions!=null){
				for (j=0; j<theactions.length;j++){
					if (theactions[j].Data==ActionName){
						actions=theactions;
						runActions();
						j=theactions.length;
						i=response.length;
					}
				}
			}
		}
	  });
}

function GetReport(lrsURL,LRSusername,LRSpassword){
	var queryObj={$and:[
	{"actor.mbox":LearnerID.mbox},
	{"verb.id":xAPIVerbBase+"action"},{$or:[{"result.success":true},{"result.success":false}]}
	]};
	var datasqlstring="actor="+JSON.stringify(queryObj)+"&limit=1&sort=1";
	var queryStrForSearch="actor="+JSON.stringify({"mbox":LearnerID.mbox})+"&verb="+xAPIVerbBase+"action&limit=1";
	$.ajax ({
			  type: "GET",
			  url: lrsURL+"statements",
			  dataType: 'json',
			  headers: {
				"Authorization": "Basic " + getCSALTheDataAuthory()
			  },
			data:queryStrForSearch,
			success: function (data){
				  if (data.statements.length>0){
				  var statementGot=data.statements[0];
				  if (statementGot.result==null){
					  return;
				  }
				  if (statementGot.result.extensions==null){
					  return;
				  }
				  
				  var htmlstr="<table align='center' width='100%' height='80%'><tr>";
				    htmlstr=htmlstr+"<td colspan='4'><H2>Your Scores</H2></td></tr>";
				  
				  htmlstr=htmlstr+"<tr><td><b>Question Difficulty Level</b></td><td>Hard<br/>(correct)</td><td>Medium<br/>(correct)</td><td>Easy<br/>(correct)</td></tr>";
				    htmlstr=htmlstr+"<td colspan='4'><hr/></td></tr>";
				  
				  var TheResult=statementGot.result.extensions["https://app.skoonline.org/ITSProfile/CSAL/Result"];
				  				 
				  var The_CurrentScore=accumlateScore;
				  htmlstr=htmlstr+"<tr><td><b>Your score in this lesson</b></td>";
				  
				  var hardTotal=The_CurrentScore.Hard.success+The_CurrentScore.Hard.failure;				  
				  htmlstr=htmlstr+"<td>"+The_CurrentScore.Hard.success.toString()+" of "+hardTotal.toString()+"</td>";
				  
				  var medianTotal=The_CurrentScore.Medium.success+The_CurrentScore.Medium.failure;
				  htmlstr=htmlstr+"<td>"+The_CurrentScore.Medium.success.toString()+" of "+medianTotal.toString()+"</td>";
				  
				  
				  var easyTotal=The_CurrentScore.Easy.success+The_CurrentScore.Easy.failure;
				   htmlstr=htmlstr+"<td>"+The_CurrentScore.Easy.success.toString()+" of "+easyTotal.toString()+"</td>";
				  
				    htmlstr=htmlstr+"<tr/><tr><td colspan='4'> </td></tr>";
				    htmlstr=htmlstr+"<tr><td colspan='4'> </td></tr>";
				  if (TheResult.Score.total!=null){
				     var The_CurrentScore=TheResult.Score.total;
					  htmlstr=htmlstr+"<td><b>Your score in all lessons</b></td>";
					  
					  var hardTotal=The_CurrentScore.Hard.success+The_CurrentScore.Hard.failure;				  
					  htmlstr=htmlstr+"<td>"+The_CurrentScore.Hard.success.toString()+" of "+hardTotal.toString()+"</td>";
					  
					  var medianTotal=The_CurrentScore.Medium.success+The_CurrentScore.Medium.failure;
					  htmlstr=htmlstr+"<td>"+The_CurrentScore.Medium.success.toString()+" of "+medianTotal.toString()+"</td>";
					  
					  
					  var easyTotal=The_CurrentScore.Easy.success+The_CurrentScore.Easy.failure;
					   htmlstr=htmlstr+"<td>"+The_CurrentScore.Easy.success.toString()+" of "+easyTotal.toString()+"</td>";
				  }
				  
				  htmlstr=htmlstr+"<tr/><tr><td colspan='4'> </td></tr>";
				  htmlstr=htmlstr+"<tr><td colspan='4'> </td></tr>";
				  htmlstr=htmlstr+"<tr><td><b>Scores from all others students <br/> for all lessons</b></td><td><div id='AllHard'></td><td><div id='AllMedium'></td><td><div id='AllEasy'></td></tr>"
				  htmlstr=htmlstr+"</tr></table>"
				  $("#ScorePanel").html(htmlstr);
				  GetAllScores(LRSURL,LRSLogin,LRSPassword);
				}
				
				
			}
	});
}

function GetSCORE(lrsURL,LRSusername,LRSpassword){
	var queryObj={$and:[
	{"actor.mbox":LearnerID.mbox},
	{"verb.id":xAPIVerbBase+"action"},{$or:[{"result.success":true},{"result.success":false}]}
	]};
	var datasqlstring="actor="+JSON.stringify(queryObj)+"&limit=1&sort=1";
	var queryStrForSearch="actor="+JSON.stringify({"mbox":LearnerID.mbox})+"&verb="+xAPIVerbBase+"action&limit=1";
	$.ajax ({
			  type: "GET",
			  url: lrsURL+"statements",
			  dataType: 'json',
			  headers: {
				"Authorization": "Basic " + getCSALTheDataAuthory()
			  },
			data:queryStrForSearch,
			success: function (data){
				  if (data.statements.length>0){
				  var statementGot=data.statements[0];
				  if (statementGot.result==null){
					  return;
				  }
				  if (statementGot.result.extensions==null){
					  return;
				  }
					var TheResult=statementGot.result.extensions["https://app.skoonline.org/ITSProfile/CSAL/Result"];
					if (TheResult!=""){
						if (TheResult.Score.total!=null){
	//					console.log(JSON.stringify(TheResult.Score.total));
						totalScore=TheResult.Score.total;
						if (totalScore.Final.success==null){
							totalScore.Final={"success":0,"failure":0}
						}
					  }
					}
				}
			}
	});
}

function Compose(AnActor,
                verbObj,
				ResultObj,
				activityObj,
				Extdata){
	var contextActivities={grouping:[{id:SKOSchool},{id:sessionID}]}
	var parts = {
		actor: AnActor,
		verb: verbObj,
		object: activityObj,
		result: ResultObj,
		context:{"contextActivities":contextActivities,"extensions":Extdata.extensions}
		};
		timestamp:(new Date()).toISOString();
//	console.log(JSON.stringify(parts));
	return parts;
	}


	
function init() {   
    // when actor is student
	 // when actor is student
	var AnActor=LearnerID;
				
	var verb="Anything";			
	var verbObj={
			id:xAPIVerbBase+verb,
			display:{
				 "en":verb 
			}
		};
	// Activity
	var activityObj=TheLessonIDforXAPI;
	// Activity
	var data={anything:"value"};
	var ResultObj={};
	/* var Extdata={
			extensions: {
				"https://app.skoonline.org/ITSProfile/CSAL/Data": data
			}
	} */
	var Extdata={};
	Extdata.extensions[ITProfile+"CSAL/Data"]=data;
	
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}


function AceResponse(Data,averb){
	
	var AnActor=TheLessonIDforXAPI;
				
	var verb=averb;			
	var verbObj={
			id:xAPIVerbBase+verb,
			display:{
				 "en":verb 
			}
		};
	
	var activityObj=LearnerID;
	// Activity
	var data=Data;


	var resltExt={};
	resltExt[ITProfile+"CSAL/LMS"]=MoodleVar;
	var ResultObj={"response":MoodleVar.classID,"extensions":resltExt};
		
	var Extdata={};
	var extObj={};
	var theStr=ITProfile+"CSAL/Data";
	extObj[theStr]=data;
	Extdata.extensions=extObj;
//	console.log("===");
//	console.log(JSON.stringify(data));
		var statements=Compose(AnActor,
								verbObj,
								ResultObj,
								activityObj,
								Extdata);
								
		ADL.XAPIWrapper.sendStatement(statements);
}



function xAPIPostOther(acePostjson,averb){
	
	var AnActor=LearnerID;
				
	var verb=averb;			
	var verbObj={
			id:xAPIVerbBase+verb,
			display:{
				 "en":verb 
			}
		};
		
	var activityObj=TheLessonIDforXAPI;
	// Activity
	var data=acePostjson;


	var resltExt={};
	resltExt[ITProfile+"CSAL/LMS"]=MoodleVar;


	var ResultObj={};
	if ((data.userAnswer=="Incorrect")||(data.userAnswer=="Correct")){
		if (data.userAnswer=="Incorrect"){
			ResultObj={success:false,
			response:data.userSelectedItem,
			extensions:resltExt
			}
		}else{
			ResultObj={success:true,
			response:data.userSelectedItem,
		    extensions:resltExt
		}
		}
	}
	
	var Extdata={};
	var extObj={};
	var theStr=ITProfile+"CSAL/Data";
	extObj[theStr]=data;
	Extdata.extensions=extObj;
	// Consider contextActivities
	var Assessments=data.data.response.Log.Assessments;
	
	// contextActivities
	var statements;
	if (Assessments.length!=0){
	statements= ComposewithContextActivities(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Assessments,
							Extdata);
	}else{
		return;
		statements= Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	}
if (statements!=null){
//	console.log(JSON.stringify(statements));
	ADL.XAPIWrapper.sendStatement(statements);
   }
}

function xAPIPostStart(acePostjson,averb){
	if (started) {
		started=true;
		return;
	}
	var AnActor=LearnerID;
				
	var verb=averb;			
	var verbObj={
			id:xAPIVerbBase+verb,
			display:{
				 "en":verb 
			}
		};
	var activityObj=TheLessonIDforXAPI;
	// Activity
	var data=acePostjson;

	
	var resltExt={};
	resltExt[ITProfile+"CSAL/LMS"]=MoodleVar;
//	var ResultObj={"extensions":resltExt};
	var ResultObj={"response":MoodleVar.classID,"extensions":resltExt};

	var Extdata={};
	var extObj={};
	var theStr=ITProfile+"CSAL/Data";
	extObj[theStr]=data;
	Extdata.extensions=extObj;
	
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
	
}
function xAPIPostEnding(ActorMbox,
                        ActorName,
						RawScore,
						Result,
						Min,
						Max,
						ActivityURL,
                        averb,TextLevel,FinalData){
	
	var AnActor=LearnerID;
				
	var verb=averb;			
	var verbObj={
			id:xAPIVerbBase+verb,
			display:{
				 "en":verb 
			}
		};
	var scaledScore=0;
	var ARawScore=0;
	if (RawScore!=null){
		scaledScore=RawScore;
		ARawScore=Math.round(scaledScore*Max);
	}
	var activityObj=TheLessonIDforXAPI;
	var data={"URL":ActivityURL,
	           "guid":SKOGuid,
			   "TextLevel":TextLevel,
			   "finalData":FinalData}
	
			   
	var resltExt={};
	resltExt[ITProfile+"CSAL/LMS"]=MoodleVar;


	var ResultObj={
        "score": {
            "scaled": scaledScore,
            "raw": ARawScore,
            "min": Min,
            "max": Max
        },
        "success": Result,
		"extensions":resltExt,
		"response":MoodleVar.classID
	}
	
	
	var Extdata={};
	var extObj={};
	var theStr=ITProfile+"CSAL/Data";
	extObj[theStr]=data;
	Extdata.extensions=extObj;
	
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}