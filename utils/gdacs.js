const GDACS_URL =
"https://www.gdacs.org/xml/rss.xml";

export async function getFloodAlerts() {

    try {

        const response = await fetch(GDACS_URL);

        const xml = await response.text();

        const alerts = [];

        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

        items.slice(0, 5).forEach(item => {

            const title =
                item.match(/<title>(.*?)<\/title>/)?.[1] || "Unknown";

            const link =
                item.match(/<link>(.*?)<\/link>/)?.[1] || "";

            const pubDate =
                item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

            alerts.push({

                source: "GDACS",

                title,

                date: pubDate,

                link

            });

        });

        return alerts;

    } catch (error) {

        console.error("GDACS Error:", error.message);

        return [];

    }

}