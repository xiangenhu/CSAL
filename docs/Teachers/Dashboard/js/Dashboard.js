var TheUniqPointer = qs(
  "TheDashPointer",
  "https://record.x-in-y.com/integrations/embedableDashboards/"
);
var DashboardAgentLink = qs(
  "DashAgentLink",
  "37448295-cd87-4727-92e0-72187923fb30"
);
var DashboardActivityLink = qs(
  "DashActivityLink",
  "ee6e78ae-20c4-4767-9790-8a002a44ce99"
);
var DashboardLRSLink = qs(
  "DashLRSLink",
  "ef68bddf-2a01-40ae-a87f-9e9e2be4a71f"
);

function DisplayStudentLog(StudentID, name) {
  var TheDate = Date.now();
  var last24hurs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  var DashConfig = {
    name: "agent",
    params: { agentId: { value: StudentID, display: name } },
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
        range: { from: last24hurs, to: TheDate },
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
      { "statement.result.score.raw": 1 },
      { "statement.result.score.raw": 0 },
    ],
  };
  if (qs("ClassID", "0000") != "Master") {
    var theStr = "^.*" + qs("ClassID", "0000") + ".*$";
    match = {
      "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
      "statement.object.name": { $parseRegex: { regex: theStr } },
      $or: [
        { "statement.result.score.raw": 1 },
        { "statement.result.score.raw": 0 },
      ],
    };
  }
  var data = [
    { $match: match },
    { $sort: { "statement.timestamp": -1 } },
    {
      $group: {
        _id: "$statement.result.response",
        sum: { $sum: 1 },
        Start: { $min: "$statement.timestamp" },
        End: { $max: "$statement.timestamp" },
        MaxScore: { $max: "$statement.result.score.raw" },
        MinScore: { $min: "$statement.result.score.raw" },
        Average: { $avg: "$statement.result.score.raw" },
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
            "<br/><a href='" +
            encodeURI(activityLink) +
            "' target='activity'>activities in the last 24 hours</a>" +
            "<br/><a href='" +
            encodeURI(AgentLink) +
            "' target='alllogs'>All history since starting</a>";
          var WithAnswer = false;
          for (var k = 0; k < TheRealResponse.length; k++) {
            var Thedetails = JSON.parse(TheRealResponse[k]._id);

            if (
              Thedetails.lesson == JSON.parse(Lessons[i]).guid &&
              Thedetails.learner == JSON.parse(Learners[j]).email
            ) {
              WithAnswer = true;
              var cellID = "cell_" + i.toString() + "_" + j.toString();
              // get inform rom lessons
              //             var lessonPassing=GetLessonInformation(Thedetails.lesson);

              if (TheRealResponse[k].sum >= LessonInfor.total) {
                if (TheRealResponse[k].Average >= LessonInfor.passing) {
                  theValue =
                    "<button onclick='togglebtn(\"" +
                    cellID +
                    "\");' class='btn' style='background-color: green' >&#10003;</button>";
                } else {
                  theValue =
                    "<button onclick='togglebtn(\"" +
                    cellID +
                    "\");' class='btn' style='background-color: red' >&#10008;</button>";
                }
              } else {
                theValue =
                  "<button onclick='togglebtn(\"" +
                  cellID +
                  "\");' class='btn' style='background-color: purple' >&#10003;</button>";
              }

              theValue =
                theValue + "<div id='" + cellID + "' style='display:none'>";
              theValue = theValue + "<ul>";
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
              //              var theLinkRow="<li>More details:"+Links+" </li>";
              //              theValue =theValue+ "<li>More details:"+Links+" </li>";
              theValue = theValue + "</ul>";
              theValue = theValue + "</div>";
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
    $("#TheStatusOfStudents").html(html);
    // create table
  });
}

function togglebtn(divName) {
  $("#" + divName).toggle();
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
    console.log(row);
    TheLessionsInfo.push(row);
  }
}
