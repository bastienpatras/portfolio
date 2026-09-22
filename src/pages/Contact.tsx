import { Mail, Twitter, Github, Linkedin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Contact() {
  // Primary email
  const emailUser = 'bastien.patras';
  const emailDomain = 'sciencespo.fr';
  const email = `${emailUser}@${emailDomain}`;

  // Secondary email
  const emailUser2 = 'bastien.patras';
  const emailDomain2 = 'ens-paris-saclay.fr';
  const email2 = `${emailUser2}@${emailDomain2}`;

  return (
    <PageLayout
      title="Contact"
      description="Get in touch for collaborations, questions, or opportunities"
    >
      <div className="mx-auto max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              For research collaborations, speaking opportunities, or general
              inquiries, please reach out via email.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <a href={`mailto:${email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {email}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${email2}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {email2}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              90 Rue Pelleport<br />
              75020 Paris, France
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social & Professional Networks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <a
                href="https://twitter.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <Twitter className="h-5 w-5" />
                <div>
                  <div className="font-medium">Twitter</div>
                  <div className="text-sm text-muted-foreground">@username</div>
                </div>
              </a>

              <a
                href="https://github.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <Github className="h-5 w-5" />
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">@username</div>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <Linkedin className="h-5 w-5" />
                <div>
                  <div className="font-medium">LinkedIn</div>
                  <div className="text-sm text-muted-foreground">
                    /in/username
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Response time: Usually within 2-3 business days</p>
        </div>
      </div>
    </PageLayout>
  );
}
