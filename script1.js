 const alert = document.querySelector("audio");

 function spawnNotification(theBody, theIcon, theTitle) {
     var options = {
         body: theBody,
         icon: theIcon
     }
     var n = new Notification(theTitle, options);
 }



 function notifyMe() {
     if (!("Notification" in window)) {
         alert("This web browser doesn't support notifications :(");
     } else if (Notification.permission === "granted") {
         spawnNotification('Remember to drink water every 6 mins!', 'logo-small.jpg', 'WATER alert');
         alert.play();

     } else if (Notification.permission !== 'denied') {
         Notification.requestPermission(function (permission) {
             if (permission === "granted") {
                 spawnNotification('Remember to drink water every 6 mins!', 'logo-small.jpg', 'WATER alert');
                 alert.play();
             }
         });
     }
 }

 function notifyMeFirst() {
     if (!("Notification" in window)) {
         alert("This web browser doesn't support notifications :(");
     } else if (Notification.permission === "granted") {
         spawnNotification('This is how notifications will look like', 'logo-small.jpg', 'WATER alert');
         alert.play();

     } else if (Notification.permission !== 'denied') {
         Notification.requestPermission(function (permission) {
             if (permission === "granted") {
                 spawnNotification('This is how notifications will look like', 'logo-small.jpg', 'WATER alert');
                 alert.play();
             }
         });
     }
 }

notifyMeFirst();


 const min = document.querySelector(".timeMin");
 const sec = document.querySelector(".timeSec");

 let minutes = 5;
 let seconds = 00;
 setTimeout(function () {
     min.textContent = minutes;
 }, 1000);
 setInterval(function () {
     minutes--;
     if (minutes < 0) {
         minutes = 4;
     }
     min.textContent = minutes;
 }, 60000)
 setInterval(function () {
     seconds--;
     if (seconds < 0) {
         seconds = 59;
     }
     if (seconds >= 10) {
         sec.textContent = seconds;
     } else {
         sec.textContent = "0" + seconds;
     }
 }, 1000)

 setInterval(notifyMe, 9000);
 