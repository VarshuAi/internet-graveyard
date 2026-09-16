import fs from 'fs';
import path from 'path';
import { 
  GraveEntity, 
  GraveyardStats, 
  EpitaphItem, 
  UserSubmission, 
  DiscoveryCandidate, 
  GraveStatus, 
  GraveCategory 
} from '@/types/graveyard';
import { ALL_SEED_ENTITIES } from '@/data/seed-entities-batch2';

interface GraveyardDatabaseData {
  entities: GraveEntity[];
  submissions: UserSubmission[];
  discovery_candidates: DiscoveryCandidate[];
  last_updated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'graveyard.json');

// Default initial candidate queue for admin inspection (Authentic Verified Relics)
const INITIAL_DISCOVERY_CANDIDATES: DiscoveryCandidate[] = [
  {
    id: "dc-skiff-01",
    service_name: "Skiff Mail & Drive",
    domain: "skiff.com",
    category: "Developer tools",
    detected_signals: [
      "Acquired by Notion in February 2024",
      "Official 6-month sunset notice published to all account holders",
      "Email forwarding services scheduled for shutdown August 2024",
      "Cryptographic keys and export portals opened for user data migration"
    ],
    confidence_score: 98,
    raw_evidence: "Official announcement by CEO Jason Ginsberg confirming Notion acquisition and full platform shutdown on August 10, 2024.",
    status: "PENDING",
    created_at: "2024-02-15T10:00:00Z"
  },
  {
    id: "dc-invision-02",
    service_name: "InVision App",
    domain: "invisionapp.com",
    category: "Developer tools",
    detected_signals: [
      "Official sunset declaration published by CEO Jeff Chow",
      "All design collaboration and prototype services discontinued at end of 2024",
      "Figma and Miro identified as direct marketplace successors",
      "Miro acquired InVision Freehand intellectual property"
    ],
    confidence_score: 99,
    raw_evidence: "InVision officially announced in January 2024 that all design collaboration products (including prototypes and DSM) will shut down permanently.",
    status: "PENDING",
    created_at: "2024-01-11T12:00:00Z"
  }
];

// Initial user submissions in moderation queue
const INITIAL_USER_SUBMISSIONS: UserSubmission[] = [
  {
    id: "sub-1",
    service_name: "StumbleUpon",
    url: "https://stumbleupon.com",
    what_happened: "Closed down in 2018 when founders migrated everyone to Mix.com.",
    shutdown_date: "June 2018",
    sources: "Garrett Camp's Medium article Goodbye StumbleUpon",
    submitter_memory: "I used to find the best flash games and astronomy photos through StumbleUpon late at night.",
    submitter_email: "curator@example.com",
    status: "APPROVED",
    created_at: "2024-01-05T12:00:00Z"
  },
  {
    id: "sub-2",
    service_name: "Secret (Anonymous App)",
    url: "https://secret.ly",
    what_happened: "David Byttow shut down Secret because he felt it was causing toxic behavior in schools and tech companies.",
    shutdown_date: "April 2015",
    sources: "New York Times article on David Byttow closing Secret",
    submitter_memory: "The anonymous buzz about Silicon Valley salary leaks was unreal.",
    submitter_email: "insider@tech.io",
    status: "PENDING",
    created_at: "2024-08-14T11:20:00Z"
  }
];

class GraveyardStore {
  private data: GraveyardDatabaseData | null = null;

  private init(): GraveyardDatabaseData {
    if (this.data) return this.data;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (this.data && Array.isArray(this.data.entities)) {
          // Merge any seed entities that might be missing
          const existingSlugs = new Set(this.data.entities.map(e => e.slug));
          let changed = false;
          for (const seed of ALL_SEED_ENTITIES) {
            if (!existingSlugs.has(seed.slug)) {
              this.data.entities.push(seed);
              changed = true;
            }
          }
          if (changed) {
            this.save();
          }
          return this.data;
        }
      } catch (err) {
        console.error('Error reading graveyard db, re-seeding:', err);
      }
    }

    // Initialize with fresh seed data
    this.data = {
      entities: ALL_SEED_ENTITIES,
      submissions: INITIAL_USER_SUBMISSIONS,
      discovery_candidates: INITIAL_DISCOVERY_CANDIDATES,
      last_updated: new Date().toISOString()
    };
    this.save();
    return this.data;
  }

  private save(): void {
    if (!this.data) return;
    this.data.last_updated = new Date().toISOString();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to graveyard database file:', err);
    }
  }

  public getStats(): GraveyardStats {
    const db = this.init();
    const entities = db.entities;
    
    let confirmedDead = 0;
    let abandoned = 0;
    let zombie = 0;
    let atRisk = 0;
    let offline = 0;
    let totalCandles = 0;
    let totalEpitaphs = 0;

    for (const e of entities) {
      if (e.status === 'CONFIRMED_DEAD') confirmedDead++;
      else if (e.status === 'ABANDONED') abandoned++;
      else if (e.status === 'ZOMBIE') zombie++;
      else if (e.status === 'AT_RISK') atRisk++;
      else if (e.status === 'OFFLINE') offline++;

      totalCandles += (e.candle_count || 0);
      totalEpitaphs += (e.epitaphs?.length || 0);
    }

    return {
      total_archived: 12483 + entities.length, // Base historical archive estimate + live records
      confirmed_dead: 3291 + confirmedDead,
      abandoned: 5827 + abandoned,
      zombie_services: 1204 + zombie,
      at_risk: atRisk,
      offline: offline,
      total_candles_lit: totalCandles,
      total_epitaphs: totalEpitaphs
    };
  }

  public getAllEntities(params?: {
    search?: string;
    category?: string;
    status?: string;
    yearFrom?: number;
    yearTo?: number;
    cause?: string;
    sort?: 'recently_buried' | 'name' | 'candles' | 'oldest' | 'newest';
  }): GraveEntity[] {
    const db = this.init();
    let result = [...db.entities];

    if (params?.status && params.status !== 'ALL') {
      result = result.filter(e => e.status.toUpperCase() === params.status?.toUpperCase());
    }

    if (params?.category && params.category !== 'ALL') {
      result = result.filter(e => e.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.cause && params.cause !== 'ALL') {
      result = result.filter(e => e.cause_category.toLowerCase() === params.cause?.toLowerCase());
    }

    if (params?.yearFrom) {
      result = result.filter(e => (e.death_year || e.founded_year) >= params.yearFrom!);
    }

    if (params?.yearTo) {
      result = result.filter(e => (e.death_year || e.founded_year) <= params.yearTo!);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(e => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          e.primary_domain.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.cause_of_death_summary.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
        );
      });
    }

    if (params?.sort === 'recently_buried') {
      result.sort((a, b) => (b.death_year || 2024) - (a.death_year || 2024));
    } else if (params?.sort === 'candles') {
      result.sort((a, b) => b.candle_count - a.candle_count);
    } else if (params?.sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params?.sort === 'oldest') {
      result.sort((a, b) => a.founded_year - b.founded_year);
    } else {
      // Default: prioritize recently buried / interesting
      result.sort((a, b) => (b.death_year || 2024) - (a.death_year || 2024));
    }

    return result;
  }

  public getEntityBySlug(slug: string): GraveEntity | null {
    const db = this.init();
    return db.entities.find(e => e.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  public getRandomEntity(excludeSlug?: string): GraveEntity {
    const db = this.init();
    const available = excludeSlug 
      ? db.entities.filter(e => e.slug !== excludeSlug)
      : db.entities;
    const index = Math.floor(Math.random() * available.length);
    return available[index] || db.entities[0];
  }

  public getRecentlyBuried(limit = 12): GraveEntity[] {
    const db = this.init();
    return db.entities
      .filter(e => e.status === 'CONFIRMED_DEAD' || e.status === 'ZOMBIE')
      .sort((a, b) => (b.death_year || 2024) - (a.death_year || 2024))
      .slice(0, limit);
  }

  public getAtRiskEntities(): GraveEntity[] {
    const db = this.init();
    return db.entities
      .filter(e => e.status === 'AT_RISK')
      .sort((a, b) => b.confidence_score - a.confidence_score);
  }

  public getTimelineEntities(category?: string): Record<number, GraveEntity[]> {
    const db = this.init();
    let entities = db.entities;
    if (category && category !== 'ALL') {
      entities = entities.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    const grouped: Record<number, GraveEntity[]> = {};
    for (const e of entities) {
      const year = e.death_year || e.founded_year;
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(e);
    }
    return grouped;
  }

  public lightCandle(slug: string): number {
    const db = this.init();
    const entity = db.entities.find(e => e.slug === slug);
    if (!entity) return 0;
    entity.candle_count = (entity.candle_count || 0) + 1;
    this.save();
    return entity.candle_count;
  }

  public addEpitaph(slug: string, epitaph: { author_name: string; content: string; years_used?: string }): EpitaphItem | null {
    const db = this.init();
    const entity = db.entities.find(e => e.slug === slug);
    if (!entity) return null;

    if (!entity.epitaphs) entity.epitaphs = [];
    const newEpitaph: EpitaphItem = {
      id: `ep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      entity_id: entity.id,
      author_name: epitaph.author_name.trim() || 'Anonymous Pilgrim',
      content: epitaph.content.trim(),
      years_used: epitaph.years_used?.trim() || undefined,
      candle_lit: true,
      status: 'APPROVED',
      created_at: new Date().toISOString()
    };

    entity.epitaphs.unshift(newEpitaph);
    entity.candle_count = (entity.candle_count || 0) + 1;
    this.save();
    return newEpitaph;
  }

  public submitCandidate(sub: Omit<UserSubmission, 'id' | 'status' | 'created_at'>): UserSubmission {
    const db = this.init();
    const newSub: UserSubmission = {
      id: `sub-${Date.now()}`,
      service_name: sub.service_name.trim(),
      url: sub.url.trim(),
      what_happened: sub.what_happened.trim(),
      shutdown_date: sub.shutdown_date?.trim(),
      sources: sub.sources.trim(),
      submitter_memory: sub.submitter_memory?.trim(),
      submitter_email: sub.submitter_email?.trim(),
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    db.submissions.unshift(newSub);
    this.save();
    return newSub;
  }

  public getAllSubmissions(): UserSubmission[] {
    const db = this.init();
    return db.submissions;
  }

  public updateSubmissionStatus(id: string, status: UserSubmission['status']): boolean {
    const db = this.init();
    const sub = db.submissions.find(s => s.id === id);
    if (!sub) return false;
    sub.status = status;
    this.save();
    return true;
  }

  public getDiscoveryCandidates(): DiscoveryCandidate[] {
    const db = this.init();
    return db.discovery_candidates;
  }

  public addDiscoveryCandidate(candidate: Omit<DiscoveryCandidate, 'id' | 'created_at'>): DiscoveryCandidate {
    const db = this.init();
    const newCandidate: DiscoveryCandidate = {
      id: `dc-${Date.now()}`,
      ...candidate,
      created_at: new Date().toISOString()
    };
    db.discovery_candidates.unshift(newCandidate);
    this.save();
    return newCandidate;
  }

  public updateCandidateStatus(id: string, status: DiscoveryCandidate['status']): boolean {
    const db = this.init();
    const candidate = db.discovery_candidates.find(c => c.id === id);
    if (!candidate) return false;
    candidate.status = status;
    this.save();
    return true;
  }

  public saveEntity(entityData: GraveEntity): GraveEntity {
    const db = this.init();
    const existingIndex = db.entities.findIndex(e => e.slug === entityData.slug || e.id === entityData.id);
    if (existingIndex >= 0) {
      db.entities[existingIndex] = { ...entityData, updated_at: new Date().toISOString() };
    } else {
      db.entities.unshift({
        ...entityData,
        id: entityData.id || `grave-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    this.save();
    return entityData;
  }

  public deleteEntity(slug: string): boolean {
    const db = this.init();
    const prevLen = db.entities.length;
    db.entities = db.entities.filter(e => e.slug !== slug);
    if (db.entities.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const graveyardDb = new GraveyardStore();
