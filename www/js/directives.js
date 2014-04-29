angular.module('argia-multimedia-app.directives', [])
.directive('knob', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            // Aukera guztiak zein diren ikusteko: https://github.com/aterrien/jQuery-Knob#options
            $(element).val(scope.minLehenetsiak).knob({
                min: 0,             // default: 0
                max: 90,            // default: 100
                step: 1             // default: 1
            });
        }
    };
});