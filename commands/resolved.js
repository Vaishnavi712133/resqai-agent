import { getResolvedReports } from "../services/reportService.js";

export function handleResolvedReports() {
  const reports = getResolvedReports();

  if (reports.length === 0) {
    throw new Error("No resolved reports found.");
  }

  return reports;
}