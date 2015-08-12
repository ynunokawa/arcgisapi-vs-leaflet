require([

    "esri/map",
    "esri/dijit/Search",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/renderers/HeatmapRenderer",
    "esri/InfoTemplate",
    "esri/layers/ArcGISImageServiceLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",

    "dojo/dom",
    "dojo/on",

    "config/defaults",

    "dojo/domReady!"

], function (Map, Search, ArcGISDynamicMapServiceLayer, FeatureLayer, HeatmapRenderer, InfoTemplate, ArcGISImageServiceLayer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, Color, dom, on, d) {

    var map = new Map("arcgis-map", {
        basemap: "topo",
        center: [d.long, d.lat], // lon, lat
        zoom: d.zoom
    });

    var dynamicLayer, featureLayer, heatmapFeatureLayer, imageLayer;
    var _d = false;
    var _f = false;
    var _h = false;
    var _i = false;

    var s = new Search({
        map: map
    }, "arcgis-search");
    s.startup();

    on(dom.byId("arcgis-tab"), "click", function() {
        console.log("#arcgis-tab click");
        map.on("mouse-over", function() {
            console.log("#arcgis-map mouse-over");
            map.reposition();
        });
        map.on("click", function() {
            map.reposition();
        });
    });

    on(dom.byId("feature"), "click", function() {
      if(_f === true) {
        featureLayer.hide();
        _f = false;
      }
      else {
        featureLayer.show();
        _f = true;
      }
    });
    on(dom.byId("dynamic"), "click", function() {
      if(_d === true) {
        dynamicLayer.hide();
        _d = false;
      }
      else {
        dynamicLayer.show();
        _d = true;
      }
    });
    on(dom.byId("image"), "click", function() {
      if(_i === true) {
        imageLayer.hide();
        _i = false;
      }
      else {
        imageLayer.show();
        _i = true;
      }
    });
    on(dom.byId("heatmap"), "click", function() {
      if(_h === true) {
        heatmapFeatureLayer.hide();
        _h = false;
      }
      else {
        heatmapFeatureLayer.show();
        _h = true;
      }
    });

    addDynamicLayer();
    addFeatureLayer();
    addHeatmapLayer();
    addImageLayer();

    function addDynamicLayer() {
        dynamicLayer = new ArcGISDynamicMapServiceLayer(d.dynamicLayerUrl, {
            opacity: 0.8
        });
        map.addLayer(dynamicLayer);
        dynamicLayer.hide();
    }

    function addFeatureLayer() {
        var infoTemplate = new InfoTemplate("市区町村", "${SIKUCHOSON}");
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,255]), 1),new Color([0,0,0,0])
        );
        var renderer = new SimpleRenderer(symbol);
        featureLayer = new FeatureLayer(d.featureLayerUrl, {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: infoTemplate
        });
        featureLayer.setMinScale(1500000);
        featureLayer.setRenderer(renderer);
        map.addLayer(featureLayer);
        featureLayer.hide();
    }

    function addHeatmapLayer() {
        var heatmapFeatureLayerOptions = {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"],
          opacity: 0.5
        };
        heatmapFeatureLayer = new FeatureLayer(d.heatmapLayerUrl, heatmapFeatureLayerOptions);
        var heatmapRenderer = new HeatmapRenderer({
            blurRadius: 12,
            maxPixelIntensity: 12,
            minPixelIntensity: 0
        });
        heatmapFeatureLayer.setRenderer(heatmapRenderer);
        map.addLayer(heatmapFeatureLayer);
        heatmapFeatureLayer.hide();
    }

    function addImageLayer() {
        imageLayer = new ArcGISImageServiceLayer(d.imageServiceLayerUrl, {
            opacity: 0.7
        });
        map.addLayer(imageLayer);
        imageLayer.hide();
    }

});
