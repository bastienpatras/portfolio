import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { apis } from '@/content/apis';

export function APIs() {
  return (
    <PageLayout
      title="APIs & Demos"
      description="Interactive demos and API endpoints showcasing our research"
    >
      <div className="space-y-8">
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium">Demo Environment</p>
                <p className="text-sm text-muted-foreground">
                  These APIs are provided for research and demonstration purposes.
                  Please review the limitations and security notes for each API
                  before use. Do not send sensitive or private data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {apis.map((api) => (
            <Card key={api.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">
                  <Link
                    to={`/apis/${api.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {api.title}
                  </Link>
                </CardTitle>
                <CardDescription>{api.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {api.tags.map((tag) => (
                    <Tag key={tag} variant="muted">
                      {tag}
                    </Tag>
                  ))}
                </div>

                {api.limitations && api.limitations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Key Limitations:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {api.limitations.slice(0, 2).map((limitation, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button variant="outline" asChild className="w-full">
                  <Link to={`/apis/${api.id}`}>
                    View Playground & Docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
