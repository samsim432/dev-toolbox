"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Trash, FileJson, Minimize2 } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Core processing logic
  const processJson = (action: "format" | "minify") => {
    setError(""); // Reset error state
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter some JSON first.");
      return;
    }

    try {
      // 1. Validate by parsing
      const parsed = JSON.parse(input);
      
      // 2. Format or Minify based on user action
      if (action === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      // Graceful error handling
      setError("Invalid JSON. Check for missing quotes, trailing commas, or brackets.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2s
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, validate, and minify JSON instantly. Processed completely in your browser.
        </p>
      </div>

      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-2">
          <Label htmlFor="json-input">Input JSON</Label>
          <Textarea
            id="json-input"
            placeholder='{"hello": "world"}'
            className="font-mono h-[400px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          {/* Controls */}
          <div className="flex gap-2 pt-2">
            <Button onClick={() => processJson("format")} className="flex-1">
              <FileJson className="w-4 h-4 mr-2" />
              Format
            </Button>
            <Button onClick={() => processJson("minify")} variant="secondary" className="flex-1">
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify
            </Button>
            <Button onClick={handleReset} variant="outline" size="icon">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Error Message */}
          {error && <p className="text-sm text-destructive font-medium mt-2">{error}</p>}
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="json-output">Output</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              disabled={!output}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Textarea
            id="json-output"
            readOnly
            className="font-mono h-[400px] resize-none bg-muted/50"
            value={output}
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
}