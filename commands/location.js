import { searchByLocation } from "../services/reportService.js";

export function handleLocation(text) {

  const parts = text.trim().split(" ");

  if (parts.length < 2) {
    throw new Error("Please provide a location.");
  }

  const location = parts.slice(1).join(" ");

  return searchByLocation(location);

}