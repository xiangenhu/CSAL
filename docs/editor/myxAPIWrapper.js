// MyxAPI Wrapper

var asatWrapper; 

var wrapper;

function DataLRS(){
ADL.launch(function(err, launchdata, xAPIWrapper) {
	wrapper = ADL.XAPIWrapper;
	wrapper.changeConfig({
			endpoint: LRSURL,
			user: LRSLogin,
			password:LRSPassword
		})
	console.log("--- content statically configured ---\n", wrapper.lrs);
}, true);
}

function ScriptLRS(){
        ADL.launch(function(err, launchdata, xAPIWrapper) {
		asatWrapper = ADL.XAPIWrapper;
		asatWrapper.changeConfig({
			endpoint: qs("asatlrs","https://record.x-in-y.com/scripts/xapi/"),
			user: qs("asatlrslogin",'asatScripts'),
			password: qs("asatlrspassword",'asatScripts')
		});
		console.log("--- content statically configured ---\n", asatWrapper.lrs);
        }, true);
}

function getExtenInfo(theObj,theStr){
	var areturnExtObjstr=aceVocab+theStr;
	var returnExtObj={};
	returnExtObj[areturnExtObjstr]=theObj;
	return returnExtObj;
}

function MyExtObj(ParentObjInfor,GroupObjInfo,CategoryInfo,OtherObjInfor){
	var Obj={};
	if(!OtherObjInfor){
		OtherObjInfor = {};
	}
    const Parent=ITProfile+"Extensions/parent";
	const Category=ITProfile+"Extensions/category";
	const Grouping=ITProfile+"Extensions/grouping";
	const Other=ITProfile+"Extensions/other";
	
	var ParentObjInforStr=getExtenInfo(ParentObjInfor,'Extensions/parent');
	var GroupObjInfoString=getExtenInfo(GroupObjInfo,'Extensions/grouping');
	var CategoryInfoString=getExtenInfo(CategoryInfo,'Extensions/category');
	var OtherObjInforString=getExtenInfo(OtherObjInfor,'Extensions/other');
	
	

	var contextActivitiesObj={};
	

    var GroupingObj={};
	GroupingObj.objectType="Activity";
	GroupingObj.id=ITProfile+"Extensions/grouping";
	GroupingObj.definition={};
	GroupingObj.definition.extensions=GroupObjInfoString;
	contextActivitiesObj.grouping=[GroupingObj];


	var ParentObj={};
	ParentObj.objectType="Activity";
	ParentObj.id=ITProfile+"Extensions/grouping";
	ParentObj.definition={};
	ParentObj.definition.extensions=ParentObjInforStr;
	contextActivitiesObj.parent=[ParentObj];

	var categoryObj={};
	categoryObj.objectType="Activity";
	categoryObj.id=ITProfile+"Extensions/category";
	categoryObj.definition={};
	categoryObj.definition.extensions=CategoryInfoString;
	contextActivitiesObj.category=[categoryObj];

	var otherObj={};
	otherObj.objectType="Activity";
	otherObj.id=ITProfile+"Extensions/other";
	otherObj.definition={};
	otherObj.definition.extensions=OtherObjInforString;
	contextActivitiesObj.other=[otherObj];

	Obj.contextActivities=contextActivitiesObj;
	return Obj;
}

function DoSearch(Statement){
	try{
		var search = ADL.XAPIWrapper.searchParams();
		var SeachObj={};
		SeachObj.mbox=Auser;
		SeachObj.objectType="Agent";
		 search['agent']=JSON.stringify(SeachObj);
		 search['verb']=Statement.verb.id;
		 search['limit']=1;
		var ret = ADL.XAPIWrapper.getStatements(search);
		var i=0;
		if(ret){
		  for (i=0;i<ret.statements.length;i++)
		  {
			displayDebugging('#DebuggingArea',"=========");
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].actor));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].verb));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].object));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].result));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].result.response));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].context.contextActivities.parent[0].definition.extensions[aceVocab+"AT"].timeTaken));
			displayDebugging('#DebuggingArea',"++++++++++");
		  }
		  return;
		}
  }catch(e){
    alert("error getting records: " + e);
  }
}



function sendStatement(aStatement){
//	console.log(JSON.stringify(aStatement));
	if (Array.isArray(aStatement)) {
		printlog('sending array - multi stmt... Type 1');
		printlog(JSON.stringify(aStatement));
		displayDebugging('#DebuggingArea',JSON.stringify(aStatement.verb.id)+" "+EXPID);
		DoSearch(aStatement);
		wrapper.sendStatements(aStatement, outputResults);
	} else {
		printlog('sending object - single stmt... Type 2');
		printlog(JSON.stringify(aStatement));
		wrapper.sendStatement(aStatement, outputResults);
	}

}

function GetResult(Score){
	var ResultStatement ={};
	var ResultScore={};
	ResultScore.scaled=Score;
	ResultScore.min=0;
	ResultScore.max=1;
	ResultScore.raw=Score;
	ResultStatement.score=ResultScore;
	return ResultStatement;
}


function ComposeActor(ActorName,homePage,ambox){
	var actorObj={};
	var actorAccountObj={};
	var AString=decodeURIComponent(homePage);
	var mboxStr=decodeURIComponent(ambox);
	actorObj.name=ActorName;
	actorObj.objectType="Agent";
	if (AString.toLowerCase().indexOf("mailto")==0){
		actorObj.mbox=AString;
		return actorObj;
	}else if(mboxStr.toLowerCase().indexOf("mailto")==0){
		actorObj.mbox=mboxStr;
		return actorObj;
	}else {
		actorAccountObj.name=ambox;
		actorAccountObj.homePage=decodeURIComponent(homePage);
		actorObj.account=actorAccountObj;
	return actorObj;
	}
	displayDebugging("#DebuggingArea",JSON.stringify(actorObj)+"==========");
	return actorObj;
}
function Compose_matchScore(data){
	var resultObj={};
	var resultScoreObj={};
	resultScoreObj.scaled=Math.max(data.Match,data.LSAMatch,data.RegExMatch);
	resultScoreObj.min=0;
	resultScoreObj.max=1;
	resultScoreObj.raw=Math.max(data.Match,data.LSAMatch,data.RegExMatch);
	resultObj.score=resultScoreObj;
	resultObj.success=data.Pass;
	resultObj.response=data.AnswerType;
	resultObj.completion=data.Pass;
	macthAnswerExt=aceVocab+"matchAnswer";
	var extensionsObj={};
	extensionsObj[macthAnswerExt]=data;
	resultObj.extensions=extensionsObj;
	return resultObj;
}


function GetObjective1(actormbx,atype){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":""};
	DefinitionObj.type=atype;
//	DefinitionObj.en=" ";
	OBJDefObj.description=DefinitionObj;
	var NameObj={};
	NameObj.en=fullname;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}


function GetObjective4(actormbx,atype,NameOfObject){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":""};
	DefinitionObj.type=atype;
//	DefinitionObj.en=" ";
	OBJDefObj.description=DefinitionObj;
	var NameObj={};
	NameObj.en=NameOfObject;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}


function GetObjective6(actormbx,atype,Question){
	var Object={};
	Object.id=actormbx;
	Object.objectType=atype;
	var OBJDefObj={};
	var DefinitionObj={"en-US":Question};
	DefinitionObj.type=atype;
	OBJDefObj.description=DefinitionObj;
	var NameObj={"en-US":Question};
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}

function GetObjective3(actormbx,atype,TargetID){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":""};
	DefinitionObj.type=atype;
//	DefinitionObj.en=" ";
	OBJDefObj.description=DefinitionObj;
	var NameObj={"en-US":fullname+" on "+TargetID};
//	NameObj.en=fullname+" on "+TargetID;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}

function GetObjectiveActivityRef(actormbx,atype,ATObject,inputOfStudent){
	var Object={};
	Object.id=SKOGuid;
	Object.objectType="StatementRef";
	return Object;
}

function GetObjective2(actormbx,atype,ATObject,inputOfStudent){  // for speech and input only
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":inputOfStudent.action};
	DefinitionObj.type=atype;
	var ExtensionObj={};
	var NameObj={"en-US":ATObject};
	if (inputOfStudent.endoFSpeechTime!=null){
		ExtensionObj[aceVocab+"/endoFSpeechTime"]=inputOfStudent.endoFSpeechTime;
		OBJDefObj.extensions=ExtensionObj;
		NameObj={"en-US":Auser};
	}
	if (inputOfStudent.inputoFText!=null){
		ExtensionObj[aceVocab+"/inputoFText"]=inputOfStudent.inputoFTex;
		ExtensionObj[aceVocab+"/InputTimeLatency"]=inputoFText-endoFSpeechTime;
		OBJDefObj.extensions=ExtensionObj;
		NameObj={"en-US":TutorEmail};
	}
	
	
	OBJDefObj.description=DefinitionObj;
	
	OBJDefObj.name=NameObj;
	
	
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}


function GetObjective10(actormbx,atype,name){  // for speech and input only
	var Object={};
	Object.mbox=actormbx;
	Object.objectType=atype;
	Object.name=name;
	return Object;
}


function GetObjectiveChat(ObjID,AtTitle,position,OptionTarget){  // for speech and input only
	var Object={};
	var definitionObj={};
	var nameObj={};
	nameObj={"en-US":AtTitle+"@=>"+position}
	definitionObj.name=nameObj;
	Object.id=ObjID;
	if (OptionTarget!=""){
		var DescriptionObj={"en-US":OptionTarget}
		definitionObj.description=DescriptionObj;
	}
	Object.definition=definitionObj;
	return Object;
}


function GetObjectiveQAOld(ObjID,AtTitle,position,OptionTarget){
	var Object={};
	var definitionObj={};
	var nameObj={};
	nameObj={"en-US":AtTitle+"@ Scene "+position}
	definitionObj.name=nameObj;
	Object.id=ObjID;
	if (OptionTarget!=""){
		var DescriptionObj={"en-US":OptionTarget}
		definitionObj.name=DescriptionObj;
	}
	Object.definition=definitionObj;
	return Object;
}


function GetObjectiveQA(ObjID,AtTitle,position,OptionTarget){
	var Object={objectType:"StatementRef",
				id:OptionTarget};
	return Object;
}

function GetObjectiveACE(ObjID,AtTitle,position,OptionTarget){  // for speech and input only
	var Object={};
	var definitionObj={};
	var nameObj={};
	nameObj={"en-US":AtTitle+"@ Scene "+position}
	definitionObj.name=nameObj;
	Object.id=ObjID;
	if (OptionTarget!=""){
		var DescriptionObj={"en-US":OptionTarget}
		definitionObj.description=DescriptionObj;
	}
	Object.definition=definitionObj;
	return Object;
}


function FindTarget(EvaluationData){
	var lengths=EvaluationData.Assessments.length;
	var i;
	for (i=0; i<lengths;i++){
		if (EvaluationData.Assessments[i].TargetID!="Event"){
			return EvaluationData.Assessments[i].TargetID;
		}
	}
	return "";
}


function composeViewHintsStatement(Question,Answer,StartTime,Duration){
	var Statement={};
	var actorObj=ComposeActor(fullname,Auser,MoodleID);
	var verbObj={};
	verbObj.id=ITProfile+"Activity/"+viewPnQStr;
	verbObj.display={"en-US":viewPnQStr};
	TutorEmail="mailto:"+SKOGuid+"@"+SchoolName;


	var ObjectObj={};
	ObjectObj.id= "http://"+SchoolName+"/"+SKOGuid;
    ObjectObj.definition={
      "name": { "en-US":SKOTitle+": PnQ: "+Question}
    }
	
	var NewQStr={}
	NewQStr.ScriptID=SKOGuid+"@"+SchoolName;
	var ATLink=window.location.href.split("?")[0];
	NewQStr.question=Question;
	NewQStr.answer=Answer;
	NewQStr.timeStart=StartTime;
	NewQStr.timeTaken=Duration;
	NewQStr.playerHost=ATLink;
	NewQStr.objectType="PnQ";
//	NewQStr.problemGUID=SKOGuid;
    var SplitTitle=SKOTitle.split(":");
	if (SplitTitle.length>0){
		NewQStr.problemID=SplitTitle[1];
	}else {
		NewQStr.problemID=SKOTitle;
	}
	const vewExt=ITProfile+"view";
	var ExtOb={};
	ExtOb[vewExt]=NewQStr;
	ObjectObj.definition.extensions=ExtOb;
	
	Statement.context=MyExtObj(null,null,null,null)
    Statement.actor=actorObj;
	Statement.verb=verbObj;
	Statement.object=ObjectObj;
	displayDebugging('#DebuggingArea',JSON.stringify(Statement));
	return Statement;

}

function ComposeSimpleStatement(verb,
					   userMailbox,
					   ActorName,
					   currentLocaltion,
					   result_response,
					   result_ext){
	var actorObj={
		mbox:userMailbox,
		"name":ActorName
		}
	var verbObj={
		id:aceVocab+verb,
		display:{
			"en-US":verb
		}
	}
	
	var objectObj={
		"id":currentLocaltion,
		"definition":{
			"name":{"en-US": result_ext}
		}
	}
	var resultObj={
		"response":result_response,
	}
	var statement={
		actor:actorObj,
		verb:verbObj,
		result:resultObj,
		object: objectObj
	}
	return statement;
}

function ComposeStatement(typeofStatement,actormbx,actorType,verbID,ObjectID,data){
	var TheData;
	if (verbID!=ListenVerStr){
		TutorName="";
	}else{
		if (TutorName.indexOf("@")==-1){
		   TutorName=TutorName+"@"	
		}
	}
	if (data.Transitions!=undefined){
		TheData=data.Transitions;
		TheData.SKOType=Status;
	}else if (data.Data!=undefined) {
		TheData=data.Data;
		TheData.SKOType=Status;
	}else{
		TheData={"SKOType":Status};
	}
	var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString,ITProfile:TheData}};
	var actorObj;
	QueryString="";
	xAPIObject=GetObjective1(actormbx,verbID);

	if (verbID==ChatVerb1){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var anID="mailto:"+verbID+"@"+rootServer;
		xAPIObject=GetObjective4(anID,verbID,"AT Chat Service");
	}else if (verbID==ChatVerb2){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var anID="mailto:"+verbID+"@"+rootServer;
		xAPIObject=GetObjective4(anID,verbID,"AT Chat Service");
	}else if (verbID==ListenVerStr){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var ATLink=window.location.href;
		var TaegetStr=data.action;
		xAPIObject=GetObjective10(Auser,"Agent",fullname);
	}else if (verbID==InputVerStr){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var ATLink=window.location.href;
		var TaegetStr=data.action;
		TutorEmail="mailto:"+SKOGuid+"@"+SchoolName
		xAPIObject=GetObjective10(TutorEmail,"Agent",SKOTitle);
	}

	//	ITProfile:data.Transitions,

	var OldVerbID=verbID;
	var AverbID=ITProfile+typeofStatement+"/"+verbID;
	if (Status!="OTHER") {
			if (OldVerbID==ListenVerStr){
				var TName=TutorName+" "+SKOTitle;
					var ATLink=window.location.href.split("?")[0];
					SchoolName=SKOSchool.split("//")[1];
					TutorEmail="mailto:"+SKOGuid+"@"+SchoolName;
					actorObj=ComposeActor(TName,ATLink,TutorEmail);
				var statement={
					actor:actorObj,
					verb:{
							id:AverbID,
							display:{"en-US":verbID}
						},
					object: xAPIObject,
					context:MyExtObj(QueryString,LOMString,data.Transitions,data)
				}
				return statement;
			}
			if (OldVerbID==InputVerStr){
				actorObj=ComposeActor(fullname,Auser,MoodleID);
				var ATLink=window.location.href.split("?")[0];
				var TaegetStr=data.id+" of "+TutorName+SKOTitle+" on "+data.note;

				var statement={
					actor:actorObj,
					verb:{
							id:AverbID,
							display:{"en-US":verbID}
						},
					object: xAPIObject,
					context:MyExtObj(QueryString,LOMString,data.Transitions,data)
					}
				return statement;
			}
			if (OldVerbID==TransitionStr) {
				var TName=TutorName+" "+SKOTitle;
				var ATLink=window.location.href.split("?")[0];
				SchoolName=SKOSchool.split("//")[1];
				TutorEmail="mailto:"+SKOGuid+"@"+SchoolName;
				actorObj=ComposeActor(TName,ATLink,TutorEmail);
				var Question=FindTarget(data);
				if (Question==""){
					Question="Tutor Start"
				}
				xAPIObject=GetObjective3(actormbx,verbID,Question);

				displayDebugging("#DebuggingArea",JSON.stringify(actorObj));
				displayDebugging("#DebuggingArea",JSON.stringify(xAPIObject));

				var statement={
					actor:actorObj,
					verb:{
							id:AverbID,
							display:{"en-US":verbID}
						},
					object: xAPIObject,
					context:MyExtObj(QueryString,LOMString,data.Transitions,null)
				}
				return statement;
			}
			if (OldVerbID==Evaluate_Input_Of) {
					var TName=TutorName+" "+SKOTitle;
					var ATLink=window.location.href.split("?")[0];
					SchoolName=SKOSchool.split("//")[1];
					TutorEmail="mailto:"+SKOGuid+"@"+SchoolName;
					actorObj=ComposeActor(TName,ATLink,TutorEmail);
				//	GetResultScore=Compose_matchScore(data);
					xAPIObject=GetObjective3(actormbx,verbID,FindTarget(data));

					var statement={
						actor:actorObj,
						verb:{
								id:AverbID,
								display:{"en-US":verbID}
							},
						result:GetResultScore,
						object: xAPIObject,
						context:MyExtObj(QueryString,LOMString,data.Transitions,null)
					}
					return statement;
				} 
				if (OldVerbID==matchAnswer_of) {
					var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString}};
					actorObj=ComposeActor(fullname,Auser,MoodleID);
					// actorObj=ComposeActor(fullname,HomePage,MoodleID);
					displayDebugging("#DebuggingArea",JSON.stringify(actorObj));
					GetResultScore=Compose_matchScore(data);
					var TaegetStr=data.AnswerType+", "+data.TargetID+" of "+TutorName+SKOTitle;
					var ATLink=SKOSchool+"?"+SKOGuid+"&Obj="+data.TargetID;
					xAPIObject=GetObjectiveActivityRef(ATLink,verbID,TaegetStr,data.input);

					displayDebugging("#DebuggingArea",JSON.stringify(GetResultScore));
					
					var statement={
						actor:actorObj,
						verb:{
								id:AverbID,
								display:{"en-US":verbID}
							},
						result:GetResultScore,
						object: xAPIObject,
						context:MyExtObj(QueryString,LOMString,TheData,null)
					}
					return statement;
				} 
				if (OldVerbID==SaveKCScoreStr) {
					var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString}};
					var TName=TutorName+" "+SKOTitle;
					var ATLink=window.location.href.split("?")[0];
					SchoolName=SKOSchool.split("//")[1];
					TutorEmail="mailto:"+SKOGuid+"@"+SchoolName;
					actorObj=ComposeActor(fullname,Auser,MoodleID);
					xAPIObject=GetObjectiveActivityRef(ATLink,verbID,TaegetStr,data.input);
				GetResultScore.response=data.Data.split(":")[0];
				displayDebugging("#DebuggingArea",JSON.stringify(GetResultScore));

				var statement={
					actor:actorObj,
					verb:{
							id:AverbID,
							display:{"en-US":verbID}
						},
					object: xAPIObject,
					result: GetResultScore,
					context:MyExtObj(QueryString,LOMString,TheData,null)
				}
				return statement;
			}
			var TName=TutorName+" "+SKOTitle;
				var ATLink=window.location.href.split("?")[0];
				SchoolName=SKOSchool.split("//")[1];
				TutorEmail="mailto:"+SKOGuid+"@"+SchoolName;
				actorObj=ComposeActor(TName,ATLink,TutorEmail);
			var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				context:MyExtObj(QueryString,LOMString,TheData,null)
			}
			return statement;
		}
	
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				context:MyExtObj(QueryString,LOMString,TheData,null)
			}
	return statement;
}

  var outputResults = function (resp, thing) {
	var spanclass = "text-info";
	var text = "";
	if (resp.status >= 400) {
		spanclass = "text-danger";
		text = (thing.totalErrors > 1) ? "Errors: " : "Error: ";
		for ( var res in thing.results ) {
			text += "<br>" + ((thing.results[res].instance.id) ? thing.results[res].instance.id : "Statement " + res);
			for ( var err in thing.results[res].errors ) {
				text += "<br>&nbsp;&nbsp;" + thing.results[res].errors[err].trace;
				text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + thing.results[res].errors[err].message;
			}
		}
	} else {
		if ( resp.responseText )
			text = "LRS "+LRSURL+ "Successfully sent " + resp.responseText+" "+EXPID;
		else
			text = thing+" "+EXPID;
	}
	displayDebugging('#About',text);
//	printlog(text);
};

function SimplexAPIStatementQA(AverbID,Scenecount,OptionTarget,Answer,SCORE,OtherObj){
	var actorObj=ComposeActor(fullname,Auser,"");
	var xAPIObjective=GetObjectiveQA(currentAddress,SKOTitle,Scenecount.toString(),OptionTarget);
	var verbIDURI=qs('aceVocab','https://vocabulary.autotutor.org/')+AverbID;
	var extensionsObj={};
	extensionsObj[verbIDURI]=OtherObj;
	var contextObj={extensions:extensionsObj};
	var statement={
			actor:actorObj,
			result:{score:{raw:SCORE},
					response:Answer
			},
			verb:{id:verbIDURI,
				  display:{"en-US":AverbID}
				},
			object: xAPIObjective,
			context:contextObj
		}
	console.log(statement);
	return statement;
}

function SimplexAPIStatement(AverbID,Scenecount,OptionTarget){
	var actorObj=ComposeActor(fullname,Auser,"");
	
	var xAPIObjective=GetObjectiveACE(currentAddress,SKOTitle,Scenecount.toString(),OptionTarget);
	
	var verbIDURI=aceVocab+AverbID;
	var statement={
			actor:actorObj,
			verb:{
					id:verbIDURI,
					display:{"en-US":AverbID}
				},
			object: xAPIObjective,
		}
	return statement;
}


function SimplexAPIStatementChat(AverbID,Scenecount,OptionTarget){
	var actorObj=ComposeActor(fullname,Auser,"");
	
	var xAPIObjective=GetObjectiveChat(currentAddress,SKOTitle,Scenecount.toString(),OptionTarget);
	
	var verbIDURI=aceVocab+AverbID;
	var statement={
			actor:actorObj,
			verb:{
					id:verbIDURI,
					display:{"en-US":AverbID}
				},
			object: xAPIObjective,
		}
	return statement;
}


function UpdateStatementsASAT(data,MyxAPIType){
	var j = 0;
	var Localurl=SKOGuid;
	var An_xAPIType=parseInt(MyxAPIType);
	var transActions=data.Log.Transitions;
    
	var CumulatedKCMessage="";

	displayDebugging('#DebuggingArea',JSON.stringify(data.Log.Assessments));

	if (An_xAPIType==1){ // Total Transaction Together

		var aStatementA = ComposeStatement("verbs",Auser,"Agent",TransitionStr,Localurl,data.Log);
		sendStatement(aStatementA);

		var AssessmentLength=data.Log.Assessments.length;
		var counter=0;
		if (AssessmentLength>0){
			for (counter=0; counter<AssessmentLength;counter++){
				if (data.Log.Assessments[counter].TargetID!="Event"){
					var Matchdata=data.Log.Assessments[counter];
					Matchdata.input=data.Log.Input["CurrentText"];
					
					var AssessmentVB=matchAnswer_of;
					displayDebugging('#DebuggingArea',JSON.stringify(Matchdata));
					var aStatementC = ComposeStatement("System",Auser,"Agent",AssessmentVB,Localurl,Matchdata);
					sendStatement(aStatementC);
				}
			}
			var input_and_assessment={Input:data.Log.Input,	Assessments:data.Log.Assessments}
			var aStatementB = ComposeStatement("System",Auser,"Agent",Evaluate_Input_Of,Localurl,input_and_assessment);
			sendStatement(aStatementB);
			var str="";
			var cos=-1;
			var theMode=currentMode;
			if (PMMQ.trim()!=""){
				theMode=theMode+":MQ";
				str= str+"&MQ="+PMMQ.trim(); 
			}
			if (HorP.trim()!=""){
				theMode=theMode+":HorP";
				str= str+"&HorP="+HorP.trim(); 
			}
			var inputText="Response="+data.Log.Input.CurrentText+
			              "&MatchedAnswer="+
						  "&Method="+AnswerMethod+
						  "&Mode="+theMode;

			getUUDandPostOnly(str,"0",inputText,cos);
		}
	}
	var trasisionLength=transActions.length;
    for (j = 0; j < trasisionLength; j++) {
	   if (transActions[j].RuleID!=null) {
			var transActionsActions=transActions[j].Actions;
			var transActionsRulesID="AT_rule_"+transActions[j].RuleID;
			if (An_xAPIType==2){ // Total Transaction RuleID
				var aStatement = ComposeStatement("verbs",Auser,"Agent",transActionsRulesID,Localurl,transActionsActions);
				sendStatement(aStatement);
			}
			var actionLength=transActionsActions.length;
			var k=0;
			for (k = 0; k < actionLength; k++) {
				var transActionsRulesIDAction = transActionsActions[k].Act;
				    if (transActionsActions[k].Agent=="System"){
				    displayDebugging('#DebuggingArea',JSON.stringify(transActionsActions[k]));
					displayDebugging('#DebuggingArea','=====================');
					}
					if (transActionsRulesIDAction==SaveKCScoreStr){
						var score=parseFloat(transActionsActions[k].Data.split(":")[1]);
						GetResultScore=GetResult(score);
						var aStatement = ComposeStatement("verbs",Auser,"Agent",transActionsRulesIDAction,Localurl,transActionsActions[k]);
						sendStatement(aStatement);
						if (transActionsActions[k].Data!=""){
							CumulatedKCMessage=CumulatedKCMessage+"<b>"+transActionsActions[k].Data+"</b><br/>";
						}
					}
					SaveKCScore="<p align='Center'>Your score for current learning in the form of <br/> Coverage of Knowledge Components (KC):<br/>"+
					CumulatedKCMessage+"<input type='submit' id='Replay' value='Replay'/><input type='submit' id='Restart' value='Restart'/></p>";
				if (An_xAPIType==3){
					if (transActionsRulesIDAction!=SaveKCScoreStr){
						if (AT_Blocked_Verb.indexOf(transActionsRulesIDAction)==-1){ 
						var verbstr="AT_action_"+transActionsRulesIDAction;
						var aStatement = ComposeStatement("verbs",Auser,"Agent",verbstr,Localurl,transActionsActions[k]);
						sendStatement(aStatement);
						}
					}
				}
			}
		}
	}
}

function UpdateStatementsQuestionToChatScripts(Character,data){
	if (xAPI>="1"){
		var Localurl=SKOGuid;
		var AskingChatScripts="AskingChatScripts";
		var aStatement = ComposeStatement(Character,Auser,"Agent",AskingChatScripts,Localurl,data);
		sendStatement(aStatement);
	}

}

function UpdateStatementsAnswerFromChatScripts(Character,data,verb){
	if (xAPI>="1"){
		var Localurl=SKOGuid;
		var aStatement = ComposeStatement(Character,Auser,"Agent",verb,Localurl,data);
		sendStatement(aStatement);
	}

}



function UpdateStatementsID(data){
	if (xAPI>="1"){
		var Localurl=SKOGuid;
		var Assessment=ListenVerStr;
		var aStatement = ComposeStatement("System",Auser,"Agent",Assessment,Localurl,data);
		sendStatement(aStatement);
	}

}


function UpdateStatementsAfterInput(data){
	if (xAPI>="1"){
		var Localurl=SKOGuid;
		var Assessment=InputVerStr;
		var aStatement = ComposeStatement("System",Auser,"Agent",Assessment,Localurl,data);
//		printlog(JSON.stringify(aStatement));
		sendStatement(aStatement);
	}

}
