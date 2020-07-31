		var UID = [
				"Memphis-Test-Art:Art Graesser C1",
				"Memphis-Test-Whitney:Whitney Baer C2",
				"Memphis-Test-Carl:Carl Cai C3",
				"Memphis-Test-Qinyu:Qinyu Cheng C4:D20150225",
				"Memphis-Test-Qinyu:Qinyu2 Cheng C4:D20150225",
				"Memphis-Test-Tiffany:Tiffany Hunter C5",
				"Memphis-Test-Amy:Amy Adcock C6",
				"Memphis-Test-Andrew:Andrew Olney C7",
				"Memphis-Test-Breya:Breya Walker C8",
				"Memphis-Test-Cadarrius:Cadarrius McGlown C9",
				"Memphis-Test-Craig:Craig Kelly C10",
				"Memphis-Test-Danielle:Danielle Clewley C11",
				"Memphis-Test-Patrick:Patrick Hays C12",
				"Memphis-Test-Habibah:Habibah Khan C13",
				"Memphis-Test-Haiying:Haiying Li C14",
				"Memphis-Test-Janay:Janay Stewart C15",
				"Memphis-Test-ComputerStudent1:ComputerStudent1 Delong C16",
				"Memphis-Test-Lijia:Lijia Wang C17",
				"Memphis-Test-Logan:Logan Garrison C18",
				"Memphis-Test-Mark:Mark Conley C19",
				"Memphis-Test-Megan:Megan Reed C20",
				"Memphis-Test-Morgan:Morgan Douglass C21",
				"Memphis-Test-Parya:Parya Zareie C22",
				"Memphis-Test-Paul:Paul Edwards C23",
				"Memphis-Test-C24:Qiong Yu C24",
				"Memphis-Test-C25:Qiping Bao C25",
				"Memphis-Test-Shi:Shi Feng C26",
				"Memphis-Test-Xiangen:Xiangen Hu C27",
				"Memphis-Test-Stephanie:Stephanie Bagley C28",
				"Memphis-Test-Devi:Devi Rodgerson C29",
				"Memphis-Test-Anthony:Anthony Pedace C30",
				"Memphis-Test-Yehui:Yehui Liu C31"
				
				];
		var availableTags = [
				"Art Graesser",
				"Whitney Baer",
				"Carl Cai",
				"Qinyu Cheng",
				"Qinyu2 Cheng",
				"Tiffany Hunter",
				"Amy Adcock",
				"Andrew Olney",
				"Breya Walker",
				"Cadarrius McGlown",
				"Craig Kelly",
				"Danielle Clewley",
				"Patrick Hays",
				"Habibah Khan",
				"Haiying Li",
				"Janay Stewart",
				"ComputerStudent1 Delong",
				"Lijia Wang",
				"Logan Garrison",
				"Mark Conley",
				"Megan Reed",
				"Morgan Douglass",
				"Parya Zareie",
				"Paul Edwards",
				"Qiong Yu",
				"Qiping Bao",
				"Shi Feng",
				"Xiangen Hu",
				"Stephanie Bagley",
				"Devi Rodgerson",
				"Anthony Pedace",
				"Yehui Liu"
				];
			$(document).ready(function()
			{
				$("#fadeBody").fadeIn(1000);
				
				$("#firstName").focus();
				
				$("#firstName").keyup(function(event){
					if(event.keyCode == 13){ $("#submit").click(); }
				});
				
				$("#submit").click(function(){					
					if( $("#firstName").val().length == 0 )
					{
						parent.PlaySound('incorrect0.wav');
						$("#firstName").focus();
					}
					else
					{
					var getName=$("#firstName").val();
					var isExisit=$.inArray(getName, availableTags);
						
							if(isExisit!=-1)
							{
								parent.PlaySound('clicked0.wav');
						
								$("#fadeBody").fadeOut(800, function()
								{
									submitName(isExisit);
								});
							
							}
							else 
							{
							parent.PlaySound('incorrect0.wav');
							$("#firstName").focus();
							
							}
							
							
						
					}
					
					$("#firstName").keyup(function(event){
						if(event.keyCode == 13){ $("#submit").click(); }
					});
				});
				
				//this sets the hover animation & cursor for buttons
				$( ".mybutton" ).mouseover(function()
				{ $(this).animate({backgroundColor: "#edff73"}, 350); });
				$( ".mybutton" ).mouseout(function()
				{ $(this).animate({backgroundColor: "white"}, 300); });
				$( ".mybutton" ).css( 'cursor', 'pointer' );
			});

			function submitName(index)
			{			
				//make results into a string//
				
				var name = document.getElementById("firstName").value;
				var fristName = name.split(" ");
				sessionStorage.setItem("uname",fristName[0]);
				//var isExisit=$.inArray(getName, availableTags);
				var getUID = UID[index].split(":");
				//var GUID=sessionStorage.getItem("GUID");
				var GUID="";
				//sessionStorage.setItem("UID",getUID[0]+"-"+GUID);
				sessionStorage.setItem("UID",getUID[0]);
				var strs=getUID[1].split(" ");
				
				if(getUID.length==2)
				{
				sessionStorage.setItem("SID",strs[2]);
				//parent.sayHi(sessionStorage.getItem("uname"));
				}
				else if(getUID.length==3)
				{
					
					sessionStorage.setItem("SID",getUID[2]);
					parent.sayHi("user");
					
				}
				
				
				//alert(sessionStorage.getItem("uname"));
				
				
				
				//var id = document.getElementById("id").value;
				//window.external.GetName(name);
				//window.external.GetId(name);
				window.location = "CSALScreenPage.html";
			}
			
			function isNumber(evt) {
				evt = (evt) ? evt : window.event;
				var charCode = (evt.which) ? evt.which : evt.keyCode;
				if (charCode > 31 && (charCode < 48 || charCode > 57)) {
					alert("Phone number consists of only numbers");
					return false;
				}
				return true;
			}
			
			$(function() {
				
				$( "#firstName" ).autocomplete({
				  source: availableTags
				});
			  });