'use strict';

var stockChartApp = angular.module('stockChartApp', ['n3-line-chart', 'ngMaterial', 'ngMessages']);

stockChartApp.controller('StockChartCtrl', function($scope) {
  // default date range: 1 month
  $scope.timeframe = '1 Month';

  // default symbol: ^GSPC (S&P 500)
  $scope.symbol = '^GSPC';

  $scope.$watch('timeframe', function(newValue) {
    var startDate = new Date();
    // number of months
    var duration = parseInt(newValue);
    
    startDate.setMonth(startDate.getMonth() - duration);
    if (startDate.getMonth() < 0) {
      startDate.setMonth(startDate.getMonth() % 12);
      startDate.setYear(startDate.getYear() - 1);
    }
    $scope.startDate = startDate;
    updateClosePrices();
  });

  $scope.symbolChange = function() {
    updateClosePrices();
  };

  this.openMenu = function($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
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
