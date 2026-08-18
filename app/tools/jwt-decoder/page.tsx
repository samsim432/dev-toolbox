"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Trash } from "lucide-react";

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const decodeJWT = (token: string) => {
    setInput(token);
    setError("");
    setHeader("");
    setPayload("");
    setSignature("");

    if (!token.trim()) return;

    try {
      // 1. Split the token into its 3 parts
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("A valid JWT must have exactly 3 parts separated by dots.");
      }

      // 2. Helper function to decode Base64Url
      const decodeBase64Url = (base64Url: string) => {
        // Convert Base64Url to standard Base64
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        // Pad with '=' until length is a multiple of 4
        while (base64.length % 4) {
          base64 += "=";
        }
        // Decode using browser's atob() API
        const decoded = atob(base64);
        // Format it nicely as JSON
        return JSON.stringify(JSON.parse(decoded), null, 2);
      };

      // 3. Decode and set the parts
      setHeader(decodeBase64Url(parts[0]));
      setPayload(decodeBase64Url(parts[1]));
      setSignature(parts[2]); // Signature is just raw text, not JSON
    } catch (err) {
      setError("This does not appear to be a valid JWT.");
    }
  };

  const handleReset = () => {
    setInput("");
    setHeader("");
    setPayload("");
    setSignature("");
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">JWT Decoder</h1>
        <p className="text-muted-foreground">
          Decode the Header, Payload, and Signature of a JSON Web Token locally.
        </p>
      </div>

      {/* Security Warning */}
      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Warning: Decode Only</AlertTitle>
        <AlertDescription>
          This tool only decodes the token so you can read the contents. <strong>The signature is NOT verified.</strong> Never trust the contents of a JWT unless you have verified the signature on your server.
        </AlertDescription>
      </Alert>

      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-2">
          <Label htmlFor="jwt-input">JWT String</Label>
          <Textarea
            id="jwt-input"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="font-mono h-[400px] resize-none break-all"
            value={input}
            onChange={(e) => decodeJWT(e.target.value)}
          />
          <div className="flex justify-end pt-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              <Trash className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          {error && <p className="text-sm text-destructive font-medium mt-2">{error}</p>}
        </div>

        {/* Output Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-red-500">Header (Algorithm & Type)</Label>
            <Textarea
              readOnly
              className="font-mono h-[100px] resize-none bg-muted/50 text-red-500"
              value={header}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-purple-500">Payload (Data)</Label>
            <Textarea
              readOnly
              className="font-mono h-[180px] resize-none bg-muted/50 text-purple-500"
              value={payload}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-blue-500">Signature</Label>
            <Textarea
              readOnly
              className="font-mono h-[70px] resize-none bg-muted/50 text-blue-500 break-all"
              value={signature}
            />
          </div>
        </div>
      </div>
    </div>
  );
}