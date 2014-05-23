angular.module('argia-multimedia-app.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MultimediaZerrenda', ['$http','$q', function($http, $q) {
    var factory = {};
   
    factory.ikusienak = [];
    factory.azkenak = [];
    
    factory.getIkusienak = function(){
        var d = $q.defer();
        $http.get('http://192.168.2.174/argia-multimedia-zerbitzaria/elementuak/ikusienak/').success(function(data, status, headers) {            
            factory.ikusienak = data;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        return d.promise;
    }
    
    factory.getAzkenak = function(offset, limit) {
        var d = $q.defer();
        $http.get('http://192.168.2.174/argia-multimedia-zerbitzaria/elementuak/azkenak?offset' + offset + "&limit=" + limit).success(function(data, status, headers) {            
            factory.azkenak = data;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        return d.promise;
    }
    
    factory.getElementuMotak = function() {
        
        var d = $q.defer();
        
        $http.get('http://192.168.2.174/argia-multimedia-zerbitzaria/elementu-motak/').success(function(data, status, headers) {            
            factory.elementu_motak = data;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }
    
    factory.getElementua = function(id) {
        
        var d = $q.defer();
        
        $http.get('http://192.168.2.174/argia-multimedia-zerbitzaria/elementua/' + id).success(function(data, status, headers) {
            factory.elementua = data;
            d.resolve();
        }).error(function(data, status, headers) {
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }
    
    return factory;
}]);
