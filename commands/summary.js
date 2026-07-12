import { getSummary } from "../services/summaryService.js";

export async function handleSummary(
    say,
    threadTs
) {

    const data = getSummary();

    await say({

        text:
`🤖 *AI SITUATION SUMMARY*

📊 Total Incidents : ${data.total}

🟡 Pending : ${data.pending}

🟢 Resolved : ${data.resolved}

🚨 High Severity : ${data.high}

🌊 Most Common Disaster :
${data.commonDisaster}

📍 Most Affected Location :
${data.commonLocation}

⚠ Overall Risk :
${data.risk}

🚑 Recommended Actions

• Deploy rescue teams

• Prepare emergency shelters

• Notify local authorities

• Monitor affected areas continuously

Stay Alert 🚨`,

        thread_ts: threadTs

    });

}