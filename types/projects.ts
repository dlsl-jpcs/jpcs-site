export interface Project {
  id: number;
  name: string;
  description: string;
  org: string;
  date: string;
  facebook: string;
  instagram: string;
  image: string;
  /** Up to 4 extra photos shown in the details modal (the cover is not repeated). */
  gallery?: string[];
}
