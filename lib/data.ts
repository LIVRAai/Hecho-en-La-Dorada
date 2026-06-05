export type LegacyContentRecord = {
  id: string;
  slug: string;
  title: string;
  category?: string;
};

// Demo content was intentionally removed. Public pages read real records from Supabase via lib/public-data.ts.
