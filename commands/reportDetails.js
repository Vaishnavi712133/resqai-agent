import { getReportById } from "../services/reportService.js";

export function handleReportDetails(reportId) {
  const report = getReportById(reportId);

  if (!report) {
    throw new Error("Report not found.");
  }

  return report;
}