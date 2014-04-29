angular.module('argia-multimedia-app.directives', [])
.directive('knob', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).val(scope.number).knob();
        }
    };
});