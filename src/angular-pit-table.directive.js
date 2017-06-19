'use strict';

angular.module('datatables.directive', [])
    .directive('pitTable', pitTable)
    .directive('pitTableRow', pitTableRow)
    .directive('pitTableCell', pitTableCell)
    .directive('pitTableCellDatetime', pitTableCellDatetime);

function pitTable(){
    return {
        templateUrl: 'views/directives/pit-table.html',
        restrict: 'E',
        scope: {
            ptPath: '@',
            ptColumns: '=',
            ptParams: '=',
            ptEventName: '@'
        },
        link: function postLink(scope, element) {
            var config = {
                pagination: {
                    radious: 2,
                    size: 30
                }
            };
            scope.page = {
                number: 0,
                totalElements: 0,
                totalPages: 0
            };
            scope.pagination = [];
            scope.data = [];

            if (angular.isDefined(scope.ptEventName)) {
                scope.$on(scope.ptEventName, function () {
                    scope.page.number = 0;
                    scope.loadData();
                });
            }

            scope.updatePagination = function () {
                if(!scope.page){
                    return;
                }
                var actual = scope.page.number;
                var from = Math.max(0, actual - config.pagination.radious);
                var to = Math.min(from + 2 * config.pagination.radious, scope.page.totalPages - 1);
                from = Math.max(0, to - 2 * config.pagination.radious);
                scope.pagination = [
                    {
                        number: 0,
                        text: '<<',
                        disabled: actual == from
                    },
                    {
                        number: Math.max(actual - 1, 0),
                        text: '<',
                        disabled: actual == from
                    }
                ];
                for (var i = from; i <= to; i++) {
                    scope.pagination.push(
                        {
                            number: i,
                            text: i + 1,
                            enable: true,
                            selected: i === actual
                        }
                    );
                }
                scope.pagination.push(
                    {
                        number: Math.min(actual + 1, to),
                        text: '>',
                        disabled: actual == to
                    });
                scope.pagination.push({
                        number: scope.page.totalPages - 1,
                        text: '>>',
                        disabled: actual == to
                    }
                );
            };

            scope.updatePage = function (pag) {
                if (pag.disabled) {
                    return;
                }
                scope.page.number = pag.number;
                scope.loadData();
            };

            scope.getSort = function () {
                var sort = null;
                angular.forEach(scope.ptColumns, function (ptColumn) {
                    if (ptColumn.sort) {
                        if (angular.isDefined(ptColumn.columns)) {
                            sort = {
                                sort: []
                            };
                            for (var i = 0; i < ptColumn.columns.length; i++) {
                                sort.sort.push(ptColumn.columns[i] + ',' + ptColumn.sort);
                            }
                        }
                        else {
                            sort = {
                                sort: ptColumn.id + ',' + ptColumn.sort
                            };
                        }
                    }
                });
                return sort;
            };

            scope.loadData = function () {
                rest.findAll(scope.ptPath, angular.extend({
                    page: scope.page.number,
                    size: config.pagination.size
                }, scope.ptParams, scope.getSort()), function (dtData) {
                    scope.page = {
                        number: dtData.number,
                        totalPages: dtData.totalPages,
                        totalElements: dtData.totalElements
                    };
                    scope.updatePagination();
                    scope.data = dtData.content;
                });
            };

            scope.pagButClass = function (pag) {
                return {
                    'btn-primary': pag.selected,
                    'disabled': pag.disabled
                };
            };

            scope.thIconClass = function (column) {
                if (column.sortable) {
                    return {
                        'fa-sort-desc': column.sort === 'desc',
                        'fa-sort-asc': column.sort === 'asc',
                        'fa-sort sortable': column.sortable
                    };
                }
                else {
                    return {};
                }
            };

            scope.thClass = function (column) {
                return {
                    'sortable': column.sortable
                };
            };

            scope.columnOrder = function (selectedColumn) {
                if (!selectedColumn.sortable) {
                    return;
                }
                angular.forEach(scope.ptColumns, function (ptColumn) {
                    if (selectedColumn.id === ptColumn.id) {
                        if (angular.isUndefined(ptColumn.sort)) {
                            ptColumn.sort = 'asc';
                        }
                        else if (ptColumn.sort === 'asc') {
                            ptColumn.sort = 'desc';
                        }
                        else {
                            delete ptColumn.sort;
                        }
                    }
                    else {
                        delete ptColumn.sort;
                    }
                });
                scope.loadData();
            };

            scope.loadData();
        }
    };
}

function pitTableRow(){
    return {
        templateUrl: 'views/directives/pit-table-row.html',
        restrict: 'A',
        scope: {
            ptColumns: '=',
            ptRowData: '='
        },
        link: function postLink(scope, element, attrs) {

        }
    };
}

function pitTableCell($compile) {
    return {
        restrict: 'A',
        scope: {
            ptColumn: '=',
            ptRowData: '='
        },
        link: function postLink(scope, element, attrs) {

            var config = {
                'datetime': 'pit-table-row-datetime'
            };

            if (scope.ptColumn.id) {
                if (angular.isDefined(config[scope.ptColumn.type])) {
                    element.append($compile('<' + scope.ptColumn.directive + ' class="' + config[scope.ptColumn.type] + '"></' + scope.ptColumn.directive + '>')(scope));
                }
                else {
                    element.text(scope.ptRowData[scope.ptColumn.id]);
                }
            }
            else if (scope.ptColumn.directive) {
                element.append($compile('<' + scope.ptColumn.directive + ' row-data="ptRowData"></' + scope.ptColumn.directive + '>')(scope));
            }
        }
    };
}

function pitTableCellDatetime() {
    return {
        templateUrl: 'views/directives/pit-table-row-datetime.html',
        restrict: 'C',
        link: function postLink(scope, element, attrs) {
            scope.datetime = scope.ptRowData[scope.ptColumn.id];
        }
    };
}