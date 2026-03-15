"use client";

import type { ComponentProps } from "react";
import { Button as CarbonButton } from "@carbon/react";
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

const variantToKind: Record<AppButtonVariant, ComponentProps<typeof CarbonButton>["kind"]> = {
  default: "primary",
  outline: "tertiary",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "danger",
  link: "ghost",
};

const sizeToCarbon: Record<AppButtonSize, ComponentProps<typeof CarbonButton>["size"]> = {
  default: "md",
  xs: "sm",
  sm: "sm",
  lg: "lg",
  icon: "sm",
  "icon-xs": "sm",
  "icon-sm": "sm",
  "icon-lg": "lg",
};

type ButtonProps = Omit<ComponentProps<typeof CarbonButton>, "kind" | "size"> & {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
};

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const isIconOnly = size.startsWith("icon");
  return (
    <CarbonButton
      kind={variantToKind[variant]}
      size={sizeToCarbon[size]}
      hasIconOnly={isIconOnly}
      iconDescription={isIconOnly ? (typeof children === "string" ? children : "action") : undefined}
      className={cn(
        "transition-colors duration-150",
        variant === "link" && "!h-auto !min-h-0 !px-0 !py-0 underline",
        className,
      )}
      {...props}
    >
      {children}
    </CarbonButton>
  );
}

function buttonVariants({
  className,
}: {
  className?: string;
}) {
  return cn(className);
}

export { Button, buttonVariants };
