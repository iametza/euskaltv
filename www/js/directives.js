angular.module('argia-multimedia-app.directives', [])
.directive('knob', ['ZureErara', function(ZureErara) {
    return {
        restrict: 'A',
        
        priority: 1, // necessary for angular 1.2.x+
        
        link: function(scope, element, attrs, ngModel) {
            
            // Aukera guztiak zein diren ikusteko: https://github.com/aterrien/jQuery-Knob#options
            $(element).val(scope.minutuak).knob({
                min: 0,                 // default: 0
                max: 90,                // default: 100
                step: 1,                // default: 1
                fgColor: "#4A87EE",     // Arkuaren kolorea.
                inputColor: "#4A87EE",  // Erdiko zenbakiaren kolorea
                width: 300,             // Zabalera eta altuera dinamikoki ezartzea hobe litzateke ala ez? Pantaila-tamainaren arabera?
                height: 300,
                change: function(value) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(value);
                        ZureErara.ezarriMinutuak(value);
                    });
                }
            });
            
            ngModel.$render = function(){
               $(element).val(ngModel.$viewValue).trigger("change"); 
            };
        }
    };
}]);