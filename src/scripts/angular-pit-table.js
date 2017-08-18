'use strict';

angular
  .module('angular-pit-table', [
    'angular-pit-table.options',
    'angular-pit-table.factory',
    'angular-pit-table.directive'
  ])
  .run(function($templateCache) {
    $templateCache.put('views/pit-table.html', '<div class="row"> <div class="col-md-12"> <table class="table table-bordered table-responsive table-striped"> <thead> <tr> <th ng-repeat="column in ptColumns" ng-class="thClass(column)" ng-click="columnOrder(column)"> <i class="pull-right fa" ng-class="thIconClass(column)"></i>{{column.name}} </th> </tr> </thead> <tbody> <tr ng-repeat="rowData in data" pit-table-row pt-columns="ptColumns" pt-row-data="rowData"></tr><tr ng-if="!page.totalElements" pit-table-row-empty pt-columns="ptColumns"></tr> </tbody> </table> </div> </div> <div ng-if="page.totalElements" class="row"> <div class="col-md-5">{{page.totalElements}} registros ({{page.totalPages}} páginas)</div> <div class="col-md-7"> <div class="btn-group pull-right" ng-show="pagination.length > 0"> <button ng-repeat="p in pagination" ng-click="updatePage(p)" ng-class="pagButClass(p)" type="button" class="btn btn-default"> {{p.text}}</button> </div> </div> </div>');
  });
