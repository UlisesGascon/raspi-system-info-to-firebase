# raspberrypi-system-info-data-to-firebase
Send the system info (cpu usage, temperature, kernel version, etc..) from any linux based system like Raspberry Pi, Ubuntu... to firebase. Realtime nodejs script

## Thanks to 
[Mario Pérez Esteso](https://twitter.com/_mario_perez) from [GeekyTheory](https://geekytheory.com). He developed the script [Raspberry Pi Status](https://github.com/GeekyTheory/Raspberry-Pi-Status) . I used that repository as the base for this one.

## Screenshot

![Screenshot](https://pbs.twimg.com/media/CHDy6QVW8AA1ug7.png:large)

## Installation
I asumed that you have installed nodejs, npm and git.


**STEP 1:**
~~~
$ git clone https://github.com/UlisesGascon/raspberrypi-system-info-data-to-firebase.git
~~~

**STEP 2:**
Edit the app.js file and include your firebase URL in the line 8

**STEP 3:**
~~~
$ npm install
~~~

**STEP 4:**
~~~
$ node app.js
~~~

**STEP 4:**
Check your Firebase app in the web browser. Now you can see all the system info there. 
