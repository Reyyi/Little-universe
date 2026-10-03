import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-3 whitespace-nowrap font-sans uppercase transition-[color,background-color,border-color,opacity,transform] duration-500 ease-[var(--ease-cinema)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] focus-visible:outline-1 focus-visible:outline-gold",
  {
    variants: {
      variant: {
        cinematic:
          "border border-paper/25 text-paper hover:border-gold/70 hover:text-gold tracking-[0.42em] text-[0.7rem]",
        solid: "bg-paper text-ink-950 hover:bg-blush tracking-[0.32em] text-[0.7rem]",
        ghost: "text-mist hover:text-paper tracking-[0.28em] text-[0.65rem]",
        icon: "text-mist hover:text-paper rounded-full",
      },
      size: {
        default: "min-h-12 px-8 py-3",
        lg: "min-h-14 px-12 py-4",
        sm: "min-h-11 px-4 py-2",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "cinematic", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
