import Link from "next/link";
import { tools } from "@/lib/tools";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-4 pt-10 pb-8 border-b">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Developer tools, <span className="text-primary">all in one place.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px]">
          Fast, private, and free developer utilities that run directly in your browser. No data is sent to our servers.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-secondary rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}