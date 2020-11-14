   var domainURL = location.origin;
   
        window.addEventListener('message', receiveMessage, false);
	var lessonName;
        function receiveMessage(evt) {
            if (evt.origin === domainURL) {

                //alert("got message: "+evt.data);
                var getMessage = evt.data.split(',');
                callBoth(getMessage[0], getMessage[1]);
            }
        }

        function doResize() {}

        var xhttp;

        function onLoad() {
        URLParams = URI.parseQuery(window.location.search);
			if (URLParams["lessonName"] != undefined) {
				lessonName=URLParams["lessonName"].toLowerCase();
				var lessonNameSplit = lessonName.split('_');
				var lessonNameShort = lessonNameSplit[0];
				 var s = '';
				s += '<table border="0" padding="0" width="100%" height="30%" align="center"><tr>';
				s += '<td width="100" align="center">';
				s += '<div id="Movie1" style="width:130px; height:110px"></div>';
				s += '</td>';
				s += '<td width="100" align="center">';
				s += '<div id="Movie2" style="width:130px; height:110px"></div>';
				s += '</td>';
				s += '</tr>';
				s += '</table>';


				document.getElementById('talkingHeads').innerHTML = s;
				msAttach('Movie1', lessonNameShort+'A', 'output/'+lessonNameShort+'A_Files', 140, 115);
				msAttach('Movie2', lessonNameShort+'B', 'output/'+lessonNameShort+'B_Files', 140, 115);
			}
        }

        var responses = [];
        var movie1Loaded = false;
        var movie2Loaded = false;
        var movie1Speaking = false;
        var movie2Speaking = false;
        var talkingHeadHasLoaded = false;

     
        function Speak1() {

            Speak("Movie1", talking1.value);

        }

        function Speak2() {
            Speak("Movie2", talking2.value);

        }

        function Play1() {

            Play("Movie1", talking2.value);
        }

        function Play2() {
            Play("Movie2", talking4.value);
        }

        function response1() {
            response("Movie1", talking1.value);
        }

        function response2() {
            response("Movie2", talking2.value);
        }


        function Play(movieID, Text) {
            //alert("Playing "+" " +movieID+"   "+Text+" Not implemented yet ");
            msPlay(movieID, Text);
        }

        function Speak(movieID, Text) {

            msSpeak(movieID, Text);
        }

        function response(movieID, Text) {
            alert("Response " + " " + movieID + "   " + Text + " Not implemented yet ");
            //	msResponse(movieID, Text);
        } 
		function Stop() {
           msStop("Movie1");
           msStop("Movie2");
		   window.parent.postMessage(0, '*');
        }
		
        function onSceneLoaded(id) {
            console.log(id);
            if (id == "Movie1") {
                movie1Loaded = false;
            } else {
                movie2Loaded = false;
            }
            // CB content loaded and ready to accept commands - will get N of these where N is # of characters
        }

        function onPresentingChange(id, p) {
            // Presenting state changed, e.g. as a result of going idle
            //if (p == false) alert("Character idle");

            if (id == "Movie1" && p == false) {
                movie1Loaded = true;
                console.log(id + " is loaded");
            } else if (id == "Movie2" && p == false) {
                movie2Loaded = true;
                console.log(id + " is loaded");
            }
            if (movie1Loaded == true && movie2Loaded==true && talkingHeadHasLoaded==false ) {
                talkingHeadHasLoaded=true;
                window.parent.postMessage(9, '*');
				console.log("CSAL: both is loaded");
            }



            if (id == "Movie1" && p == true) {
                movie1Speaking = true;
                console.log(id + " is speaking");
            } else if (id == "Movie2" && p == true) {
                movie2Speaking = true;
                console.log(id + " is speaking");
            }
            if (id.Presenting == false && p == false) {
                if (movie1Speaking == true) {
                    movie1Speaking = false;
                    console.log(id.Presenting + ":" + id.Focus + ":" + p);
                    window.parent.postMessage(0, '*');
                } else {
                    movie2Speaking == false;
                    console.log(id.Presenting + ":" + id.Focus + ":" + p);
                    window.parent.postMessage(0, '*');
                }

            }

        }

        function onFocusChange(id, f) {
            // Focus changed, e.g. as a result of navigation
        }

        function onExternalCommand(id, cmd, args) {
            // External Command encountered in script
            //alert("External Command cmd=" + cmd + ", args=" + args);
        }

        function onQueueLengthChange(id, n) {
            // msSpeakQueued queue length change
        }

        function onVariableChange(id, n) {
            // One or more variables changed
        }
        //--12/12/2015 ---this  method will send script list to agent 
        function callBoth(str, status, talkingheadSwitch) {
			if(str==undefined)
			{
				
				 window.parent.postMessage(0, '*');
				 return;
			}
			else
			{

				if(talkingheadSwitch=="on")
				{
						 var strs = str.split(":");
					var firstPart = strs[0];
					var scoendPart = strs[1];

					if (status == "Speak") {

						if (firstPart == 0) {
							Speak("Movie1", scoendPart);
						 
						} else if (firstPart == 1) {
							Speak("Movie2", scoendPart);
						   
						}

					} else if (status == "Play") {
						if (firstPart == 0) {
							Play("Movie1", scoendPart);
						   
						} else if (firstPart == 1) {
							Play("Movie2", scoendPart);
						   
						}
					}
					
					
				}
					else if(talkingheadSwitch=="off")
					{
						 window.parent.postMessage(0, '*');
						
					}
				   
				}
		}