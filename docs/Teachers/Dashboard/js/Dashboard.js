var TheLRSURL = qs("lrs", "https://record.x-in-y.com/arcproduction/xapi/");
var TheLRSLogin = qs("lrslogin", "8ab2151b-dd04-478c-9a41-6075ef40d47e");
var theLRSPassword = qs("lrspassword", "8ab2151b-dd04-478c-9a41-6075ef40d47e");

var AggregateURLData = TheLRSURL + "statements/aggregate";

var TheDataAuthory = btoa(TheLRSLogin + ":" + theLRSPassword);

var TheUniqPointer = qs(
  "TheDashPointer",
  "https://record.x-in-y.com/integrations/embedableDashboards/"
);
var DashboardAgentLink = qs(
  "DashAgentLink",
  "07288904-ab64-4562-87ea-821880887e14"
);
var DashboardActivityLink = qs(
  "DashActivityLink",
  "52f9d198-442a-4d96-b33d-c83baae136d2"
);
var DashboardLRSLink = qs(
  "DashLRSLink",
  "2a82bdc3-10ff-4a9c-beb9-a6dad906a26f"
);

function DisplayStudentLog(StudentID, name) {
  var TheDate = Date.now();
  var last24hurs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  var DashConfig = {
    name: "agent",
    params: {
      agentId: {
        value: StudentID,
        display: name,
      },
    },
  };
  return (
    TheUniqPointer + DashboardAgentLink + "/#" + JSON.stringify(DashConfig)
  );
}

function DisplayStudentActivity(StudentID, name) {
  var TheDate = new Date();
  var last24hurs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  var DashConfig = {
    name: "activity",
    params: {
      activityId: {
        value: StudentID,
        display: name,
        range: {
          from: last24hurs,
          to: TheDate,
        },
      },
    },
  };
  return (
    TheUniqPointer + DashboardActivityLink + "/#" + JSON.stringify(DashConfig)
  );
}

function DisplayLRSLog() {
  return TheUniqPointer + DashboardLRSLink + "/";
}

function GetLessonInformation(LessonID) {
  var LessonIfo = {};
  for (var i = 0; i < TheLessionsInfo.length; i++) {
    if (LessonID.indexOf(TheLessionsInfo[i][1]) > 0) {
      LessonIfo.total = parseInt(TheLessionsInfo[i][4]);
      LessonIfo.passing = parseFloat(TheLessionsInfo[i][5]);
      LessonIfo.lessonTitle = TheLessionsInfo[i][0];
      return LessonIfo;
    }
  }
}

function CreateLessonByStudentMatrix() {
  var settings = TheLRStheSetting;
  // create matrix
  var lessonID = 0;
  var studentID = 0;
  //  create matrix
  var match = {
    "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
    $or: [
      {
        "statement.result.score.raw": 1,
      },
      {
        "statement.result.score.raw": 0,
      },
    ],
  };
  if (qs("classID", "0000") != "Master") {
    var theStr = "^.*" + qs("classID", "0000") + ".*$";
    match = {
      "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
      "statement.object.name": {
        $parseRegex: {
          regex: theStr,
        },
      },
      $or: [
        {
          "statement.result.score.raw": 1,
        },
        {
          "statement.result.score.raw": 0,
        },
      ],
    };
  }
  var data = [
    {
      $match: match,
    },
    {
      $sort: {
        "statement.timestamp": -1,
      },
    },
    {
      $group: {
        _id: "$statement.result.response",
        sum: {
          $sum: 1,
        },
        Start: {
          $min: "$statement.timestamp",
        },
        End: {
          $max: "$statement.timestamp",
        },
        MaxScore: {
          $max: "$statement.result.score.raw",
        },
        MinScore: {
          $min: "$statement.result.score.raw",
        },
        Average: {
          $avg: "$statement.result.score.raw",
        },
      },
    },
  ];
  settings.data = JSON.stringify(data);
  $.ajax(settings).done(function (response) {
    if (response.length == 0) {
      return;
    } else {
      var TheRealResponse = [];
      for (var i = 0; i < response.length; i++) {
        var details = response[i]._id;
        if (details.indexOf("mailto:") != -1) {
          TheRealResponse.push(response[i]);
        }
      }
      var Lessons = [];
      var Learners = [];

      for (i = 0; i < TheRealResponse.length; i++) {
        var details = TheRealResponse[i]._id;
        var DetailObj = JSON.parse(details);
        var lessoninfor = {
          guid: DetailObj.lesson,
          title: DetailObj.lessonTitle,
        };
        var learnerinfo = {
          email: DetailObj.learner,
          name: DetailObj.learnerName,
        };

        if (Lessons.includes(JSON.stringify(lessoninfor))) {
        } else {
          Lessons.push(JSON.stringify(lessoninfor));
        }
        if (Learners.includes(JSON.stringify(learnerinfo))) {
        } else {
          Learners.push(JSON.stringify(learnerinfo));
        }
      }

      console.log(Lessons);
      console.log(Learners);
      // create table
      var html = "<table align='center' id='ReportTable'>";
      html = html + "<tr><th></th>";
      for (var j = 0; j < Learners.length; j++) {
        html =
          html +
          "<th> <p align='center'>" +
          JSON.parse(Learners[j]).name.split(" ")[0] +
          "</p></th>";
      }
      html = html + "</tr>";
      for (var i = 0; i < Lessons.length; i++) {
        html = html + "<tr>";
        var Therow = "";

        for (var k = 0; k < TheRealResponse.length; k++) {
          var Thedetails = JSON.parse(TheRealResponse[k]._id);
          if (Therow == "") {
            if (Thedetails.lesson == JSON.parse(Lessons[i]).guid) {
              var LessonInfor = GetLessonInformation(Thedetails.lesson);
              Therow = LessonInfor.lessonTitle;
              html = html + "<th>" + Therow + "</th>";
            }
          }
        }

        for (var j = 0; j < Learners.length; j++) {
          var theValue = "";

          var AgentLink = DisplayStudentLog(
            JSON.parse(Learners[j]).email,
            JSON.parse(Learners[j]).name
          );
          var activityLink = DisplayStudentActivity(
            JSON.parse(Learners[j]).email,
            JSON.parse(Learners[j]).name
          );
          var Links =
            "<li><a href='" +
            AgentLink +
            "' target='alllogs'><button>Activity Log</button></a> </li>";
       
          /*Links =
            Links +
            "<li><a href='" +
            activityLink +
            "' target='activity'>activities in the last 24 hours</a>" +
            "</li>";
            */

          var WithAnswer = false;
          for (var k = 0; k < TheRealResponse.length; k++) {
            var Thedetails = JSON.parse(TheRealResponse[k]._id);

            if (
              Thedetails.lesson == JSON.parse(Lessons[i]).guid &&
              Thedetails.learner == JSON.parse(Learners[j]).email
            ) {
              Thedetails.learnerName=JSON.parse(Learners[j]).name;
              Thedetails.LessonTitle=Therow;
              var LastPerformance =
                "<li><button onclick='GetLastperformance(\"" +
                encodeURI(JSON.stringify(Thedetails)) +
                "\")'>Last Performance</button></li>";
                console.log(LastPerformance)
              WithAnswer = true;
              var cellID = "cell__" + i.toString() + "__" + j.toString();

              if (TheRealResponse[k].sum >= LessonInfor.total) {
                if (TheRealResponse[k].Average >= LessonInfor.passing) {
                  theValue =
                    "<button onclick='togglebtn(\"" +
                    cellID +
                    "\");' class='btn1' style='background-color: green' >&#10003;</button>";
                } else {
                  theValue =
                    "<button onclick='togglebtn(\"" +
                    cellID +
                    "\");' class='btn1' style='background-color: red' >&#10008;</button>";
                }
              } else {
                theValue =
                  "<button onclick='togglebtn(\"" +
                  cellID +
                  "\");' class='btn1' style='background-color: grey' >&#x27A4;</button>";
              }

              theValue =
                theValue +
                "<ul  id='" +
                cellID +
                "' style='display:none; z-index: -1'>";

              theValue = theValue + LastPerformance;
              theValue = theValue + Links;
              theValue =
                theValue +
                "<li>Last  Access: " +
                ReturnDate(TheRealResponse[k].End) +
                " </li>";
              theValue =
                theValue +
                "<li>First  Access: " +
                ReturnDate(TheRealResponse[k].Start) +
                " </li>";
              theValue =
                theValue +
                "<li>Answered: " +
                TheRealResponse[k].sum +
                " Question(s)</li>";
              theValue =
                theValue +
                "<li>Maximum Score " +
                TheRealResponse[k].MaxScore.toFixed(2) +
                " </li>";
              theValue =
                theValue +
                "<li>Minimum Score " +
                TheRealResponse[k].MinScore.toFixed(2) +
                " </li>";
              theValue =
                theValue +
                "<li>Average Score " +
                TheRealResponse[k].Average.toFixed(2) +
                " </li>";
              theValue = theValue + "</ul>";
            } else {
            }
          }
          if (WithAnswer) {
            html = html + "<td>" + theValue + "</td>";
          } else {
            html = html + "<td></td>";
          }
          theValue = "";
        }
        html = html + "</tr>";
      }
    }
    html = html + "</table>";
    console.log(html);
    $("#TheStatusOfStudents").html(html);
    // create table
  });
}

function GetLastperformance(LessonAndUser) {
  var LessonLearner=JSON.parse(decodeURI(LessonAndUser));
  console.log(LessonLearner)
  findLastSession(LessonLearner.lesson, LessonLearner.learner, 1, false,LessonLearner) 
}

function togglebtn(divName) {
  $("#" + divName).toggle();
  console.log(divName);
}

function DashBoardCheckStudentStatus() {
  CreateLessonByStudentMatrix();
}

function GetLessonName(LessonList, guid) {
  for (var i = 0; i < LessonList.length; i++) {
    if (LessonList[i][2] == guid) {
      return LessonList[i][0] + ": " + LessonList[i][1];
    }
  }
  return "";
}

function loadjscssfile(filename, filetype) {
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

TheLessionsInfo = [];

function GetLessonsInfo(json) {
  var spData;
  var FromTools = json.feed == null;
  if (FromTools) {
    spData = json;
  } else {
    spData = json.feed.entry;
  }
  var i;
  for (i = 0; 6 * i < spData.length; i++) {
    var line = i * 6;
    var row = [
      spData[line].content["$t"],
      spData[line + 1].content["$t"],
      spData[line + 2].content["$t"],
      spData[line + 3].content["$t"],
      spData[line + 4].content["$t"],
      spData[line + 5].content["$t"],
    ];
    TheLessionsInfo.push(row);
  }
  DashBoardCheckStudentStatus();
}

TheLRStheSetting = {
  async: true,
  crossDomain: true,
  url: AggregateURLData,
  method: "POST",
  headers: {
    authorization: "Basic " + TheDataAuthory,
    "content-type": "application/json",
    "cache-control": "no-cache",
    "x-experience-api-version": "1.0.3",
    "postman-token": "f2acffd3-e37a-3578-cea0-995aa07124a8",
  },
  processData: false,
  data: {},
};

function findLastSession(LessonID, Learnermbox, N, findReport,LessonLearnObj) {
  var thesetting = TheLRStheSetting;
  var match = {
    "statement.actor.mbox": Learnermbox,
    "statement.object.mbox": LessonID,
    "statement.verb.id": "https://app.skoonline.org/ITSProfile/start",
  };
  var data = [
    {
      $match: match,
    },
    { $sort: { "statement.timestamp": -1 } },
    { $limit: N },
    { $project: { statementTime: "$statement.timestamp" } },
  ];
  thesetting.data = JSON.stringify(data);
  $.ajax(thesetting).done(function (response) {
    if (response.length == 0) {
    } else {
      getCurrentScore(
        LessonID,
        Learnermbox,
        response[0].statementTime,
        findReport,LessonLearnObj
      );
    }
  });
}

function getCurrentScore(LessonID, Learnermbox, startingTime, findReport,LessonLearnObj) {
  var thesetting = TheLRStheSetting;
  var match = {
    "statement.actor.mbox": Learnermbox,
    "statement.object.mbox": LessonID,
    "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
    "statement.timestamp": { $gt: { $parseDate: { date: startingTime } } },
  };
  var group = {
    _id: "$statement.result.response",
    sum: {
      $sum: 1,
    },
    Start: {
      $min: "$statement.timestamp",
    },
    End: {
      $max: "$statement.timestamp",
    },
    MaxScore: {
      $max: "$statement.result.score.raw",
    },
    MinScore: {
      $min: "$statement.result.score.raw",
    },
    Average: {
      $avg: "$statement.result.score.raw",
    },
  };
  var data = [
    {
      $match: match,
    },
    {
      $group: group,
    },
  ];
  thesetting.data = JSON.stringify(data);
  $.ajax(thesetting).done(function (response) {
    if (response.length == 0) {
      var msg="LAST RECORD RETRIEVED: \n"
            msg=msg+LessonLearnObj.learnerName.split(" ")[0] +" Worked on lesson "+LessonLearnObj.LessonTitle+"\n"
            msg=msg+"Started at: "+ReturnDate(startingTime)+"\n";
            msg=msg+"But did not answer any questions";
            alert(msg);
    } else {
      for (i = 0; i < TheLessionsInfo.length; i++) {
        if (response[0]._id.indexOf(TheLessionsInfo[i][1]) > -1) {
          if (findReport) {
            if (response[0].Average >= TheLessionsInfo[i][5]) {
              userPerformancePage(
                "pass",
                response[0].Average,
                0,
                response[0].sum,
                "Level"
              );
            } else {
              userPerformancePage(
                "Fail",
                response[0].Average,
                0,
                response[0].sum,
                "Level"
              );
            }
            return;
          } else {
            var msg="LAST RECORD RETRIEVED: \n"
            msg=msg+LessonLearnObj.learnerName.split(" ")[0] +" Worked on lesson "+LessonLearnObj.LessonTitle+"\n"
            msg=msg+"Total Number of questions answered: "+response[0].sum+"\n";
            msg=msg+"Average Score: "+response[0].Average.toFixed(2)+"\n"; 
            msg=msg+"Started at: "+ReturnDate(response[0].Start)+"\n";
            msg=msg+"Finished at: "+ReturnDate(response[0].End)+"\n";
            alert(msg);
          }
        }
      }
    }
  });
}
