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
         'thumb': 'http://www.argia.com/argia-multimedia/docs/bideoak/libreZubiagaEleaktx.jpg'},
        {'id': 1,
         'izenburua': '"Pilota desafioa", Aiherrako ikasleen eskutik',
         'mota': 'Ekitaldia',
         'thumb': 'http://www.argia.com/argia-multimedia/docs/bideoak/pilotaAiherratx.jpg'},
        {'id': 2,
         'izenburua': 'Euskal Herriko komunikabideak erronka berrien aurrean',
         'mota': 'Solasaldia',
         'thumb': 'http://www.argia.com/argia-multimedia/docs/bideoak/arrosa14hitzaldiatx.jpg'}
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
