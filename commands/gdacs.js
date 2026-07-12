import { getFloodAlerts } from "../utils/gdacs.js";

export async function handleGDACS(
    say,
    threadTs
){

    const alerts = await getFloodAlerts();

    if (alerts.length === 0) {

        await say({

            text: "❌ No GDACS alerts available.",

            thread_ts: threadTs

        });

        return;

    }

    let message = "🌍 *LIVE GDACS ALERTS*\n\n";

    alerts.forEach((alert, index) => {

        message +=
`${index + 1}. 🚨 ${alert.title}

📅 ${alert.date}

🔗 ${alert.link}

────────────────────

`;

    });

    message += "Source: GDACS";

    await say({

        text: message,

        thread_ts: threadTs

    });

}