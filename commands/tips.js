export function handleTips(text) {

  if (text === "tips flood") {

    return `🌊 *FLOOD SAFETY TIPS*

• Move to higher ground.
• Avoid walking through flood water.
• Switch off electricity.
• Keep emergency supplies ready.
• Follow evacuation orders.`;

  }

  if (text === "tips fire") {

    return `🔥 *FIRE SAFETY TIPS*

• Call the fire service immediately.
• Stay low to avoid smoke.
• Use stairs instead of elevators.
• Cover your nose with a cloth.
• Exit the building safely.`;

  }

  if (text === "tips cyclone") {

    return `🌪 *CYCLONE SAFETY TIPS*

• Stay indoors.
• Close all doors and windows.
• Keep emergency kits ready.
• Charge phones and power banks.
• Follow weather updates.`;

  }

  if (text === "tips earthquake") {

    return `🌍 *EARTHQUAKE SAFETY TIPS*

• Drop, Cover and Hold On.
• Stay away from windows.
• Move to an open area after shaking stops.
• Keep an emergency kit ready.
• Follow official instructions.`;

  }

  throw new Error("Available tips: flood, fire, cyclone, earthquake.");
}