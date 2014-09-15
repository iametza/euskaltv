angular.module('argia-multimedia-app.controllers', [])

.controller('OrokorraCtrl', ['$scope', '$location', '$sce', '$ionicSideMenuDelegate', '$ionicNavBarDelegate', function($scope, $location, $sce, $ionicSideMenuDelegate, $ionicNavBarDelegate) {
    
    $scope.txandakatuAlboMenua = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }
    
    $scope.joanURLra = function(urla) {
        console.log(urla);
        $location.url(urla);
    }
    
    $scope.atzera = function() {
        $ionicNavBarDelegate.back();
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
    $scope.irekiNabigatzailean = function($event, urla) {
        
        $event.preventDefault();
        
        window.open(urla, "_system");
    }
    
}])

.controller('FitxakCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    
    // Fitxen arteko trantsizioaren norabidea alderantzikatu behar den adierazten du.
    // Normala: Ezkerretik eskuinera.
    // Alderantzikatua: Eskuinetik ezkerrera.
    $scope.alderantzikatuBeharDa = false;
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        
        if (fromState.name === "tab.nabarmenduak-xehetasunak") {
            
            // Disqus-eko div-a garbituko dugu. Horrela trantsizioa azkarragoa dela iruditu zait.
            $("#nabarmenduak-xehetasunak-disqus").empty();
            
        } else if (fromState.name === "tab.zure-erara-xehetasunak") {
            
            // Disqus-eko div-a garbituko dugu. Horrela trantsizioa azkarragoa dela iruditu zait.
            $("#zure-erara-xehetasunak-disqus").empty();
            
        }
        
        // Momentukoa baino ezkerrerago dagoen fitxa batera mugitu behar badugu fitxen arteko trantsizioaren norabidea alderantzikatu behar dugu.
        // Ez zait gehiegi gustatzen hau. Orokorragoa izan behar luke. Orain dagoen moduan azpi-fitxa batean bagaude ez du funtzionatzen eta
        // fitxen izenak aldatuz gero hemen ere aldatu beharko lirateke.
        if ((fromState.name === "tab.konfiguratu-alertak" && toState.name === "tab.zure-erara-denbora") ||
            (fromState.name === "tab.zure-erara-denbora" && toState.name === "tab.nabarmenduak-zerrenda" ||
             fromState.name === "tab.nabarmenduak-zerrenda" && toState.name === "tab.igo-zurea")) {
            
            $scope.alderantzikatuBeharDa = true;
            
        } else {
            
            $scope.alderantzikatuBeharDa = false;
            
        }
    });
}])

.controller('NabarmenduakZerrendaCtrl', ['$scope', '$ionicScrollDelegate', '$ionicPopover', '$location', 'Nabarmenduak', 'Zerbitzaria', function($scope, $ionicScrollDelegate, $ionicPopover, $location, Nabarmenduak, Zerbitzaria) {
    
    $scope.active = Nabarmenduak.eskuratuFitxaAktiboa();
    
    $scope.multimediaZerrenda = [];  
    
    // ion-content direktibak $scope-tik heredatzen duen scope berri bat sortzen du,
    // ondorioz hemengo aldagaiak irakur daitezke scope umetik baina umean egindako aldaketak ez dira ikusten gurasotik.
    // Javascript-en objektuak erreferentzia bezala pasatzen direnez, umean bilaketa.testua aldatzean gurasokoa ere aldatzen da,
    // horregatik erabiltzen dut bilaketa.testua eta ez testua zuzenean.
    // Ikusi hau: https://www.youtube.com/watch?v=ZhfUv0spHCY&feature=youtu.be&t=30m
    $scope.bilaketa = {
        testua: ""
    }
    
    // Zenbagarren elementutik aurrera eskatu behar diren kasu bakoitzean.
    $scope.offsets = {};
    $scope.offsets.azkenak = 0;
    $scope.offsets.alfabetikoki = 0;
    
    // Zenbat elementu eskatu behar diren aldiko kasu bakoitzean.
    $scope.limits = {};
    $scope.limits.azkenak = 10;
    $scope.limits.alfabetikoki = 10;

    // Zerbitzaritik elementu gehiago kargatzen ari garen ala ez.
    $scope.gehiago_kargatzen = {};
    $scope.gehiago_kargatzen.azkenak = false;
    $scope.gehiago_kargatzen.alfabetikoki = false;
    
    $scope.zerrenda_hutsik_dago = false;
    
    // Zerbitzaritik elementu berriak kargatu ditugula adierazten du.
    // Begiratu ion-infinite-scroll elementuaren ng-if.
    // Hau gabe behin eta berriz zerbitzarira eskaerak egiten hasten da.
    $scope.elementu_gehiago_daude = true;
    
    $ionicPopover.fromTemplateUrl('popoverra.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    $scope.irekiPopoverra = function($event) {
        $scope.popover.show($event);
    }
    
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
    
    $scope.birkargatuZerrenda = function() {
        
        // Nabarmenduak motako zerrendak garbitu, bai Zerbitzaria zerbitzuan bai momentuko scope-an.
        Zerbitzaria.garbituZerrendak(0);
        $scope.multimediaZerrenda = [];
        
        // Offset-ak eguneratu.
        $scope.offsets.azkenak = 0;
        $scope.offsets.alfabetikoki = 0;
        
        // Bilaketarekin bat datozen elementuak eskuratu zerbitzaritik.
        $scope.kargatuGehiago();
        
    }
    
    $scope.iragazi = function(keyEvent) {
        
        // Erabiltzaileak teklatuko Joan/Go/Ir botoia sakatu badu.
        if(keyEvent.keyCode === 13){
            
            // Bilaketaren emaitzak bistaratu behar dira, horretarako zerrenda berriz kargatuko dugu.
            $scope.birkargatuZerrenda();
            
        }
        
    }
    
    $scope.garbitu = function() {
        
        $scope.bilaketa.testua = "";
        
        // Zerrenda berriz kargatu.
        
        $scope.birkargatuZerrenda();
        
    }
    
    $scope.kargatuGehiago = function() {
        
        console.log("kargatuGehiago");
        
        // Hau deitzen den lehen aldian window.navigator.connection undefined da. Network plugina oraindik kargatu ez duelako?
        // Bigarren bueltarako prest egoten da eta orduan bai sartzen da hemen.
        if (window.navigator.connection && window.navigator.connection.type === Connection.NONE) {
                
                console.log("Nabarmenduak zerrenda - Konexiorik ez dago!!!");
                
                window.location.href = "#/konexiorik-gabe";
                
        } else {
            
            if ($scope.active == 'alfabetikoki') {
                
                if (!$scope.gehiago_kargatzen.alfabetikoki && (Zerbitzaria.alfabetikoki.length === 0 || Zerbitzaria.alfabetikoki.length === $scope.offsets.alfabetikoki)) {
                    
                    console.log("bai");
                    
                    // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                    $scope.gehiago_kargatzen.alfabetikoki = true;
                    
                    // Zerbitzaritik elementu gehiago eskuratu.
                    var promise = Zerbitzaria.eskuratuZerrenda("alfabetikoki", 0, $scope.offsets.alfabetikoki, $scope.limits.alfabetikoki, null, $scope.bilaketa.testua);
                    
                    promise.then(function() {
                        
                        // Zerrendaren luzera ez bada aldatu, elementu berririk ez dagoela esan nahi du.
                        if ($scope.multimediaZerrenda.length === Zerbitzaria.alfabetikoki.length) {
                            
                            $scope.elementu_gehiago_daude = false;
                            
                        } else {
                            
                            $scope.elementu_gehiago_daude = true;
                            
                        }
                        
                        // Eguneratutako elementuen zerrenda gorde.
                        $scope.multimediaZerrenda = Zerbitzaria.alfabetikoki;
                        
                        console.log($scope.multimediaZerrenda);
                        
                        // Ikusienak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                        $scope.offsets.alfabetikoki += $scope.limits.alfabetikoki;
                        
                        // Zerrenda hutsik al dago?
                        // Bat datorren elementurik ez dagoela dioen mezua noiz bistaratu jakiteko erabiltzen dugu hau.
                        // Begiratu txantiloia.
                        if ($scope.multimediaZerrenda.length === 0) {
                            
                            $scope.zerrenda_hutsik_dago = true;
                            
                        } else {
                            
                            $scope.zerrenda_hutsik_dago = false;
                            
                        }
                        
                        // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                        $scope.gehiago_kargatzen.alfabetikoki = false;
                        
                    });
                    
                } else {
                    
                    console.log("ez");
                    $scope.multimediaZerrenda = Zerbitzaria.alfabetikoki;
                    
                }
                
            } else {
                
                if (!$scope.gehiago_kargatzen.azkenak && (Zerbitzaria.azkenak.length === 0 || Zerbitzaria.azkenak.length === $scope.offsets.azkenak)) {
                    
                    console.log("bai");
                    
                    // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                    $scope.gehiago_kargatzen.azkenak = true;
                    
                    // Zerbitzaritik elementu gehiago eskuratu.
                    var promise = Zerbitzaria.eskuratuZerrenda("azkenak", 0, $scope.offsets.azkenak, $scope.limits.azkenak, null, $scope.bilaketa.testua);
                    
                    promise.then(function() {
                        
                        // Zerrendaren luzera ez bada aldatu, elementu berririk ez dagoela esan nahi du.
                        if ($scope.multimediaZerrenda.length === Zerbitzaria.azkenak.length) {
                            
                            $scope.elementu_gehiago_daude = false;
                            
                        } else {
                            
                            $scope.elementu_gehiago_daude = true;
                            
                        }
                        
                        // Eguneratutako elementuen zerrenda gorde.
                        $scope.multimediaZerrenda = Zerbitzaria.azkenak;
                        
                        // Azkenak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                        $scope.offsets.azkenak += $scope.limits.azkenak;
                        
                        // Zerrenda hutsik al dago?
                        // Bat datorren elementurik ez dagoela dioen mezua noiz bistaratu jakiteko erabiltzen dugu hau.
                        // Begiratu txantiloia.
                        if ($scope.multimediaZerrenda.length === 0) {
                            
                            $scope.zerrenda_hutsik_dago = true;
                            
                        } else {
                            
                            $scope.zerrenda_hutsik_dago = false;
                            
                        }
                        
                        // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                        $scope.gehiago_kargatzen.azkenak = false;
                    });
                    
                } else {
                    
                    console.log("ez");
                    $scope.multimediaZerrenda = Zerbitzaria.azkenak;
                    
                }
                
            }
            
        }
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
        
    }
}])

.controller('NabarmenduakXehetasunakCtrl', ['$sce', '$scope', '$stateParams', 'Zerbitzaria', 'Nabarmenduak', function($sce, $scope, $stateParams, Zerbitzaria, Nabarmenduak) {
    
    $scope.multimedia = {};
    
    $scope.urla = "";
    
    $scope.datuak_kargatzen = false;
    
    $scope.eskuratuDatuak = function(id) {
        
        var promise = Zerbitzaria.getElementua(id);
        
        // Zerbitzaritik datuak kargatzen ari garela adierazi.
        $scope.datuak_kargatzen = true;
        
        promise.then(function() {
            
            $scope.multimedia = Zerbitzaria.elementua;
            
            $scope.urla = Zerbitzaria.multimedia_url + $scope.multimedia.mota + "/" + $scope.multimedia.nice_name;
            
            $scope.multimedia.disqus_url = $sce.trustAsResourceUrl(Zerbitzaria.api_url + "disqus?shortname=argia2&url=" + $scope.multimedia.argia_multimedia_url + "&title=Iruzkinak");
            
            for (var i = 0; i < $scope.multimedia.embed.length; i++) {
                
                $scope.multimedia.embed[i].embed_src = $($scope.multimedia.embed[i].embed_kodea).attr('src');
                
                if ($scope.multimedia.embed[i].embed_src && $scope.multimedia.embed[i].embed_src.indexOf('http') !== 0) {
                    
                    // Txertatzeko kodea ez bada http-rekin hasten gehitu egingo diogu.
                    // Bestela, gurasoaren protokoloa erabiltzen du. Aplikazio hibridoen kasuan file:// da eta bideoa ez du kargatzen.
                    $scope.multimedia.embed[i].embed_kodea = $scope.multimedia.embed[i].embed_kodea.replace("src=\"", "src=\"https:");
                    $scope.multimedia.embed[i].embed_src = "https:" + $scope.multimedia.embed[i].embed_src;
                    
                    console.log($scope.multimedia.embed[i].embed_kodea);
                    console.log($scope.multimedia.embed[i].embed_src);
                    
                }
                
                // Youtube-ko esteka da ala ez?
                if ($scope.multimedia.embed[i].embed_src.indexOf('youtube') === -1) {
                    
                    $scope.multimedia.embed[i].youtubekoEstekaDa = false;
                    
                } else {
                    
                    $scope.multimedia.embed[i].youtubekoEstekaDa = true;
                    
                }
            }
            
            // Zerbitzaritik datuak kargatzen bukatu dugula adierazi.
            $scope.datuak_kargatzen = false;
        });
    }
    
    // Nabarmenduak factory-an gorde hautatutako multimedia elementuaren id-a.
    Nabarmenduak.ezarriIdElementua($stateParams.multimediaId);
    
    // Hau deitzen den lehen aldian window.navigator.connection undefined da. Network plugina oraindik kargatu ez duelako?
    // Bigarren bueltarako prest egoten da eta orduan bai sartzen da hemen.
    if (window.navigator.connection && window.navigator.connection.type === Connection.NONE) {
        
        console.log("Nabarmenduak xehetasunak - Konexiorik ez dago!!!");
        
        window.location.href = "#/konexiorik-gabe";
        
    } else {
        
        console.log("Nabarmenduak xehetasunak - else-ra sartu da");
        
        $scope.eskuratuDatuak($stateParams.multimediaId);
        
    }
    
}])

.controller('NabarmenduakArazoaCtrl', ['$scope', '$http', '$ionicPopup', 'Zerbitzaria', 'Nabarmenduak', function($scope, $http, $ionicPopup, Zerbitzaria, Nabarmenduak) {
    
    $scope.formData = {};
    $scope.formData.azalpena = "";
    
    // Formularioaren datuei multimedia elementuaren id-a gehitu.
    $scope.formData.id_multimedia = Nabarmenduak.eskuratuIdElementua();
    
    $scope.arrakastaBidaltzean = false;
    $scope.erroreaBidaltzeanTestua = "";
    
    $scope.showAlert = function() {
        
        var mezua = "";
        
        if ($scope.arrakastaBidaltzean) {
            
            mezua = "Arazoaren informazioa behar bezala bidali da!";
            
        } else {
            
            mezua = "Errore bat gertatu da arazoaren informazioa bidaltzean: " + $scope.erroreaBidaltzeanTestua;
            
        }
        
        var alertPopup = $ionicPopup.alert({
            title: 'Euskal TV',
            template: mezua
        });
        
        alertPopup.then(function(res) {
            
            if ($scope.arrakastaBidaltzean) {
                
                window.location.href = "#/tab/nabarmenduak-zerrenda";
                
            }
            
        });
    };
    
    $scope.bidali = function() {
        
        Zerbitzaria.bidaliArazoa($scope.formData).then(function(erantzuna) {
            
            if (erantzuna.data.arrakasta) {
                
                // Dena ondo joan dela adierazten duen mezua bistaratu.
                $scope.arrakastaBidaltzean = true;
                
            } else {
                
                // Arazoak egon direla adierazten duen mezua bistaratu.
                $scope.arrakastaBidaltzean = false;
                
                // Zerbitzaritik jasotako errore mezua bistaratu.
                $scope.erroreaBidaltzeanTestua = erantzuna.data.mezua;
                
            }
            
            $scope.showAlert();
            
        });
        
    }
    
}])

.controller('ZureEraraDenboraCtrl', ['$scope', 'ZureErara', function($scope, ZureErara) {
    
    $scope.minutuak = ZureErara.eskuratuMinutuak();
    
}])

.controller('ZureEraraMotakCtrl', ['$scope', 'Zerbitzaria', 'ZureErara', function($scope, Zerbitzaria, ZureErara) {
    
    $scope.elementu_motak = [];
    
    $scope.datuak_kargatzen = false;
    
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
            
            // Zerbitzaritik datuak kargatzen ari garela adierazi.
            $scope.datuak_kargatzen = true;
            
            promise.then(function() {
                
                $scope.elementu_motak = Zerbitzaria.elementu_motak;
                
                // Zerbitzaritik datuak kargatzen bukatu dugula adierazi.
                $scope.datuak_kargatzen = false;
                
            });
            
        } else {
            
            $scope.elementu_motak = Zerbitzaria.elementu_motak;
        }
    }
    
    if (window.navigator.connection && window.navigator.connection.type === Connection.NONE) {
        
        console.log("Zure erara motak - Konexiorik ez dago!!!");
        
        window.location.href = "#/konexiorik-gabe";
        
    } else {
        
        console.log("Zure erara motak - else-ra sartu da");
        
        $scope.eskuratuDatuak();
        
    }
    
}])

.controller('ZureEraraZerrendaCtrl', ['$scope', '$ionicScrollDelegate', 'Zerbitzaria', 'ZureErara', function($scope, $ionicScrollDelegate, Zerbitzaria, ZureErara) {
    
    $scope.active = ZureErara.eskuratuFitxaAktiboa();
    
    $scope.zure_erara_zerrenda = [];
    
    // ion-content direktibak $scope-tik heredatzen duen scope berri bat sortzen du,
    // ondorioz hemengo aldagaiak irakur daitezke scope umetik baina umean egindako aldaketak ez dira ikusten gurasotik.
    // Javascript-en objektuak erreferentzia bezala pasatzen direnez, umean bilaketa.testua aldatzean gurasokoa ere aldatzen da,
    // horregatik erabiltzen dut bilaketa.testua eta ez testua zuzenean.
    // Ikusi hau: https://www.youtube.com/watch?v=ZhfUv0spHCY&feature=youtu.be&t=30m
    $scope.bilaketa = {
        testua: ""
    }
    
    // Zenbagarren elementutik aurrera eskatu behar diren kasu bakoitzean.
    $scope.offsets = {};
    $scope.offsets.azkenak = 0;
    $scope.offsets.alfabetikoki = 0;
    
    // Zenbat elementu eskatu behar diren aldiko kasu bakoitzean.
    $scope.limits = {};
    $scope.limits.azkenak = 10;
    $scope.limits.alfabetikoki = 10;

    // Zerbitzaritik elementu gehiago kargatzen ari garen ala ez.
    $scope.gehiago_kargatzen = {};
    $scope.gehiago_kargatzen.azkenak = false;
    $scope.gehiago_kargatzen.alfabetikoki = false;
    
    // Zerbitzaritik elementu berriak kargatu ditugula adierazten du.
    // Begiratu ion-infinite-scroll elementuaren ng-if.
    // Hau gabe behin eta berriz zerbitzarira eskaerak egiten hasten da.
    $scope.elementu_gehiago_daude = true;
    
    $scope.zerrenda_hutsik_dago = false;
    
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
    
    $scope.birkargatuZerrenda = function() {
        
        // Nabarmenduak motako zerrendak garbitu, bai Zerbitzaria zerbitzuan bai momentuko scope-an.
        Zerbitzaria.garbituZerrendak(ZureErara.eskuratuMota());
        $scope.zure_erara_zerrenda = [];
        
        // Offset-ak eguneratu.
        $scope.offsets.azkenak = 0;
        $scope.offsets.alfabetikoki = 0;
        
        // Bilaketarekin bat datozen elementuak eskuratu zerbitzaritik.
        $scope.kargatuGehiago();
        
    }
    
    $scope.iragazi = function(keyEvent) {
        
        // Erabiltzaileak teklatuko Joan/Go/Ir botoia sakatu badu.
        if(keyEvent.keyCode === 13){
            
            // Bilaketaren emaitzak bistaratu behar dira, horretarako zerrenda berriz kargatuko dugu.
            $scope.birkargatuZerrenda();
            
        }
        
    }
    
    $scope.garbitu = function() {
        
        $scope.bilaketa.testua = "";
        
        // Zerrenda berriz kargatu.
        
        $scope.birkargatuZerrenda();
        
    }
    
    $scope.kargatuGehiago = function() {
        
        console.log("kargatuGehiago");
        
        if (window.navigator.connection && window.navigator.connection.type === Connection.NONE) {
                
                console.log("Nabarmenduak zerrenda - Konexiorik ez dago!!!");
                
                window.location.href = "#/konexiorik-gabe";
                
        } else {
            
            // Erabiltzaileak bideoaren gehienezko iraupena aldatu badu.
            if (ZureErara.minutuak_aldatu_dira) {
                
                // Zure erararen zerrendak garbitu behar dira.
                Zerbitzaria.garbituZureEraraZerrendak();
                
                // Berriz ere false jarri.
                ZureErara.minutuak_aldatu_dira = false;
                
            }
            
            if ($scope.active == 'alfabetikoki') {
                
                if (!$scope.gehiago_kargatzen.alfabetikoki // Ez bagara dagoeneko gehiago kargatzen ari eta...
                    && (Zerbitzaria.zure_erara.alfabetikoki.length === 0                                // Ikusienen zerrenda hutsik badago edo...
                        || Zerbitzaria.zure_erara.alfabetikoki.length === $scope.offsets.alfabetikoki)) {  // Hutsik ez dagoen kasuan ere gehiago kargatzeko da baldintza hau.
                    
                    console.log("bai");
                    
                    // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                    $scope.gehiago_kargatzen.alfabetikoki = true;
                    
                    // Zerbitzaritik elementu gehiago eskuratu.
                    var promise = Zerbitzaria.eskuratuZerrenda("alfabetikoki", ZureErara.eskuratuMota(), $scope.offsets.alfabetikoki, $scope.limits.alfabetikoki, $scope.segundoak, $scope.bilaketa.testua);
                    
                    promise.then(function() {
                        
                        // Zerrendaren luzera ez bada aldatu, elementu berririk ez dagoela esan nahi du.
                        if ($scope.zure_erara_zerrenda.length === Zerbitzaria.zure_erara.alfabetikoki.length) {
                            
                            $scope.elementu_gehiago_daude = false;
                            
                        } else {
                            
                            $scope.elementu_gehiago_daude = true;
                            
                        }
                        
                        // Eguneratutako elementuen zerrenda gorde.
                        $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.alfabetikoki;
                        
                        // Ikusienak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                        $scope.offsets.alfabetikoki += $scope.limits.alfabetikoki;
                        
                        // Zerrenda hutsik al dago?
                        // Bat datorren elementurik ez dagoela dioen mezua noiz bistaratu jakiteko erabiltzen dugu hau.
                        // Begiratu txantiloia.
                        if ($scope.zure_erara_zerrenda.length === 0) {
                            
                            $scope.zerrenda_hutsik_dago = true;
                            
                        } else {
                            
                            $scope.zerrenda_hutsik_dago = false;
                            
                        }
                        
                        // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                        $scope.gehiago_kargatzen.alfabetikoki = false;
                        
                    });
                    
                } else {
                    
                    console.log("ez");
                    $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.alfabetikoki;
                    
                }
                
            } else {
                
                if (!$scope.gehiago_kargatzen.azkenak   // Ez bagara dagoeneko gehiago kargatzen ari eta...
                    && (Zerbitzaria.zure_erara.azkenak.length === 0                              // Ikusienen zerrenda hutsik badago edo...
                        || Zerbitzaria.zure_erara.azkenak.length === $scope.offsets.azkenak)) {  // Hutsik ez dagoen kasuan ere gehiago kargatzeko da baldintza hau.
                
                    console.log("bai");
                    
                    // Zerbitzaritik elementu berriak kargatzen ari garela adierazi.
                    $scope.gehiago_kargatzen.azkenak = true;
                    
                    // Zerbitzaritik elementu gehiago eskuratu.
                    var promise = Zerbitzaria.eskuratuZerrenda("azkenak", ZureErara.eskuratuMota(), $scope.offsets.azkenak, $scope.limits.azkenak, $scope.segundoak, $scope.bilaketa.testua);
                    
                    promise.then(function() {
                        
                        // Zerrendaren luzera ez bada aldatu, elementu berririk ez dagoela esan nahi du.
                        if ($scope.zure_erara_zerrenda.length === Zerbitzaria.zure_erara.azkenak.length) {
                            
                            $scope.elementu_gehiago_daude = false;
                            
                        } else {
                            
                            $scope.elementu_gehiago_daude = true;
                            
                        }
                        
                        // Eguneratutako elementuen zerrenda gorde.
                        $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.azkenak;
                        
                        // Azkenak atalaren offseta eguneratu kargatu berri ditugun elementu kopuruarekin.
                        $scope.offsets.azkenak += $scope.limits.azkenak;
                        
                        // Zerrenda hutsik al dago?
                        // Bat datorren elementurik ez dagoela dioen mezua noiz bistaratu jakiteko erabiltzen dugu hau.
                        // Begiratu txantiloia.
                        if ($scope.zure_erara_zerrenda.length === 0) {
                            
                            $scope.zerrenda_hutsik_dago = true;
                            
                        } else {
                            
                            $scope.zerrenda_hutsik_dago = false;
                            
                        }
                        
                        // Zerbitzaritik elementu berriak kargatzen bukatu dugula adierazi.
                        $scope.gehiago_kargatzen.azkenak = false;
                    });
                    
                } else {
                    
                    console.log("ez");
                    $scope.zure_erara_zerrenda = Zerbitzaria.zure_erara.azkenak;
                    
                }
            }
        }
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
}])

.controller('ZureEraraXehetasunakCtrl', ['$sce', '$scope', '$stateParams', 'Zerbitzaria', 'ZureErara', function($sce, $scope, $stateParams, Zerbitzaria, ZureErara) {
    
    $scope.multimedia = {};
    
    $scope.urla = "";
    
    $scope.datuak_kargatzen = false;
    
    $scope.eskuratuDatuak = function(id) {
        
        var promise = Zerbitzaria.getElementua(id);
        
        // Zerbitzaritik datuak kargatzen ari garela adierazi.
        $scope.datuak_kargatzen = true;
        
        promise.then(function() {
            
            $scope.multimedia = Zerbitzaria.elementua;
            
            $scope.urla = Zerbitzaria.multimedia_url + $scope.multimedia.mota + "/" + $scope.multimedia.nice_name;
            
            $scope.multimedia.disqus_url = $sce.trustAsResourceUrl(Zerbitzaria.api_url + "disqus?shortname=argia2&url=" + $scope.multimedia.argia_multimedia_url + "&title=Iruzkinak");
            
            for (var i = 0; i < $scope.multimedia.embed.length; i++) {
                
                $scope.multimedia.embed[i].embed_src = $($scope.multimedia.embed[i].embed_kodea).attr('src');
                
                if ($scope.multimedia.embed[i].embed_src && $scope.multimedia.embed[i].embed_src.indexOf('http') !== 0) {
                    
                    // Txertatzeko kodea ez bada http-rekin hasten gehitu egingo diogu.
                    // Bestela, gurasoaren protokoloa erabiltzen du. Aplikazio hibridoen kasuan file:// da eta bideoa ez du kargatzen.
                    $scope.multimedia.embed[i].embed_kodea = $scope.multimedia.embed[i].embed_kodea.replace("src=\"", "src=\"https:");
                    $scope.multimedia.embed[i].embed_src = "https:" + $scope.multimedia.embed[i].embed_src;
                    
                    console.log($scope.multimedia.embed[i].embed_kodea);
                    console.log($scope.multimedia.embed[i].embed_src);
                    
                }
                
                // Youtube-ko esteka da ala ez?
                if ($scope.multimedia.embed[i].embed_src.indexOf('youtube') === -1) {
                    
                    $scope.multimedia.embed[i].youtubekoEstekaDa = false;
                    
                } else {
                    
                    $scope.multimedia.embed[i].youtubekoEstekaDa = true;
                    
                }
            }
            
            // Zerbitzaritik datuak kargatzen bukatu dugula adierazi.
            $scope.datuak_kargatzen = false;
            
        });
    }
    
    // ZureErara factory-an gorde hautatutako multimedia elementuaren id-a.
    ZureErara.ezarriIdMultimedia($stateParams.multimediaId);
    
    if (window.navigator.connection && window.navigator.connection.type === Connection.NONE) {
        
        console.log("Zure erara xehetasunak - Konexiorik ez dago!!!");
        
        window.location.href = "#/konexiorik-gabe";
        
    } else {
        
        console.log("Zure erara xehetasunak - else-ra sartu da");
        
        // Hautatutako multimedia elementuaren datuak eskuratu.
        $scope.eskuratuDatuak($stateParams.multimediaId);
        
    }
    
    
}])

.controller('ZureEraraArazoaCtrl', ['$scope', '$http', '$ionicPopup', 'Zerbitzaria', 'ZureErara', function($scope, $http, $ionicPopup, Zerbitzaria, ZureErara) {
    
    $scope.formData = {};
    $scope.formData.azalpena = "";
    
    // Formularioaren datuei multimedia elementuaren id-a gehitu.
    $scope.formData.id_multimedia = ZureErara.eskuratuIdMultimedia();
    
    $scope.arrakastaBidaltzean = false;
    $scope.erroreaBidaltzeanTestua = "";
    
    $scope.showAlert = function() {
        
        var mezua = "";
        
        if ($scope.arrakastaBidaltzean) {
            
            mezua = "Arazoaren informazioa behar bezala bidali da!";
            
        } else {
            
            mezua = "Errore bat gertatu da arazoaren informazioa bidaltzean: " + $scope.erroreaBidaltzeanTestua;
            
        }
        
        var alertPopup = $ionicPopup.alert({
            title: 'Euskal TV',
            template: mezua
        });
        
        alertPopup.then(function(res) {
            
            if ($scope.arrakastaBidaltzean) {
                
                window.location.href = "#/tab/nabarmenduak-zerrenda";
                
            }
            
        });
    };
    
    $scope.bidali = function() {
        
        Zerbitzaria.bidaliArazoa($scope.formData).then(function(erantzuna) {
            
            if (erantzuna.data.arrakasta) {
                
                // Dena ondo joan dela adierazten duen mezua bistaratu.
                $scope.arrakastaBidaltzean = true;
                
            } else {
                
                // Arazoak egon direla adierazten duen mezua bistaratu.
                $scope.arrakastaBidaltzean = false;
                
                // Zerbitzaritik jasotako errore mezua bistaratu.
                $scope.erroreaBidaltzeanTestua = erantzuna.data.mezua;
                
            }
            
            $scope.showAlert();
            
        });
        
    }
    
}])

.controller('KonfiguratuAlertakCtrl', ['$scope', '$ionicPopup', 'Zerbitzaria', 'push', function($scope, $ionicPopup, Zerbitzaria, push) {
    
    $scope.alerta_motak = [];
    
    $scope.arrakastaBidaltzean = false;
    $scope.erroreaBidaltzeanTestua = "";
    
    $scope.datuak_kargatzen = false;
    
    $scope.showAlert = function() {
        
        var mezua = "";
        
        if ($scope.arrakastaBidaltzean) {
            
            mezua = "Zure alerta eskaera behar bezala bidali da!";
            
        } else {
            
            mezua = "Errore bat gertatu da zure alerta eskaera bidaltzean: " + $scope.erroreaBidaltzeanTestua;
            
        }
        
        var alertPopup = $ionicPopup.alert({
            title: 'Euskal TV',
            template: mezua
        });
        
        alertPopup.then(function(res) {
            
            if ($scope.arrakastaBidaltzean) {
                
                window.location.href = "#/tab/nabarmenduak-zerrenda";
                
            }
            
        });
    };
    
    $scope.bidali = function() {
        
        console.log("bidali");
        
        var result = push.registerPush(function (result) {
            
            var eskatutako_alerta_motak = "";
            var data;
            
            if (result.type === 'registration') {
                
                for (var i = 0; i < $scope.alerta_motak.length; i++) {
                    
                    if ($scope.alerta_motak[i].hautatuta) {
                        
                        eskatutako_alerta_motak = eskatutako_alerta_motak + $scope.alerta_motak[i].id;
                        
                        if (i !== $scope.alerta_motak.length - 1) {
                            
                            eskatutako_alerta_motak = eskatutako_alerta_motak + ",";
                            
                        }
                    }
                    
                }
                
                data = {'mota': result.device, 'id_gailua': result.id, 'aukerak': eskatutako_alerta_motak};
                
                $.ajax({
                    url: Zerbitzaria.api_url + 'erregistroa',
                    type: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(data)
                })
                .done(function(data, textStatus, jqXHR) {
                    
                    console.log(data);
                    console.log(textStatus);
                    
                    // Id-a eta gailu mota biltegiratze lokalean gordeko dugu.
                    localStorage.setItem('regid', result.id);
                    localStorage.setItem('gailua', result.device);
                    
                    // Dena ondo joan dela adierazten duen mezua bistaratu.
                    $scope.arrakastaBidaltzean = true;
                    
                    
                    $scope.showAlert();
                    
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    
                    console.log(textStatus);
                    console.log(errorThrown);
                    
                    // Arazoak egon direla adierazten duen mezua bistaratu.
                    $scope.arrakastaBidaltzean = false;
                    
                    // Zerbitzaritik jasotako errore mezua bistaratu.
                    $scope.erroreaBidaltzeanTestua = erantzuna.data.mezua;
                    
                    $scope.showAlert();
                    
                });
                
            }
            
        });    
    }
    
    $scope.eskuratuDatuak = function() {
        
        var regid = localStorage.getItem('regid');
        var gailua = localStorage.getItem('gailua');
        
        console.log(regid);
        console.log(gailua);
        
        if (Zerbitzaria.alerta_motak.length === 0) {
            
            var promise = Zerbitzaria.getAlertaMotak(regid);
            
            // Zerbitzaritik datuak kargatzen ari garela adierazi.
            $scope.datuak_kargatzen = true;
            
            promise.then(function() {
                
                $scope.alerta_motak = Zerbitzaria.alerta_motak;
                
                // Zerbitzaritik datuak kargatzen bukatu dugula adierazi.
                $scope.datuak_kargatzen = false;
                
            });
            
        } else {
            
            $scope.alerta_motak = Zerbitzaria.alerta_motak;
        }
    }
    
    $scope.eskuratuDatuak();
    
}])

.controller('IgoZureaCtrl', ['$scope', '$http', '$ionicPopup', 'Zerbitzaria', function($scope, $http, $ionicPopup, Zerbitzaria) {
    
    $scope.formData = {};
    $scope.formData.izenburua = "";
    $scope.formData.azalpena = "";
    $scope.formData.txertatzeko = "";
    
    $scope.arrakastaBidaltzean = false;
    $scope.erroreaBidaltzeanTestua = "";
    
    $scope.showAlert = function() {
        
        var mezua = "";
        
        if ($scope.arrakastaBidaltzean) {
            
            mezua = "Zure proposamena behar bezala bidali da!";
            
        } else {
            
            mezua = "Errore bat gertatu da zure proposamena bidaltzean: " + $scope.erroreaBidaltzeanTestua;
            
        }
        
        var alertPopup = $ionicPopup.alert({
            title: 'Euskal TV',
            template: mezua
        });
        
        alertPopup.then(function(res) {
            
            if ($scope.arrakastaBidaltzean) {
                
                window.location.href = "#/tab/nabarmenduak-zerrenda";
                
            }
            
        });
    };
    
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
                
                // Dena ondo joan dela adierazten duen mezua bistaratu.
                $scope.arrakastaBidaltzean = true;
                
            } else {
                
                // Arazoak egon direla adierazten duen mezua bistaratu.
                $scope.arrakastaBidaltzean = false;
                
                // Zerbitzaritik jasotako errore mezua bistaratu.
                $scope.erroreaBidaltzeanTestua = data.mezua;
                
            }
            
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            
            $scope.showAlert();
            
        })
        
        .error(function(data, status, headers, config) {
            
            // Aurretik egon zitekeen arrakasta mezua ezkutatu (ngShow).
            $scope.arrakastaBidaltzean = false;
            
            // Zerbitzaritik jasotako errore mezua bistaratu.
            $scope.erroreaBidaltzeanTestua = data.mezua;
            
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            
            $scope.showAlert();
            
        });
        
    }
    
}])

.controller('KonexiorikGabeCtrl', ['$scope', function($scope) {
   
    $scope.saiatuBerriz = function() {
        
        if (window.navigator.connection && window.navigator.connection.type !== Connection.NONE) {
            
            window.history.back();
            
        }
        
    }
}]);
