import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { ArtifactLinks } from './ArtifactLinks';
import type { Publication } from '@/types';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const statusColors: Record<Publication['status'], 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    'working-paper': 'secondary',
    'under-review': 'outline',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          <Tag variant={statusColors[publication.status]}>
            {publication.status}
          </Tag>
          <Tag variant="muted">{publication.year}</Tag>
        </div>
        <CardTitle className="text-xl">
          <Link
            to={`/publications/${publication.id}`}
            className="hover:text-primary transition-colors"
          >
            {publication.title}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {publication.authors.join(', ')}
        </div>
        {publication.venue && (
          <div className="text-sm font-medium text-foreground">
            {publication.venue}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {publication.abstract}
        </p>

        <ArtifactLinks artifacts={publication.artifacts} size="sm" />

        <div className="flex flex-wrap gap-1 mt-4">
          {publication.tags.map((tag) => (
            <Tag key={tag} variant="muted" className="text-xs">
              {tag}
            </Tag>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
