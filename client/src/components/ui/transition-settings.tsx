import { useState } from 'react';
import { useTransition } from '@/context/TransitionContext';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * A UI component to change the page transition style
 * 
 * This provides a small floating settings button in the corner 
 * of the screen that allows changing between different 
 * Nordic-inspired transition styles.
 */
export function TransitionSettings() {
  const { transitionType, setTransitionType } = useTransition();
  const [open, setOpen] = useState(false);

  const transitions = [
    { id: 'standard', name: 'Nordic Minimal' },
    { id: 'wave', name: 'Nordic Wave' },
    { id: 'geometric', name: 'Nordic Geometric' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="backdrop-blur-md bg-white/70 hover:bg-white/90 shadow-lg border border-white/20 text-primary"
          >
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Transition Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="backdrop-blur-md bg-white/80 border border-white/30">
          <DropdownMenuLabel className="text-xs text-primary-dark font-medium">
            Page Transition Style
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {transitions.map((transition) => (
            <DropdownMenuItem
              key={transition.id}
              className={`text-sm flex items-center gap-2 cursor-pointer ${
                transitionType === transition.id ? 'font-medium text-primary' : 'text-neutral-dark'
              }`}
              onClick={() => setTransitionType(transition.id as any)}
            >
              {transitionType === transition.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
              {transition.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}