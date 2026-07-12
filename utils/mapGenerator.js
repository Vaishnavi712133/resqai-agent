import fs from "fs";
import path from "path";

export function generateMap(events) {

const markers = events.map(event => {

if(event.latitude==null || event.longitude==null)
return "";

return `

L.marker([${event.latitude}, ${event.longitude}])

.addTo(map)

.bindPopup(\`
<b>${event.title}</b><br>
${event.disasterType}<br>
${event.location}
\`);

`;

}).join("\n");

const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8"/>

<title>ResQAI Live Map</title>

<link
rel="stylesheet"
href="https://unpkg.com/leaflet/dist/leaflet.css"
/>

<style>

html,
body,
#map{

height:100%;
margin:0;

}

</style>

</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>

const map=L.map("map")
.setView([20.5937,78.9629],3);

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

maxZoom:19

}

).addTo(map);

${markers}

</script>

</body>

</html>

`;

const filePath =
path.join(process.cwd(),"live-map.html");

fs.writeFileSync(filePath,html);

return filePath;

}