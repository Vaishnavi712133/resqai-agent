import { getAllReports } from "../services/reportService.js";

export function handleReports() {

  const reports = getAllReports();

  if (reports.length === 0) {
    throw new Error("No reports found.");
  }

  return reports;
}