// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('argia-multimedia-app', ['ionic', 'argia-multimedia-app.controllers', 'argia-multimedia-app.services'])

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

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.zerrenda', {
      url: '/zerrenda',
      views: {
        'tab-zerrenda': {
          templateUrl: 'templates/tab-zerrenda.html',
          controller: 'MultimediaZerrendaCtrl'
        }
      }
    })
    .state('tab.zerrenda-xehetasunak', {
      url: '/zerrenda/:multimediaId',
      views: {
        'tab-zerrenda': {
          templateUrl: 'templates/zerrenda-xehetasunak.html',
          controller: 'MultimediaXehetasunakCtrl'
        }
      }
    })

    .state('tab.youtube', {
      url: '/youtube',
      views: {
        'tab-youtube': {
          templateUrl: 'templates/tab-youtube.html',
          controller: 'YoutubeCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

