
var TheLessions=[];
var StudentList=[];

var TheLRSURL=qs("lrs","https://record.x-in-y.com/csaldata2021/xapi/");
var TheLRSLogin=qs("lrslogin","CSALData");
var theLRSPassword=qs("lrspassword","CSALData");
var AggregateURLData=TheLRSURL+"/statements/aggregate";
var TheDataAuthory=btoa(TheLRSLogin+":"+theLRSPassword);
var classID=qs("classID","CSALUSNW01");
var StudentEmailPhrase = "student";

TheLRStheSetting={
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


function GetLessons(json){
    var spData = json.feed.entry;
    var i;
    for (i=0;3*i<spData.length;i++){
        var line=i*3;
        var row=[spData[line].content["$t"],spData[line+1].content["$t"],spData[line+2].content["$t"]];
        console.log(row)
        TheLessions.push(row);
    }
	GetStudents(classID)
}

function studentsReport(student,verb){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":+student,"statement.verb.id":"https://app.skoonline.org/ITSProfile/"+verb};
	var group={"_id":"$statement.id",
	           "Sum":{"$sum":1}};
	var data=[
	{"$match":match},
	{"$group":group}
	];
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		
	})
}

function GetStudents(classID){
    var thesetting=TheLRStheSetting;
	var match={"statement.result.response":classID};
	var group={"_id":"$statement.actor.mbox",
	           "Sum":{"$sum":1}};
	var data=[
	{"$match":match},
	{"$group":group}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
			return
		}else{
			for (var i=0;i<response.length;i++){
				if (response[i]._id.indexOf(StudentEmailPhrase)!=-1){
					var studentID=response[i]._id;
					studentID=studentID.split("@")[0].split(":")[1].split("tudent")[1];
				StudentList.push(studentID);
				}
			}
			console.log(StudentList);
			CreateTable(TheLessions,StudentList)
		}
	});
}

function GetPassFailInProgress(Lesson,Student,i,j){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":"mailto:student"+Student+"@csal.autotutor.org",
	           "statement.object.mbox":"mailto:"+Lesson[1]+"@csal.autotutor.org"
			};
	var data=[
		{"$match":match},
		{"$sort":{"statement.timestamp":-1}},
		{"$group":{"_id":"$statement.verb.id","TotalScore":{"$sum":1}}}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		var scoreFiled="score_"+i.toString()+"_"+j.toString();
		if (response.length==0){ 
			$("#"+scoreFiled).html("");
			return;
		}else{
			for (var k=1;k<response.length;k++){
				if (response[k]._id.indexOf("completed")>-1){
				$("#"+scoreFiled).html("P");
				return;
				}
				if (response[k]._id.indexOf("failed")>-1){
					$("#"+scoreFiled).html("F");
					return;
				}
			}
			$("#"+scoreFiled).html("IP");
		}
	});
}

function GetScoreThe(Lesson,Student,i,j){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":"mailto:student"+Student+"@csal.autotutor.org",
	           "statement.verb.id":"https://app.skoonline.org/ITSProfile/action",
	           "statement.object.mbox":"mailto:"+Lesson[1]+"@csal.autotutor.org"
			};
	var data=[
	{"$match":match},
		{"$sort":{"statement.timestamp":-1}},
		{"$project":{"ResultExt":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"}},
		{"$project":{"Statement":"$ResultExt.Score.this"}}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		var scoreFiled="score_"+i.toString()+"_"+j.toString();
		if (response.length==0){ 
			$("#"+scoreFiled).html("");
			return;
		}else{
			$("#"+scoreFiled).html("tried");
		}
	});
}

function StudentDetails(student){
	var htmlbody="Information about "+student;
	htmlbody=htmlbody+"<ul>";
	htmlbody=htmlbody+"<li>Most recent time seen in class: <span class='numbers' id='RecentTime'></span></li>";
	htmlbody=htmlbody+"<li>Time started the lesson: <span class='numbers' id='FirstTime'></span></li>";
	htmlbody=htmlbody+"<li>Number of Lessons Started: <span class='numbers' id='NLStarted'></span></li>";
	htmlbody=htmlbody+"<li>Number of Lessons Completed: <span class='numbers' id='NLCompeted'></span></li>";
	htmlbody=htmlbody+"<li>Number of Lessons falsed: <span class='numbers' id='NLFaled'></span></li>";
	htmlbody=htmlbody+"<li>Number of question answered: <span class='numbers' id='NumberQ'></span></li>";
	htmlbody=htmlbody+"</ul>";
	OpenPopUp(student,"details of "+student,htmlbody,"popupWin");
}
function CreateTable(LessonList,StudentList){
	var j;
	var i;
	var html="";
	html=html+"<table align='center' id='customers'>"
	html=html+"<tr><th></th>";
	for (j=0;j<StudentList.length;j++){
		html=html+"<th>"+StudentList[j]+"<button  onclick='StudentDetails(\""+StudentList[j]+"\")'>?</button></th>";
	}
	html=html+"</tr>";
	for (i=0;i<LessonList.length;i++){
		html=html+"<tr> <td>"+LessonList[i][0]+"</td>";
		for (j=0;j<StudentList.length;j++){
			var scoreFiled="score_"+i.toString()+"_"+j.toString();
			html=html+"<td><span id='"+scoreFiled+"'>"+" "+"</span></td>";
		}
		html=html+"</tr>";
	}
	html=html+"</table>";
	$("#TheGrades").html(html);
	$("#TheGrades").show();
	for (i=0;i<LessonList.length;i++){
		for (j=0;j<StudentList.length;j++){
			GetPassFailInProgress(LessonList[i],StudentList[j],i,j);
		//	GetScoreThe(LessonList[i],StudentList[j],i,j);
		}
	}
}

function GetGradesFor(User,Test,ObjID,n,i,j,link){
	var settings=TheLRStheSetting;
	var Target={};
	Target={
			"statement.actor.mbox":User,
			"statement.verb.id":"https://www.autotutor.org/ITSProfile/Answer",
			"statement.object.id":ObjID
		}
	var GroupIng={};
	GroupIng={
		"_id":"$statement.actor.name",
		"Sum":{"$sum":1},
		"AverageConfidence":{"$avg":"$statement.result.score.raw"},
		"AverageScore":{"$avg":"$statement.result.score.scaled"},
		"AverageTime":{"$avg":"$statement.result.score.max"}
	}

	var data=[{"$match":Target},
	          {"$sort":{"statement.timestamp":-1}},
			  {"$limit":parseInt(n)},
			  {"$group":GroupIng}
	 ];
	 settings.data=JSON.stringify(data);
	 $.ajax(settings).done(function (response) {
		if (response.length==0){ return}
		$("#email"+i.toString()).html(response[0]._id);
		html="";
		if (response[0].AverageScore<0.999){
			html=html="<a href='"+link+"' targt='Test'>"+response[0].AverageScore.toFixed(2)+"</a>";
		}else{
			html=response[0].AverageScore.toFixed(2);
		}
		$("#test"+j.toString()+i.toString()).html(html);
	     console.log(Test, response[0]._id, response[0].AverageScore);
	  });

}

function GetScore(email){
	var html="";
	html=html+"<table align='center' id='customers'>"
	html=html+"<tr>";
	var j;
	for (j=0;j<TestList.length;j++){
		html=html+"<th>"+TestList[j][0]+"</th>";
	}
	html=html+"</tr>";
	html=html+"<tr>";
	for (j=0;j<TestList.length;j++){
		html=html+"<td><span id='TheTest"+j.toString()+"'></span></td>";
	}
	html=html+"</tr>";
	html=html+"</table>";
	html=html+"<ul>";
	html=html+"<span id='additionalNotes'></span>";
	html=html+"</ul>";
	$("#TheYourScore").html(html);
	for (j=0;j<TestList.length;j++){
		getTest(email,TestList[j][1],TestList[j][2],"TheTest"+j.toString(),TestList[j][3],TestList[j][0]);
	}
}
function getTest(email,testID,n,target,link,Title){
	var settings=TheLRStheSetting;
	var Target={};
	Target={
			"statement.actor.mbox":"mailto:"+email,
			"statement.verb.id":"https://www.autotutor.org/ITSProfile/Answer",
			"statement.object.id":testID
		}
	var GroupIng={};
	GroupIng={
		"_id":"$statement.actor.mbox",
		"Sum":{"$sum":1},
		"AverageConfidence":{"$avg":"$statement.result.score.raw"},
		"AverageScore":{"$avg":"$statement.result.score.scaled"},
		"AverageTime":{"$avg":"$statement.result.score.max"}
	}

	var data=[{"$match":Target},
	          {"$sort":{"statement.timestamp":-1}},
			  {"$limit":parseInt(n)},
			  {"$group":GroupIng}
	 ];
	 settings.data=JSON.stringify(data);
	 $.ajax(settings).done(function (response) {
		html="";
		if (response.length==0){ 
			$("#"+target).html("0");
			return;
		}
		var difference=parseInt(n)-response[0].Sum;
		if (response[0].AverageScore<0.999){
			if (difference==0){
				html=html="<a href='"+link+"' target='Test'>"+response[0].AverageScore.toFixed(2)+"*</a>";
				var varNotes=$("#additionalNotes").html();
				$("#additionalNotes").html(varNotes+ " <li>*You can improve your score for <span class='numbers'>"+Title+" </span><br/>");

			}else{
				html=html="<a href='"+link+"' target='Test'>"+response[0].AverageScore.toFixed(2)+"**</a>";
				var varNotes=$("#additionalNotes").html();
				$("#additionalNotes").html(varNotes+ " <li>**You need to answer additional <span class='numbers'>"+difference.toString()+" </span> problems for <span class='numbers'>"+Title+" </span><br/>");
			}
		}else{
			if (difference==0){
			    html=response[0].AverageScore.toFixed(2);
			}else{
				html=html="<a href='"+link+"' target='Test'>"+response[0].AverageScore.toFixed(2)+"**</a>";
				var varNotes=$("#additionalNotes").html();
				$("#additionalNotes").html(varNotes+ " <li>**You need to answer additional <span class='numbers'>"+difference.toString()+" </span> problems for <span class='numbers'>"+Title+" </span><br/>");
			}
		}
		$("#"+target).html(html);
	  });


}
