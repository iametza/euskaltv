angular.module('argia-multimedia-app.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MultimediaZerrenda', function() {
    // Might use a resource here that returns a JSON array
  
    var multimedia = [
        {'id': 0,
            'izenburua': 'Donostiako Libre topaketak',
            'mota': 'Solasaldia',
            'thumbnail': 'http://www.argia.com/argia-multimedia/docs/bideoak/libreZubiagaEleaktx.jpg',
            'embed_kodea': '<iframe width="240" height="150" frameborder="0" allowfullscreen="" src="http://www.youtube.com/embed/6cf_TTOpOJc?rel=0"></iframe>'},
        {'id': 1,
            'izenburua': '"Pilota desafioa", Aiherrako ikasleen eskutik',
            'mota': 'Ekitaldia',
            'thumbnail': 'http://www.argia.com/argia-multimedia/docs/bideoak/pilotaAiherratx.jpg',
            'embed_kodea': '<iframe width="240" height="150" frameborder="0" allowfullscreen="" webkitallowfullscreen="" src="http://www.kanaldude.tv/embed/2873/?title=1&"></iframe>'},
        {'id': 2,
            'izenburua': 'Euskal Herriko komunikabideak erronka berrien aurrean',
            'mota': 'Solasaldia',
            'thumbnail': 'http://www.argia.com/argia-multimedia/docs/bideoak/arrosa14hitzaldiatx.jpg',
            'embed_kodea': '<iframe width="240" height="150" frameborder="0" allowfullscreen="" src="http://www.youtube.com/embed/aHyYDcws-VU?rel=0"></iframe>'}
    ];
    
    return {
        all: function() {
            return multimedia;
        },
        get: function(multimediaId) {
            // Simple index lookup
            return multimedia[multimediaId];
        }
    }
});
