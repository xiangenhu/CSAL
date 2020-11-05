
$(document).ready(function(){


		$(".mainTargetURL").click(function(){
		var TargetURL = $(this).attr("url");
		var getID = $(this).attr("id");
		var TargetName = $(this).html();
		TargetName=TargetName.replace(/[\r\n]/g,"");
		TargetName=TargetName.replace(/[\/#$%\^&\*{}=_`~();\"]/g,"");
		TargetName=TargetName.replace(/nbsp/g,'');
		TargetName=TargetName.replace(/(^\s*)|(\s*$)/g, "");
		TargetName=TargetName.replace(/<[^>].*?>/g,"");
		TargetName=TargetName.replace(/[\t]+/g,"");
		parent.PlaySound('clicked0.wav');
		if (getID=="resume")
		{
			
			parent.showMedia("resources/csalgsuedu/csalMainPage.html");
			
		
		}
		else if (getID=="lessons" ||getID=="progress"||getID=="quit"||getID=="newsforyou")
		{
			var nwin = window.open();
			nwin.location =TargetURL;
			var TargetURL=TargetURL;
		
		}
	var TagetObj="{'TargetURL':"+TargetURL+",'TargetName':"+TargetName+"}";
		
		saveAction(TagetObj);
	
		});
		
		
	$(".targetURL").click(function(){
		var TargetURL = $(this).attr("href");
		var TargetName= $(this).html();
		var TagetObj="{'TargetURL':"+TargetURL+",'TargetName':"+TargetName+"}";
		
		saveAction(TagetObj);
	
		});
		
		
			});
function saveAction(TagetObj)
{
	var uids = sessionStorage.getItem("UID").split("-")[2];
	var inpjson = "{\"UserID\":\"" + uids + "\",\"TargetURL\":\"" + TagetObj + "\"}";

	var content = JSON.parse(inpjson);
	var method = "POST";

	
	var APIUrl="https://ace.autotutor.org/aceapicors12/api/StudentReading";
	var getUrl = $.ajax({
		type : method,
		url :  APIUrl,
		
		//dataType:'json',
		data : content,
		success : function(data) {
			
		}
		}).done(function (data){
		
});
}
			