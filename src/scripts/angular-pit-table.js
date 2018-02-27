'use strict';

angular
  .module('angular-pit-table', [
    'angular-pit-table.options',
    'angular-pit-table.factory',
    'angular-pit-table.directive',
    'angular-loading-bar'
  ])
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.parentSelector = '#loading-container';
  })
  .run(function($templateCache) {
    $templateCache.put('views/pit-table.html', '<style>#loading-bar-spinner { position: relative; display: inline-block; width: 100%; text-align: center; top: 0; } #loading-bar-spinner .spinner-icon { width: 30px; height: 30px; display: inline-block; }</style><div class="row"> <div class="col-md-12"> <div id="loading-container" ng-if="showLoading"></div><div class="table-responsive"><table ng-if="!showLoading" class="table table-bordered table-striped"> <thead> <tr> <th ng-repeat="column in ptColumns" ng-class="thClass(column)" ng-click="columnOrder(column)"> <i class="pull-right fa" ng-class="thIconClass(column)"></i>{{column.name}} <pit-table-header-checkbox></pit-table-header-checkbox></th> </tr> </thead> <tbody> <tr ng-repeat="rowData in data" pit-table-row pt-columns="ptColumns" pt-row-data="rowData"></tr><tr ng-if="!page.totalElements" pit-table-row-empty pt-columns="ptColumns"></tr> </tbody> </table> </div></div> </div> <div ng-if="page.totalElements" class="row"> <div class="col-md-5">{{page.totalElements}} registros ({{page.totalPages}} páginas)</div> <div class="col-md-7"> <div class="btn-group pull-right" ng-show="pagination.length > 0"> <button ng-repeat="p in pagination" ng-click="updatePage(p)" ng-class="pagButClass(p)" type="button" class="btn btn-default"> {{p.text}}</button> </div> </div> </div>');
  });
