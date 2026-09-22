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

export interface APIDemo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  limitations?: string[];
  endpoints?: APIEndpoint[];
  examples?: CodeExample[];
  securityNotes?: string[];
  rateLimit?: string;
  lastUpdated: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: APIParameter[];
  response?: string;
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
}

export interface CodeExample {
  language: 'curl' | 'javascript' | 'typescript' | 'python';
  code: string;
  description?: string;
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

export type ContentType = 'publication' | 'project' | 'api' | 'talk';

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
