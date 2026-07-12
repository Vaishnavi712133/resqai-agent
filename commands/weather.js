import { detectCycloneRisk } from "../utils/cyclone.js";

export async function handleWeather(
    text,
    say,
    threadTs
){

    let city="Chennai";

    const match=
        text.match(/weather\s+(.+)/i);

    if(match){

        city=match[1];

    }

    const data=
        await detectCycloneRisk(city);

    await say({

text:
`🌤 *LIVE WEATHER*

📍 City : ${data.city}

🌡 Temperature : ${data.temperature}°C

💧 Humidity : ${data.humidity}%

🌬 Wind : ${data.windSpeed} m/s

🌥 Condition : ${data.condition}

🌡 Pressure : ${data.pressure} hPa`,

thread_ts:threadTs

    });

}