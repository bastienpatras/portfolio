import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';
import { DPE_AVAILABLE_FIELDS, type FieldCategory } from '@/api/dpe-matcher/types';

const CATEGORIES: FieldCategory[] = ['Energy', 'Building', 'Cost', 'Administrative'];

const CATEGORY_COLORS: Record<FieldCategory, string> = {
  Energy: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Building: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Cost: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  Administrative: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
};

export function DPEFieldCatalog() {
  const [open, setOpen] = useState(false);

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    fields: DPE_AVAILABLE_FIELDS.filter((f) => f.category === cat),
  }));

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-sm font-semibold">Available ADEME fields</span>
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <CardContent className="pt-0 space-y-5">
          <p className="text-xs text-muted-foreground">
            Fields marked <span className="font-medium text-foreground">default</span> are
            always returned. Pass additional field keys via the{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">fields</code>{' '}
            API parameter to include extended data in the response.
          </p>

          {grouped.map(({ category, fields }) => (
            <div key={category}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h4>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-1.5 text-left font-medium">Key</th>
                      <th className="px-3 py-1.5 text-left font-medium">Label</th>
                      <th className="px-3 py-1.5 text-left font-medium hidden sm:table-cell">Description</th>
                      <th className="px-3 py-1.5 text-center font-medium w-16">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((f) => (
                      <tr key={f.key} className="border-b last:border-0">
                        <td className="px-3 py-1.5 font-mono text-[11px]">{f.key}</td>
                        <td className="px-3 py-1.5">{f.label}</td>
                        <td className="px-3 py-1.5 text-muted-foreground hidden sm:table-cell">{f.description}</td>
                        <td className="px-3 py-1.5 text-center">
                          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${f.isDefault ? CATEGORY_COLORS[category] : 'bg-muted text-muted-foreground'}`}>
                            {f.isDefault ? 'default' : 'extra'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
