"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Hash, ShieldAlert } from "lucide-react";

export default function HashGenerator() {
  const [input, setInput] = useState("Hello World");
  const [hashes, setHashes] = useState({
    sha1: "",
    sha256: "",
    sha512: "",
  });
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Re-calculate hashes every time the input changes
  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ sha1: "", sha256: "", sha512: "" });
      return;
    }

    try {
      // 1. Convert string to raw bytes
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      // 2. Helper function to digest and convert buffer to hex string
      const hashToHex = async (algorithm: string) => {
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // Convert each byte to a 2-character hex string (e.g. padding '5' to '05')
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      };

      // 3. Generate all hashes concurrently for maximum speed
      const [sha1, sha256, sha512] = await Promise.all([
        hashToHex("SHA-1"),
        hashToHex("SHA-256"),
        hashToHex("SHA-512")
      ]);

      setHashes({ sha1, sha256, sha512 });
    } catch (err) {
      console.error("Hashing failed", err);
    }
  };

  const handleCopy = async (text: string, format: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate cryptographic hashes instantly. Processed completely in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-2">
          <Label htmlFor="hash-input">Input Text</Label>
          <Textarea
            id="hash-input"
            placeholder="Type something to hash..."
            className="font-mono h-[300px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <p>Hashes are one-way functions. You cannot decrypt a hash back into text.</p>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <HashOutputRow 
            label="SHA-256 (Recommended)" 
            value={hashes.sha256} 
            onCopy={() => handleCopy(hashes.sha256, "sha256")} 
            copied={copiedFormat === "sha256"} 
          />
          <HashOutputRow 
            label="SHA-512" 
            value={hashes.sha512} 
            onCopy={() => handleCopy(hashes.sha512, "sha512")} 
            copied={copiedFormat === "sha512"} 
          />
          <HashOutputRow 
            label="SHA-1 (Legacy)" 
            value={hashes.sha1} 
            onCopy={() => handleCopy(hashes.sha1, "sha1")} 
            copied={copiedFormat === "sha1"} 
          />
        </div>
      </div>
    </div>
  );
}

// Reusable UI component for the hash rows
function HashOutputRow({ 
  label, value, onCopy, copied 
}: { 
  label: string, value: string, onCopy: () => void, copied: boolean 
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold flex items-center gap-2">
        <Hash className="w-4 h-4 text-primary" />
        {label}
      </Label>
      <div className="relative">
        <Textarea
          readOnly
          className="font-mono min-h-[80px] resize-none bg-muted/50 pr-12 break-all text-sm"
          value={value}
          placeholder="Hash will appear here..."
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCopy} 
          className="absolute right-2 top-2"
          disabled={!value}
        >
          {copied ? <span className="text-xs font-bold text-green-500">✓</span> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}