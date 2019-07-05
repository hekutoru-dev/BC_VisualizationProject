var dataset;
var seleccion;

var map = L.map('mapa-townhalls', {
  center: [19.3207671,-99.1730415],    
  zoom: 10,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  zoomControl: false
});

var layers = {
  INDUSTRIAL_PARK: new L.LayerGroup()
};

// Create an overlays object to add to the layer control
var overlays = {
  "Industrial Parks": layers.INDUSTRIAL_PARK
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

function getColor(cve_mun) {   

  return cve_mun === "002" ? '#c6e6ff' :
    cve_mun === "003" ? '#a2c9e8' :
    cve_mun === "004" ? '#7fadd2' :
    cve_mun === "005" ? '#003e59' :
    cve_mun === "006" ? '#c6e6ff' :
    cve_mun === "007" ? '#7fadd2' :
    cve_mun === "008" ? '#003e59' :
    cve_mun === "009" ? '#c6e6ff' :
    cve_mun === "010" ? '#c6e6ff' :
    cve_mun === "011" ? '#003e59' :
    cve_mun === "012" ? '#7fadd2' :
    cve_mun === "013" ? '#5b91bc' :
    cve_mun === "014" ? '#5b91bc' :
    cve_mun === "015" ? '#7fadd2' :
    cve_mun === "016" ? '#b4d7f3' : '#a2c9e8';
   
} // END function getColor: EDIT for change color

function style(feature) {  
    return {
        fillColor: getColor(feature.properties.CVE_MUN),
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '2',
        fillOpacity: 1
    };
} // END function style (map stroke)

// Get the status of the current monitoring station.      
var cdmx_map = L.geoJson(cdmxjson, {style: style}).addTo(map);

//: OK Up to this point.


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// Set style: On mouseover().
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 7,
      color: '#ff616d',
      dashArray: '',
      fillOpacity: 0.7
  });
}

// Set style: On mouseout()
function resetHighlight(e) {
  geojson.resetStyle(e.target);
}


var graphFeature =(e) =>{
console.log(e.target.feature.properties.NOMGEO);
townhall = e.target.feature.properties.NOMGEO;
const url = `/diseases/?q={"townhall":"${townhall}"}`;
d3.json(url, function(response) {
  console.log("El contaminante es:");
  console.log(seleccion);

  date = response.date;
  cases = response.cases;
  O3 = response.O3;
  PM10 = response.PM10;

  dataset = response
  console.log(e.target.feature.properties.NOMGEO);

  //////////////////////////////////////PM10///////////////////////
  if (seleccion=="PM10") {
    console.log("ES PM10");
    cplot=response.PM10;

    var a = [ "Cases_100K"];
    var b = [ "PM10 (ppb)"];
  
    for (var i = 0; i < O3.length; i++) { 
      a.push(cases[i]);
      b.push(cplot[i]);
    }
  

    var chart = c3.generate({
      bindto: '#graph',
      data: {
          columns: [
            a,
            b
          ],
          axes: {
            cases: 'y',
            PM10: 'y2'
          }
      },
      point: {
        show: false
    },
      axis: {
          y2: {
              show: true
          }
      },
      title: {
        show: true,
        text: `Contaminants vs. Respiratory Diseases (${townhall})`,
        position: 'top-left',   // top-left, top-center and top-right
        padding: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 50
        }
      }
  });
  d3.select('#graph .c3-title')
  .style('font-size', '1.8em');
  
  // https://stackoverflow.com/questions/45142519/c3-js-chart-title-overlapped-if-i-change-the-size-of-title
  d3.select('#graph .c3-title')
  .style('font-size', '1.8em')
  .style("dominant-baseline", "central");

  


//////////////////////////////////////O3///////////////////////
 } else {
  console.log("ES O3");
  cplot=response.O3;
  var a = [ "Cases_100K"];
  var b = [ "O3 (ug/m3)"];

  for (var i = 0; i < O3.length; i++) { 
    a.push(cases[i]);
    b.push(cplot[i]);
  }


  var chart = c3.generate({
    bindto: '#graph',
    data: {
        columns: [
          a,
          b
        ],
        axes: {
          cases: 'y',
          O3: 'y2'
        }
    },
    point: {
      show: false
  },
    axis: {
        y2: {
            show: true
        }
    },
    title: {
      show: true,
      text: `Contaminants vs. Respiratory Diseases (${townhall})`,
      position: 'top-left',   // top-left, top-center and top-right
      padding: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50
      }
    }
});

d3.select('#graph .c3-title')
  .style('font-size', '1.8em');
  
  // https://stackoverflow.com/questions/45142519/c3-js-chart-title-overlapped-if-i-change-the-size-of-title
  d3.select('#graph .c3-title')
  .style('font-size', '1.8em')
  .style("dominant-baseline", "central");
 }});
}
//}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: graphFeature // Change to read data and graph pollutants behaviour.
  });
}

// Add these moficitations to CDMX map.
geojson = L.geoJson(cdmxjson, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(cdmx_map);

// ICONS for Active and Unactive stations.
var icons = {
  INDUSTRIAL_PARK: L.ExtraMarkers.icon({
    icon: "ion-android-home",
    iconColor: "white",
    markerColor: "purple",
    shape: "square"
  })
};


// READ INDUSTRIAL PARKS LOCATIONS AND ADD LAYER TO MAP.
d3.csv('../static/res/industrial_parks.csv', function(error, parkData) {
  if (error) throw error;
  console.log(parkData);  

  for (var i = 0; i < parkData.length; i++) {
    var park = Object.assign({}, parkData[i]);
    // Get the current park name.
    var park_name = park.nom_parque;

    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.marker([park.latitud, park.longitud], {
      icon: icons['INDUSTRIAL_PARK']
    });  

     // Add the new marker to the appropriate layer
     newMarker.addTo(layers['INDUSTRIAL_PARK'])
              .bindPopup(park_name);
  } // END FOR Industrial parkData
}); // END read_csv INDUSTRIAL PARKS



function getData(selCont) {
  //console.log(selCont);
  seleccion = selCont;
}