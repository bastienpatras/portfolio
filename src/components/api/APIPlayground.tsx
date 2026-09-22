import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Play, Loader2 } from 'lucide-react';

interface APIPlaygroundProps {
  apiId: string;
  title: string;
  onExecute: (input: Record<string, unknown>) => Promise<unknown>;
  defaultInput: Record<string, unknown>;
  inputFields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
    placeholder?: string;
    required?: boolean;
  }[];
}

export function APIPlayground({
  title,
  onExecute,
  defaultInput,
  inputFields,
}: APIPlaygroundProps) {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onExecute(input);
      setOutput(result as Record<string, unknown>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateInput = (name: string, value: unknown) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Parameters</h3>
          {inputFields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium mb-2"
              >
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
              {field.type === 'text' && (
                <input
                  id={field.name}
                  type="text"
                  value={input[field.name] as string}
                  onChange={(e) => updateInput(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
              {field.type === 'number' && (
                <input
                  id={field.name}
                  type="number"
                  value={input[field.name] as number}
                  onChange={(e) =>
                    updateInput(field.name, parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
              {field.type === 'boolean' && (
                <input
                  id={field.name}
                  type="checkbox"
                  checked={input[field.name] as boolean}
                  onChange={(e) => updateInput(field.name, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring"
                />
              )}
              {field.type === 'select' && field.options && (
                <select
                  id={field.name}
                  value={input[field.name] as string}
                  onChange={(e) => updateInput(field.name, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Execute Button */}
        {loading ? (
          <Button onClick={handleExecute} disabled={loading} className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running...
          </Button>
        ) : (
          <Button onClick={handleExecute} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        )}

        {/* Output */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="text-sm text-destructive/90 mt-1">{error}</p>
          </div>
        )}

        {output && !error && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Response</h3>
            <CodeBlock code={JSON.stringify(output as object, null, 2)} language="json" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
