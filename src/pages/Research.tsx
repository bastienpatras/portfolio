import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { ArtifactLinks } from '@/components/publications/ArtifactLinks';
import { Link } from 'react-router-dom';
import { projects } from '@/content/projects';
import { publications } from '@/content/publications';

export function Research() {
  return (
    <PageLayout
      title="Research"
    >
      <div className="space-y-12">
        {/* Overview */}
        <section>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            My research focuses on Urban & Real Estate Economics, with a particular emphasis on
            how energy regulation and environmental policies shape housing market dynamics.
            I apply advanced econometric methods, computational economics, and large-scale data
            analysis to understand the complex interactions between environmental legislation,
            real estate markets, and urban development. My work combines rigorous causal inference
            techniques with practical policy applications.
          </p>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Research Projects</h2>
          <div className="space-y-6">
            {projects.map((project) => {
              const projectPublications = project.publicationIds
                ? publications.filter((p) =>
                    project.publicationIds?.includes(p.id)
                  )
                : [];

              return (
                <Card key={project.id} id={project.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag variant="muted">{project.year}</Tag>
                    </div>
                    <CardTitle className="text-2xl">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag} variant="outline">
                          {tag}
                        </Tag>
                      ))}
                    </div>

                    {/* Artifacts */}
                    {project.artifacts.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Resources
                        </h3>
                        <ArtifactLinks artifacts={project.artifacts} />
                      </div>
                    )}

                    {/* Related Publications */}
                    {projectPublications.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Related Publications
                        </h3>
                        <ul className="space-y-2">
                          {projectPublications.map((pub) => (
                            <li key={pub.id}>
                              <Link
                                to={`/publications/${pub.id}`}
                                className="text-sm text-primary hover:underline"
                              >
                                {pub.title} ({pub.year})
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
