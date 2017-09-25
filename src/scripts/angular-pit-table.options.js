'use strict';

angular.module('angular-pit-table.options', [])
  .provider('pitTableOptions', pitTableOptionsProvider);

function pitTableOptionsProvider() {

  var config = {
    pageRadious: 2,
    pageSize: 20,
    emptyTableText: 'Ningún dato disponible en esta tabla.',
    method: 'GET'
  };

  function PitTableOptions(config) {
    this.pageRadious = config.pageRadious;
    this.pageSize = config.pageSize;
    this.emptyTableText = config.emptyTableText;
  };

  this.setPageRadious = function (pageRadious) {
    if (angular.isNumber(pageRadious)) {
      config.pageRadious = pageRadious;
    }
  };

  this.setPageSize = function (pageSize) {
    if (angular.isNumber(pageSize)) {
      config.pageSize = pageSize;
    }
  };

  this.setEmptyTableText = function (text) {
    config.emptyTableText = text;
  };

  this.setMethod = function (method) {
    config.emptyTableText = method;
  };

  this.$get = [function () {
    return new PitTableOptions(config);
  }];
}


