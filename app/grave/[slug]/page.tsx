import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { graveyardDb } from '@/lib/db';
import { MemorialClient } from './MemorialClient';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const entity = graveyardDb.getEntityBySlug(params.slug);
  if (!entity) {
    return {
      title: 'Grave Not Found — Internet Graveyard',
      description: 'The requested digital grave does not exist in our historical archives.'
    };
  }

  const title = `${entity.name} (${entity.lifespan}) — Internet Graveyard`;
  const description = `${entity.name} memorial (${entity.lifespan}). Status: ${entity.status.replace(/_/g, ' ')}. Cause: ${entity.cause_of_death_summary.slice(0, 160)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://graveyard.archive/grave/${entity.slug}`,
      images: entity.hero_image_url ? [{ url: entity.hero_image_url }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default function MemorialPage({ params }: PageProps) {
  const entity = graveyardDb.getEntityBySlug(params.slug);

  if (!entity) {
    notFound();
  }

  // Fetch related entities
  const relatedSlugs = entity.related_slugs || [];
  let relatedEntities = relatedSlugs
    .map(slug => graveyardDb.getEntityBySlug(slug))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  if (relatedEntities.length === 0) {
    // Fallback: pick entities in same category
    relatedEntities = graveyardDb.getAllEntities({ category: entity.category })
      .filter(e => e.slug !== entity.slug)
      .slice(0, 3);
  }

  return (
    <>
      {/* Schema.org Structured Data for Digital Archaeology Item */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ArchiveComponent',
            name: entity.name,
            description: entity.description,
            temporalCoverage: entity.lifespan,
            dateCreated: entity.founded_year ? `${entity.founded_year}` : undefined,
            dateDeleted: entity.death_date || undefined,
            url: `https://graveyard.archive/grave/${entity.slug}`,
            provider: {
              '@type': 'Organization',
              name: 'Internet Graveyard Digital Archaeology'
            }
          })
        }}
      />
      <MemorialClient entity={entity} relatedEntities={relatedEntities} />
    </>
  );
}
