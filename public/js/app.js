'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',

  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',

  // 3rd party dependencies
  'btford.socket-io',
  'highcharts-ng'
]).
config(function ($routeProvider, $locationProvider) {
  // $routeProvider.
  //   when('/view1', {
  //     templateUrl: 'partials/partial1',
  //     controller: 'MyCtrl1'
  //   }).
  //   when('/view2', {
  //     templateUrl: 'partials/partial2',
  //     controller: 'MyCtrl2'
  //   }).
  //   otherwise({
  //     redirectTo: '/view1'
  //   });

  $locationProvider.html5Mode(true);
});


(function($) {
  // It would be nice to have this done in the Angular way,
  // by using a directive to manipulate the DOM. However,
  // for Highcharts this is surprisingly difficult. The only
  // existing attempt, https://github.com/pablojim/highcharts-ng,
  // has a few issues still, in particular around adding points
  // to an existing data series, which is exactly what I want
  // to do here. The crux of it is that the only way in highcharts-ng
  // to dynamically update the data on a chart is by modifying
  // the chart config object in the scope. But this means that
  // the directive has to tell highcharts to redraw the entire graph
  // each time the series has changed, which results in different
  // and undesirable behaviour versus using .addPoint().
  $('#price-chart').highcharts('StockChart', {
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
    },
    title: {
        text: 'GBP to USD Exchange Rate'
    },
    series: [{
        name: 'GBP to USD',
        tooltip: {
            valueDecimals: 2
        }
    }]
  });

  var socket = io();
  socket.on('tick', function(tick) {
    var chart = $('#price-chart').highcharts();
    chart.series[0].addPoint([tick.timestamp, tick.close]);
  }); 
})(jQuery);