import { searchReports } from "../services/reportService.js";

export function handleSearch(text) {

  const parts = text.trim().split(" ");

  if (parts.length < 2) {
    throw new Error("Please provide a disaster type.");
  }

  const disaster = parts.slice(1).join(" ");

  return searchReports(disaster);

}