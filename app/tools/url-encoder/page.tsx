"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Trash, Link2, Link2Off } from "lucide-react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) return;

    try {
      // Safely encodes special characters for URLs
      setOutput(encodeURIComponent(input));
    } catch (err) {
      setError("Failed to encode the URL.");
      setOutput("");
    }
  };

  const handleDecode = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) return;

    try {
      // Safely decodes. This WILL throw an error if the user typed an invalid % sequence
      setOutput(decodeURIComponent(input));
    } catch (err) {
      setError("Invalid URL encoding. Make sure your percentage signs (%) are followed by valid hex codes.");
      setOutput("");
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

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">URL Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Encode text for use in URLs, or decode URL-encoded strings into readable text.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="space-y-2">
          <Label htmlFor="url-input">Input String</Label>
          <Textarea
            id="url-input"
            placeholder="https://example.com/?search=hello world"
            className="font-mono h-[300px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="flex gap-2 pt-2">
            <Button onClick={handleEncode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Link2 className="w-4 h-4 mr-2" />
              Encode
            </Button>
            <Button onClick={handleDecode} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              <Link2Off className="w-4 h-4 mr-2" />
              Decode
            </Button>
            <Button onClick={handleReset} variant="outline" size="icon">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
          
          {error && <p className="text-sm text-destructive font-medium mt-2">{error}</p>}
        </div>

        {/* Output Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="url-output">Output</Label>
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
            id="url-output"
            readOnly
            className="font-mono h-[300px] resize-none bg-muted/50 break-all"
            value={output}
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
}