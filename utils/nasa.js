const url = "https://eonet.gsfc.nasa.gov/api/v3/events";

export async function getLiveDisasters() {

    const response = await fetch(url);

    const data = await response.json();

    return data.events.map(event => ({

        id: event.id,

        title: event.title,

        disasterType: event.categories[0]?.title || "Unknown",

        location: event.title,

        latitude: event.geometry[0]?.coordinates[1],

        longitude: event.geometry[0]?.coordinates[0],

        date: event.geometry[0]?.date,

        source: "NASA"

    }));

}