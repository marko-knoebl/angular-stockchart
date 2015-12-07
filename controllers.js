'use strict';

var stockChartApp = angular.module('stockChartApp', ['n3-line-chart', 'ngMaterial', 'ngMessages']);

stockChartApp.controller('StockChartCtrl', function($scope) {
  // default date range: 1 month

  var startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  if (startDate.getMonth() === -1) {
    startDate.setMonth(11);
    startDate.setYear(startDate.getYear() - 1);
  }
  $scope.startDate = startDate;


  var endDate = new Date();
  $scope.endDate = endDate;

  $scope.symbol = '^GSPC';

  $scope.symbolChange = function() {
    updateClosePrices();
  };
  $scope.dateChange = function() {
    updateClosePrices();
  };
});

stockChartApp.controller('InnerChartCtrl', function($scope) {

  $scope.chartOptions = {
    series: [
      {
        y: 'y'
      }
    ]
  }
});
