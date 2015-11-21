'use strict';

/* Controllers */

var stockChartApp = angular.module('stockChartApp', []);

stockChartApp.controller('StockChartCtrl', function($scope) {
  $scope.prices = [];
});
