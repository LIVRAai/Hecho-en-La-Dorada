export type LegacyContentRecord = {
  id: string;
  slug: string;
  title: string;
  category?: string;
};

// Public content is loaded from Supabase via lib/public-data.ts; this file only keeps legacy shared types.
