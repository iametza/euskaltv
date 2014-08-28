angular.module('argia-multimedia-app.directives', [])
.directive('knob', ['ZureErara', function(ZureErara) {
    return {
        restrict: 'A',
        
        priority: 1, // necessary for angular 1.2.x+
        
        require: 'ngModel',
        
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
                    
                    // Hau eta beheko ngModel zergatik erabiltzen ditugun ulertzeko begiratu hau: https://groups.google.com/forum/#!msg/angular/gWqeEGK1cds/ArQAVaFmcn0J
                    scope.$apply(function() {
                        ngModel.$setViewValue(value);
                        
                        // Erabiltzaileak hautatutako minutuak gorde gero erabiltzeko.
                        ZureErara.ezarriMinutuak(value);
                        
                        // Erabiltzaileak bideoaren gehienezko iraupena aldatu duela adierazi.
                        ZureErara.minutuak_aldatu_dira = true;
                    });
                }
            });
            
            // Hau eta goiko scope.$apply zergatik erabiltzen ditugun ulertzeko begiratu hau: https://groups.google.com/forum/#!msg/angular/gWqeEGK1cds/ArQAVaFmcn0J
            ngModel.$render = function(){
               $(element).val(ngModel.$viewValue).trigger("change"); 
            };
        }
    };
}])

.directive('prettyembed', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).prettyEmbed();//{ useFitVids: true });
        }
    }
});