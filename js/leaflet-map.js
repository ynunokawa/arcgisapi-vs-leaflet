require([

  "config/defaults"

], function (d) {

  $( document ).ready(function() {

    var map = L.map('leaflet-map').setView([d.lat, d.long], d.zoom);
    var arcgis_rt = L.esri.basemapLayer('Topographic').addTo(map);
    var mapbox_vt;
    var featureLayer, dynamicLayer, heatmapLayer, imageLayer;
    var _d = false;
    var _f = false;
    var _h = false;
    var _i = false;

    var searchControl = L.esri.Geocoding.Controls.geosearch().addTo(map);

    var results = L.layerGroup().addTo(map);

    searchControl.on('results', function(data){
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });

    /*$('#feature').click(function() {
      if(_f === true) {
        featureLayer.setOpacity(0);
        _f = false;
      }
      else {
        featureLayer.setOpacity(1);
        _f = true;
      }
    });
    $('#dynamic').click(function() {
      if(_d === true) {
        dynamicLayer.setOpacity(0);
        _d = false;
      }
      else {
        featureLayer.setOpacity(0.8);
        _d = true;
      }
    });
    $('#image').click(function() {
      if(_i === true) {
        imageLayer.setOpacity(0);
        _i = false;
      }
      else {
        imageLayer.setOpacity(0.7);
        _i = true;
      }
    });
    $('#heatmap').click(function() {
      if(_h === true) {
        heatmapLayer.setOpacity(0);
        _h = false;
      }
      else {
        heatmapLayer.setOpacity(1);
        _h = true;
      }
    });*/

    addDynamicLayer();
    addFeatureLayer();
    addHeatmapLayer();
    addImageLayer();
    addMapboxVectorTiledLayer();

    function addDynamicLayer() {
      dynamicLayer = L.esri.dynamicMapLayer({
        url: d.dynamicLayerUrl,
        opacity: 0.8,
        useCors: true
      }).addTo(map);
    }

    function addFeatureLayer() {
      featureLayer = L.esri.featureLayer({
        url: d.featureLayerUrl,
        minZoom: 9,
        style: { color: 'white', fillOpacity: 0, weight: 1 }
      }).addTo(map).bindPopup(function (feature) {
        return L.Util.template('<p>市区町村<br>{SIKUCHOSON}</p>', feature.properties);
      });
    }

    function addHeatmapLayer() {
      heatmapLayer = L.esri.heatmapFeatureLayer({
        url: d.heatmapLayerUrl,
        minOpacity: 0.5,
        radius: 30,
        blur: 30,
        gradient: {
          0.2: '#ffffb2',
          0.4: '#fd8d3c',
          0.6: '#fd8d3c',
          0.8: '#f03b20',
          1: '#bd0026'
        }
      }).addTo(map);
    }

    function addImageLayer() {
      imageLayer = L.esri.imageMapLayer({
        url: d.imageServiceLayerUrl,
        opacity: 0.7
      }).addTo(map);
    }

    function addMapboxVectorTiledLayer() {
      var debug = {};
      mapbox_vt = new L.TileLayer.MVTSource({
        url: "http://spatialserver.spatialdev.com/services/vector-tiles/GAUL_FSP/{z}/{x}/{y}.pbf",
        debug: true,
        clickableLayers: ["GAUL0"],
        getIDForLayerFeature: function(feature) {
          return feature.properties.id;
        },

        /**
         * The filter function gets called when iterating though each vector tile feature (vtf). You have access
         * to every property associated with a given feature (the feature, and the layer). You can also filter
         * based of the context (each tile that the feature is drawn onto).
         *
         * Returning false skips over the feature and it is not drawn.
         *
         * @param feature
         * @returns {boolean}
         */
        filter: function(feature, context) {
          if (feature.layer.name === 'GAUL0') {
            return true;
          }
          return false;
        },

        style: function (feature) {
          var style = {};

          var type = feature.type;
          switch (type) {
            case 1: //'Point'
              style.color = 'rgba(49,79,79,1)';
              style.radius = 5;
              style.selected = {
                color: 'rgba(255,255,0,0.5)',
                radius: 6
              };
              break;
            case 2: //'LineString'
              style.color = 'rgba(161,217,155,0.8)';
              style.size = 3;
              style.selected = {
                color: 'rgba(255,25,0,0.5)',
                size: 4
              };
              break;
            case 3: //'Polygon'
              style.color = fillColor;
              style.outline = {
                color: strokeColor,
                size: 1
              };
              style.selected = {
                color: 'rgba(255,140,0,0.3)',
                outline: {
                  color: 'rgba(255,140,0,1)',
                  size: 2
                }
              };
              break;
          }
          return style;
        }

      });
      debug.mvtSource = mapbox_vt;

      //Globals that we can change later.
      var fillColor = 'rgba(149,139,255,0.4)';
      var strokeColor = 'rgb(20,20,20)';

      //Add layer
      map.addLayer(mapbox_vt);
    }

  });

});
