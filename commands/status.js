import { getStatus } from "../services/reportService.js";

export function handleStatus(text) {

  const reportId = text.replace("status", "").trim();

  const report = getStatus(reportId);

  if (!report) {
    throw new Error("Report not found.");
  }

  return report;

}