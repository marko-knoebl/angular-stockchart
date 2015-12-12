'use strict';

var stockChartApp = angular.module('stockChartApp', ['n3-line-chart', 'ngMaterial', 'ngMessages']);

stockChartApp.controller('StockChartCtrl', function($scope, $http) {
  // default date range: 1 month
  $scope.timeframe = '1 Month';

  // default symbol: ^GSPC (S&P 500)
  $scope.symbol = '^GSPC';

  var quoteStorage = {};

  var updateStoredClosePrices = function(symbol, startDate, endDate, callback) {
    // update the corresponding entry in quoteStorage (for the last 10 months);
    // then, call the callback
    // TODO: branch here
    if (!(symbol in quoteStorage) || true) {
      // not stored yet

      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 10);
      if (startDate.getMonth() < 0) {
        startDate.setMonth(startDate.getMonth() + 12);
        startDate.setYear(startDate.getYear() - 1);
      }
      var endDate = new Date();
      
      var queryString = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol +
        '" and startDate = "' + startDate.toISOString().slice(0, 10) +
        '" and endDate = "' + endDate.toISOString().slice(0, 10) + '"';
      var queryUrl = 'https://query.yahooapis.com/v1/public/yql?q=' + queryString +
        '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callaback=';
      $.ajax(queryUrl).done(function(data) {
        if (!data.query.results) {
          showErrorMessage();
          return;
        }
        // store the retrieved data
        quoteStorage[symbol] = data.query.results.quote;
        callback();
      });
    } else {
      callback();
      return;
    }
  };

  var getClosePrices = function(symbol, startDate, endDate, callback) {
    // get the close prices from the specified date range and pass them to 'callback'
    updateStoredClosePrices(symbol, startDate, endDate, function() {
      var filteredPrices = [];
      var quotes = quoteStorage[symbol];
      for (var i = 0; i < quoteStorage[symbol].length; i ++) {
        if (quoteStorage[symbol][i].Date >= startDate.toISOString().slice(0, 10)) {
          filteredPrices.push(quoteStorage[symbol][i]);
        }
      }
      callback(filteredPrices);
    });
  };

  var updateClosePrices = function() {

    // retrieve the stock data and change it in the angular model
    getClosePrices($scope.symbol, $scope.startDate, new Date(), function(quotes) {
      var dataForChart = [];
      quotes.reverse();
      quotes.forEach(function(element, index) {
        dataForChart.push({x: index, y: parseFloat(element.Close)});
      });
      $scope.$apply(function() {
        $scope.dataForChart = dataForChart;
      });
    });
  };

  $(document).ready(updateClosePrices);

  var showErrorMessage = function() {
    alert('Could not get data from the server: The selected time frame may be too long or too short.')
  };

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
