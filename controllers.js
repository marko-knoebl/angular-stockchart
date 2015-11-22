'use strict';

/* Controllers */

var stockChartApp = angular.module('stockChartApp', []);

stockChartApp.controller('StockChartCtrl', function($scope) {

  $scope.prices = [];

  // default date range: 1 month
  var date = new Date();
  $scope.endDate = date.toISOString().slice(0,10);
  date.setMonth(date.getMonth() - 1);
  if (date.getMonth() === -1) {
    date.setMonth(11);
    date.setYear(date.getYear() - 1);
  }
  $scope.startDate = date.toISOString().slice(0,10);

  $scope.symbol = 'VXUS';
});
