angular.module('argia-multimedia-app.directives', [])
.directive('knob', ['ZureErara', function(ZureErara) {
    return {
        restrict: 'A',
        
        priority: 1, // necessary for angular 1.2.x+
        
        require: 'ngModel',
        
        link: function(scope, element, attrs, ngModel) {
            
            // tamaina = Altuera osoa - knob-aren div-aren marjina - 15 (Aurrera botoiaren eta beheko barraren artean tartea egon dadin)
            // - goiko barra - beheko barra - goiko azalpena (marjina barne, horregatik true) - botoiaren div-a (marjina barne, horregatik true).
            var tamaina = Math.round(window.screen.height - 44 - 64 - 30 - 15 - $(".goiko-azalpena").outerHeight(true) - $("#zure-erara-denbora-aurrera-botoia").outerHeight(true));
            
            console.log(window.screen.height);
            console.log($(".goiko-azalpena").height());
            console.log($("#zure-erara-denbora-aurrera-botoia").height());
            console.log(tamaina);
            
            // Kalkulatutako tamaina zabaleraren %70 baino handiagoa bada hori erabiliko dugu.
            var zabalera_max = Math.round(window.screen.width * 0.70);
            
            if (tamaina > zabalera_max) {
                tamaina = zabalera_max;
            }
            
            // Aukera guztiak zein diren ikusteko: https://github.com/aterrien/jQuery-Knob#options
            $(element).val(scope.minutuak).knob({
                min: 0,                 // default: 0
                max: 90,                // default: 100
                step: 1,                // default: 1
                fgColor: "#e6332a",     // Arkuaren kolorea.
                inputColor: "#e6332a",  // Erdiko zenbakiaren kolorea
                width: tamaina,  // Zabalera eta altuera dinamikoki ezartzea hobe litzateke ala ez? Pantaila-tamainaren arabera?
                height: tamaina,
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
    
    // Helper function: get video ID from youtube URLs (prettyembed-en kodetik hartu dut.)
    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            return match[7];
        } else {
            console.error('PrettyEmbed.js Error: Bad URL.');
        }
    }
    
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).prettyEmbed({
                videoID: youtube_parser(scope.element.embed_src),
                customPreviewImage: scope.multimedia.irudia
            });
        }
    }
})

.directive('irudiembed', function() {
    
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            // Aurrebista irudia gehitu.
            $(element).html("<img width='100%' alt='Bideoaren aurrebista irudia' src='" + scope.multimedia.irudia + "'>");
            
            $(element).click(function() {
                
                // pretty-embed klasea kendu div-ari.
                $(element).removeClass("pretty-embed");
                
                // Embed kodea txertatu div-ean.
                $(element).html(scope.element.embed_kodea);
            });
        }
    }
    
});