import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl">
      <EmptyState
        title="Page not found"
        description="This view does not exist in the clinic workspace. Return to dashboard to continue your workflow."
        action={
          <Link href="/">
            <Button>Return to dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
