var Parse = false;
var counter = 1;
var actions = [];
var getHistory = [];
var webAPImethod="GET";
		function lessonRecover()
		{
			var userID=sessionStorage.getItem("UID");
			
			
			var inpjson = "{\"ID\":\"" + userID + "\",\"ScriptURL\":\"" + "" + "\",\"User\":\"" + "" + "\",\"UseDB\":\"" + "false" + "\"}";
			
			var content =JSON.parse(inpjson);
			var url="http://ace.autotutor.org/ACEAPICORS6/api/aceaction/";
			var method= "GET";
			var getUrl=$.ajax({
			type: method,
			url: url,
			data: content,
			success: function(data){
			getJsonobj(data);
			
				
			}
			}).done(function (data){
					show_confirm();
				});
		}
		function getJsonobj(obj) {
		 if(obj=="null")
		 {
		 return;
		 }
		 else
		 {
			for ( var key in obj) {
				if (key == "ACEActions" && Parse == false) {
					Parse = true;
				}
				if (Parse == true && key != "Log") {
					if (typeof obj[key] == 'object') {
						getJsonobj(obj[key]);
					} else {
						if (webAPImethod == "GET") {
							if (counter == 1) {
								line = obj[key];
								counter += 1;
							} else if (counter >= 1 && counter <= 3) {
								line = line + "/////" + obj[key];
								if (counter == 3) {
									
									actions.push(line + "\n");
										counter = 0;
										line = "";
									
									
								}
								counter += 1;
							}
						}
					}
				} else if (key == "Log") {
					getLog(obj);
					Parse = false;
					break;
					
					}
				}
				
			}
		
    
		}
	function getLog(obj){
		for ( var key in obj) {
			if (typeof obj[key] == 'object') {
					getLog(obj[key]);
				} 
				else {
				line = obj[key];
				if(key=="PresentationID" ||key=="PresentationHistory" || key=="UserID" ||key=="Time")
				{
				getHistory.push(line);
				
				}
			}

		}
	}
	