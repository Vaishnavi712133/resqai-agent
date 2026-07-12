/**
 * Add an emoji reaction to a Slack message.
 *
 * @param {import("@slack/web-api").WebClient} client
 * @param {string} channelId
 * @param {string} messageTs
 * @param {string} emoji
 * @returns {Promise<void>}
 */
export async function addEmojiReaction(
  client,
  channelId,
  messageTs,
  emoji = "wave"
) {
  try {
    await client.reactions.add({
      channel: channelId,
      timestamp: messageTs,
      name: emoji,
    });

    console.log(`Added :${emoji}: reaction`);
  } catch (error) {
    console.error("Failed to add emoji reaction:", error.message);
  }
}