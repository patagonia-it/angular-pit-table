'use strict';

angular.module('angular-pit-table.options', [])
    .service('PitTableOptions', ptOptions);

function ptOptions() {

    var options = {
        pageRadious: 3,
        pageSize: 25
    };

    return options;

    function setPageRadious(pageRadious){
        if(angular.isNumber(pageRadious)){
            options.pageRadious = pageRadious;
        }
        return options;
    }

    function setPageSize(pageSize){
        if(angular.isNumber(pageSize)){
            options.pageSize = pageSize;
        }
        return options;
    }
}
