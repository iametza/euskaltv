angular.module('argia-multimedia-app.controllers', [])

.controller('NabarmenduakCtrl', ['$scope','$http','MultimediaZerrenda', function($scope, $http, MultimediaZerrenda) {
    $scope.active = "azkenak";
    
    $scope.multimediaZerrenda = [];
    
    // Zenbagarren elementutik aurrera eskatu behar diren kasu bakoitzean.
    $scope.offsets = {};
    $scope.offsets.azkenak = 0;
    $scope.offsets.ikusienak = 0;
    
    // Zenbat elementu eskatu behar diren aldiko kasu bakoitzean.
    $scope.limits = {};
    $scope.limits.azkenak = 10;
    $scope.limits.ikusienak = 10;

    // Zerbitzaritik elementu gehiago kargatzen ari garen ala ez.
    $scope.gehiago_kargatzen = {};
    $scope.gehiago_kargatzen.azkenak = false;
    $scope.gehiago_kargatzen.ikusienak = false;
    
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
    $scope.changeTab = function(type) {
        $scope.active = type;
        $scope.kargatuGehiago();
    }
    
    $scope.kargatuGehiago = function() {
        
        console.log("kargatuGehiago");
        
        if ($scope.active == 'ikusienak') {
            
            if (MultimediaZerrenda.ikusienak.length == 0) {
                
                var promise = MultimediaZerrenda.getIkusienak();
                
                promise.then(function() {
                    $scope.multimediaZerrenda = MultimediaZerrenda.ikusienak;
                });
                
            } else {
                
                $scope.multimediaZerrenda = MultimediaZerrenda.ikusienak;
                
            }
            
        } else {
            
            if (!$scope.gehiago_kargatzen.azkenak && (MultimediaZerrenda.azkenak.length === 0 || MultimediaZerrenda.azkenak.length === $scope.offsets.azkenak)) {
                
                console.log("bai");
                
                // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                $scope.gehiago_kargatzen.azkenak = true;
                
                // Zerbitzaritik elementu gehiago eskuratu.
                var promise = MultimediaZerrenda.getAzkenak($scope.offsets.azkenak, $scope.limits.azkenak);
                
                promise.then(function() {
                    
                    // Eguneratutako elementuen zerrenda gorde.
                    $scope.multimediaZerrenda = MultimediaZerrenda.azkenak;
                    
                    // Azkenak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                    $scope.offsets.azkenak += $scope.limits.azkenak;
                    
                    // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                    $scope.gehiago_kargatzen.azkenak = false;
                });
                
            } else {
                
                console.log("ez");
                $scope.multimediaZerrenda = MultimediaZerrenda.azkenak;
                
            }    
            
        }
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
}])

.controller('ZureEraraCtrl', ['$scope', '$http', 'MultimediaZerrenda', function($scope, $http, MultimediaZerrenda) {
    
    $scope.minLehenetsiak = 15;
    
    $scope.eskuratuDatuak = function() {
        
        if (MultimediaZerrenda.ikusienak.length == 0){
            
            var promise = MultimediaZerrenda.getElementuMotak();
            
            promise.then(function() {
                $scope.elementu_motak = MultimediaZerrenda.elementu_motak;
            });
            
        }else{
            
            $scope.zerrenda = MultimediaZerrenda.elementu_motak;
        }
    }
    
    $scope.eskuratuDatuak();
}])

.controller('MultimediaXehetasunakCtrl', ['$scope', '$http', '$sce', '$stateParams', 'MultimediaZerrenda', function($scope, $http, $sce, $stateParams, MultimediaZerrenda) {
    
    $scope.eskuratuDatuak = function(id) {
        
        var promise = MultimediaZerrenda.getElementua(id);
        
        promise.then(function() {
            $scope.multimedia = MultimediaZerrenda.elementua;
        });
    }
    
    $scope.eskuratuDatuak($stateParams.multimediaId);
    
    // Hau gabe ez dut lortu embed kodea erabili ahal izatea, ng-bind-html-k ez baitu onartzen html etiketak ez diren guztia.
    $scope.onartu_embed_kodea_HTML_bezala = function(kodea) {
        return $sce.trustAsHtml(kodea);
    };
}])

.controller('IgoZureaCtrl', function($scope) {
})

.controller('HoniBuruzCtrl', function($scope) {
});

