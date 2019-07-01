let heatLayer = undefined;

// Base map
var myMap = new L.Map('map', {
  center: new L.LatLng(19.39068, -99.2837),
  zoom: 11
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// ----------
// Initial map with O3 at 01/01/2016
var init = () => {
  getData("O3", '01/01/2016');
}

// Update map
var createLayer = (selectedContaminant, selectedDate) => {
  d3.csv("../static/res/contaminants2016.csv", function (error, contaminants) {
    if (error) throw error;
    var cont = contaminants;


    var graphContaminant = []
    for (let i = 0; i < cont.length; i++) {
      if (cont[i].date === selectedDate) {
        if (cont[i].id_parameter === selectedContaminant) {
          graphContaminant.push(cont[i])
        }
      }
    }

    var heatArray = [];
    for (let j = 0; j < graphContaminant.length; j++) {
      var value = graphContaminant[j].value;
      if (value) {
        heatArray.push([graphContaminant[j].latitud, graphContaminant[j].longitud, graphContaminant[j].value]);
      }
    }

    if (heatLayer !== undefined) {
      myMap.removeLayer(heatLayer);

    }

    heatLayer = L.heatLayer(heatArray, {
      radius: 50,
      blur: 35
    }).addTo(myMap);


  });
}


// ---------
// contaminant selection
function getData(selCont) {
  createLayer(selCont, '01/01/2016');
}

init();
