'use strict';

angular.module('angular-pit-table.factory', [])
    .factory('PTColumnBuilder', ptColumnBuilder)
    .factory('PTParamsBuilder', ptParamsBuilder);

function ptColumnBuilder(){

    var PTColumn = {
        withName: function(name) {
            this.name = name;
            return this;
        },

        withType: function(type) {
            this.type = type;
            return this;
        },

        withDirective: function(directive) {
            this.directive = directive;
            return this;
        },

        notSortable: function() {
            this.sortable = false;
            return this;
        },

        withOrder: function(order) {
            this.order = order;
            return this;
        },

        withOrderColumns: function(orderColumns) {
            if(angular.isArray(orderColumns)){
                this.orderColumns = orderColumns;
            }
            return this;
        }
    };
    
    return {
        newColumn: function(id, name) {
            if (angular.isUndefined(id)) {
                throw new Error('El parámetro "id" no está definido');
            }
            var column = Object.create(PTColumn);
            column.id = id;
            column.sortable = true;
            if (angular.isDefined(name)) {
                column.name = name;
            }
            return column;
        },
        PTColumn: PTColumn
    };
}

function ptParamsBuilder(){

    var PTParams = {
        withParam: function(key, value) {
            if (angular.isString(key)) {
                this.params[key] = value;
            }
            return this;
        },

        withUrl: function(url) {
            this.url = url;
            return this;
        },

        withEventName: function(eventName) {
            this.eventName = eventName;
            return this;
        },
    };

    return {
        newParams: function() {
            var params = Object.create(PTParams);
            params.params = {};
            return params;
        },
        PTParams: PTParams
    };
}