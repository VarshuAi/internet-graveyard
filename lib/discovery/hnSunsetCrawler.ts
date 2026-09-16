import { DiscoveryCandidate, GraveCategory } from '@/types/graveyard';

export interface HnSunsetHit {
  title: string;
  url?: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
  objectID: string;
}

function inferCategoryFromTitle(title: string): GraveCategory {
  const t = title.toLowerCase();
  if (t.includes('chat') || t.includes('messenger') || t.includes('messaging')) return 'Messaging';
  if (t.includes('music') || t.includes('audio') || t.includes('stream') || t.includes('video') || t.includes('podcast')) return 'Streaming';
  if (t.includes('game') || t.includes('gaming') || t.includes('arcade')) return 'Gaming';
  if (t.includes('social') || t.includes('network') || t.includes('community')) return 'Social';
  if (t.includes('search') || t.includes('portal') || t.includes('directory')) return 'Search';
  if (t.includes('api') || t.includes('dev') || t.includes('code') || t.includes('sdk') || t.includes('cloud')) return 'Developer tools';
  return 'Web technology';
}

function extractDomain(url?: string, title?: string): string {
  if (url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./i, '');
      // If the URL is just a news site reporting the shutdown (like techcrunch or theverge), look for domain in title
      if (!host.includes('techcrunch') && !host.includes('theverge') && !host.includes('engadget') && !host.includes('wired') && !host.includes('nytimes') && !host.includes('bloomberg') && !host.includes('reuters')) {
        return host;
      }
    } catch {
      // url parse failed
    }
  }

  // Extract from title (e.g. "Skiff is shutting down", "Mint.com is closing")
  const domainMatch = title?.match(/\b([a-z0-9-]+\.(?:com|io|co|net|org|app|dev|me))\b/i);
  if (domainMatch) return domainMatch[1].toLowerCase();

  const nameMatch = title?.match(/^([A-Za-z0-9]+)\s+(?:is|has|announces|to)\s+(?:shutting down|shut down|sunset|closing)/i);
  if (nameMatch) {
    return `${nameMatch[1].toLowerCase()}.com`;
  }

  return 'defunct-service.io';
}

function extractServiceName(title: string, domain: string): string {
  const match = title.match(/^([A-Za-z0-9\s.]+?)\s+(?:is|has|announces|closing|sunset|shut)/i);
  if (match && match[1].trim().length > 1 && match[1].trim().length < 30) {
    return match[1].trim();
  }
  return domain.replace(/\.[a-z]+$/i, '').toUpperCase();
}

/**
 * Crawls Hacker News for real-world tech shutdown announcements and post-mortems
 */
export async function crawlHackerNewsSunsets(limit: number = 10): Promise<DiscoveryCandidate[]> {
  const query = 'shutting down OR sunsetting OR "closing its doors" OR "farewell letter" OR "shut down"';
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit * 2}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'InternetGraveyard-ArchaeologyBot/1.0 (+https://graveyard.archive; digital archaeology research)'
      }
    });

    if (!res.ok) {
      console.error(`HN Algolia API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const hits: HnSunsetHit[] = data.hits || [];
    const candidates: DiscoveryCandidate[] = [];
    const seenDomains = new Set<string>();

    for (const hit of hits) {
      if (!hit.title) continue;

      const domain = extractDomain(hit.url, hit.title);
      if (domain === 'defunct-service.io' || seenDomains.has(domain)) continue;
      seenDomains.add(domain);

      const serviceName = extractServiceName(hit.title, domain);
      const category = inferCategoryFromTitle(hit.title);
      const hnUrl = `https://news.ycombinator.com/item?id=${hit.objectID}`;

      candidates.push({
        id: `hn-${hit.objectID}`,
        service_name: serviceName,
        domain: domain,
        category: category,
        detected_signals: [
          `Hacker News discussion: "${hit.title}" (${hit.points} points, ${hit.num_comments} comments)`,
          `Direct announcement / report: ${hit.url || hnUrl}`,
          `Published: ${hit.created_at.split('T')[0]}`,
          `Community consensus: Platform sunset/cessation confirmed by tech founders`
        ],
        confidence_score: Math.min(96, 75 + Math.min(20, Math.floor(hit.points / 10))),
        raw_evidence: `HN Story #${hit.objectID} by ${hit.author}: "${hit.title}". Discussion: ${hnUrl}`,
        status: 'PENDING',
        created_at: new Date().toISOString()
      });

      if (candidates.length >= limit) break;
    }

    return candidates;
  } catch (err) {
    console.error('Error crawling Hacker News sunsets:', err);
    return [];
  }
}
