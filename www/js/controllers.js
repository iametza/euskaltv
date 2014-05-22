angular.module('argia-multimedia-app.controllers', [])

.controller('NabarmenduakCtrl',['$scope','$http','MultimediaZerrenda', function($scope, $http, MultimediaZerrenda) {
    $scope.active = "azkenak";
    
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
    $scope.changeTab = function(type) {
        $scope.active = type;
        //$scope.datuakLortu(type);
        $scope.loadMore();
    }
    
    $scope.items = [];
    
    $scope.loadMore = function() {
        var data = [];
        var l = $scope.items.length
        for (var i = l; i < l+20; i++) {
            data.push({id: i});
        }
        
        $scope.items = $scope.items.concat(data);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        console.log($scope.items);
    };
    
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
    //$scope.datuakLortu($scope.active);
}])

.controller('ZureEraraCtrl', ['$scope', '$http', 'MultimediaZerrenda', function($scope, $http, MultimediaZerrenda) {
    
    $scope.minLehenetsiak = 15;
    
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

