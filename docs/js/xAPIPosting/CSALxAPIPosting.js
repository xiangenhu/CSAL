﻿function qs(search_for,defaultstr) {
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
var last_action="";
var last_questionID=""

var started=false;
var accumlateScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0},"Final":{"success":0,"failure":0}};

var totalScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0},"Final":{"success":0,"failure":0}};

var ITProfile=qs("ITProfile","https://app.skoonline.org/ITSProfile/");
var LRSURL=qs("lrs","https://record.x-in-y.com/csalexclusive/xapi/");
var LRSLogin=qs("lrslogin","asaiga");
var LRSPassword=qs("lrspassword","padkep");

var xAPIVerbBase=qs("verbbase",ITProfile);

var wrapper;
var SKOSchool="AutoTutorARC:"+qs("client","moodle");
var sessionID="http://"+qs("ssid","anAICC_sid");

var SKOTitle=decodeURIComponent(qs("LessonName","alesson")+qs("ver","_github"));
var user=decodeURIComponent(qs("user",qs("UID","csalguest@csal.autotutor.org")));
var fullname=decodeURIComponent(qs("fullname",qs("SName","John Doe")));
var SKOGuid=qs("guid",SKOTitle);

var allowedTextLevels=["Hard","Medium","Easy","Final",""];

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
		}
		if(QuestLevel.indexOf("L2")==0) {
			scoreLabel="Medium";
		}
		if (QuestLevel.indexOf("L3")==0) {
			scoreLabel="Hard";
		}
		if (QuestLevel.indexOf("TPM0")==0) {
			scoreLabel="Easy";
		}
		if (QuestLevel.indexOf("TPM1")==0) {
			scoreLabel="Medium";
		}
		if (QuestLevel.indexOf("TPM2")==0) {
			scoreLabel="Hard";
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
	return userAnswer;
}	
	
				
var LessonID={mbox:"mailto:"+SKOGuid+"@csal.memphis.edu",
				 name:SKOTitle,
				 objectType:"Agent"
				};

 ADL.launch(function(err, launchdata, xAPIWrapper) {
		if (!err) {
			wrapper = ADL.XAPIWrapper = xAPIWrapper;
			console.log("--- content launched via xAPI Launch ---\n", wrapper.lrs, "\n", launchdata);
		} else {
			wrapper = ADL.XAPIWrapper;
			wrapper.changeConfig({
				endpoint: LRSURL,
				user: LRSLogin,
				password: LRSPassword
			});
			console.log("--- content statically configured ---\n", wrapper.lrs);
		}
	}, true);


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
	var PresentationHistory=JSON.parse(Extdata.extensions[exturl].data.input.PresentationHistory);
	
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
	for (i=0;i<response.length-1;i++){
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
	var queryBody=[
			{"$match": {
				"$and":[
							{"statement.verb.id":"https://app.skoonline.org/ITSProfile/action"}
						]
						}
				},					
				{"$sort":{"statement.timestamp":-1
						}
					},            
				{"$project":{
					 "agent":"$statement.actor.mbox",
					 "Ext":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
				}},
				{"$project":{
					"agent":"$agent",
					 "Score":"$Ext.Score.total"
				}},
			   {"$group":{
				   "_id":"$agent",
				   "lastScore":{"$first":"$Score"}
			   }}    

		]
			var settings = {
		   "url": lrsURL+"statements/aggregate",
		   "method": "POST",
		   "timeout": 0,
		   "headers": {
			"Authorization": "Basic "+ btoa(LRSusername+":"+LRSpassword),
			"Content-Type": "application/json"
		  },
		  "data": JSON.stringify(queryBody),
		};
		
	$.ajax(settings).done(function (response){ 
	calculateAllScores(response);
	})	
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
				"Authorization": "Basic " + btoa(LRSusername+":"+LRSpassword)
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
				"Authorization": "Basic " + btoa(LRSusername+":"+LRSpassword)
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
					if (TheResult.Score.total!=null){
//					console.log(JSON.stringify(TheResult.Score.total));
					totalScore=TheResult.Score.total;
					if (totalScore.Final.success==null){
						totalScore.Final={"success":0,"failure":0}
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
	console.log(JSON.stringify(parts));
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
	var activityObj=LessonID;
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
	
	var AnActor=LessonID;
				
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
	var ResultObj={};
		
	var Extdata={};
	var extObj={};
	var theStr=ITProfile+"CSAL/Data";
	extObj[theStr]=data;
	Extdata.extensions=extObj;
	console.log("===");
	console.log(JSON.stringify(data));
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
		
	var activityObj=LessonID;
	// Activity
	var data=acePostjson;
	var ResultObj={};
	if ((data.userAnswer=="Incorrect")||(data.userAnswer=="Correct")){
		if (data.userAnswer=="Incorrect"){
			ResultObj={success:false,
			response:data.userSelectedItem,
			extensions:{"https://app.skoonline.org/ITSProfile/CSAL/ResultExt":data}
			}
		}else{
			ResultObj={success:true,
			response:data.userSelectedItem,
		     extensions:{"https://app.skoonline.org/ITSProfile/CSAL/ResultExt":data}
		}
		var Extdata={}
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
	console.log(JSON.stringify(statements));
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
	var activityObj=LessonID;
	// Activity
	var data=acePostjson;
	var ResultObj={};
	/* var Extdata={
			extensions: {
				"https://app.skoonline.org/ITSProfile/CSAL/Data": data
			}
	}
	 */
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
	var scaledScore=RawScore;
	var ARawScore=Math.round(scaledScore*Max);
	var activityObj=LessonID;
	var data={"URL":ActivityURL,
	           "guid":SKOGuid,
			   "TextLevel":TextLevel,
			   "finalData":FinalData}
	var ResultObj={
        "score": {
            "scaled": scaledScore,
            "raw": ARawScore,
            "min": Min,
            "max": Max
        },
        "success": Result 
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