// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('argia-multimedia-app', ['ionic', 'argia-multimedia-app.controllers', 'argia-multimedia-app.services', 'argia-multimedia-app.directives', 'ngSanitize'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        
        // Each tab has its own nav history stack:
        
        .state('tab.nabarmenduak', {
            url: '/nabarmenduak',
            views: {
                'tab-nabarmenduak': {
                    templateUrl: 'templates/tab-nabarmenduak.html',
                    controller: 'NabarmenduakCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-denbora', {
            url: '/zure-erara-denbora',
            views: {
                'tab-zure-erara-denbora': {
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
                    controller: 'ZureEraraCtrl'
                }
            }
        })
        
        .state('tab.zure-erara-zerrenda', {
            url: '/zure-erara-zerrenda',
            views: {
                'tab-zure-erara': {
                    templateUrl: 'templates/tab-zure-erara-zerrenda.html',
                    controller: 'ZureEraraCtrl'
                }
            }
        })
        
        .state('tab.zerrenda-xehetasunak', {
            url: '/zerrenda/:multimediaId',
            views: {
                'tab-nabarmenduak': {
                    templateUrl: 'templates/tab-zerrenda-xehetasunak.html',
                    controller: 'MultimediaXehetasunakCtrl'
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
        
        .state('tab.honi-buruz', {
            url: '/honi-buruz',
            views: {
                'tab-honi-buruz': {
                    templateUrl: 'templates/tab-honi-buruz.html',
                    controller: 'HoniBuruzCtrl'
                }
            }
        })
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/nabarmenduak');

});


