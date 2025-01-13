// PART 1:
// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
        // Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
        // Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data.




// Create the map object
let myMap = L.map("map", {
    center: [37, -95],      // Centered on the United States
    zoom: 4
});

// Basemap Layers
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Map data: &copy; <a href="https://www.esri.com/">ESRI</a>',
    maxZoom: 18
});

// Add the default basemap to the map
satellite.addTo(myMap);

// Create a function to set marker size based on magnitude
function markerSize(magnitude) {        // The markerSize function scales the radius of the circle markers based on magnitude.
    return magnitude * 4;               // Scale factor for visibility
};

// Create a function to set marker color based on depth
function markerColor(depth) {           // The markerColor function assigns colors based on the depth of the earthquake.
    if (depth > 90) return "#FF4500";   // Red
    if (depth > 70) return "#FF6347";   // OrangeRed
    if (depth > 50) return "#FFA500";   // Orange
    if (depth > 30) return "#FFD700";   // Gold
    if (depth > 10) return "#ADFF2F";   // GreenYellow
    return "#00FF00";                   // Lime
};

// Load the GeoJSON data for earthquakes
let earthquakeLayer = new L.LayerGroup();
let earthquakeDataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Get GeoJSON data with d3
d3.json(earthquakeDataURL).then(function(data) {

    // Create a GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),                 // Marker size by magnitude
                fillColor: markerColor(feature.geometry.coordinates[2]),    // Color by depth
                color: "#000",      // Outline color
                weight: 0.5,        // Outline width
                opacity: 1,         // Outline opacity
                fillOpacity: 0.8    // Fill opacity
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                `<strong>Location:</strong> ${feature.properties.place}<br>
                <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
            );
        }
    }).addTo(earthquakeLayer);
    earthquakeLayer.addTo(myMap);
});

// Add a legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    // Create the container for the legend
    let div = L.DomUtil.create("div", "info legend");

    // Define depth ranges and corresponding colors
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["#00FF00", "#ADFF2F", "#FFD700", "#FFA500", "#FF6347", "#FF4500"];

    // Loop through depth ranges and create a label with color square for each
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background: ${colors[i]}"></i> ${depths[i]}${(depths[i + 1] ? `&ndash;${depths[i + 1]}` : "+")} km<br>`;
    }

    return div;
};

legend.addTo(myMap);