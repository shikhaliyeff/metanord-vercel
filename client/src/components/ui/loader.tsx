import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const loaderVariants = cva(
  'inline-block relative',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 border-t-primary',
        primary: 'border-neutral-200 border-t-primary',
        accent: 'border-neutral-200 border-t-accent',
        secondary: 'border-neutral-200 border-t-secondary',
        ghost: 'border-neutral-100/30 border-t-white',
      },
      size: {
        default: 'w-6 h-6 border-4',
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-4',
        lg: 'w-10 h-10 border-4',
        xl: 'w-16 h-16 border-[6px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loaderVariants> {
  text?: string;
  textClassName?: string;
}

export function Loader({ 
  className, 
  variant, 
  size, 
  text,
  textClassName,
  ...props 
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center" {...props}>
      <div 
        className={cn(
          loaderVariants({ variant, size }),
          'rounded-full animate-spin',
          className
        )}
      />
      {text && (
        <span className={cn("mt-3 text-sm text-neutral-600", textClassName)}>
          {text}
        </span>
      )}
    </div>
  );
}