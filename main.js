import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map';
import Projection from 'ol/proj/Projection';
import TileWMS from 'ol/source/TileWMS';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import {Stroke, Fill, Circle, Style} from 'ol/style.js';
import View from 'ol/View';
import {ScaleLine,  Attribution, FullScreen, defaults as defaultControls} from 'ol/control';
import {
  transform,
} from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import LayerSwitcher from 'ol-layerswitcher';

// https://github.com/walkermatt/ol-layerswitcher-examples/blob/master/parcel/main.js

// By default OpenLayers does not know about the EPSG:25833 (Europe) projection.
// https://epsg.io/25833
proj4.defs("EPSG:25833","+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

var projectionETRS89 = new Projection({
  code: 'EPSG:25833',
  // The extent is used to determine zoom level 0. Recommended values for a
  // projection's validity extent can be found at https://epsg.io/.
    extent: [-2465144.80, 4102893.55, 776625.76, 9408555.22],
  units: 'm',
});

// We also declare EPSG:21781/EPSG:4326 transform functions. These functions
// are necessary for the ScaleLine control and when calling ol/proj~transform
// for setting the view's initial center (see below).

var extentBerlin = [-2465144.80, 4102893.55, 776625.76, 9408555.22];

var vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function(extent) {
        return 'https://mymapnik.rudzick.it/geoserver/wfs?service=WFS&' +
            'version=1.1.0&request=GetFeature&typename=Kleingartenparzellen:planet_osm_polygon:Allmende_Kontor&' +
            'outputFormat=application/json&srsname=EPSG:25833&' +
            'bbox=' + extent.join(',') + ',EPSG:25833';
    },
    strategy: bboxStrategy
});

var vector = new VectorLayer({
//    'title' : 'Allmende-Kontor',
    source: vectorSource,
    style: new Style({
        stroke: new Stroke({
            color: 'rgba(189, 2, 64, 1.0)',
            width: 1
        }),
//	fill: new Fill({
//	    color: 'rgba(189, 2, 64, 0.3)'
//	}),   
    }),
    renderMode: vector,
    updateWhileInteracting: true
});

var berlin1928 = new TileLayer({
    'title' : 'Luftbildkarte 1928',
     type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild1928',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild1928@senstadt&type=WMS">Geoportal Berlin / Luftbildplan 1928</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin1953 = new TileLayer({
    'title' : 'Luftbilder 1953',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild1953',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild1953@senstadt&type=WMS">Geoportal Berlin / Luftbilder 1953</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2002 = new TileLayer({
    'title' : 'Digitale SW Orthophotos 2002',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2002',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2002@senstadt&type=WMS">Geoportal Berlin / Digitale schwarz-weiß Orthophotos 2002</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2006 = new TileLayer({
    'title' : 'Digitale SW Orthophotos 2006',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/luftbild2006',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=luftbild2006@senstadt&type=WMS">Geoportal Berlin / Digitale schwarz-weiß Orthophotos 2006</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2007 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2007',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2007',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2007@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2007</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2009 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2009',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2009_20',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2009_20@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2009</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2010 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2010',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2010_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2010_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2010</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2011 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2011',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2011_20',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2013_20@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2011</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2013 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2013',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2013',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2013@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2013</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2014 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2014',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2014',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2014@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2014</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2015 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2015',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2015_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2015_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2015</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2016 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2016',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2016_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2016_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2016</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2017 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2017',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2017_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2017_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2017</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2018 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2018',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2018_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2018_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2018</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2019 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2019',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2019_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2019_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2019</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2020 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2020',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2020_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2020_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2020</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2021 = new TileLayer({
    'title' : 'Digitale farbige Orthophotos 2021',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2021_rgb',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2021_rgb@senstadt&type=WMS">Geoportal Berlin / Digitale farbige Orthophotos 2021</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2022 = new TileLayer({
    'title' : 'Digitale farbige TrueOrthophotos 2022',
    type: 'base',
    visible: false,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild2022_true_rgbi',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_luftbild2022_true_rgbi@senstadt&type=WMS">Geoportal Berlin / Digitale farbige TrueOrthophotos 2022</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': '0',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var berlin2023 = new TileLayer({
    'title' : 'Digitale farbige TrueOrthophotos 2023',
    type: 'base',
    visible: true,
    extent: extentBerlin,
    source: new TileWMS({
      url: 'https://gdi.berlin.de/services/wms/truedop_2023',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://gdi.berlin.de/geonetwork/srv/ger/catalog.search#/metadata/07ec4c16-723f-32ea-9580-411d8fe4f7e7">Geoportal Berlin / Digitale farbige TrueOrthophotos 2023"</a>' +
	    ' &amp; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	params: {
	    'SERVICE': 'WMS',
	    'VERSION': '1.3.0',
            'LAYERS': 'truedop_2023',
	    'CRS': 'EPSG:25833',
            'FORMAT': 'image/png',
      },
      serverType: 'mapserver',
    }),
});

var basisLayers = new LayerGroup({
    'title': 'Hintergrund',
    combine: false,
//     type: 'base',
    visible: true,
    layers: [berlin1928,
	     berlin1953,
	     berlin2002,
	     berlin2006,
	     berlin2007,
	     berlin2009,
	     berlin2010,	     
	     berlin2011,
	     berlin2013,
	     berlin2014,
	     berlin2015,
	     berlin2016,
	     berlin2017,
	     berlin2018,
	     berlin2019,
	     berlin2020,
	     berlin2021,
	     berlin2022,
	     berlin2023]
});

var overlaysOSM = new LayerGroup({
    'title': 'Gemeinschaftsgarten Allmende-Kontor (OSM)',
    combine: true,
    fold: 'closed',
    layers: [vector]
});


var map = new Map({
    controls: defaultControls().extend([
	new ScaleLine({
	    units: 'metric',
	}),
	new FullScreen()
    ]),
    layers: [basisLayers,
	     overlaysOSM
	    ],
    target: 'map',
    view: new View({
	projection: projectionETRS89,
        center: transform([13.4170488, 52.474506], 'EPSG:4326', 'EPSG:25833'),
//	center: [386956.39, 5816099.66],
        extent: extentBerlin,
	zoom: 16
  }),
});

var layerSwitcher = new LayerSwitcher();
map.addControl(layerSwitcher);

// https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild1928?&VERSION=1.3.0&REQUEST=GetCapabilities&SERVICE=WMS&
