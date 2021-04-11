// More info -> https://github.com/UlisesGascon/raspberrypi-system-info-data-to-firebase

var Firebase = require("firebase");
var fs = require('fs');
var sys = require('util');
var exec = require('child_process').exec, child, child1;


/*YOUR SETTINGS!*/
var firebasePath = "https://test-only-f4216-default-rtdb.firebaseio.com/"; // Your FirebaseURL.
var fastTime = 5000; // Time used to check the memory buffered and CPU Temp. 
var customTime = 60000; // Time used to check the uptime.
var slowTime = 10000; // Time used to check the top list and CPU usage.

  // Function for checking memory
    child = exec("egrep --color 'MemTotal' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      memTotal = stdout.replace("\n","");
      var myFirebaseRef = new Firebase(firebasePath+"/memory/total");
      myFirebaseRef.set(parseInt(memTotal));
    }
  });

  // Function for checking hostname
    child = exec("hostname", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var hostname = stdout.replace("\n","");	
      var myFirebaseRef = new Firebase(firebasePath+"/hostname");
      myFirebaseRef.set(hostname);
    }
  });
  
  // Function for checking uptime
    child = exec("uptime | tail -n 1 | awk '{print $1}'", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
	    var uptime = stdout.replace("\n","");
      	var myFirebaseRef = new Firebase(firebasePath+"/uptime");
      	myFirebaseRef.set(uptime);
    }
  });

  // Function for checking Kernel version
    child = exec("uname -r", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var kernel = stdout.replace("\n","");	
      var myFirebaseRef = new Firebase(firebasePath+"/kernel");
      myFirebaseRef.set(kernel);
    }
  });

  // Function for checking Top list
    child = exec("top -d 0.5 -b -n2 | tail -n 10 | awk '{print $12}'", function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    } else {
      		var myFirebaseRef = new Firebase(firebasePath+"/toplist");
      		myFirebaseRef.set(stdout);
	    }
	  });
 
  setInterval(function(){
  // Function for checking memory free and used
    child1 = exec("egrep --color 'MemFree' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error == null) {
      memFree = stdout.replace("\n","");      
      memUsed = parseInt(memTotal)-parseInt(memFree);
      percentUsed = Math.round(parseInt(memUsed)*100/parseInt(memTotal));
      percentFree = 100 - percentUsed;
      
      var myFbmFRef = new Firebase(firebasePath+"/memory/free");
	    var myFbmURef = new Firebase(firebasePath+"/memory/used");
	    var myFbPMURef = new Firebase(firebasePath+"/memory/percent/used"); 
	    var myFbPMFRef = new Firebase(firebasePath+"/memory/percent/free"); 	  
      myFbmFRef.set(parseInt(memFree));
	    myFbmURef.set(memUsed); 
	    myFbPMURef.set(percentUsed);
	    myFbPMFRef.set(percentFree); 

    } else {
      sendData = 0;
      console.log('exec error: ' + error);
    }
  	});

  // Function for checking memory buffered
    child1 = exec("egrep --color 'Buffers' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error == null) {
      memBuffered = stdout.replace("\n","");
      percentBuffered = Math.round(parseInt(memBuffered)*100/parseInt(memTotal));
      var myFbmBRef = new Firebase(firebasePath+"/memory/buffered");
      var myFbPMBRef = new Firebase(firebasePath+"/memory/percent/buffered");
      myFbmBRef.set(parseInt(memBuffered));
	  myFbPMBRef.set(percentBuffered); 

    } else {
      sendData = 0;
      console.log('exec error: ' + error);
    }
  });

  // Function for checking memory buffered
    child1 = exec("egrep --color 'Cached' /proc/meminfo | egrep '[0-9.]{4,}' -o", function (error, stdout, stderr) {
    if (error == null) {
      memCached = stdout.replace("\n","");
      percentCached = Math.round(parseInt(memCached)*100/parseInt(memTotal));
      var myFbmCRef = new Firebase(firebasePath+"/memory/cached");
      var myFbPMCRef = new Firebase(firebasePath+"/memory/percent/cached");
      myFbmCRef.set(parseInt(memCached));
	  myFbPMCRef.set(percentCached); 
    } else {
      console.log('exec error: ' + error);
    }
  });}, fastTime);

  // Function for measuring temperature
  setInterval(function(){
    child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      //For charts we need (X axis) time and (Y axis) temperature.
      var date = new Date().getTime();
      var temp = parseFloat(stdout)/1000;
      var myFbtRef = new Firebase(firebasePath+"/CPU/temp");
      var myFbttRef = new Firebase(firebasePath+"/CPU/tempdate");
      myFbtRef.set(temp);
	    myFbttRef.set(date); 

    }
  });}, fastTime);

  setInterval(function(){
    child = exec("top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{print $2 + $4}'", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      //For charts we need (X axis) time and (Y axis) percentaje.
      var date = new Date().getTime();
      var cpuUsageUpdate = parseFloat(stdout);
      var myFbcRef = new Firebase(firebasePath+"/CPU/usage");
      var myFbctRef = new Firebase(firebasePath+"/CPU/usagedate");
      myFbcRef.set(cpuUsageUpdate);
	    myFbctRef.set(date);        
    }
  });}, slowTime);

	// Uptime
  setInterval(function(){
    child = exec("uptime | tail -n 1 | awk '{print $1}'", function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    } else {
	    	var uptime = stdout.replace("\n","");
      		var myFirebaseRef = new Firebase(firebasePath+"/uptime");
      		myFirebaseRef.set(uptime);
	    }
	  });}, customTime);
 
  // TOP list
  setInterval(function(){
    child = exec("ps aux --width 30 --sort -rss --no-headers | head  | awk '{print $11}'", function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    } else {
      var topControl = 1;
      var res = stdout.split("\n");
        for (r in res) {
          if (res[r] != "") {
                    var myFirebaseRef = new Firebase(firebasePath+"/toplist/"+topControl);
                    myFirebaseRef.set(res[r]);
                    topControl++;
              }
        }
	    }	  
});}, slowTime);
