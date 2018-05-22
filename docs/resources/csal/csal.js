		var UID = [
				"Memphis-csalevent2017-csal001:Qinyu Cheng C4",
				"Memphis-csalevent2017-csal002:Anne C31",
				"Memphis-csalevent2017-csal003:Art C1",
				"Memphis-csalevent2017-csal004:Carl C3",
				"Memphis-csalevent2017-csal005:Andrew C7",
				"Memphis-csalevent2017-csal006:Breya C8",
				"Memphis-csalevent2017-csal007:Cadarrius C9",
				"Memphis-csalevent2017-csal008:Danielle C11",
				"Memphis-csalevent2017-csal009:Lijia C17",
				"Memphis-csalevent2017-csal010:Shi C26",
				"Memphis-csalevent2017-csal011:Xiangen C27",
				"Memphis-csalevent2017-csal012:Genghu D201",
				"Memphis-csalevent2017-csal013:Thomas D201",
				"Memphis-csalevent2017-csal014:Raven D201",
				"Memphis-csalevent2017-csal015:Whitney D201",
				"Memphis-csalevent2017-csal016:Ying D201"
				
				];
		var availableTags = [
				"Qinyu",
				"Anne Lippert",
				"Art Graesser",
				"Carl Cai",
				"Andrew Olney",
				"Breya Walker",
				"Cadarrius McGlown",
				"Danielle Clewley",
				"Lijia Wang",
				"Shi Feng",
				"Xiangen Hu",
				"Genghu Shi",
				"Thomas Thompson",
				"Raven Davis",
				"Whitney Baer",
				"Ying Fang"
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
									//submitName(isExisit);
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
			