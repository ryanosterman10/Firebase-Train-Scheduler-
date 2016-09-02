// Initialize Firebase
var config = {
	apiKey: "AIzaSyChq_4hnE2kwKKWgPrsuZBRwBgzfhn8q10",
    authDomain: "train-scheduler-aea51.firebaseapp.com",
    databaseURL: "https://train-scheduler-aea51.firebaseio.com",
    storageBucket: "train-scheduler-aea51.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

// add train to list from user input and clear input fields

$("#addTrain").on('click', function(event){
	event.preventDefault();
  	var trainName = $("#nameInput").val().trim();
  	var trainDestination = $("#destinationInput").val().trim();
  	var firstTrainTime = moment($("#firstTimeInput").val().trim(), "HH:mm").format("X");
  	var trainFrequency = $("#frequencyInput").val().trim();

  	var newTrain = {
  		name: trainName,
  		destination: trainDestination,
  		time: firstTrainTime,
  		frequency: trainFrequency
  	}

  	database.ref().push(newTrain);

  	$("#nameInput").val("");
  	$("#destinationInput").val("");
  	$("#firstTimeInput").val("");
  	$("#frequencyInput").val("");

});

// using moment.js to convert times

database.ref().on('child_added', function(childSnapshot, prevChildKey){

	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().time;
	var trainFrequency = childSnapshot.val().frequency;

	var firstTimeConverted = moment.unix(firstTrainTime, 'hh:mm').subtract(1, 'years');

	var currentTime = moment();

	var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');

	var remainder = diffTime % trainFrequency;

	var minsAway = trainFrequency - remainder;

	var nextArrival = moment().add(minsAway, 'minutes').format('HH:mm');

	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td><tr>");

});



