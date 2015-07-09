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
        basemap: "satellite",
        center: [d.long, d.lat], // lon, lat
        zoom: d.zoom
    });

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

    addDynamicLayer();
    addFeatureLayer();
    addHeatmapLayer();
    addImageLayer();

    function addDynamicLayer() {
        var dynamicLayer = new ArcGISDynamicMapServiceLayer(d.dynamicLayerUrl, {
            opacity: 0.5
        });
        map.addLayer(dynamicLayer);
    }

    function addFeatureLayer() {
        var infoTemplate = new InfoTemplate("市区町村", "${SIKUCHOSON}");
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,255]), 1),new Color([0,0,0,0])
        );
        var renderer = new SimpleRenderer(symbol);
        var featureLayer = new FeatureLayer(d.featureLayerUrl, {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: infoTemplate
        });
        featureLayer.setMinScale(1500000);
        featureLayer.setRenderer(renderer);
        map.addLayer(featureLayer);
    }

    function addHeatmapLayer() {
        var heatmapFeatureLayerOptions = {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"]
        };
        var heatmapFeatureLayer = new FeatureLayer(d.heatmapLayerUrl, heatmapFeatureLayerOptions);
        var heatmapRenderer = new HeatmapRenderer();
        heatmapFeatureLayer.setRenderer(heatmapRenderer);
        map.addLayer(heatmapFeatureLayer);
    }

    function addImageLayer() {
        var imageLayer = new ArcGISImageServiceLayer(d.imageServiceLayerUrl, {
            opacity: 0.7
        });
        map.addLayer(imageLayer);
    }

});