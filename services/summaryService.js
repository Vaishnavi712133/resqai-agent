import { getAllReports } from "./reportService.js";

export function getSummary() {

    const reports = getAllReports();

    if (reports.length === 0) {
        throw new Error("No reports found.");
    }

    const total = reports.length;

    const pending = reports.filter(
        r => r.status === "Pending"
    ).length;

    const resolved = reports.filter(
        r => r.status === "Resolved"
    ).length;

    const high = reports.filter(
        r => r.severity.toLowerCase() === "high"
    ).length;

    const disasterCount = {};
    const locationCount = {};

    reports.forEach(report => {

        disasterCount[report.disaster] =
            (disasterCount[report.disaster] || 0) + 1;

        locationCount[report.location] =
            (locationCount[report.location] || 0) + 1;

    });

    const commonDisaster =
        Object.keys(disasterCount).reduce(
            (a, b) =>
                disasterCount[a] > disasterCount[b]
                    ? a
                    : b
        );

    const commonLocation =
        Object.keys(locationCount).reduce(
            (a, b) =>
                locationCount[a] > locationCount[b]
                    ? a
                    : b
        );

    let risk = "LOW";

    if (high >= 5)
        risk = "CRITICAL";
    else if (high >= 3)
        risk = "HIGH";
    else if (high >= 1)
        risk = "MEDIUM";

    return {

        total,

        pending,

        resolved,

        high,

        commonDisaster,

        commonLocation,

        risk

    };

}