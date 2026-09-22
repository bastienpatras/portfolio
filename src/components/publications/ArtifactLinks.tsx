import { ExternalLink, FileText, Code, Database, Presentation, FlaskConical, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Artifact } from '@/types';

interface ArtifactLinksProps {
  artifacts: Artifact[];
  size?: 'sm' | 'default' | 'lg';
}

export function ArtifactLinks({ artifacts, size = 'default' }: ArtifactLinksProps) {
  const getIcon = (type: Artifact['type']) => {
    const iconClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    switch (type) {
      case 'pdf':
        return <FileText className={iconClass} />;
      case 'doi':
        return <Link2 className={iconClass} />;
      case 'code':
        return <Code className={iconClass} />;
      case 'data':
        return <Database className={iconClass} />;
      case 'slides':
        return <Presentation className={iconClass} />;
      case 'replication':
        return <FlaskConical className={iconClass} />;
      case 'demo':
        return <ExternalLink className={iconClass} />;
    }
  };

  const getLabel = (artifact: Artifact) => {
    if (artifact.label) return artifact.label;
    return artifact.type.toUpperCase();
  };

  if (artifacts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {artifacts.map((artifact, index) => (
        <Button
          key={`${artifact.type}-${index}`}
          variant="outline"
          size={size}
          asChild
        >
          <a
            href={artifact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            {getIcon(artifact.type)}
            <span>{getLabel(artifact)}</span>
          </a>
        </Button>
      ))}
    </div>
  );
}
