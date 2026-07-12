import { getPendingReports } from "../services/reportService.js";

export function handlePending() {

  return getPendingReports();

}