angular.module('argia-multimedia-app.services', [])

/**
 * Zerbitzaritik datuak eskuratzeko zerbitzua.
 */
.factory('Zerbitzaria', ['$http','$q', function($http, $q) {
    var factory = {};
    
    factory.api_url ="http://argia2012.ametza.com/euskaltv/API/v1/";
    factory.multimedia_url = "http://argia2012.ametza.com/multimedia/";
    
    factory.alfabetikoki = [];
    factory.azkenak = [];
    
    factory.zure_erara = {};
    factory.zure_erara.alfabetikoki = [];
    factory.zure_erara.azkenak = [];
    
    factory.elementu_motak = [];
    
    factory.alerta_motak = [];
    
    factory.garbituZerrendak = function(mota) {
        
        if (mota === 0) {
            
            factory.alfabetikoki = [];
            
            factory.azkenak = [];
            
        } else {
            
            factory.zure_erara.alfabetikoki = [];
            
            factory.zure_erara.azkenak = [];
            
        }
        
    }
    
    factory.eskuratuZerrenda = function(ordenatu, mota, offset, limit, iraupena, bilaketa) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'elementuak', {
            params: {
                "ordenatu": ordenatu,
                "mota": mota,
                "offset": offset,
                "limit": limit,
                "iraupena": iraupena,
                "bilaketa": bilaketa
            }
        }).success(function(data, status, headers) {
            
            if (mota === 0) {
                
                if (ordenatu === "alfabetikoki") {
                    factory.alfabetikoki = factory.alfabetikoki.concat(data.elementuak);
                } else {
                    factory.azkenak = factory.azkenak.concat(data.elementuak);
                }
                
            } else {
                
                if (ordenatu === "alfabetikoki") {
                    factory.zure_erara.alfabetikoki = factory.zure_erara.alfabetikoki.concat(data.elementuak);
                } else {
                    factory.zure_erara.azkenak = factory.zure_erara.azkenak.concat(data.elementuak);
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
            factory.elementu_motak = data.elementuak;
            d.resolve();
        }).error(function(data, status, headers) {            
            console.log(data);
            console.log(status);
            console.log(headers);
            d.reject();
        });
        
        return d.promise;
    }

    factory.getAlertaMotak = function(regid) {
        
        var d = $q.defer();
        
        $http.get(factory.api_url + 'alertak/' + regid).success(function(data, status, headers) {
            factory.alerta_motak = data.motak;
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
        factory.zure_erara.alfabetikoki = [];
        
    }
    
    factory.bidaliArazoa = function(formData) {
        
        // AngularJSk application/json erabiltzen du modu lehenetsian Content-type goiburu bezala.
        // PHPk ez zidan onartzen datuak modu horretan bidaltzea:
        // Request header field Content-Type is not allowed by Access-Control-Allow-Headers.
        // Horregatik application/x-www-urlencoded goiburua erabili behar izan dut eta datuak serializatu $.param erabiliz (jQuery).
        return $http({
            method: 'POST',
            url: factory.api_url + 'arazoa',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param(formData)
        })
    }
    
    return factory;
}])

.factory('Nabarmenduak', function() {
    
    var factory = {};
    
    // Aldagai pribatua.
    // Erabilitako azken fitxa zein den adierazten du.
    // ezarriFitxaAktiboa metodoa erabiliz aldatzen da.
    // eskuratuFitxaAktiboa metodoa erabiliz eskuratzen da bere balioa.
    var fitxa_aktiboa = "azkenak";
    
    // Aldagai pribatua.
    // ezarriIdElementua metodoa erabiliz aldatzen da.
    // eskuratuIdElementua metodoa erabiliz eskuratzen da bere balioa.
    var id_elementua = 0;
    
    factory.eskuratuFitxaAktiboa = function() {
        
        return fitxa_aktiboa;
    }
    
    factory.ezarriFitxaAktiboa = function(fitxa) {
        
        fitxa_aktiboa = fitxa;
        
    }
    
    factory.ezarriIdElementua = function(id) {
        id_elementua = id;
        console.log("Id elementua: " + id_elementua);
    }
    
    factory.eskuratuIdElementua = function() {
        return id_elementua;
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
    
    // Aldagai pribatua.
    // ezarriIdMultimedia metodoa erabiliz aldatzen da.
    // eskuratuIdMultimedia metodoa erabiliz eskuratzen da bere balioa.
    var id_multimedia = 0;
    
    // Aldagai pribatua.
    // Erabilitako azken fitxa zein den adierazten du.
    // ezarriFitxaAktiboa metodoa erabiliz aldatzen da.
    // eskuratuFitxaAktiboa metodoa erabiliz eskuratzen da bere balioa.
    var fitxa_aktiboa = "azkenak";
    
    // Erabiltzaileak bideoaren gehienezko iraupena aldatu duen adierazten du.
    factory.minutuak_aldatu_dira = false;
    
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
        id_multimedia = id;
        console.log("Id multimedia: " + id_multimedia);
    }
    
    factory.eskuratuIdMultimedia = function() {
        return id_multimedia;
    }
    
    factory.eskuratuFitxaAktiboa = function() {
        
        return fitxa_aktiboa;
    }
    
    factory.ezarriFitxaAktiboa = function(fitxa) {
        
        fitxa_aktiboa = fitxa;
        
    }
    
    return factory;
});
