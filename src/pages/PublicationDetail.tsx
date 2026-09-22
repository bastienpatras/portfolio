import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArtifactLinks } from '@/components/publications/ArtifactLinks';
import { BibTeXBlock } from '@/components/publications/BibTeXBlock';
import { publications } from '@/content/publications';
import { formatDate } from '@/lib/utils';
import { ErrorState } from '@/components/ui/ErrorState';

export function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const publication = publications.find((p) => p.id === id);

  if (!publication) {
    return (
      <PageLayout>
        <ErrorState
          title="Publication not found"
          message="The publication you're looking for doesn't exist or has been removed."
        />
        <div className="flex justify-center mt-6">
          <Button asChild>
            <Link to="/publications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Publications
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const relatedPublications = publication.relatedIds
    ? publications.filter((p) => publication.relatedIds?.includes(p.id))
    : [];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/publications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Publications
          </Link>
        </Button>

        <article className="space-y-8">
          {/* Header */}
          <header>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag>{publication.status}</Tag>
              <Tag variant="muted">{publication.year}</Tag>
            </div>
            <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{publication.authors.join(', ')}</span>
              </div>
              {publication.venue && (
                <div className="text-lg font-medium text-foreground">
                  {publication.venue}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {formatDate(publication.lastUpdated)}</span>
              </div>
            </div>
          </header>

          {/* Artifacts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <ArtifactLinks artifacts={publication.artifacts} />
          </div>

          {/* Abstract */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Abstract</h2>
            <p className="text-muted-foreground leading-relaxed">
              {publication.abstract}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {publication.tags.map((tag) => (
                <Tag key={tag} variant="muted">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          {/* BibTeX */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Citation</h2>
            <BibTeXBlock bibtex={publication.bibtex} />
          </div>

          {/* Related Publications */}
          {relatedPublications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Related Work</h2>
              <div className="space-y-4">
                {relatedPublications.map((related) => (
                  <Card key={related.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link
                          to={`/publications/${related.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {related.title}
                        </Link>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {related.authors.join(', ')} • {related.year}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </PageLayout>
  );
}
