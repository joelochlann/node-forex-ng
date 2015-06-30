'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    $scope.traders = [
      new SimpleMovingAverageTrader("SimpleMovingAverageTrader", 50000),
      new RandomTrader("RandomTrader", 10000),
      new MovingAverageTrader("MovingAverageTrader", 50000, 10),
      new RSITrader("RSITrader", 50000, 14)
    ];

    socket.on('tick', function (tick) {
      console.log(tick);
      $scope.traders.forEach(function(trader) {
        trader.trade(tick);
      });

      var price = tick.close;

      if ($scope.lastPrice) {
        var up = ((price - $scope.lastPrice) > 0);
        $scope.upOrDown = up ? 'up' : 'down';
      }
      $scope.lastPrice = price;
    });
  }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('tick', function (tick) {
      $scope.price = tick.close;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
