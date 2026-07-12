import { getLiveDisasters } from "./nasa.js";
import { getEarthquakes } from "./usgs.js";
import { getCycloneData } from "./weather.js";
import { getFloodAlerts } from "./gdacs.js";

export async function getAllLiveEvents(city = "Chennai") {

    const events = [];

    try {

        const nasa = await getLiveDisasters();

        nasa.forEach(event => {

            events.push({

                source: "NASA",

                type: "Disaster",

                title: event.title,

                location: event.location,

                latitude: event.latitude,

                longitude: event.longitude,

                date: event.date

            });

        });

    } catch {}

    try {

        const earthquakes =
            await getEarthquakes();

        events.push(...earthquakes);

    } catch {}

    try {

        const cyclone =
            await getCycloneData(city);

        events.push(cyclone);

    } catch {}

    try {

        const floods =
            await getFloodAlerts();

        events.push(...floods);

    } catch {}

    return events;

}