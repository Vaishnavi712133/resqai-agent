import { getEarthquakes } from "../utils/usgs.js";

export async function handleEarthquake(
    say,
    threadTs
){

    const earthquakes =
        await getEarthquakes();

    if(earthquakes.length===0){

        await say({

            text:
"✅ No earthquakes reported today.",

            thread_ts:threadTs

        });

        return;

    }

    let message =
"🌍 *LIVE EARTHQUAKES (USGS)*\n\n";

    earthquakes.forEach((e,index)=>{

        message +=
`${index+1}. 🌍 ${e.title}

📏 Magnitude : ${e.magnitude}

📍 ${e.latitude}, ${e.longitude}

🕒 ${e.date}

──────────────

`;

    });

    await say({

        text:message,

        thread_ts:threadTs

    });

}