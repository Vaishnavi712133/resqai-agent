export function generateEmergencyPlan(disaster, severity) {

    disaster = disaster.toLowerCase();
    severity = severity.toLowerCase();

    if (disaster === "flood") {

        return `1. Move to higher ground.
2. Switch off electricity.
3. Avoid flooded roads.
4. Contact rescue teams.
5. Stay updated through official alerts.`;

    }

    if (disaster === "fire") {

        return `1. Evacuate immediately.
2. Call Fire Department.
3. Avoid elevators.
4. Stay low to avoid smoke.
5. Assemble at the safe zone.`;

    }

    if (disaster === "cyclone") {

        return `1. Stay indoors.
2. Secure doors and windows.
3. Keep emergency supplies ready.
4. Charge mobile devices.
5. Follow official warnings.`;

    }

    if (disaster === "earthquake") {

        return `1. Drop, Cover and Hold.
2. Stay away from glass.
3. Move to an open area after shaking stops.
4. Avoid damaged buildings.
5. Wait for official instructions.`;

    }

    return `Follow instructions from local emergency authorities.`;

}