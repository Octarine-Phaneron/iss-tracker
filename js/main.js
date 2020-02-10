// Making map & tiles
const mymap = L.map('issMap', {
    minZoom: 2,
    maxBounds: [
        [-85, -350],
        [85, 350]
    ]
}).setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {
    attribution
});
tiles.addTo(mymap);
//night layer
const t = L.terminator();
t.addTo(mymap);

// Making marker with custom icon
const issIcon = L.icon({
    iconUrl: 'img/iss.svg',
    iconSize: [100, 100],
    iconAnchor: [50, 50]
});

const marker = L.marker([0, 0], {
    icon: issIcon
});

//initialize the circle object
const gc = new L.greatCircle(marker.getLatLng(), {
    radius: 2222000 // => 2222 km
});

let firstTime = true;
// Get ISS location
const issUrl = 'https://api.wheretheiss.at/v1/satellites/25544';

// Loop Function
async function getIss() {
    const response = await fetch(issUrl);
    const data = await response.json();
    //console.log(data);
    const {
        latitude,
        longitude
    } = data;

    if (firstTime) {
        mymap.setView([latitude, longitude], 3);
        firstTime = false;
        marker.addTo(mymap);
        gc.addTo(mymap); //add to map
        gc.bindTo(marker); //bind to marker
    }

    marker.setLatLng([latitude, longitude]);
    gc.setLatLng([latitude, longitude]);

    // update night zone
    t.setLatLngs(L.terminator().getLatLngs());
    t.redraw();

    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('long').textContent = longitude.toFixed(2);
}
getIss();
setInterval(getIss, 2500);

let myLng, myLat, myMarker;
document.getElementById("locateBtn").onclick = () => {
    if ('geolocation' in navigator) {
        console.log("Géolocalisation disponible");
        // Default browser function, callback f as param
        navigator.geolocation.getCurrentPosition(position => {
            if (myMarker === undefined) {
                myMarker = L.marker([position.coords.latitude, position.coords.longitude]);
                myMarker.addTo(mymap);
            } else {
                myMarker.setLatLng([position.coords.latitude, position.coords.longitude]);
            }
        });
    } else {
        console.log("Géolocalisation non disponible");
    }
}