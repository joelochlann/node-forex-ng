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

    $scope.chartConfig = {
      options: {
        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0
        }
      },

      series: [{
        name: 'GBP to USD',
        tooltip: {
          valueDecimals: 2
        },
        data: []
      }],
        
      title: {
          text: 'GBP to USD Exchange Rate'
      },

      useHighStocks: true
    };

    socket.on('tick', function (tick) {
      console.log(tick);
      $scope.traders.forEach(function(trader) {
        trader.trade(tick);
      });

      var price = tick.close;
      $scope.chartConfig.series[0].data.push([tick.timestamp, price]);

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
