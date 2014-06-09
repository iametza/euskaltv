angular.module('argia-multimedia-app.services', [])

/**
 * Zerbitzaritik datuak eskuratzeko zerbitzua.
 */
.factory('Zerbitzaria', ['$http','$q', function($http, $q) {
    var factory = {};
    
    factory.api_url ="http://192.168.2.174/argia-multimedia-zerbitzaria/";
    factory.multimedia_url = "http://argia2012.ametza.com/multimedia/";
    
    factory.ikusienak = [];
    factory.azkenak = [];
    
    factory.zure_erara = {};
    factory.zure_erara.ikusienak = [];
    factory.zure_erara.azkenak = [];
    
    factory.elementu_motak = [];
    
    factory.eskuratuZerrenda = function(ordenatu, mota, offset, limit, iraupena) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'elementuak', {
            params: {
                "ordenatu": ordenatu,
                "mota": mota,
                "offset": offset,
                "limit": limit,
                "iraupena": iraupena
            }
        }).success(function(data, status, headers) {
            
            if (mota === 0) {
                
                if (ordenatu === "ikusienak") {
                    factory.ikusienak = factory.ikusienak.concat(data);
                } else {
                    factory.azkenak = factory.azkenak.concat(data);
                }
                
            } else {
                
                if (ordenatu === "ikusienak") {
                    factory.zure_erara.ikusienak = factory.zure_erara.ikusienak.concat(data);
                } else {
                    factory.zure_erara.azkenak = factory.zure_erara.azkenak.concat(data);
                }
                
            }
            
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
        
        $http.get(factory.api_url + 'elementuak/motak/').success(function(data, status, headers) {
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
        
        $http.get(factory.api_url + 'elementua/' + id).success(function(data, status, headers) {
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
    
    factory.garbituZureEraraZerrendak = function() {
        
        factory.zure_erara.azkenak = [];
        factory.zure_erara.ikusienak = [];
        
    }
    
    return factory;
}])

.factory('Nabarmenduak', function() {
    
    var factory = {};
    
    // Erabilitako azken fitxa zein den adierazten du.
    factory.fitxa_aktiboa = "azkenak";
    
    factory.eskuratuFitxaAktiboa = function() {
        
        return factory.fitxa_aktiboa;
    }
    
    factory.ezarriFitxaAktiboa = function(fitxa) {
        
        factory.fitxa_aktiboa = fitxa;
        
    }
    
    return factory;
})

.factory('ZureErara', function() {
    
    var factory = {};
    
    // Aldagai pribatua.
    // ezarriMinutuak metodoa erabiliz aldatzen da.
    // eskuratuMinutuak metodoa erabiliz eskuratzen da bere balioa.
    var minutuak = 15;
    
    // Aldagai pribatua.
    // ezarriMota metodoa erabiliz aldatzen da.
    // eskuratuMota metodoa erabiliz eskuratzen da bere balioa.
    var id_mota = 0;
    
    // Erabiltzaileak bideoaren gehienezko iraupena aldatu duen adierazten du.
    factory.minutuak_aldatu_dira = false;
    
    // Erabilitako azken fitxa zein den adierazten du.
    factory.fitxa_aktiboa = "azkenak";
    
    factory.ezarriMinutuak = function(m) {
        minutuak = m;
    }
    
    factory.eskuratuMinutuak = function() {
        return minutuak;
    }
    
    factory.ezarriMota = function(id) {
        id_mota = id;
        console.log("Mota: " + id_mota);
    }
    
    factory.eskuratuMota = function() {
        return id_mota;
    }
    
    factory.ezarriIdMultimedia = function(id) {
        factory.id_multimedia = id;
        console.log("Id multimedia: " + factory.id_multimedia);
    }
    
    factory.eskuratuIdMultimedia = function() {
        return factory.id_multimedia;
    }
    
    factory.eskuratuFitxaAktiboa = function() {
        
        return factory.fitxa_aktiboa;
    }
    
    factory.ezarriFitxaAktiboa = function(fitxa) {
        
        factory.fitxa_aktiboa = fitxa;
        
    }
    
    return factory;
});
