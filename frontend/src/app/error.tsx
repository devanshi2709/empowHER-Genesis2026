"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <ErrorState
        title="Unable to load this clinic view"
        description={error.message || "An unexpected issue occurred while rendering this page."}
        action={
          <Button size="sm" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
