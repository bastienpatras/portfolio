export type PublicationStatus = 'published' | 'working-paper' | 'under-review';

export type ArtifactType = 'pdf' | 'doi' | 'code' | 'data' | 'slides' | 'replication' | 'demo';

export interface Artifact {
  type: ArtifactType;
  label?: string;
  url: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  status: PublicationStatus;
  venue?: string;
  abstract: string;
  artifacts: Artifact[];
  tags: string[];
  relatedIds?: string[];
  bibtex: string;
  lastUpdated: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  publicationIds?: string[];
  artifacts: Artifact[];
  year: number;
  lastUpdated: string;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  location?: string;
  slides?: string;
  video?: string;
  tags: string[];
}

export interface SearchFilters {
  query: string;
  years: number[];
  tags: string[];
  status: PublicationStatus[];
  authors: string[];
  artifactTypes: ArtifactType[];
}

export type ContentType = 'publication' | 'project' | 'talk';

export interface SearchableItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  year?: number;
  tags: string[];
  authors?: string[];
  status?: PublicationStatus;
}
