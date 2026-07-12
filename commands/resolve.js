import { resolveReport } from "../services/reportService.js";

export function handleResolve(text) {

  const parts = text.trim().split(" ");

  if (parts.length !== 2) {
    throw new Error("Please provide a Report ID.");
  }

  return resolveReport(parts[1].toUpperCase());

}