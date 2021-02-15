
var TheLessions=[];
var StudentList=[];

var TheLRSURL=qs("lrs","https://record.x-in-y.com/csaldata2021/xapi/");
var TheLRSLogin=qs("lrslogin","CSALData");
var theLRSPassword=qs("lrspassword","CSALData");
var AggregateURLData=TheLRSURL+"/statements/aggregate";
var TheDataAuthory=btoa(TheLRSLogin+":"+theLRSPassword);

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
}

function GetStudents(){
    var thesetting=TheLRStheSetting;
    

}

function CreateTable(){
	var j;
	var i;
	var html="";
	html=html+"<table align='center' id='customers'>"
	html=html+"<tr><th></th>";
	for (j=0;j<TestList.length;j++){
		html=html+"<th>"+TestList[j][0]+"</th>";
	}
	html=html+"</tr>";
	html=html+"<tr><td></td><td></td><td></td></tr>";
	for (i=0;i<emailList.length;i++){
		html=html+"<tr><td><span id='email"+i.toString()+"'>"+emailList[i]+"</span></td>"
		for (j=0;j<TestList.length;j++){
			html=html+"<td><span id='test"+j.toString()+i.toString()+"'></span></td>"
		}
		html=html+"</tr>"
	}
	html=html+"</table>";
	$("#TheGrades").html(html);
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
