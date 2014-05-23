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
    
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
    $scope.changeTab = function(type) {
        $scope.active = type;
        $scope.kargatuGehiago();
        //$scope.loadMore();
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
        //console.log($scope.items);
    };
    
    $scope.kargatuGehiago = function() {
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
            console.log(MultimediaZerrenda.azkenak);
            console.log(MultimediaZerrenda.azkenak.length);
            console.log($scope.multimediaZerrenda);
            if (MultimediaZerrenda.azkenak.length <= $scope.offsets.azkenak) {
                console.log("gehiago");
                var promise = MultimediaZerrenda.getAzkenak($scope.offsets.azkenak, $scope.limits.azkenak);
                promise.then(function() {
                    $scope.multimediaZerrenda = $scope.multimediaZerrenda.concat(MultimediaZerrenda.azkenak);
                    console.log($scope.multimediaZerrenda);
                    $scope.offsets.azkenak += $scope.limits.azkenak;
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

