function openLink(evt, animName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-blue", "");
  }
  document.getElementById(animName).style.display = "block";
  evt.currentTarget.className += " w3-blue";
}



// function myFunction() {
//   // Get the snackbar DIV
//   var x = document.getElementById("snackbar");

//   // Add the "show" class to DIV
//   x.className = "show";

//   // After 3 seconds, remove the show class from DIV
//   setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1000);
// }




function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}

function openNavMapFull() {
  document.getElementById("myMap").style.width = "100%";
}

function closeNavMapFull() {
  document.getElementById("myMap").style.width = "0";
}



function openRightMenu() {
  document.getElementById("rightMenu").style.display = "block";
}

function closeRightMenu() {
  document.getElementById("rightMenu").style.display = "none";
}



function openConferenciaFull() {
  document.getElementById("myConferencia").style.width = "100%";
}

function closeConferenciaFull() {
  document.getElementById("myConferencia").style.width = "0";
}



function openConferenciaManualFull() {
  document.getElementById("myConferenciaManual").style.width = "100%";
}
function closeConferenciaManualFull() {
  document.getElementById("myConferenciaManual").style.width = "0";
}



function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}


function dropcopy(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("Text");
  var copyimg = document.createElement("div");
  var original = document.getElementById(data);

  copyimg.id = original.id;
  copyimg.innerText = original.children[0].innerText;
  // copyimg.innerHTML     = original.innerHTML;
  

  
  
  copyimg.style.cssText = "padding-top: 7px;width: 52px;height: 38px;color: white;background: rgb(28, 53, 93);border:2px solid orange;margin: 5px;  text-align: center;margin-left: 30%;"; original.style.cssText;

  ev.target.appendChild(copyimg);

}



function acordion(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

// function openRote(cityName) {
//   var i;
//   var x = document.getElementsByClassName("city");
//   for (i = 0; i < x.length; i++) {
//     x[i].style.display = "none";  
//   }
//   document.getElementById(cityName).style.display = "block";  
// }


function openRote(evt, cityName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " w3-red";
}



function openLink(evt, animName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
  document.getElementById(animName).style.display = "block";
  evt.currentTarget.className += " w3-red";
  
}

function openDownRetornoRouteasy() {
  var x = document.getElementById("retornoRouteasy");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}


  // function drag(ev) {
  //   ev.dataTransfer.setData("text", ev.target.id);
  // }

  // function drop(ev) {
  //   ev.preventDefault();
  //   var data = ev.dataTransfer.getData("text");
  //   ev.target.appendChild(document.getElementById(data));
  // }



//   // Change the selector if needed
// var $table = $('table.scroll'),
// $bodyCells = $table.find('tbody tr:first').children(),
// colWidth;

// // Adjust the width of thead cells when window resizes
// $(window).resize(function() {
// // Get the tbody columns width array
// colWidth = $bodyCells.map(function() {
//     return $(this).width();
// }).get();

// // Set the width of thead columns
// $table.find('thead tr').children().each(function(i, v) {
//     $(v).width(colWidth[i]);
// });    
// }).resize(); // Trigger resize handler


