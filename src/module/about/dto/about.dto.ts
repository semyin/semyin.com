export interface ContactMethod {
  type: string;
  label: string;
  value: string;
  icon?: string;
}

export interface BlogJourneyItem {
  date: string;
  title: string;
  description: string;
  milestone?: boolean;
}

export interface UpdateAboutDto {
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  isPublished?: boolean;
  contactMethods?: ContactMethod[];
  blogJourney?: BlogJourneyItem[];
}