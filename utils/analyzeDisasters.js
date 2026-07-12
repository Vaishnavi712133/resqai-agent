export function analyzeDisasters(events) {

    if (!events.length) {
        return {
            total: 0
        };
    }

    const earthquakes = events
        .filter(e => e.source === "USGS");

    const floods = events
        .filter(e => e.source === "GDACS");

    const cyclones = events
        .filter(e => e.source === "OpenWeather");

    const wildfires = events
        .filter(e => e.disasterType === "Wildfire");

    const strongestEarthquake =
        earthquakes.sort(
            (a,b)=>b.severity-a.severity
        )[0];

    const highestFlood =
        floods.find(
            e=>e.severity==="Red"
        );

    const strongestCyclone =
        cyclones.sort(
            (a,b)=>b.severity-a.severity
        )[0];

    return {

        totalEvents: events.length,

        wildfireCount: wildfires.length,

        strongestEarthquake,

        highestFlood,

        strongestCyclone

    };

}