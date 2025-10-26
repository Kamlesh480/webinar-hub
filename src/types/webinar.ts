export interface Webinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  ai_summary: string;
  duration_minutes: number;
  date_published: string;
  topics: string[];
  thumbnail_url: string;
  video_url: string;
  authors: {
    name: string;
    avatar_url: string;
    role?: string;
  }[];
  featured: boolean;
  popularity_score: number;
  is_new: boolean;
  type: "past" | "upcoming" | "all";
  integration_tags: string[];
  what_brings_you_here: string[];
  learning_outcomes?: string[];
}

export interface FilterState {
  search: string;
  topics: string[];
  durations: string[];
  dateRange: string;
  authors: string[];
  integrations: string[];
  categories: string[];
}
