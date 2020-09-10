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
var last_action="";

var started=false;
var accumlateScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0}};

var totalScore={"Hard":{"success":0,"failure":0},"Medium":{"success":0,"failure":0},"Easy":{"success":0,"failure":0},"TA":{"success":0,"failure":0}};

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
	
	var QuestLevel="";
	QuestLevel=PresentationHistory.questionLevel;
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
	
	var userAnswer="";
	userAnswer=PresentationHistory.userAnswer;
	if (PresentationHistory.newUserPerfomaceLog.length>0){
		userAnswer=PresentationHistory.newUserPerfomaceLog[0].userAnswer;
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
	
	
	if (PresentationHistory==null) {
		return
	}
	
	var Answer=CompileScroe(PresentationHistory);
	
	var resultsSuccess=(Answer=="Correct");
	
	var resultExt={};
	resultExt[ITProfile+"CSAL/Result"]=PresentationHistory;
	if (last_action==PresentationHistory.userSelectedItem){
		return null;
	}
	
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
	return parts;
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
		
	 /* "result": {
        "score": {
            "scaled": 0.95,
            "raw": 95,
            "min": 0,
            "max": 100
        },
        "success": true,
        "completion": true,
        "response": "this is the response",
        "duration": "PT5H4M",
        "extensions": {
            "http://ext.com/key": "value"
        }
    }, */
	/* var Extdata={
			extensions: {
				"https://app.skoonline.org/ITSProfile/CSAL/Data": data
			}
	} */
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
	/* var Extdata={
		extensions: {
			"https://app.skoonline.org/ITSProfile/CSAL/Data": data
		}
	}	 */
	
	var Extdata={};
	Extdata.extensions[ITProfile+"CSAL/Data"]=data;
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}