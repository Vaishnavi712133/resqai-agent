const url =
"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export async function getEarthquakes(){

    const response =
    await fetch(url);

    const data =
    await response.json();

    return data.features
    .slice(0,5)
    .map(item=>({

        source:"USGS",

        type:"Earthquake",

        title:item.properties.place,

        magnitude:item.properties.mag,

        latitude:item.geometry.coordinates[1],

        longitude:item.geometry.coordinates[0],

        date:new Date(item.properties.time)
        .toLocaleString()

    }));

}