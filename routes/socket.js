/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  _ = require('underscore');

  // How finely do we want to divide up the sine wave?
  var divisions = 60;
  inputVals = _.range(0, Math.PI * 2, Math.PI/(divisions/2));

  inputValsFastCycle = _.range(0, Math.PI * 18, Math.PI/(divisions/18));
  sineValsFastCycle = inputValsFastCycle.map(function(x) { return parseFloat((Math.sin(x))); });

  sineVals = inputVals.map(function(x, i) {
    return parseFloat((Math.sin(x) + 3 + sineValsFastCycle[i]).toFixed(2));
  });
  var i = 0;
  setInterval(function() {
    if (i === sineVals.length) {
      i = 0;
    }
    var val = sineVals[i++];
    socket.emit('tick', {timestamp: Date.now(), open: val, high: val, low: val, close: val});
  }, 1000);
};