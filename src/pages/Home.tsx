import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { publications } from '@/content/publications';
import { projects } from '@/content/projects';
import { Suspense, lazy } from 'react';

const Hero3D = lazy(() => import('@/components/3d/Hero3D'));

interface HomeProps {
  onSearchOpen: () => void;
}

export function Home({ onSearchOpen }: HomeProps) {
  const recentPublications = publications
    .sort((a, b) => b.year - a.year)
    .slice(0, 3);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div>
      {/* Hero Section with 3D */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Suspense fallback={<div className="h-[400px] bg-muted/20" />}>
          <Hero3D />
        </Suspense>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Bastien Patras
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              PhD Candidate in Economics at Sciences Po, specializing in Urban & Real Estate Economics.
              Exploring the intersection of energy regulation, environmental policy, and housing market dynamics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/about">
                  View CV <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={onSearchOpen}>
                <Search className="mr-2 h-5 w-5" />
                Search Research
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Working Paper */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Working Paper</h2>
            <Button variant="ghost" asChild>
              <Link to="/publications">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPublications.map((pub) => (
              <Card key={pub.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link
                      to={`/publications/${pub.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {pub.title}
                    </Link>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {pub.venue || pub.status} • {pub.year}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {pub.abstract}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Research Areas</h2>
            <Button variant="ghost" asChild>
              <Link to="/research">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/research">Learn more</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sherlock'Homes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Find the energy performance certificate for any French property.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/dpe-matcher">Try it</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn more about our research background and CV.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/about">Read more</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in collaboration or have questions?
                </p>
                <Button variant="outline" asChild>
                  <Link to="/contact">Contact us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
