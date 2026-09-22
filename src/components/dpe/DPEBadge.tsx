const DPE_COLORS: Record<string, string> = {
  A: '#319834',
  B: '#33cc31',
  C: '#cbfc34',
  D: '#fbeb09',
  E: '#fccc04',
  F: '#fc9935',
  G: '#fc1912',
};

const DPE_TEXT_DARK: Record<string, boolean> = {
  A: false,
  B: false,
  C: true,
  D: true,
  E: true,
  F: false,
  G: false,
};

interface DPEBadgeProps {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DPEBadge({ label, size = 'md', className = '' }: DPEBadgeProps) {
  const letter = label.toUpperCase();
  const bg = DPE_COLORS[letter] ?? '#6b7280';
  const dark = DPE_TEXT_DARK[letter] ?? false;

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm font-bold',
    md: 'w-14 h-14 text-2xl font-extrabold',
    lg: 'w-20 h-20 text-4xl font-extrabold',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: bg,
        color: dark ? '#1a1a1a' : '#ffffff',
      }}
    >
      {letter}
    </div>
  );
}
