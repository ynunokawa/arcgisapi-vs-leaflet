var d;
require([

  "config/defaults"

], function (d) {

  $( document ).ready(function() {

    var map = L.map('leaflet-map').setView([d.lat, d.long], d.zoom);
    L.esri.basemapLayer('Imagery').addTo(map);
    /*map.invalidateSize(false);

    $('#leaflet-tab').click(function() {
      map.invalidateSize(false);
    });*/

    var searchControl = new L.esri.Geocoding.Controls.Geosearch().addTo(map);
    var results = new L.LayerGroup().addTo(map);
    searchControl.on('results', function(data){
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });

    L.esri.featureLayer(d.featureLayerUrl, {
      minZoom: 9,
      style: { color: 'white', fillOpacity: 0, weight: 1 }
    }).addTo(map).bindPopup(function (feature) {
      return L.Util.template('<p>市区町村<br>{SIKUCHOSON}</p>', feature.properties);
    });

    L.esri.dynamicMapLayer(d.dynamicLayerUrl, {
      opacity: 0.5,
      useCors: false
    }).addTo(map);

    L.esri.heatmapFeatureLayer(d.heatmapLayerUrl, {
      radius: 50,
      gradient: {
        0.2: '#ffffb2',
        0.4: '#fd8d3c',
        0.6: '#fd8d3c',
        0.8: '#f03b20',
        1: '#bd0026'
      }
    }).addTo(map);

    L.esri.imageMapLayer(d.imageServiceLayerUrl, {
      opacity: 0.7
    }).addTo(map);

  });

});