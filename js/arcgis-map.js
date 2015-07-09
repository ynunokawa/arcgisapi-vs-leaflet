require([

    "esri/map",
    "esri/dijit/Search",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/renderers/HeatmapRenderer",
    "esri/InfoTemplate",
    "esri/layers/ArcGISImageServiceLayer",

    "dojo/dom",
    "dojo/on",
    "config/defaults",
    "dojo/domReady!"

], function (Map, Search, ArcGISDynamicMapServiceLayer, FeatureLayer, HeatmapRenderer, InfoTemplate, ArcGISImageServiceLayer, dom, on, d) {
    var map = new Map("arcgis-map", {
        basemap: "topo",
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
    });

    var dynamicLayer = new ArcGISDynamicMapServiceLayer("http://d29gfjzfcfpjgq.cloudfront.net/arcgis/rest/services/DynamicLayer/PopulationDensity/MapServer", {
        opacity: 0.5
    });
    map.addLayer(dynamicLayer);

    var infoTemplate = new InfoTemplate("属性", "{*}");

    var heatmapFeatureLayerOptions = {
      mode: FeatureLayer.MODE_SNAPSHOT,
      infoTemplate: infoTemplate,
      outFields: ["*"]
    };
    var heatmapFeatureLayer = new FeatureLayer(d.heatmapLayerUrl, heatmapFeatureLayerOptions);
    var heatmapRenderer = new HeatmapRenderer();
    heatmapFeatureLayer.setRenderer(heatmapRenderer);
    map.addLayer(heatmapFeatureLayer);

    var imageLayer = new ArcGISImageServiceLayer(d.imageServiceLayerUrl);
    map.addLayer(imageLayer);

});