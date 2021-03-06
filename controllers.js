'use strict';

var stockChartApp = angular.module('stockChartApp', ['n3-line-chart', 'ngMaterial', 'ngMessages']);

stockChartApp.controller('StockChartCtrl', function($scope, $http) {
  // default date range: 1 month
  $scope.timeframe = '1 Month';

  // default symbol: ^GSPC (S&P 500)
  $scope.symbol = '^GSPC';

  var quoteStorage = {};

  var pastDate = function(years, months) {
    // return the date that's the specified years and months in the past
    var date = new Date();
    date.setYear(date.getFullYear() - 0);
    date.setMonth(date.getMonth() - months);
    if (date.getMonth() < 0) {
      date.setMonth(date.getMonth() % 12);
      date.setYear(date.getFullYear() - 1);
    }
    return date;
  };

  var updateStoredClosePrices = function(symbol, callback) {
    // make sure the quote in quoteStorage is up-to-date
    // then, call the callback
    symbol = symbol.toLowerCase();
    var startDate = pastDate(0, 10);
    var endDate = new Date();
    if (!(symbol in quoteStorage)) {
      // not stored yet
      var queryString = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol +
        '" and startDate = "' + startDate.toISOString().slice(0, 10) +
        '" and endDate = "' + endDate.toISOString().slice(0, 10) + '"';
      var queryUrl = 'https://query.yahooapis.com/v1/public/yql?q=' + queryString +
        '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
      $http({method: 'GET', url: queryUrl}).then(
        function(request) {
          if (!request.data.query.results) {
            showErrorMessage();
            return;
          }
          // store the retrieved data
          quoteStorage[symbol] = request.data.query.results.quote;
          callback();
        },
        function(request) {
          showErrorMessage();
        }
      );
    } else {
      callback();
    }
  };

  var getClosePrices = function(symbol, startDate, endDate, callback) {
    // get the close prices from the specified date range and pass them to 'callback'
    symbol = symbol.toLowerCase();
    updateStoredClosePrices(symbol, function() {
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

    var duration = parseInt($scope.timeframe);

    var startDate = pastDate(0, duration);

    // retrieve the stock data and change it in the angular model
    getClosePrices($scope.symbol, startDate, new Date(), function(quotes) {
      var dataForChart = [];
      quotes.reverse();
      quotes.forEach(function(element, index) {
        dataForChart.push({x: index, y: parseFloat(element.Close)});
      });
      //$scope.$apply(function() {
        $scope.dataForChart = dataForChart;
      //});
    });
  };

  $(document).ready(updateClosePrices);

  var showErrorMessage = function() {
    alert('Could not get data from the server.')
  };

  $scope.$watch('timeframe', updateClosePrices);

  $scope.symbolChange = updateClosePrices;

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
