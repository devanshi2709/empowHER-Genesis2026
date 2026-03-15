import { Button } from "@/components/ui/button";

type DemoModeToggleProps<T extends string> = {
  label?: string;
  active: T;
  options: Array<{ key: T; label: string }>;
  onChange: (value: T) => void;
};

export function DemoModeToggle<T extends string>({
  label = "Demo mode",
  active,
  options,
  onChange,
}: DemoModeToggleProps<T>) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        {options.map((option) => (
          <Button
            key={option.key}
            size="sm"
            variant={active === option.key ? "default" : "outline"}
            onClick={() => onChange(option.key)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
