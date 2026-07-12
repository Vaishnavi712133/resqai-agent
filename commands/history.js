import { getReportHistory } from "../services/reportService.js";


export async function handleHistory(
    text,
    say,
    threadTs
){

    const reportId =
        text.trim().split(" ")[1];


    if(!reportId){

        await say({

            text:
`❌ Please provide report ID.

Example:
history RPT1001`,

            thread_ts: threadTs

        });

        return;

    }



    const history =
        getReportHistory(
            reportId.toUpperCase()
        );



    await say({

        text:
`📜 *INCIDENT HISTORY*


🆔 *Report ID:*
${history.reportId}


🌊 *Disaster:*
${history.disaster}


📍 *Location:*
${history.location}


🟢 *Created:*
${history.createdAt}


🔴 *Resolved:*
${history.resolvedAt || "Not Resolved Yet"}


📌 *Current Status:*
${history.status}`,

        thread_ts: threadTs

    });

}