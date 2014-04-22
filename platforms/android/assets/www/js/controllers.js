angular.module('argia-multimedia-app.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('MultimediaZerrendaCtrl', function($scope, MultimediaZerrenda) {
  $scope.multimediaZerrenda = MultimediaZerrenda.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('YoutubeCtrl', function($scope) {
});
