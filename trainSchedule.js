//Initialize firebase
var config = {
    apiKey: "AIzaSyB9VU8CaW3v2361yy34tcEkdKM3YFABvEY",
    authDomain: "timesheet-e2bed.firebaseapp.com",
    databaseURL: "https://timesheet-e2bed.firebaseio.com",
    storageBucket: "timesheet-e2bed.appspot.com",
  };
firebase.initializeApp(config);

var db = firebase.database();
var nextArrival = '';
var minutesAway = 0;

$(document).on("click", "#submitBtn", function() {
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTime = $("#firstTime").val().trim();
  var formatted = firstTime+":00";
  var frequency = parseInt($("#frequency").val().trim());
  var now = moment();
  var date = now.format('YYYY-MM-DD');
  var time = now.format('HH:mm:ss');
  var converted = moment(new Date(date+" "+formatted));
  var difference = now.diff(converted,'minutes');
  if(difference<=0){
     nextArrival = firstTime;
     minutesAway = difference*(-1);
    console.log(nextArrival);
    console.log(minutesAway);
  } else {
    var multiplier = Math.ceil(difference/frequency);
    var addTime = multiplier*frequency;
    console.log(addTime);
    nextArrival = now.add(addTime,'minutes').subtract(difference,'minutes').format('HH:mm A');
    minutesAway = addTime - difference;
    console.log(nextArrival);
    console.log(minutesAway);
  }


  db.ref().push({
    name: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
    nextArrival:nextArrival,
    minutesAway:minutesAway
  });

 $("#trainName").empty();
 $("#destination").empty();
 $("#firstTime").empty();
 $("#frequency").empty();


});

db.ref().on("child_added", function(childSnapshot) {
  var dbName = (childSnapshot.val().name);
  var dbDestination = (childSnapshot.val().destination);
  var dbFirstTime = (childSnapshot.val().firstTime);
  var dbFrequency = (childSnapshot.val().frequency);
  var dbNextArrival = (childSnapshot.val().nextArrival);
  var dbMinutesAway = (childSnapshot.val().minutesAway);



  var newRow = $('<tr>');
  var td1 = $('<td>').html(dbName);
  var td2 = $('<td>').html(dbDestination);
  var td3 = $('<td>').html(dbFrequency);
  var td4 = $('<td>').html(dbNextArrival);
  var td5 = $('<td>').html(dbMinutesAway);



  newRow.append(td1, td2, td3, td4, td5);
  $('.table').append(newRow);



}, function(error) {
  console.log(error.code);
});

