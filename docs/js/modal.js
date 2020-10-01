
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 

// When the user clicks on <span> (x), close the modal

// When the user clicks anywhere outside of the modal, close it

function OpenModal(header,footer,bodytext){
	var html="";
	html=html+'<div class="modal-content">';
    html=html+'<div class="modal-header">';
    html=html+'<span class="close" onclick="moveforward()">&times;</span>';
    html=html+'<h2>'+header+'</h2>';
    html=html+'</div>';
    html=html+'<div class="modal-body">';
    html=html+bodytext;
    html=html+'</div>';
    html=html+'<div class="modal-footer">';
    html=html+'<h3>'+footer+'</h3>';
    html=html+'</div>';
	html=html+'</div>';
	var mymessage=document.getElementById("myMessage");
	mymessage.innerHTML = html;
	mymessage.style.display = "block";
}