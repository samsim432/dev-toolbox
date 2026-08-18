import Link from "next/link";
import { Terminal } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Terminal className="h-6 w-6" />
          <span>DevTools</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* We will implement the global search later */}
          <div className="text-sm text-muted-foreground hidden sm:block">
            All tools run locally in your browser.
          </div>
          <Button variant="outline" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}