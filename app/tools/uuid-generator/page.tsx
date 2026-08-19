"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Fingerprint } from "lucide-react";

export default function UuidGenerator() {
  const [output, setOutput] = useState("");
  const [count, setCount] = useState<number>(5);
  const [copied, setCopied] = useState(false);

  // Generate initial UUIDs on first load
  useEffect(() => {
    generateUUIDs(5);
  }, []);

  const generateUUIDs = (amount: number) => {
    setCopied(false);
    
    // Ensure amount is between 1 and 500
    const safeAmount = Math.min(Math.max(1, amount), 500);
    
    try {
      const uuids = [];
      for (let i = 0; i < safeAmount; i++) {
        // The native, cryptographically secure browser API
        uuids.push(crypto.randomUUID());
      }
      setOutput(uuids.join("\n"));
    } catch (err) {
      console.error("Failed to generate UUIDs", err);
      setOutput("Error: Your browser does not support secure UUID generation.");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">UUID Generator</h1>
        <p className="text-muted-foreground">
          Generate cryptographically secure version 4 UUIDs instantly.
        </p>
      </div>

      <div className="space-y-4 bg-muted/30 p-6 rounded-lg border">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 w-full sm:w-32">
            <Label htmlFor="uuid-count">How many?</Label>
            <Input
              id="uuid-count"
              type="number"
              min="1"
              max="500"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <Button 
            onClick={() => generateUUIDs(count)} 
            className="w-full sm:w-auto bg-primary text-primary-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-primary" />
              Generated UUIDs
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              disabled={!output}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy All"}
            </Button>
          </div>
          <Textarea
            readOnly
            className="font-mono h-[300px] resize-none bg-background"
            value={output}
          />
        </div>
      </div>
    </div>
  );
}