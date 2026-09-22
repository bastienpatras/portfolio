import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Loader2 } from 'lucide-react';
import type { PropertyQuery } from '@/api/dpe-matcher/types';

interface DPESearchFormProps {
  onSubmit: (query: PropertyQuery) => void;
  loading: boolean;
}

export function DPESearchForm({ onSubmit, loading }: DPESearchFormProps) {
  const [address, setAddress] = useState('25 Rue de Belfort');
  const [postalCode, setPostalCode] = useState('11000');
  const [city, setCity] = useState('Carcassonne');
  const [area, setArea] = useState('46');
  const [floor, setFloor] = useState('2');
  const [propertyType, setPropertyType] = useState<'APARTMENT' | 'HOUSE'>('APARTMENT');
  const [publicationDate, setPublicationDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      address,
      postalCode: postalCode || null,
      city: city || null,
      area: Number(area),
      floor: propertyType === 'APARTMENT' && floor ? Number(floor) : null,
      propertyType,
      publicationDate: publicationDate || null,
    });
  };

  const inputClass =
    'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Street address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="25 Rue de Belfort"
              required
              className={inputClass}
            />
          </div>

          {/* Postal code + City row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Postal code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="11000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Carcassonne"
                className={inputClass}
              />
            </div>
          </div>

          {/* Property type toggle */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Property type</label>
            <div className="flex rounded-md border bg-muted/50 p-1">
              {(['APARTMENT', 'HOUSE'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                    propertyType === type
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type === 'APARTMENT' ? 'Apartment' : 'House'}
                </button>
              ))}
            </div>
          </div>

          {/* Area + Floor row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Area (m²)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="46"
                required
                min="1"
                className={inputClass}
              />
            </div>

            {propertyType === 'APARTMENT' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Floor</label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="2"
                  min="0"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* Publication date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Reference date <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Only DPEs issued before this date will be considered
            </p>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading || !address || !area}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search DPE
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
