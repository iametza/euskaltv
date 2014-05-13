angular.module('argia-multimedia-app.directives', [])
.directive('knob', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            // Aukera guztiak zein diren ikusteko: https://github.com/aterrien/jQuery-Knob#options
            $(element).val(scope.minLehenetsiak).knob({
                min: 0,                 // default: 0
                max: 90,                // default: 100
                step: 1,                // default: 1
                fgColor: "#4A87EE",     // Arkuaren kolorea.
                inputColor: "#4A87EE",  // Erdiko zenbakiaren kolorea
                width: 300,             // Zabalera eta altuera dinamikoki ezartzea hobe litzateke ala ez? Pantaila-tamainaren arabera?
                height: 300             
            });
        }
    };
});