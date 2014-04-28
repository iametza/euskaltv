angular.module('argia-multimedia-app.controllers', [])

.controller('NabarmenduakCtrl',['$scope','$http','MultimediaZerrenda', function($scope, $http,MultimediaZerrenda) {
    $scope.active = "azkenak";
    
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
    $scope.changeTab = function(type) {
        $scope.active = type;
        $scope.datuakLortu(type);        
    }
    
    $scope.datuakLortu = function(type) {        
        if (type == 'ikusienak') {
            if (MultimediaZerrenda.ikusienak.length == 0){ 
                var promise = MultimediaZerrenda.getIkusienak();
                promise.then(function(){              
                    $scope.multimediaZerrenda = MultimediaZerrenda.ikusienak;
                });
            }else{
                $scope.multimediaZerrenda = MultimediaZerrenda.ikusienak;
            }
        } else {
            if (MultimediaZerrenda.azkenak.length == 0){ 
                var promise = MultimediaZerrenda.getAzkenak();
                promise.then(function(){
                    $scope.multimediaZerrenda = MultimediaZerrenda.azkenak;
                });
            }else{
                $scope.multimediaZerrenda = MultimediaZerrenda.azkenak;
            }    
            
        }
    }
    $scope.datuakLortu($scope.active);
}])

.controller('ZureEraraCtrl', ['$scope', '$http', 'MultimediaZerrenda', function($scope, $http, MultimediaZerrenda) {
    
    $scope.eskuratuDatuak = function() {
        
        if (MultimediaZerrenda.ikusienak.length == 0){
            
            var promise = MultimediaZerrenda.getElementuMotak();
            
            promise.then(function(){              
                $scope.elementu_motak = MultimediaZerrenda.elementu_motak;
            });
            
        }else{
            
            $scope.zerrenda = MultimediaZerrenda.elementu_motak;
        }
    }
    
    $scope.eskuratuDatuak();
}])

.controller('MultimediaXehetasunakCtrl', function($scope, $http, $sce, $stateParams) {
    
    $http.get('http://192.168.2.174/argia-multimedia-zerbitzaria/elementua/' + $stateParams.multimediaId).success(function(data, status, headers) {
        $scope.multimedia = data;
        console.log($scope);
        console.log($scope.multimedia);
    }).error(function(data, status, headers) {
        console.log(data);
        console.log(status);
        console.log(headers);
    });
    
    // Hau gabe ez dut lortu embed kodea erabili ahal izatea, ng-bind-html-k ez baitu onartzen html etiketak ez diren guztia.
    $scope.onartu_embed_kodea_HTML_bezala = function(kodea) {
        return $sce.trustAsHtml(kodea);
    };
})

.controller('IgoZureaCtrl', function($scope) {
})

.controller('HoniBuruzCtrl', function($scope) {
});

