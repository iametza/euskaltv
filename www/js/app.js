// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('argia-multimedia-app', ['ionic', 'argia-multimedia-app.controllers', 'argia-multimedia-app.services', 'argia-multimedia-app.directives', 'ngSanitize'])

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
            templateUrl: 'templates/tab-honi-buruz.html',
            controller: 'HoniBuruzCtrl'
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


