import { AgentDeps, runAgent } from "../../agent/index.js";
import { conversationStore } from "../../thread-context/index.js";
import { buildFeedbackBlocks } from "../views/feedback-builder.js";
import { detectCycloneRisk } from "../../utils/cyclone.js";
import { handleReport } from "../../commands/report.js";
import { handleReports } from "../../commands/reports.js";
import { handleReportDetails } from "../../commands/reportDetails.js";
import { handleResolve } from "../../commands/resolve.js";
import { handlePending } from "../../commands/pending.js";
import { handleResolvedReports } from "../../commands/resolved.js";
import { handleDelete } from "../../commands/delete.js";
import { handleSearch } from "../../commands/search.js";
import { handleLocation } from "../../commands/location.js";
import { handleStats } from "../../commands/stats.js";
import { handleDashboard } from "../../commands/dashboard.js";
import { handleHelp } from "../../commands/help.js";
import { handleEmergency } from "../../commands/emergency.js";
import { handleTips } from "../../commands/tips.js";
import { handleRecent } from "../../commands/recent.js";
import { handleStatus } from "../../commands/status.js";
import { handleHistory } from "../../commands/history.js";
import { generateEmergencyPlan } from "../../utils/emergencyPlanner.js";
import { handleSummary } from "../../commands/summary.js";
import { handleLive } from "../../commands/live.js";
import { handleEarthquake } from "../../commands/earthquake.js";
import { handleWeather } from "../../commands/weather.js";
import { handleGDACS } from "../../commands/gdacs.js";
import { handleLiveMap } from "../../commands/liveMap.js";

function isGenericMessageEvent(event) {
  return !("subtype" in event && event.subtype !== undefined);
}

export async function handleMessage({
  client,
  context,
  event,
  logger,
  say,
  sayStream,
  setStatus,
}) {
  if (!isGenericMessageEvent(event)) return;
  if (event.bot_id) return;

  const isDm = event.channel_type === "im";
  const isThreadReply = !!event.thread_ts;

  if (!isDm && !isThreadReply) return;

  try {
    const channelId = event.channel;
    const text = event.text || "";
    const threadTs = event.thread_ts || event.ts;
    const userId = context.userId;
    const lowerText = text.trim().toLowerCase();

    const history = conversationStore.getHistory(channelId, threadTs);

    await setStatus({
      status: "Analyzing...",
      loading_messages: [
        "Checking disaster signals...",
        "Fetching live information...",
        "Preparing response...",
      ],
    });

    // ======================================
    // 1. REPORT DETAILS
    // report RPT1002
    // ======================================

    const reportMatch = text.trim().match(/^report\s+(RPT\d+)$/i);
    if (reportMatch) {
      try {
        const report = handleReportDetails(reportMatch[1].toUpperCase());
        await say({
          text:
`📄 *INCIDENT DETAILS*

🆔 *Report ID:* ${report.reportId}

🌊 *Disaster:* ${report.disaster}

📍 *Location:* ${report.location}

⚠ *Severity:* ${report.severity}

📝 *Description:* ${report.description}

📌 *Status:* ${report.status}

🕒 *Reported At:* ${report.createdAt}`,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 2. VIEW ALL REPORTS
    // reports
    // ======================================

    if (lowerText === "reports") {
      try {
        const reports = handleReports();
        if (reports.length === 0) {
          await say({
            text: "📋 *No reports found*\n\nNo incident reports have been submitted yet.",
            thread_ts: threadTs,
          });
          return;
        }
        let message = "📋 *INCIDENT REPORTS*\n\n";
        reports.forEach((report, index) => {
          message +=
`${index + 1}. 🆔 ${report.reportId}

🌊 Disaster: ${report.disaster}

📍 Location: ${report.location}

⚠ Severity: ${report.severity}

📌 Status: ${report.status}

────────────────────

`;
        });
        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 3. VIEW PENDING REPORTS
    // pending
    // ======================================

    if (lowerText === "pending") {
      try {
        const reports = handlePending();
        if (reports.length === 0) {
          await say({
            text: "✅ No pending reports.",
            thread_ts: threadTs,
          });
          return;
        }
        let message = "📋 *PENDING REPORTS*\n\n";
        reports.forEach((report, index) => {
          message +=
`${index + 1}. 🆔 ${report.reportId}

🌊 ${report.disaster}

📍 ${report.location}

⚠ ${report.severity}

──────────────

`;
        });
        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 4. VIEW RESOLVED REPORTS
    // resolved
    // ======================================

    if (lowerText === "resolved") {
      try {
        const reports = handleResolvedReports();
        if (reports.length === 0) {
          await say({
            text: "✅ No resolved reports found.",
            thread_ts: threadTs,
          });
          return;
        }
        let message = "✅ *RESOLVED REPORTS*\n\n";
        reports.forEach((report, index) => {
          message +=
`${index + 1}. 🆔 ${report.reportId}

🌊 Disaster: ${report.disaster}

📍 Location: ${report.location}

⚠ Severity: ${report.severity}

📌 Status: ${report.status}

────────────────────

`;
        });
        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 5. RESOLVE REPORT
    // resolve RPT1002
    // ======================================

    const resolveMatch = text.trim().match(/^resolve\s+(RPT\d+)$/i);
    if (resolveMatch) {
      try {
        const report = handleResolve(text);
        await say({
          text:
`✅ *Report Updated Successfully*

🆔 *Report ID:* ${report.reportId}

📌 *Status:* ${report.status}`,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 6. DELETE REPORT
    // delete RPT1002
    // ======================================

    const deleteMatch = text.trim().match(/^delete\s+(RPT\d+)$/i);
    if (deleteMatch) {
      try {
        const report = handleDelete(text);
        await say({
          text:
`🗑️ *Report Deleted Successfully*

🆔 *Report ID:* ${report.reportId}

🌊 *Disaster:* ${report.disaster}

📍 *Location:* ${report.location}`,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 7. SEARCH REPORTS BY DISASTER
    // search flood
    // ======================================

    if (lowerText.startsWith("search ")) {
      try {
        const reports = handleSearch(text);
        if (reports.length === 0) {
          await say({
            text: "❌ No matching reports found.",
            thread_ts: threadTs,
          });
          return;
        }
        let message = `🔍 *${reports[0].disaster.toUpperCase()} REPORTS*\n\n`;
        reports.forEach((report, index) => {
          message +=
`${index + 1}. 🆔 ${report.reportId}

📍 ${report.location}

⚠ ${report.severity}

📌 ${report.status}

────────────────────

`;
        });
        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 8. SEARCH BY LOCATION
    // location Chennai
    // ======================================

    if (lowerText.startsWith("location ")) {
      try {
        const reports = handleLocation(text);
        if (reports.length === 0) {
          await say({
            text: "❌ No reports found for this location.",
            thread_ts: threadTs,
          });
          return;
        }
        let message = `📍 *REPORTS IN ${reports[0].location.toUpperCase()}*\n\n`;
        reports.forEach((report, index) => {
          message +=
`${index + 1}. 🆔 ${report.reportId}

🌊 ${report.disaster}

⚠ ${report.severity}

📌 ${report.status}

────────────────────

`;
        });
        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 9. REPORT STATISTICS
    // stats
    // ======================================

    if (lowerText === "stats") {
      try {
        const stats = handleStats();
        await say({
          text:
`📊 *REPORT STATISTICS*

📋 Total Reports : ${stats.total}

🟡 Pending : ${stats.pending}

🟢 Resolved : ${stats.resolved}

🌊 Flood : ${stats.flood}

🔥 Fire : ${stats.fire}

🌪 Cyclone : ${stats.cyclone}`,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 10. DASHBOARD
    // dashboard
    // ======================================

    if (lowerText === "dashboard") {
      try {
        const data = handleDashboard();
        await say({
          text:
`📊 *RESQAI DASHBOARD*

📋 Total Reports : ${data.total}

🟡 Pending : ${data.pending}

🟢 Resolved : ${data.resolved}

🔥 Most Common Disaster : ${data.commonDisaster}

📍 Most Affected Location : ${data.commonLocation}

🆔 Latest Report : ${data.latest}`,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

   // ======================================
// 11. CREATE REPORT
// report
// Disaster:
// Location:
// Severity:
// Description:
// ======================================

if (
  lowerText === "report" ||
  lowerText.startsWith("report\n")
) {
  try {

    console.log("Received Message:");
    console.log(text);

    const report = handleReport(text);

    // Generate emergency plan
    const plan = generateEmergencyPlan(
      report.disaster,
      report.severity
    );

    await say({
      text:
`✅ *Incident Report Submitted Successfully*

🆔 *Report ID:* ${report.reportId}

🌊 *Disaster:* ${report.disaster}

📍 *Location:* ${report.location}

⚠ *Severity:* ${report.severity}

📝 *Description:* ${report.description}

📌 *Status:* ${report.status}

📊 *Risk Score:* ${report.riskScore}/100

🚨 *Risk Level:* ${report.riskLevel}

🛡 *Recommended Action:* ${report.recommendedAction}

🚑 *Emergency Response Plan*

${plan}

🕒 *Reported At:* ${report.createdAt}

Thank you for reporting.
Emergency teams will be notified.`,
      thread_ts: threadTs,
    });

    // ======================================
    // HIGH SEVERITY ALERT
    // ======================================

    if (
      report.severity &&
      report.severity.toLowerCase() === "high"
    ) {

      await say({
        text:
`🚨 *HIGH SEVERITY ALERT*

🆔 *Report ID:* ${report.reportId}

🌊 *Disaster:* ${report.disaster}

📍 *Location:* ${report.location}

⚠ *Severity:* ${report.severity}

🚑 Emergency teams have been notified.

Please take immediate safety precautions.`,
        thread_ts: threadTs,
      });

    }

    return;

  } catch (error) {

    await say({
      text:
`❌ ${error.message}

Example Format:

report

Disaster: Flood

Location: Coimbatore

Severity: High

Description: Water entered houses`,
      thread_ts: threadTs,
    });

    return;

  }
}

    // ======================================
    // 12. CYCLONE ALERT
    // cyclone in Chennai
    // ======================================

    if (
      lowerText.startsWith("cyclone") ||
      lowerText.startsWith("cyclone alert")
    ) {
      let city = "Chennai";
      const match = text.match(/in\s+([a-zA-Z\s]+)/i);
      if (match) {
        city = match[1].trim();
      }
      console.log("City:", city);

      try {
        const data = await detectCycloneRisk(city);
        await say({
          text: `🌪️ *LIVE Cyclone Risk Report*

📍 *Location:* ${data.city}

🌡 *Temperature:* ${data.temperature} °C

💧 *Humidity:* ${data.humidity} %

🌬 *Wind Speed:* ${data.windSpeed} m/s

🌡 *Pressure:* ${data.pressure} hPa

☁ *Weather:* ${data.condition}

⚠ *Risk Level:* ${data.risk}

🛡 *Safety Actions*

• Stay indoors
• Avoid unnecessary travel
• Keep emergency kit ready
• Charge phones and power banks
• Follow IMD official updates

Stay Safe 🚨`,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `⚠️ Unable to fetch cyclone data.

Reason:
${error.message}

Please check the city name or follow official weather alerts.`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 13. HELP
    // help
    // ======================================

    if (lowerText === "help") {
      const message = handleHelp();
      await say({
        text: message,
        thread_ts: threadTs,
      });
      return;
    }

    // ======================================
    // 14. EMERGENCY CONTACTS
    // emergency
    // ======================================

    if (lowerText === "emergency") {
      await say({
        text: handleEmergency(),
        thread_ts: threadTs,
      });
      return;
    }

    // ======================================
    // 15. SAFETY TIPS
    // tips flood
    // ======================================

    if (lowerText.startsWith("tips")) {
      try {
        const message = handleTips(lowerText);
        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }

    // ======================================
    // 16. RECENT REPORTS
    // recent
    // ======================================

    if (lowerText === "recent") {
      const reports = handleRecent();
      let message = "🆕 *RECENT REPORTS*\n\n";
      reports.forEach((report, index) => {
        message +=
`${index + 1}. 🆔 ${report.reportId}

🌊 ${report.disaster}

📍 ${report.location}

────────────────────

`;
      });
      await say({
        text: message,
        thread_ts: threadTs,
      });
      return;
    }

    // ======================================
    // 17. REPORT STATUS
    // status RPT1001
    // ======================================

    if (lowerText.startsWith("status ")) {
      try {
        const report = handleStatus(text);
        let message =
`📄 *REPORT STATUS*

🆔 Report ID: ${report.reportId}

📌 Status: ${report.status}

🕒 Created At:
${report.createdAt}`;

        if (report.status === "Resolved") {
          message += `

✅ Resolved At:
${report.resolvedAt}`;
        }

        await say({
          text: message,
          thread_ts: threadTs,
        });
        return;
      } catch (error) {
        await say({
          text: `❌ ${error.message}`,
          thread_ts: threadTs,
        });
        return;
      }
    }
    // ======================================
// 18. INCIDENT HISTORY
// history RPT1001
// ======================================

if (lowerText.startsWith("history ")) {

  try {

    await handleHistory(
      text,
      say,
      threadTs
    );

    return;

  } catch (error) {

    await say({
      text: `❌ ${error.message}`,
      thread_ts: threadTs,
    });

    return;

  }

}
// ======================================
// AI SITUATION SUMMARY
// summary
// ======================================

if (lowerText === "summary") {

    try {

        await handleSummary(
            say,
            threadTs
        );

        return;

    } catch (error) {

        await say({

            text: `❌ ${error.message}`,

            thread_ts: threadTs

        });

        return;

    }

}
// ======================================
// LIVE NASA
// live nasa
// ======================================

if (lowerText === "live nasa") {

    await handleLive(
        say,
        threadTs
    );

    return;
    
}
if(lowerText==="live earthquake"){

    await handleEarthquake(
        say,
        threadTs
    );

    return;

}
if(lowerText.startsWith("weather ")){

    await handleWeather(
        text,
        say,
        threadTs
    );

    return;

}
if(lowerText==="live gdacs"){

    await handleGDACS(
        say,
        threadTs
    );

    return;

}
if (lowerText === "live map") {

    await handleLiveMap(
        say,
        threadTs
    );

    return;
}
    // ======================================
    // 18. AI AGENT
    // Everything else
    // ======================================

    const inputItems = history
      ? [...history, { role: "user", content: text }]
      : text;

    const deps = new AgentDeps(
      client,
      userId,
      channelId,
      threadTs,
      event.ts,
      context.userToken
    );

    const result = await runAgent(inputItems, deps);

    const streamer = sayStream();

    await streamer.append({
      markdown_text: result.finalOutput,
    });

    const feedbackBlocks = buildFeedbackBlocks();

    await streamer.stop({
      blocks: feedbackBlocks,
    });

    conversationStore.setHistory(channelId, threadTs, result.history);

  } catch (err) {
    logger.error(`handleMessage error: ${err}`);

    await say({
      text: `⚠️ Something went wrong!\n${err.message}`,
      thread_ts: event.thread_ts || event.ts,
    });
  }

}
