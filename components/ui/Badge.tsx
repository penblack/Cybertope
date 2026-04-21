type BadgeVariant = 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'gray' | 'indigo';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-900/50 text-green-400 border border-green-800',
  blue: 'bg-blue-900/50 text-blue-400 border border-blue-800',
  yellow: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  orange: 'bg-orange-900/50 text-orange-400 border border-orange-800',
  red: 'bg-red-900/50 text-red-400 border border-red-800',
  gray: 'bg-neutral-800 text-neutral-400 border border-neutral-700',
  indigo: 'bg-indigo-900/50 text-indigo-400 border border-indigo-800',
};

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
