// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('argia-multimedia-app', [
    'ionic',
    'argia-multimedia-app.controllers',
    'argia-multimedia-app.services',
    'argia-multimedia-app.directives',
    'ngSanitize',
    'ngAnimate',
    'ngTouch',
    'cordova'
])

.run(function($ionicPlatform, $ionicSideMenuDelegate, $location, $timeout, $rootScope, push) {
    
    $ionicPlatform.ready(function() {
        
        var konexioa_galdu_aurreko_orria = "#/tab/nabarmenduak-zerrenda";
        
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
        
        // Ez utzi albo-menua arrastatuz bistaratzen.
        $ionicSideMenuDelegate.canDragContent(false);
        
        var result = push.registerPush(function (result) {
            
            if (result.type === 'message') {
                
                console.log("mezua jasota");
                console.log(result);
                
                // Mezua jasotzean aplikazioa 3 egoeratan egon daiteke:
                // * Aurreko planoan exekutatzen -> foreground === true
                // * Atzeko planoan ezkutuan baina memorian -> foreground === false && coldstart === false
                // * Erabat geldi -> foreground === false && coldstart === true
                if (result.foreground) {
                    
                } else {
                    
                    if (result.coldstart) {
                        
                    } else {
                        
                    }
                    
                }
                
                // Alertaren elementura bideratu.
                document.location.href = "#/tab/nabarmenduak-xehetasunak/" + result.id_elementua;
            }
            
        });
        
        document.addEventListener(  "offline",
                                    function() {
                                        
                                        console.log("offline");
                                        
                                        konexioa_galdu_aurreko_orria = document.location.hash;
                                        
                                        console.log(document.location.hash);
                                        
                                        document.location.href = "#/konexiorik-gabe";
                                        
                                    },
                                    false);
        
        document.addEventListener(  "online",
                                    function() {
                                        
                                        console.log("online");
                                        
                                        console.log(konexioa_galdu_aurreko_orria);
                                        
                                        document.location.href = konexioa_galdu_aurreko_orria;
                                        
                                        console.log(document.location.hash);
                                        
                                    },
                                    false);
    });
    
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        
        .state('konexiorik-gabe',  {
            url: '/konexiorik-gabe',
            templateUrl: 'templates/konexiorik-gabe.html',
            controller: ''
        })
        
        .state('honi-buruz', {
            url: '/honi-buruz',
            templateUrl: 'templates/honi-buruz.html',
            controller: 'HoniBuruzCtrl'
        })
        
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        
        // Each tab has its own nav history stack:
        
        .state('igo-zurea', {
            url: '/igo-zurea',
            templateUrl: 'templates/igo-zurea.html',
            controller: 'IgoZureaCtrl'
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
        
        .state('tab.konfiguratu-alertak', {
            url: '/konfiguratu-alertak',
            views: {
                'tab-konfiguratu-alertak': {
                    templateUrl: 'templates/tab-konfiguratu-alertak.html',
                    controller: 'KonfiguratuAlertakCtrl'
                }
            }
        });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/nabarmenduak-zerrenda');

});
