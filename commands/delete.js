import { deleteReport } from "../services/reportService.js";

export function handleDelete(text) {

  const parts = text.trim().split(" ");

  if (parts.length !== 2) {
    throw new Error("Please provide a Report ID.");
  }

  return deleteReport(parts[1].toUpperCase());

}