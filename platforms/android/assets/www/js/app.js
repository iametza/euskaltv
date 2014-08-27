// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('argia-multimedia-app', [
    'ionic',
    'argia-multimedia-app.controllers',
    'argia-multimedia-app.services',
    'argia-multimedia-app.directives',
    'ngSanitize',
    'ngAnimate',
    'ngTouch',
    'multi-select'
])

.run(function($ionicPlatform, $ionicSideMenuDelegate) {
    
    $ionicPlatform.ready(function() {
        
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
        
        // Ez utzi albo-menua arrastatuz bistaratzen.
        $ionicSideMenuDelegate.canDragContent(false);
        
    });
    
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        
        .state('honi-buruz', {
            url: '/honi-buruz',
            templateUrl: 'templates/honi-buruz.html',
            controller: 'HoniBuruzCtrl'
        })
        
        .state('konfiguratu-alertak', {
            url: '/konfiguratu-alertak',
            templateUrl: 'templates/konfiguratu-alertak.html',
            controller: 'KonfiguratuAlertakCtrl'
        })
        
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        
        // Each tab has its own nav history stack:
        
        .state('tab.nabarmenduak-zerrenda', {
            url: '/nabarmenduak-zerrenda',
            views: {
                'tab-nabarmenduak': {
                    templateUrl: 'templates/tab-nabarmenduak-zerrenda.html',
                    controller: 'NabarmenduakZerrendaCtrl'
                }
            }
        })
        
        .state('tab.nabarmenduak-xehetasunak', {
            url: '/nabarmenduak-xehetasunak/:multimediaId',
            views: {
                'tab-nabarmenduak': {
                    templateUrl: 'templates/tab-nabarmenduak-xehetasunak.html',
                    controller: 'NabarmenduakXehetasunakCtrl'
                }
            }
        })
        
        .state('tab.nabarmenduak-arazoa', {
            url: '/nabarmenduak-arazoa',
            views: {
                'tab-nabarmenduak': {
                    templateUrl: 'templates/tab-nabarmenduak-arazoa.html',
                    controller: 'NabarmenduakArazoaCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-denbora', {
            url: '/zure-erara-denbora',
            views: {
                'tab-zure-erara': {
                    templateUrl: 'templates/tab-zure-erara-denbora.html',
                    controller: 'ZureEraraDenboraCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-motak', {
            url: '/zure-erara-motak',
            views: {
                'tab-zure-erara': {
                    templateUrl: 'templates/tab-zure-erara-motak.html',
                    controller: 'ZureEraraMotakCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-zerrenda', {
            url: '/zure-erara-zerrenda',
            views: {
                'tab-zure-erara': {
                    templateUrl: 'templates/tab-zure-erara-zerrenda.html',
                    controller: 'ZureEraraZerrendaCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-xehetasunak', {
            url: '/zure-erara-xehetasunak/:multimediaId',
            views: {
                'tab-zure-erara': {
                    templateUrl: 'templates/tab-zure-erara-xehetasunak.html',
                    controller: 'ZureEraraXehetasunakCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-arazoa', {
            url: '/zure-erara-arazoa',
            views: {
                'tab-zure-erara': {
                    templateUrl: 'templates/tab-zure-erara-arazoa.html',
                    controller: 'ZureEraraArazoaCtrl'
                }
            }
        })
        
        .state('tab.igo-zurea', {
            url: '/igo-zurea',
            views: {
                'tab-igo-zurea': {
                    templateUrl: 'templates/tab-igo-zurea.html',
                    controller: 'IgoZureaCtrl'
                }
            }
        })
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/nabarmenduak-zerrenda');

});

// Hauek zerbitzu bezala jartzea hobe litzateke.
// https://github.com/driftyco/ng-cordova/issues/104

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         console.log('push-notification: ' + e.alert);
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    console.log('EVENT -> RECEIVED:' + e.event);
    
    switch( e.event )
    {
        case 'registered':
        if ( e.regid.length > 0 )
        {
            console.log('REGISTERED -> REGID:' + e.regid);
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
            
            var data = {'mota': 'android', 'id_gailua': e.regid, 'aukerak':'12345'};
            
            console.log(data);
            console.log($.param(data));
            
            $.ajax({
                url: 'http://192.168.2.174/argia-multimedia-zerbitzaria/erregistroa',
                type: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param(data)
            })
            .done(function(data, textStatus, jqXHR) {
                console.log(data);
                console.log(textStatus);
                alert("OK!");
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                alert("Errorea!");
            });
            
            // AngularJSk application/json erabiltzen du modu lehenetsian Content-type goiburu bezala.
            // PHPk ez zidan onartzen datuak modu horretan bidaltzea:
            // Request header field Content-Type is not allowed by Access-Control-Allow-Headers.
            // Horregatik application/x-www-urlencoded goiburua erabili behar izan dut eta datuak serializatu $.param erabiliz (jQuery).
            /*$http({
                method: 'POST',
                //url: Zerbitzaria.api_url + 'erregistroa',
                url: 'http://192.168.2.174/argia-multimedia-zerbitzaria/erregistroa',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param(data)
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
                
                alert("OK!");
                
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
                
                alert("Errorea!");
                
            });*/
            
            
        }
        break;
        
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                console.log('--INLINE NOTIFICATION--');
                
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+e.soundname);
                my_media.play();
            }
            else
            {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    console.log('--COLDSTART NOTIFICATION--');
                else
                console.log('--BACKGROUND NOTIFICATION--');
            }
                
            console.log('MESSAGE -> MSG: ' + e.payload.message);
            console.log('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
        break;
        
        case 'error':
            console.log('ERROR -> MSG:' + e.msg);
        break;
        
        default:
            console.log('EVENT -> Unknown, an event was received and we do not know what it is');
        break;
    }
}
