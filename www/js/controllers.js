angular.module('argia-multimedia-app.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('MultimediaZerrendaCtrl', function($scope, MultimediaZerrenda) {
  $scope.multimediaZerrenda = MultimediaZerrenda.all();
})

.controller('MultimediaXehetasunakCtrl', function($scope, $stateParams, MultimediaZerrenda) {
  $scope.multimedia = MultimediaZerrenda.get($stateParams.multimediaId);
})

.controller('YoutubeCtrl', function($scope) {
});
