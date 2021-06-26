$(document).ready(function () {
  //$('.pscontainer').hide();
  var process = 1;
  setProgress(process);
  $(".pscontainer").hide();
});

function setProgress(progress) {
  $(".pscontainer").show();
  var progressBarWidth = (progress * $(".pscontainer").width()) / 100;
  //$(".progressbar").width(progressBarWidth).html(progress + "% ");
  $(".progressbar").width(progressBarWidth).html();
}

function getPageName(data) {
  var getProcessValue = sendProcessValue();
  var pageNameList = data.split("/");
  var pageName = pageNameList[pageNameList.length - 1];
  if (pageName.indexOf("?") != -1) {
    PageNameA = pageName.split("?");
    pageName = PageNameA[0];
  }

  for (i = 0; i < getProcessValue.length; i++) {
    if (pageName == getProcessValue[i][0]) {
      setProgress(getProcessValue[i][1]);
      return;
    }
  }
}

function LoadProgressBarJs(currentMediaPath) {
  var URL = "";
  URL = currentMediaPath + "media/js/processBarDefine.js";
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = URL;
  document.body.appendChild(script);
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        setProgress(1);
        ShowProgressbar();
      }
    };
  } else {
    script.onload = function () {
      setProgress(1);
      ShowProgressbar();
    };
  }
}
