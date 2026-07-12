import { createReport } from "../services/reportService.js";

export function handleReport(text) {

  const disaster = text.match(/Disaster:\s*(.+)/i)?.[1]?.trim();
  const location = text.match(/Location:\s*(.+)/i)?.[1]?.trim();
  const severity = text.match(/Severity:\s*(.+)/i)?.[1]?.trim();
  const description = text.match(/Description:\s*(.+)/i)?.[1]?.trim();

  if (!disaster || !location || !severity || !description) {
    throw new Error(
      "Please provide Disaster, Location, Severity and Description."
    );
  }

  return createReport(
    disaster,
    location,
    severity,
    description
  );
}