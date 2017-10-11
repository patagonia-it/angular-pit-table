# angular-pit-table

## Configuración

Para poder utilizar '_angular-pit-table_' se debe definir como dependencia en el archivo **bower.json**.

`"angular-pit-table": "https://github.com/patagonia-it/angular-pit-table.git#1.0.6"`

Y definir en el archivo **app.js** el módulo `'angular-pit-table'`

## Uso

### Lógica

Es necesario configurar en el controlador algunas de las estructuras que permitirán a la tabla conocer la forma en que debe desplegar dicha información:

Para ellos se usarán los Factory **PTParamsBuilder** y **PTColumnBuilder**:

```
  $scope.ptParams = PTParamsBuilder.newParams()
    //parámetros de búsqueda (son pasados como query params), se puede invocar más de una vez este método para tener múltiples parámetros
    .withParam('nombre_parametro', valor_parametro)
    //url donde se obtiene la información
    .withUrl(url_endpoint_data)
    //nombre del evento que la tabla atenderá y que gatillará un actualización de la data
    .withEventName('nombreEvento')
    //método que se utilizará al invocar el endpoint, por defecto 'GET'
    .withMethod('POST')
    //en caso de que esto esté marcado como true, los parámetros se enviarán en el body del request, por defecto es false
    .inBody(true);
    
  $scope.ptColumns = [
    PTColumnBuilder.newColumn('llave_de_la_respuesta', 'nombre_de_la_columna')
      //atributo(s) que se enviará al backend cuando se solicite ordenar la data por dicha columna
      .withOrderColumns(['id'])
      //tipo de ordenamiento, por defecto es 'asc'
      .withOrder('desc'),
    PTColumnBuilder.newColumn('idLocal', 'Id Local')
      //indica que la columna no podrá ser usada para ordenar la data
      .notSortable()
      //agregará dicha(s) clase(s) al <td>
      .withClass('text-center'),
      ...,
    PTColumnBuilder.newColumn('fechaEntrada', 'Fecha Ingreso')
      .withOrderColumns(['derivacion.fechaHora'])
      //indica que se muestre en un formato de fecha por defecto, también se puede utilizar 'boolean' o 'checkbox'
      .withType('datetime'),
      ...,
    PTColumnBuilder.newColumn('acciones', 'Acciones')
      //se agregará la directiva al <td> lo que permitirá personalizar la manera en que se presente la información
      .withDirective('registro-acciones')
      .notSortable()
  ];
```

### Vista

Basta con incorporar dentro del HTML la siguiente directiva:

`<pit-table ng-model="tabla" pt-columns="ptColumns" pt-params="ptParams"></pit-table>`

### Configuración

Es posible realizar una configuración global usando el _provider_ **pitTableOptions**:

```
  .config(function (pitTableOptionsProvider) {
    //asigna un tamaño de página a todas las tablas
    pitTableOptionsProvider.setPageSize(25);
    //asigna un radio de páginas que se mostrará debajo de la tabla
    pitTableOptionsProvider.setPageRadious(2);
  })
```

### Directivas

Por defecto la '_angular-pit-table_' muestra la información que se indica en la configuración, si se desea hacer algo más complejo que lo que permite la opción '_withType_' del **PTColumnBuilder**, se deben usar directivas, tal como se indica en el siguiente ejemplo:

```
  .directive('nombreDirectiva', function () {
    return {
      templateUrl: 'views/directives/nombre-directive.html',
      restrict: 'E',
      scope: {
        //donde se recibirá la información completa de la fila obtenida desde el backend         
        rowData: '='
      },
      link: function postLink(scope, element, attrs) {
          console.log(scope.rowData);
      }
    };
  });
```
