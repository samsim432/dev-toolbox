"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Trash, Lock, Unlock } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) return;

    try {
      // unescape/encodeURIComponent trick safely handles emojis and special characters
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      setError("Failed to encode input.");
      setOutput("");
    }
  };

  const handleDecode = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) return;

    try {
      // Decode Base64, then safely parse special characters back to text
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err) {
      setError("Invalid Base64 string. Check for hidden spaces or missing characters.");
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
      {/* Tool Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Safely encode text to Base64 or decode Base64 back to text. Supports emojis and special characters.
        </p>
      </div>

      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-2">
          <Label htmlFor="base64-input">Input Text or Base64</Label>
          <Textarea
            id="base64-input"
            placeholder="Type your text or paste Base64 here..."
            className="font-mono h-[300px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          {/* Controls */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleEncode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Lock className="w-4 h-4 mr-2" />
              Encode
            </Button>
            <Button onClick={handleDecode} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              <Unlock className="w-4 h-4 mr-2" />
              Decode
            </Button>
            <Button onClick={handleReset} variant="outline" size="icon">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
          
          {error && <p className="text-sm text-destructive font-medium mt-2">{error}</p>}
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="base64-output">Output</Label>
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
            id="base64-output"
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