require('heapdump');
var leakyData = [];
var nonLeakyData = [];

// Simulate App usage
setInterval(function simulateAppUsage(){
  //1. Get a random string
  var randomData = Math.random().toString();

  //2. Save the data
  addData(randomData);
}, 5);

// Log Heap Statistics
setInterval(function logHeapData(){
  //1. Force garbage collection
  try {
    global.gc();
  } catch (e) {
    console.log("You must run program with 'node --expose-gc index.js'");
    console.log("or 'npm start'");
    process.exit();
  }

  //2. Output Heap stats
  var heapUsed = process.memoryUsage().heapUsed;
  console.log("Programm is using " + heapUsed + " bytes of Heap.")
}, 1000);

// Periodically get a heap dump
setInterval(getHeapDump, 20000);

//Get the initial heap dump
getHeapDump();

function getHeapDump(){
  process.kill(process.pid, 'SIGUSR2');
}

// Store the data
function addData(data){
  //1. Store generated data
  leakyData.push(data);
  nonLeakyData.push(data);

  //2. Call clean up (on the next cycle of the event loop)
  setTimeout(function(){
    cleanUp(data);
  }, 0);
}

// Clean up the data
function cleanUp(data){
  var leakyIndex = leakyData.indexOf(data);
  var nonLeakyIndex = nonLeakyData.indexOf(data);

  // Make it leak
  // leakyData.splice(leakyIndex, 1);
  nonLeakyData.splice(nonLeakyIndex, 1);

}
