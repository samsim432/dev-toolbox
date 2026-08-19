"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, CheckCircle2, XCircle } from "lucide-react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState("Contact us at support@example.com or sales@test.co.uk!");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  // We use useEffect so it evaluates the regex LIVE every time the user types
  useEffect(() => {
    evaluateRegex();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags, testString]);

  const evaluateRegex = () => {
    setError("");
    setMatches([]);

    if (!pattern) return;

    try {
      // 1. Create the Regular Expression object
      const regex = new RegExp(pattern, flags);
      
      // 2. Test the string against the regex
      const foundMatches = testString.match(regex);
      
      // 3. Update state with results
      if (foundMatches) {
        setMatches(foundMatches);
      }
    } catch (err: any) {
      // Catch invalid regex syntax (e.g. unclosed parentheses)
      setError(err.message || "Invalid regular expression.");
    }
  };

  const handleReset = () => {
    setPattern("");
    setFlags("g");
    setTestString("");
    setMatches([]);
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Regex Tester</h1>
        <p className="text-muted-foreground">
          Test regular expressions against strings in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="regex-pattern">Regular Expression</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-muted-foreground">/</span>
                <Input
                  id="regex-pattern"
                  placeholder="\d+"
                  className="font-mono text-lg"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                />
                <span className="text-2xl text-muted-foreground">/</span>
              </div>
            </div>
            
            <div className="w-24 space-y-2">
              <Label htmlFor="regex-flags">Flags</Label>
              <Input
                id="regex-flags"
                placeholder="g, i, m"
                className="font-mono text-lg"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-string">Test String</Label>
            <Textarea
              id="test-string"
              placeholder="Type the text you want to search through..."
              className="font-mono h-[200px] resize-none"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
            />
          </div>

          <Button onClick={handleReset} variant="outline" className="w-full">
            <Trash className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          
          {error && <p className="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20">{error}</p>}
        </div>

        {/* Right Column: Output */}
        <div className="space-y-4">
          <Label>Results</Label>
          
          <div className="p-4 border rounded-md bg-muted/30 min-h-[315px] space-y-4">
            {error ? (
              <div className="flex items-center text-muted-foreground gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span>Fix the regex syntax error to see matches.</span>
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center text-green-500 gap-2 mb-4 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Found {matches.length} match{matches.length === 1 ? '' : 'es'}:</span>
                </div>
                {matches.map((match, index) => (
                  <div key={index} className="p-2 bg-background border rounded-md font-mono text-sm break-all">
                    <span className="text-muted-foreground mr-3 select-none">#{index + 1}</span>
                    <span className="text-primary">{match}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground gap-2">
                <XCircle className="w-5 h-5" />
                <span>No matches found.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}