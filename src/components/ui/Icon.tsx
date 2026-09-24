import { LucideIcon, LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, className = '', size = 20, ...props }, ref) => (
    <IconComponent ref={ref} className={`text-neutral-400 ${className}`} size={size} {...props} />
  )
);

Icon.displayName = 'Icon';