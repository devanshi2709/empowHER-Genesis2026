import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "ai" | "tinted-blue" | "tinted-purple" | "flat";

const variantStyles: Record<CardVariant, string> = {
  default:        "bg-white border border-[#e2e8f0] shadow-[0_2px_8px_rgba(15,23,42,0.07),0_4px_12px_rgba(15,23,42,0.04)]",
  ai:             "border border-[#c7d2fe] shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
  "tinted-blue":  "bg-[#eff6ff] border border-[#bfdbfe] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  "tinted-purple":"bg-[#f5f3ff] border border-[#ddd6fe] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  flat:           "bg-[#f8fafc] border border-[#e2e8f0]",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({
  variant = "default",
  children,
  className,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px]",
        variantStyles[variant],
        variant === "ai" && "bg-gradient-to-br from-[#eff6ff] to-[#f5f3ff]",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(15,23,42,0.09),0_8px_24px_rgba(15,23,42,0.05)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function CardHeader({ title, description, actions, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-wrap items-start justify-between gap-3", className)}
      {...props}
    >
      <div>
        <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-[#64748b]">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}
