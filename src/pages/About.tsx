import { Download, Calendar, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { talks } from '@/content/talks';

export function About() {
  return (
    <PageLayout title="About">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Bio */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Bio</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-4">
              I am a PhD candidate in Economics at Sciences Po, specializing in Urban & Real Estate Economics.
              My research focuses on energy regulation and housing market dynamics, examining how environmental
              policies impact real estate markets and urban development patterns.
            </p>
            <p className="mb-4">
              Currently working as a Quantitative Economist at AVIV Group, I apply advanced econometric methods
              and data analytics to understand the effects of energy and climate legislation on housing markets.
              My work bridges economic theory with practical applications, combining computational economics,
              causal inference, and large-scale data analysis.
            </p>
            <p>
              My background spans economics, econometrics, and data science, with expertise in Python, R, and
              modern statistical methods. I am passionate about using rigorous empirical methods to inform
              policy decisions and understand complex economic phenomena.
            </p>
          </div>
        </section>

        {/* CV Download */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Vitae</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Download my full CV for detailed information about my research,
                publications, and academic background.
              </p>
              <Button asChild>
                <a href="/cv.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download CV (PDF)
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Talks & Teaching */}
        <section id="talks">
          <h2 className="mb-6 text-2xl font-bold">Talks & Teaching</h2>
          <div className="space-y-4">
            {talks.map((talk) => (
              <Card key={talk.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{talk.title}</CardTitle>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(talk.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div>{talk.event}</div>
                    {talk.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {talk.location}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {talk.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={talk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Conference website
                        </a>
                      </Button>
                    )}
                    {talk.slides && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={talk.slides}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Slides
                        </a>
                      </Button>
                    )}
                    {talk.video && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={talk.video}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Video
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quantitative Research Projects */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Quantitative Research Projects</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quantitative Research Assistant — CRIS</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Sciences Po PARIS | Mar. 2023 – May 2023
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Guide:</strong> Dr. Angela Greulich, CRIS
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Survival analysis: quantifying the factors influencing tenure in France</li>
                  <li>R programming: Cox regression analysis & web scraping using Python (selenium, bs4)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantitative Research Assistant — EQUIPRICE</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Sciences Po - NYU | Jan. 2021 – July 2021
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Guide:</strong> Dr. Alfred Galichon (Harvard PhD)
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Python replication code of BLP 1995, 1999 and 2004 & MPEC formulation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Education</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>PhD in Economics</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Sciences Po School of Research | Sept. 2020 – Present
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Specialization:</strong> Urban & Real Estate Economics
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Dissertation:</strong> "Energy Regulation and Housing Market Dynamics"
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Supervisors:</strong> Pierre-Philippe Combes, Franz Ostrizek
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Master in Economics</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Sciences Po School of Research | Sept. 2020 – May 2023
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Focus:</strong> Computational & Urban Economics
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>GPA:</strong> 15/20
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Master Thesis:</strong> "Investigating the Impact of Owner Capture on Media Narrative:
                  A Large-Scale Empirical Study" (Supervised by Julia Cagé and Emeric Henry)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Master in Economics</CardTitle>
                <div className="text-sm text-muted-foreground">
                  ENS Paris Saclay | Sept. 2020 – May 2021
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Focus:</strong> Econometrics
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Specialization:</strong> Environmental Economics
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Master Thesis:</strong> "Testing the empirical validity of the environmental Kuznets curve"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bachelor of Economics and Management</CardTitle>
                <div className="text-sm text-muted-foreground">
                  PARIS II Panthéon-Assas | Aug. 2016 – Apr. 2019
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Specialization:</strong> Industrial Economics and Management
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>GPA:</strong> 15/20 — Top 1%, Graduated with High Honors
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Work Experience */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Work Experience</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quantitative Economist</CardTitle>
                <div className="text-sm text-muted-foreground">
                  AVIV Group — Data and Analytics | Mar. 2023 – Present
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Estimating the effect of "Loi Energie & Climat" on the housing market</li>
                  <li>Econometrics and data analytics in Python</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Scientist Intern</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Veltys — Consulting Firm | Jan. 2022 – Sept. 2022
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Auction design: Women's World Cup 2023 TV coverage rights</li>
                  <li>Large scale web scraping and data treatment</li>
                  <li>Developed Shiny/Dash App: R and Python program optimizing Trot Turf racing scheduling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Intern</CardTitle>
                <div className="text-sm text-muted-foreground">
                  French Treasury — Ministry of Economics and Finance | Sept. 2021 – Dec. 2021
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Quantifying the effects of the posting of workers on the national labor market</li>
                  <li>Published research project: confidential Big Data treatment with Spark and R</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Intern</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Euler Hermes — Allianz Group | March 2020 – July 2020
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Country risk assessment and scoring: IHS, Macrobond and Bloomberg</li>
                  <li>Built macroeconomic index and models: tracking COVID-19 spreading and impacts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Skills</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Technical Skills</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Programming:</strong> Python (Proficient), R (Proficient), SQL, Stata, VBA</li>
                    <li><strong>Cloud & Tools:</strong> AWS, GCP, Dash, R Shiny, PowerBI</li>
                    <li><strong>Design:</strong> Photoshop, Illustrator, LaTeX</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Research Skills</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Mathematics:</strong> Econometrics, Probability Theory, Optimization, Stochastic Calculus</li>
                    <li><strong>Economics:</strong> Urban Economics, Real Estate Economics, Environmental Economics, Causal Inference</li>
                    <li><strong>Languages:</strong> French (Native), English (Fluent), Italian (Intermediate)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
