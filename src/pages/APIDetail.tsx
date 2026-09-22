import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ErrorState } from '@/components/ui/ErrorState';
import { APIPlayground } from '@/components/api/APIPlayground';
import { DPEFieldCatalog } from '@/components/dpe/DPEFieldCatalog';
import { apis } from '@/content/apis';
import { formatDate } from '@/lib/utils';
import { classifyText } from '@/api/text-classification/client';
import { matchDPE } from '@/api/dpe-matcher/client';

export function APIDetail() {
  const { id } = useParams<{ id: string }>();
  const api = apis.find((a) => a.id === id);

  if (!api) {
    return (
      <PageLayout>
        <ErrorState
          title="API not found"
          message="The API you're looking for doesn't exist or has been removed."
        />
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link to="/apis">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to APIs
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleAPIExecution = async (input: Record<string, unknown>) => {
    // Route to appropriate API client based on ID
    if (id === 'text-classification') {
      return await classifyText({
        text: input.text as string,
        model: input.model as string,
        return_probabilities: input.return_probabilities as boolean,
      });
    }

    if (id === 'dpe-matcher') {
      return await matchDPE({
        address: input.address as string,
        postalCode: (input.postalCode as string) || null,
        city: (input.city as string) || null,
        area: Number(input.area),
        floor: input.floor ? Number(input.floor) : null,
        propertyType: (input.propertyType as 'APARTMENT' | 'HOUSE') ?? 'APARTMENT',
        publicationDate: (input.publicationDate as string) || null,
      });
    }

    // Mock response for other APIs
    return {
      message: 'This is a demo response',
      timestamp: new Date().toISOString(),
      input,
    };
  };

  const getPlaygroundConfig = () => {
    if (id === 'text-classification') {
      return {
        defaultInput: {
          text: 'This product is amazing!',
          model: 'base',
          return_probabilities: true,
        },
        inputFields: [
          {
            name: 'text',
            label: 'Text to classify',
            type: 'text' as const,
            placeholder: 'Enter text to classify...',
            required: true,
          },
          {
            name: 'model',
            label: 'Model',
            type: 'select' as const,
            options: ['base', 'large', 'distilled'],
          },
          {
            name: 'return_probabilities',
            label: 'Return probabilities',
            type: 'boolean' as const,
          },
        ],
      };
    }

    if (id === 'dpe-matcher') {
      return {
        defaultInput: {
          address: '25 Rue de Belfort, 11000 Carcassonne',
          area: 46,
          floor: 2,
          propertyType: 'APARTMENT',
          publicationDate: '',
        },
        inputFields: [
          {
            name: 'address',
            label: 'Address',
            type: 'text' as const,
            placeholder: '25 Rue de Belfort, 11000 Carcassonne',
            required: true,
          },
          {
            name: 'area',
            label: 'Living area (m²)',
            type: 'number' as const,
            required: true,
          },
          {
            name: 'floor',
            label: 'Floor number',
            type: 'number' as const,
            required: false,
          },
          {
            name: 'propertyType',
            label: 'Property type',
            type: 'select' as const,
            options: ['APARTMENT', 'HOUSE'],
          },
          {
            name: 'publicationDate',
            label: 'Reference date (YYYY-MM-DD)',
            type: 'text' as const,
            placeholder: '2025-01-01',
            required: false,
          },
        ],
      };
    }

    // Default playground config
    return {
      defaultInput: { input: 'test' },
      inputFields: [
        {
          name: 'input',
          label: 'Input',
          type: 'text' as const,
          required: true,
        },
      ],
    };
  };

  const playgroundConfig = getPlaygroundConfig();

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/apis">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to APIs
          </Link>
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <header>
            <h1 className="mb-4 text-4xl font-bold">{api.title}</h1>
            <p className="mb-4 text-xl text-muted-foreground">
              {api.description}
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {api.tags.map((tag) => (
                <Tag key={tag} variant="muted">
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {formatDate(api.lastUpdated)}
            </div>
          </header>

          {/* Limitations */}
          {api.limitations && api.limitations.length > 0 && (
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {api.limitations.map((limitation, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-yellow-500">•</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Interactive Playground */}
          <APIPlayground
            apiId={api.id}
            title="Interactive Playground"
            onExecute={handleAPIExecution}
            defaultInput={playgroundConfig.defaultInput}
            inputFields={playgroundConfig.inputFields}
          />

          {/* Endpoints */}
          {api.endpoints && api.endpoints.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-bold">API Endpoints</h2>
              <div className="space-y-4">
                {api.endpoints.map((endpoint, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Tag>{endpoint.method}</Tag>
                        <code className="font-mono text-sm">
                          {endpoint.path}
                        </code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {endpoint.description}
                      </p>
                    </CardHeader>
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <CardContent>
                        <h4 className="mb-3 text-sm font-semibold">
                          Parameters
                        </h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param) => (
                            <div
                              key={param.name}
                              className="flex items-start gap-2 text-sm"
                            >
                              <code className="rounded bg-muted px-2 py-1 font-mono">
                                {param.name}
                              </code>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    {param.type}
                                  </span>
                                  {param.required && (
                                    <Tag variant="default" className="text-xs">
                                      required
                                    </Tag>
                                  )}
                                </div>
                                <p className="mt-1 text-muted-foreground">
                                  {param.description}
                                </p>
                                {param.default && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Default: {param.default}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* DPE field catalog (dpe-matcher only) */}
          {id === 'dpe-matcher' && <DPEFieldCatalog />}

          {/* Examples */}
          {api.examples && api.examples.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-bold">Examples</h2>
              <div className="space-y-4">
                {api.examples.map((example, i) => (
                  <div key={i}>
                    {example.description && (
                      <p className="mb-2 text-sm text-muted-foreground">
                        {example.description}
                      </p>
                    )}
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Notes */}
          {api.securityNotes && api.securityNotes.length > 0 && (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {api.securityNotes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-blue-500">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
                {api.rateLimit && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm">
                      <span className="font-semibold">Rate Limit:</span>{' '}
                      {api.rateLimit}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
