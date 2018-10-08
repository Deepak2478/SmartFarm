document.addEventListener("load",getFarmers());

function reportDisease(element) {
    document.getElementById("updateProgress").style.display = "none";
    document.getElementById("reportDisease").style.display = "block";
}

function updateProgress() {
    document.getElementById("updateProgress").style.display = "block";
    document.getElementById("reportDisease").style.display = "none";
}



/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function setMyPosition(oElement) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            oElement.innerHTML(position);
        });
    }

}

function getFarmers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var oSelect = document.getElementById("farmerIdSelector1");
            var oSelect2 = document.getElementById("farmerIdSelector2");
             var oResponse = JSON.parse(this.response);
             oResponse.forEach((element,index,arr)=>{
            	 oSelect.options.add(new Option(element.name,element.personId));
            	 oSelect2.options.add(new Option(element.name,element.personId))}
             );
        }
    };
    xhttp.open("GET","/api/person/all",true);
    xhttp.send();
}