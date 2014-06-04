angular.module('argia-multimedia-app.controllers', [])

.controller('OrokorraCtrl', ['$scope', '$location', '$sce', function($scope, $location, $sce) {
    
    $scope.joanURLra = function(urla) {
        console.log(urla);
        $location.url(urla);
    }
    
    $scope.partekatuTwitter = function(twitter_esaldia, urla) {
        // IOSerako bertsioa ateratzen bada, kontutan izan honela hasi behar duela hurrengo lerroak:
        // window.plugins.socialsharing.shareVia('com.apple.social.twitter'
        window.plugins.socialsharing.shareVia('twitter',
                twitter_esaldia,
                null,
                null,
                urla,
                function() {
                    console.log('share ok')
                },
                function(msg) {
                    console.log(msg);
                    
                    // Twitter ez dago instalatuta. Erabiltzaileari jakinarazi.
                    navigator.notification.confirm(
                        'Twitter instalatu gabe daukazu edo ezin izan da ireki. Nabigatzailean irekiko da.',	// message
                        function() {
                            window.open("http://twitter.com/share?url=" + encodeURIComponent(urla) + "&text=" + encodeURIComponent(twitter_esaldia), '_system');
                        },                                      	// callback to invoke with index of button pressed
                        'Oharra',                   			 	// title
                        ['Ados']                            	    // buttonLabels
                    );
                }
        )
    }
    
    $scope.partekatuFacebook = function(facebook_izenburua, urla) {
        // Androiderako Facebooken aplikazioan ezin da testua ezarri "by design":
        // https://developers.facebook.com/x/bugs/332619626816423/
        // Irudia edo esteka partekatu daiteke baina ez biak.
        // IOSen mezua, irudia eta esteka, hirurak partekatu daitezke.
        // IOSerako bertsioa ateratzen bada, kontutan izan honela hasi behar duela hurrengo lerroak:
        // window.plugins.socialsharing.shareVia('com.apple.social.facebook'
        window.plugins.socialsharing.shareVia('facebook',
                facebook_izenburua,
                null,
                null,
                urla,
                function() {
                    console.log('share ok')
                },
                function(msg) {
                    // Facebook ez dago instalatuta. Erabiltzaileari jakinarazi.
                    navigator.notification.confirm(
                        'Facebook instalatu gabe daukazu edo ezin izan da ireki. Nabigatzailean irekiko da.',	// message
                        function() {
                            window.open("http://www.facebook.com/sharer.php?s=100&p[title]=" + encodeURIComponent(facebook_izenburua) + "&p[url]=" + encodeURIComponent(urla), '_system');
                        },                                      	    // callback to invoke with index of button pressed
                        'Oharra',                   			 	    // title
                        ['Ados']                            	        // buttonLabels
                    );
                }
        )
    }
    
    // Hau gabe ez dut lortu embed kodea erabili ahal izatea, ng-bind-html-k ez baitu onartzen html etiketak ez diren guztia.
    $scope.onartuEmbedKodeaHtmlBezala = function(kodea) {
        return $sce.trustAsHtml(kodea);
    }
    
    // Estekak gailuaren nabigatzailean irekitzeko erabiltzen dut hau, bestela aplikazioaren leiho barruan irekitzen ditu.
    // inappbrowser plugina instalatu behar da funtziona dezan.
    $scope.irekiNabigatzailean = function(urla) {
        
        event.preventDefault();
        
        window.open(urla, "_system");
    }
    
}])

.controller('FitxakCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    
    // Fitxen arteko trantsizioaren norabidea alderantzikatu behar den adierazten du.
    // Normala: Ezkerretik eskuinera.
    // Alderantzikatua: Eskuinetik ezkerrera.
    $scope.alderantzikatuBeharDa = false;
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        
        // Momentukoa baino ezkerrerago dagoen fitxa batera mugitu behar badugu fitxen arteko trantsizioaren norabidea alderantzikatu behar dugu.
        // Ez zait gehiegi gustatzen hau. Orokorragoa izan behar luke. Orain dagoen moduan azpi-fitxa batean bagaude ez du funtzionatzen eta
        // fitxen izenak aldatuz gero hemen ere aldatu beharko lirateke.
        if ((fromState.name === "tab.igo-zurea" && toState.name === "tab.zure-erara-denbora") ||
            (fromState.name === "tab.zure-erara-denbora" && toState.name === "tab.nabarmenduak-zerrenda")) {
            
            $scope.alderantzikatuBeharDa = true;
            
        } else {
            
            $scope.alderantzikatuBeharDa = false;
            
        }
    });
}])

.controller('NavBarCtrl', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate) {
    $scope.txandakatuAlboMenua = function() {
        $ionicSideMenuDelegate.toggleRight();
    }
}])

.controller('NabarmenduakZerrendaCtrl', ['$scope', '$ionicScrollDelegate', 'Nabarmenduak', 'Zerbitzaria', function($scope, $ionicScrollDelegate, Nabarmenduak, Zerbitzaria) {
    
    $scope.active = Nabarmenduak.eskuratuFitxaAktiboa();
    
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
        
        // Fitxa aktiboa eguneratu.
        $scope.active = type;
        Nabarmenduak.ezarriFitxaAktiboa(type);
        
        // Scroll-a goraino eraman.
        // Hau gabe gauza arraroak egiten zituen. Arazoa erreproduzitzeko iruzkindu hurrengo lerro hau eta:
        //      1. Korritu scroll-a beherantz Azkenak zerrendan (Ikusienak fitxara sartu aurretik).
        //      2. Ikusienak fitxara joan. Scroll-a oso behean agertzen da eta elementuak ez dira ikusten ez baduzu scroll-a goraino eramaten.
        //         Fitxa hutsik dagoela ematen du.
        $ionicScrollDelegate.scrollTop();
        
        // Elementu gehiago kargatzeko funtzioari deitu.
        $scope.kargatuGehiago();
        
    }
    
    $scope.kargatuGehiago = function() {
        
        console.log("kargatuGehiago");
        
        if ($scope.active == 'ikusienak') {
            
            if (!$scope.gehiago_kargatzen.ikusienak && (Zerbitzaria.ikusienak.length === 0 || Zerbitzaria.ikusienak.length === $scope.offsets.ikusienak)) {
                
                console.log("bai");
                
                // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                $scope.gehiago_kargatzen.ikusienak = true;
                
                // Zerbitzaritik elementu gehiago eskuratu.
                var promise = Zerbitzaria.eskuratuZerrenda("ikusienak", 0, $scope.offsets.ikusienak, $scope.limits.ikusienak);
                
                promise.then(function() {
                    
                    // Eguneratutako elementuen zerrenda gorde.
                    $scope.multimediaZerrenda = Zerbitzaria.ikusienak;
                    
                    console.log($scope.multimediaZerrenda);
                    
                    // Ikusienak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                    $scope.offsets.ikusienak += $scope.limits.ikusienak;
                    
                    // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                    $scope.gehiago_kargatzen.ikusienak = false;
                    
                });
                
            } else {
                
                console.log("ez");
                $scope.multimediaZerrenda = Zerbitzaria.ikusienak;
                
            }
            
        } else {
            
            if (!$scope.gehiago_kargatzen.azkenak && (Zerbitzaria.azkenak.length === 0 || Zerbitzaria.azkenak.length === $scope.offsets.azkenak)) {
                
                console.log("bai");
                
                // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                $scope.gehiago_kargatzen.azkenak = true;
                
                // Zerbitzaritik elementu gehiago eskuratu.
                var promise = Zerbitzaria.eskuratuZerrenda("azkenak", 0, $scope.offsets.azkenak, $scope.limits.azkenak);
                
                promise.then(function() {
                    
                    // Eguneratutako elementuen zerrenda gorde.
                    $scope.multimediaZerrenda = Zerbitzaria.azkenak;
                    
                    // Azkenak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                    $scope.offsets.azkenak += $scope.limits.azkenak;
                    
                    // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                    $scope.gehiago_kargatzen.azkenak = false;
                });
                
            } else {
                
                console.log("ez");
                $scope.multimediaZerrenda = Zerbitzaria.azkenak;
                
            }    
            
        }
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
}])

.controller('ZureEraraDenboraCtrl', ['$scope', 'ZureErara', function($scope, ZureErara) {
    
    $scope.minutuak = ZureErara.eskuratuMinutuak();
    
}])

.controller('ZureEraraMotakCtrl', ['$scope', 'Zerbitzaria', 'ZureErara', function($scope, Zerbitzaria, ZureErara) {
    
    $scope.elementu_motak = [];
    
    $scope.gordeMota = function(id) {
        
        // Zerrenda mota aldatu bada
        if (id !== ZureErara.eskuratuMota()) {
            
            // Zure erararen zerrendak garbitu behar dira.
            Zerbitzaria.garbituZureEraraZerrendak();
        }
        
        // Hautatutako mota gorde
        ZureErara.ezarriMota(id);
    }
    
    $scope.eskuratuDatuak = function() {
        
        if (Zerbitzaria.elementu_motak.length === 0) {
            
            var promise = Zerbitzaria.getElementuMotak();
            
            promise.then(function() {
                $scope.elementu_motak = Zerbitzaria.elementu_motak;
            });
            
        } else {
            
            $scope.elementu_motak = Zerbitzaria.elementu_motak;
        }
    }
    
    $scope.eskuratuDatuak();
    
}])

.controller('ZureEraraZerrendaCtrl', ['$scope', '$ionicScrollDelegate', 'Zerbitzaria', 'ZureErara', function($scope, $ionicScrollDelegate, Zerbitzaria, ZureErara) {
    
    $scope.active = ZureErara.eskuratuFitxaAktiboa();
    
    $scope.zure_erara_zerrenda = [];
    
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
    
    $scope.segundoak = ZureErara.eskuratuMinutuak() * 60;
    
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
    $scope.changeTab = function(type) {
        
        // Fitxa aktiboa eguneratu.
        $scope.active = type;
        ZureErara.ezarriFitxaAktiboa(type);
        
        // Scroll-a goraino eraman.
        // Hau gabe gauza arraroak egiten zituen. Arazoa erreproduzitzeko iruzkindu hurrengo lerro hau eta:
        //      1. Korritu scroll-a beherantz Azkenak zerrendan (Ikusienak fitxara sartu aurretik).
        //      2. Ikusienak fitxara joan. Scroll-a oso behean agertzen da eta elementuak ez dira ikusten ez baduzu scroll-a goraino eramaten.
        //         Fitxa hutsik dagoela ematen du.
        $ionicScrollDelegate.scrollTop();
        
        // Elementu gehiago kargatzeko funtzioari deitu.
        $scope.kargatuGehiago();
        
    }
    
    $scope.kargatuGehiago = function() {
        
        console.log("kargatuGehiago");
        
        // Erabiltzaileak bideoaren gehienezko iraupena aldatu badu.
        if (ZureErara.minutuak_aldatu_dira) {
            
            // Zure erararen zerrendak garbitu behar dira.
            Zerbitzaria.garbituZureEraraZerrendak();
            
            // Berriz ere false jarri.
            ZureErara.minutuak_aldatu_dira = false;
            
        }
        
        if ($scope.active == 'ikusienak') {
            
            if (!$scope.gehiago_kargatzen.ikusienak // Ez bagara dagoeneko gehiago kargatzen ari eta...
                && (Zerbitzaria.zure_erara.ikusienak.length === 0                                // Ikusienen zerrenda hutsik badago edo...
                    || Zerbitzaria.zure_erara.ikusienak.length === $scope.offsets.ikusienak)) {  // Hutsik ez dagoen kasuan ere gehiago kargatzeko da baldintza hau.
                
                console.log("bai");
                
                // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                $scope.gehiago_kargatzen.ikusienak = true;
                
                // Zerbitzaritik elementu gehiago eskuratu.
                var promise = Zerbitzaria.eskuratuZerrenda("ikusienak", ZureErara.eskuratuMota(), $scope.offsets.ikusienak, $scope.limits.ikusienak, $scope.segundoak);
                
                promise.then(function() {
                    
                    // Eguneratutako elementuen zerrenda gorde.
                    $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.ikusienak;
                    
                    // Ikusienak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                    $scope.offsets.ikusienak += $scope.limits.ikusienak;
                    
                    // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                    $scope.gehiago_kargatzen.ikusienak = false;
                    
                });
                
            } else {
                
                console.log("ez");
                $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.ikusienak;
                
            }
            
        } else {
            
            if (!$scope.gehiago_kargatzen.azkenak   // Ez bagara dagoeneko gehiago kargatzen ari eta...
                && (Zerbitzaria.zure_erara.azkenak.length === 0                              // Ikusienen zerrenda hutsik badago edo...
                    || Zerbitzaria.zure_erara.azkenak.length === $scope.offsets.azkenak)) {  // Hutsik ez dagoen kasuan ere gehiago kargatzeko da baldintza hau.
            
                console.log("bai");
                
                // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                $scope.gehiago_kargatzen.azkenak = true;
                
                // Zerbitzaritik elementu gehiago eskuratu.
                var promise = Zerbitzaria.eskuratuZerrenda("azkenak", ZureErara.eskuratuMota(), $scope.offsets.azkenak, $scope.limits.azkenak, $scope.segundoak);
                
                promise.then(function() {
                    
                    // Eguneratutako elementuen zerrenda gorde.
                    $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.azkenak;
                    
                    // Azkenak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                    $scope.offsets.azkenak += $scope.limits.azkenak;
                    
                    // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                    $scope.gehiago_kargatzen.azkenak = false;
                });
                
            } else {
                
                console.log("ez");
                $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.azkenak;
                
            }
        }
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
}])

.controller('ZureEraraXehetasunakCtrl', ['$scope', '$stateParams', 'Zerbitzaria', function($scope, $stateParams, Zerbitzaria) {
    
    $scope.multimedia = {};
    
    $scope.urla = "";
    
    $scope.eskuratuDatuak = function(id) {
        
        var promise = Zerbitzaria.getElementua(id);
        
        promise.then(function() {
            
            $scope.multimedia = Zerbitzaria.elementua;
            
            $scope.urla = Zerbitzaria.multimedia_url + $scope.multimedia.mota + "/" + $scope.multimedia.nice_name;
            
        });
    }
    
    $scope.eskuratuDatuak($stateParams.multimediaId);
    
}])

.controller('NabarmenduakXehetasunakCtrl', ['$scope', '$stateParams', 'Zerbitzaria', function($scope, $stateParams, Zerbitzaria) {
    
    $scope.multimedia = {};
    
    $scope.urla = "";
    
    $scope.eskuratuDatuak = function(id) {
        
        var promise = Zerbitzaria.getElementua(id);
        
        promise.then(function() {
            $scope.multimedia = Zerbitzaria.elementua;
            
            $scope.urla = Zerbitzaria.multimedia_url + $scope.multimedia.mota + "/" + $scope.multimedia.nice_name;
        });
    }
    
    $scope.eskuratuDatuak($stateParams.multimediaId);
    
}])

.controller('IgoZureaCtrl', ['$scope', '$http', 'Zerbitzaria', function($scope, $http, Zerbitzaria) {
    
    $scope.formData = {};
    $scope.formData.izenburua = "";
    $scope.formData.azalpena = "";
    $scope.formData.txertatzeko = "";
    
    $scope.arrakastaBidaltzean = false;
    $scope.arrakastaBidaltzeanTestua = "Zure proposamena behar bezala bidali da!";
    
    $scope.erroreaBidaltzean = false;
    $scope.erroreaBidaltzeanTestua = "";
    
    $scope.bidali = function() {
        
        // AngularJSk application/json erabiltzen du modu lehenetsian Content-type goiburu bezala.
        // PHPk ez zidan onartzen datuak modu horretan bidaltzea:
        // Request header field Content-Type is not allowed by Access-Control-Allow-Headers.
        // Horregatik application/x-www-urlencoded goiburua erabili behar izan dut eta datuak serializatu $.param erabiliz (jQuery).
        $http({
            method: 'POST',
            url: Zerbitzaria.api_url + 'proposamena',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param($scope.formData)
        })
        
        .success(function(data, status, headers, config) {
            
            if (data.arrakasta) {
                
                // Dena ondo joan dela adierazten duen mezua bistaratu (ngShow).
                $scope.arrakastaBidaltzean = true;
                
                // Aurretik egon zitekeen errore mezua ezkutatu (ngShow).
                $scope.erroreaBidaltzean = false;
                
            } else {
                
                // Arazoak egon direla adierazten duen mezua bistaratu (ngShow).
                $scope.erroreaBidaltzean = true;
                
                // Aurretik egon zitekeen arrakasta mezua ezkutatu (ngShow).
                $scope.arrakastaBidaltzean = false;
                
                // Zerbitzaritik jasotako errore mezua bistaratu.
                $scope.erroreaBidaltzeanTestua = data.mezua;
                
            }
            
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            
        })
        
        .error(function(data, status, headers, config) {            
            
            // Arazoak egon direla adierazten duen mezua bistaratu (ngShow).
            $scope.erroreaBidaltzean = true;
            
            // Aurretik egon zitekeen arrakasta mezua ezkutatu (ngShow).
            $scope.arrakastaBidaltzean = false;
            
            // Zerbitzaritik jasotako errore mezua bistaratu.
            $scope.erroreaBidaltzeanTestua = data.mezua;
            
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            
        });
        
    }
    
}])

.controller('HoniBuruzCtrl', function($scope, $ionicNavBarDelegate) {
    $scope.atzera = function() {
        $ionicNavBarDelegate.back();
    }
});

