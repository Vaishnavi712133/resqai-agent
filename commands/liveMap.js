import { getLiveDisasters }
from "../utils/nasa.js";

import { generateMap }
from "../utils/mapGenerator.js";

export async function handleLiveMap(
say,
threadTs
){

const events =
await getLiveDisasters();

const file =
generateMap(events);

await say({

text:

`🗺 *LIVE DISASTER MAP GENERATED*

📍 Total Events : ${events.length}

📄 File :

${file}

Open the HTML file in your browser.`,

thread_ts:threadTs

});

}