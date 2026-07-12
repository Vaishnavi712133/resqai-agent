import { getLiveDisasters }
from "../utils/nasa.js";

export async function handleLive(
    say,
    threadTs
){

    const events =
    await getLiveDisasters();

    if(events.length===0){

        await say({

            text:
"✅ No active disasters reported.",

            thread_ts:threadTs

        });

        return;

    }

    let message =
"🌍 *LIVE DISASTER EVENTS*\n\n";

    events
    .slice(0,5)
    .forEach((event,index)=>{

        message +=
`${index+1}. 🌋 *${event.title}*

🆔 ID : ${event.id}

📅 ${event.geometry[0].date}

------------------------

`;

    });

    message +=
"Source : NASA EONET";

    await say({

        text:message,

        thread_ts:threadTs

    });

}