'use strict';

angular.module('angular-pit-table.options', [])
    .provider('pitTableOptions', pitTableOptionsProvider);

function pitTableOptionsProvider() {

    var config = {
        pageRadious: 2,
        pageSize: 20
    };

    function PitTableOptions(config) {
        this.pageRadious = config.pageRadious;
        this.pageSize = config.pageSize;
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

    this.$get = [function () {
        return new PitTableOptions(config);
    }];
}


