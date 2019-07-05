// / READ CDMX STATIONS LOCATION
// d3.csv('res/cdmx_stations.csv', function (error, stationData) {
//   if (error) throw error;
//   console.log(stationData);
//   // test cluster
//   var markers = L.markerClusterGroup();
//   //console.log(stationData.length); //69

//   /*
//   var longitude = stationData.longitud; 
//   var latitude = stationData.latitud;
//   */

//   // Create an object to keep of the number of markers in each layer
//   var stationCount = {
//     ACTIVE: 0,
//     UNACTIVE: 0
//   };

//   // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons for the layer group.
//   var stationStatusCode;

//   for (var i = 0; i < stationData.length; i++) {
//     var station = Object.assign({}, stationData[i]);
//     // Get the status of the current monitoring station.
//     var stationStatus = station.obs_estac;
//     Collapse




// ----------------------------------




var cont = []
var selectedDate = '01/01/2016'
var selectedContaminant = 'O3'
var graphContaminant = []


//d3.csv("../static/data/contaminants.csv").then((contaminants,error) => {
d3.csv("../static/res/contaminants2016.csv", function (error, contaminants) {
  if (error) throw error;
  // console.log(contaminants);
  // for (let i = 0; i < contaminants.length; i++) {
  //   cont.push(Object.assign({}, contaminants[i]))
  // }
  // console.log(cont)
var cont = contaminants;
console.log('trial')
    console.log(cont[0]);
    



    for (let j = 0; j < cont.length; j++) {
      if (cont[j].date === selectedDate) {
        if (cont[j].id_parameter === selectedContaminant) {
          // heatArray.push(latitude[j], longitud[j], value[j])
          graphContaminant.push(cont[j])
        }
      }
      // var heat = L.heatLayer(heatArray, {
      //   radius: 20,
      //   blur: 35
      // }).addTo(myMap);
      // }
    }

    var baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    })
    // .addTo(myMap);
  
    var cfg = {
      "radius": 20,
      "maxOpacity": .8,
      // scales the radius based on map zoom
      "scaleRadius": true,
      "useLocalExtrema": true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'latitude',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'longitud',
      // which field name in your data represents the data value - default "value"
      valueField: 'value'
    };
    
    
    
    var heatmapLayer = new HeatmapOverlay(cfg);
  
    // var myMap = L.map("map", {
    //   center: [19.39068, -99.2837],
    //   zoom: 11,
    //   layers: [baseLayer, heatmapLayer]
    // });


    var myMap = new L.Map('map', {
      center: new L.LatLng(19.39068, -99.2837),
      zoom: 11,
      layers: [baseLayer, heatmapLayer]
    });
    
    heatmapLayer.setData(testData);



});




    // var latitude = cont.latitud;
    // var longitud = cont.longitud;
    // var date = cont.date;
    // var parameter = cont.id_parameter;
    // var values = cont.value;
    // var heatArray = [];

    var selectedDate = '01/01/2016'
    var selectedContaminant = 'O3'
    var graphContaminant = []


    for (let j = 0; j < cont.length; j++) {
      if (cont[j].date === selectedDate) {
        if (parameter[j].id_parameter === selectedContaminant) {
          // heatArray.push(latitude[j], longitud[j], value[j])
          graphContaminant.push(cont[j])
        }
      }
      // var heat = L.heatLayer(heatArray, {
      //   radius: 20,
      //   blur: 35
      // }).addTo(myMap);
      // }
    }
  










