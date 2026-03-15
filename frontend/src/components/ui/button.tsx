"use client";

import type { ElementType, ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

type AppButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

type AppButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

const variantStyles: Record<AppButtonVariant, string> = {
  default:
    "bg-[#1e40af] text-white border border-[#1e40af] hover:bg-[#1e3a8a] hover:border-[#1e3a8a] hover:shadow-[0_2px_8px_rgba(30,64,175,0.28)] focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2",
  outline:
    "bg-transparent text-[#1e40af] border border-[#1e40af] hover:bg-[#eff6ff] hover:text-[#1e3a8a] hover:border-[#1e3a8a] focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2",
  secondary:
    "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] hover:bg-[#dbeafe] hover:border-[#93c5fd] focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2",
  ghost:
    "bg-transparent text-[#1e40af] border border-transparent hover:bg-[#eff6ff] focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-2",
  destructive:
    "bg-[#dc2626] text-white border border-[#dc2626] hover:bg-[#b91c1c] hover:border-[#b91c1c] focus:ring-2 focus:ring-[#f87171]/40 focus:ring-offset-2",
  link:
    "bg-transparent text-[#1e40af] border-none underline underline-offset-4 hover:text-[#1e3a8a] focus:outline-none",
};

const sizeStyles: Record<AppButtonSize, string> = {
  default:  "h-9 px-4 text-sm",
  xs:       "h-7 px-2.5 text-xs",
  sm:       "h-8 px-3 text-sm",
  lg:       "h-10 px-5 text-sm",
  icon:     "h-9 w-9 p-0",
  "icon-xs": "h-7 w-7 p-0",
  "icon-sm": "h-8 w-8 p-0",
  "icon-lg": "h-10 w-10 p-0",
};

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  href?: string;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
};

function Button<T extends ElementType = "button">({
  as,
  className,
  variant = "default",
  size = "default",
  children,
  disabled,
  ...props
}: ButtonProps<T> & Record<string, unknown>) {
  const Component = (as ?? "button") as ElementType;
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[6px] font-medium",
        "transition-all duration-150 focus:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        variant !== "link" && size !== "icon" && size !== "icon-xs" && size !== "icon-sm" && size !== "icon-lg"
          ? "leading-none"
          : "",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}

function buttonVariants({ className }: { className?: string }) {
  return cn(className);
}

export { Button, buttonVariants };

