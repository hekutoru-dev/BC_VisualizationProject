// ----------------------------------------------------
// | Contaminant and Emergencies Heatmaps Base Layers |
// ----------------------------------------------------

let contaminantHeatLayer = undefined;
let emergenciesHeatLayer = undefined;


// Create an array with formatted 2016 date strings
function appendLeadingZeroes(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}
var daysOfYear = []
var daysOfYearNoCero = []
for (var d = new Date(2016, 0, 1); d <= new Date(2016, 11, 31); d.setDate(d.getDate() + 1)) {
    var dateString = appendLeadingZeroes(d.getDate()) + "/" + appendLeadingZeroes(d.getMonth() + 1) + "/" + d.getFullYear()
    var dateStringNoCero = (d.getMonth()+1) + "/" + d.getDate() + "/" +  d.getFullYear();
    daysOfYear.push(dateString);
    daysOfYearNoCero.push(dateStringNoCero)
}


// Contaminant base map
var contaminantMap = new L.Map('contaminantMap', {
    center: new L.LatLng(19.4196797, -99.1270159),
    zoom: 11
});
var baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(contaminantMap);

// Emergencies base map
var emergenciesMap = new L.Map('emergenciesMap', {
    center: new L.LatLng(19.4196797, -99.1270159),
    zoom: 11
});
var baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(emergenciesMap);


// ----------
// Initial map with O3 at 01/01/2016
var init = () => {
    getData("SO2", '01/01/2016');
}

// Update map
// -----------------------
// | Contaminant Heatmap |
// -----------------------
const createContaminantLayer = async (selectedContaminant, selectedDate) => {
    const url = `/contaminants/?q={"id_parameter":"${selectedContaminant}","date":"${selectedDate}"}`;
    d3.json(url, function (contaminants) {
        console.log(`down ${selectedDate}`);
        var graphContaminant = contaminants.data;
        // debugger;
        var contaminantHeatArray = [];
        for (let j = 0; j < graphContaminant.length; j++) {
            var value = graphContaminant[j].value;
            if (value) {
                contaminantHeatArray.push([graphContaminant[j].latitud, graphContaminant[j].longitud, graphContaminant[j].value]);
            }
        }
        if (contaminantHeatLayer !== undefined) {
            contaminantMap.removeLayer(contaminantHeatLayer);
        }
        contaminantHeatLayer = L.heatLayer(contaminantHeatArray, {
            radius: 50,
            blur: 45,
            opacity: 0.5
        }).addTo(contaminantMap);
    });
}



// Update map
// -----------------------
// | Emergencies Heatmap |
// -----------------------
const createEmergenciesLayer = async (selectedDate) => {
    const url = `/emergencies/?q={"date":"${selectedDate}"}`;
    d3.json(url, function (emergencies) {
        console.log(`down ${selectedDate}`);
        
        var graphEmergencies = emergencies.data;
        // debugger;
        var emergenciesHeatArray = [];
        for (let j = 0; j < graphEmergencies.length; j++) {
            var value = graphEmergencies[j].count;
            if (value) {
                emergenciesHeatArray.push([graphEmergencies[j].latitud, graphEmergencies[j].longitud, graphEmergencies[j].count]);
            }
        }
        if (emergenciesHeatLayer !== undefined) {
            emergenciesMap.removeLayer(emergenciesHeatLayer);
        }
        emergenciesHeatLayer = L.heatLayer(emergenciesHeatArray, {
            radius: 50,
            blur: 45,
            opacity: 0.5
        }).addTo(emergenciesMap);
    });
}





// ---------
// contaminant selection
function getData(selCont) {
    createContaminantLayer(selCont, '01/01/2016');
    createEmergenciesLayer("1/1/2016")
}


var pollutant = 'O3'
for (let i = 0; i < daysOfYear.length; i++) {

    
    setTimeout(function () {
        var date = daysOfYear[i];
        var dateNoCero = daysOfYearNoCero[i]
        d3.select('#date-counter').html(`<h3>${daysOfYear[i]}</h3>`);
        createContaminantLayer(pollutant, date);
        createEmergenciesLayer(dateNoCero);
        console.log(i)
    }, 200 * i);
}



init();




