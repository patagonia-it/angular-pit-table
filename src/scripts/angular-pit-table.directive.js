'use strict';

angular.module('angular-pit-table.directive', ['angular-pit-table.factory', 'spring-data-rest'])
  .directive('pitTable', pitTable)
  .directive('pitTableHeaderCheckbox', pitTableHeaderCheckbox)
  .directive('pitTableRow', pitTableRow)
  .directive('pitTableRowEmpty', pitTableRowEmpty)
  .directive('pitTableCell', pitTableCell)
  .directive('pitTableCellDatetime', pitTableCellDatetime)
  .directive('pitTableCellBoolean', pitTableCellBoolean)
  .directive('pitTableCellCheckbox', pitTableCellCheckbox);

function pitTable($http, SpringDataRestAdapter, pitTableOptions) {
  return {
    templateUrl: 'views/pit-table.html',
    restrict: 'E',
    require: 'ngModel',
    scope: {
      ptColumns: '=',
      ptParams: '='
    },
    link: function postLink(scope, element,  attrs, ngModel) {
      scope.page = {
        number: 0,
        totalElements: 0,
        totalPages: 0
      };
      scope.pagination = [];
      scope.selectedC = [];
      scope.unSelectedC = [];
      scope.selectAll = false;
      scope.data = [];

      scope.$root.$on('cfpLoadingBar:started', function() {
        scope.$root.isLoading = true;
      });

      scope.$root.$on('cfpLoadingBar:completed', function() {
        scope.$root.isLoading = false;
      });

      if (angular.isDefined(scope.ptParams.eventName)) {
        scope.$on(scope.ptParams.eventName, function () {
          scope.page.number = 0;
          scope.loadData();
        });
      }

      scope.updatePagination = function () {
        if (!scope.page) {
          return;
        }
        var actual = scope.page.number;
        var from = Math.max(0, actual - pitTableOptions.pageRadious);
        var to = Math.min(from + 2 * pitTableOptions.pageRadious, scope.page.totalPages - 1);
        from = Math.max(0, to - 2 * pitTableOptions.pageRadious);
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
            if (angular.isDefined(ptColumn.orderColumns)) {
              sort = {
                sort: []
              };
              for (var i = 0; i < ptColumn.orderColumns.length; i++) {
                sort.sort.push(ptColumn.orderColumns[i] + ',' + ptColumn.sort);
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
        var sort = scope.getSort();
        var object = {
          url: scope.ptParams.url,
          method: scope.ptParams.method
        };

        if(scope.ptParams.isInBody){
          object.data = scope.ptParams.params;
          object.params = angular.extend(
            {
              page: scope.page.number,
              size: pitTableOptions.pageSize
            },
            sort);
        } else {
          object.params = angular.extend({},
            scope.ptParams.params,
            {
              page: scope.page.number,
              size: pitTableOptions.pageSize
            },
            sort
          )
        }
        var httpPromise = $http(object);
        scope.$root.isLoading = true;
        scope.showLoading = true;
        SpringDataRestAdapter.process(httpPromise).then(
          function success(dtData) {
            if (angular.isDefined(dtData._embeddedItems)) {
              scope.page = {
                number: dtData.page.number,
                totalPages: dtData.page.totalPages,
                totalElements: dtData.page.totalElements
              };
              scope.data = dtData._embeddedItems;

            }
            else {
              scope.page = {
                number: dtData.number,
                totalPages: dtData.totalPages,
                totalElements: dtData.totalElements
              };
              scope.data = dtData.content;
            }

            if(scope.selectAll){
              angular.forEach(scope.data, function (dt) {
                scope.$emit('updateDataCheckEvent', dt, scope.selectAll);
              });
            }

            scope.$on('updateDataCheckEvent', function (event, data, flag) {
              var idx = scope.selectedC.indexOf(data.id);
              var idxUn = scope.unSelectedC.indexOf(data.id);
              if(flag) {
                if (idx== -1) scope.selectedC.push(data.id);
                scope.unSelectedC.splice(idxUn, 1);
              } else {
                delete scope.selectedC[idx];
                scope.selectedC.length--;
                if (idxUn== -1) scope.unSelectedC.push(data.id);
              }

              scope.setSelected();
            });

            scope.$on('updatePaginationEvent', function (event, flag) {
              scope.selectAll = flag;
              scope.loadData();
            });

            ngModel.$setViewValue({
              page: scope.page,
              data: scope.data,
              selectedC: scope.selectedC,
              unSelectedC: scope.unSelectedC,
              selectAll: scope.selectAll
            });

            scope.updatePagination();
            scope.setSelected();
            scope.$root.isLoading = false;
            scope.showLoading = false;
          },
          function error(response) {
            console.error('error al obtener la información', response);
            scope.$root.isLoading = false;
            scope.showLoading = false;
          }
        );
      };

      scope.setSelected = function() {

        angular.forEach(scope.selectedC, function (value) {
          angular.forEach(scope.data, function (dt) {
            if ( dt.id == value ){
              dt.isCheck = true;
            }
          });
        });

        angular.forEach(scope.unSelectedC, function (value) {
          angular.forEach(scope.data, function (dt) {
            if ( dt.id == value ){
              dt.isCheck = false;
            }
          });
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

      if(!angular.isDefined(scope.ptParams.params.loadAtStart) || scope.ptParams.params.loadAtStart ==='true') {
        scope.loadData();
      }
    }
  };
}

function pitTableHeaderCheckbox() {
  return {
    template: '<input ng-if="isCheckBoxAll" type="checkbox" ng-model="selectAll" ng-click="selectedChange()">',
    restrict: 'E',
    scope: {
      ptColumns: '=',
      ptRowData: '='
    },
    link: function postLink(scope, element, attrs) {

      scope.isCheckBoxAll = scope.$parent.column.checkAll;

      scope.selectedChange = function () {

        scope.selectAll = !scope.selectAll;

        if ( angular.isDefined(scope.$parent.data) && scope.$parent.data.length ) {
          angular.forEach(scope.$parent.data, function (data) {
            scope.$emit('updateDataCheckEvent', data, scope.selectAll);
          });
        }

        scope.$emit('updatePaginationEvent', scope.selectAll);

      };

    }
  };
}

function pitTableRow() {
  return {
    template: '<td ng-repeat="ptColumn in ptColumns" pit-table-cell pt-column="ptColumn" pt-row-data="ptRowData" ng-class="ptColumn.clazz"></td>',
    restrict: 'A',
    scope: {
      ptColumns: '=',
      ptRowData: '='
    },
    link: function postLink(scope, element, attrs) {

    }
  };
}

function pitTableRowEmpty(pitTableOptions) {
  return {
    template: '<td colspan="{{ptColspan}}" class="text-center">{{emptyText}}</td>',
    restrict: 'A',
    scope: {
      ptColumns: '='
    },
    link: function postLink(scope, element, attrs) {
      scope.ptColspan = scope.ptColumns.length;
      scope.emptyText = pitTableOptions.emptyTableText;
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
        'datetime': 'pit-table-cell-datetime',
        'boolean': 'pit-table-cell-boolean',
        'checkbox': 'pit-table-cell-checkbox'
      };


      if (scope.ptColumn.directive) {
        element.append($compile('<' + scope.ptColumn.directive + ' row-data="ptRowData"></' + scope.ptColumn.directive + '>')(scope));
      }
      else if (angular.isDefined(config[scope.ptColumn.type])) {
        element.append($compile('<div class="' + config[scope.ptColumn.type] + '"></div>')(scope));
      }
      else {
        if(scope.ptColumn.id.constructor === Array){
          var data = scope.ptRowData;
          for (var i = 0; i < scope.ptColumn.id.length; i++) {
            data = data[scope.ptColumn.id[i]];
          }
          element.text(data);
        }else {
          element.text(scope.ptRowData[scope.ptColumn.id]);
        }
      }
    }
  };
}

function pitTableCellDatetime() {
  return {
    template: '<div ng-if="datetime">{{datetime | humanDate}} <small class="text-info">({{datetime | fromNow}})</small></div> <div ng-if="!datetime" class="text-center">-</div>',
    restrict: 'C',
    link: function postLink(scope, element, attrs) {
      scope.datetime = scope.ptRowData[scope.ptColumn.id];
    }
  };
}

function pitTableCellBoolean() {
  return {
    template: '<i class="fa" ng-class="{\'fa-check-square-o\': boolean, \'fa-square-o\': !boolean}"></i>',
    restrict: 'C',
    link: function postLink(scope, element, attrs) {
      scope.boolean = scope.ptRowData[scope.ptColumn.id];
    }
  };
}

function pitTableCellCheckbox() {
  return {
    template: '<span class="fa fa-square-o" ng-model="ischeck" ng-show="!ischeck" ng-click="approve()"></span>' +
    '<span class="fa fa-check-square-o" ng-if="ischeck" ng-click="noApprove()"></span>',
    restrict: 'C',
    link: function postLink(scope, element, attrs) {
      scope.ischeck = scope.ptRowData.isCheck ? scope.ptRowData.isCheck : false;

      scope.approve = function () {
        scope.ischeck = true;
        scope.$emit('updateDataCheckEvent', scope.ptRowData, true);
      };
      scope.noApprove = function () {
        scope.ischeck = false;
        scope.$emit('updateDataCheckEvent', scope.ptRowData, false);
      };
    }
  };
}
