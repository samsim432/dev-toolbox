"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Clock, Trash } from "lucide-react";

export default function TimestampConverter() {
  const [input, setInput] = useState("");
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);

  // Update the current timestamp every second so the user always has a live reference
  useEffect(() => {
    setCurrentEpoch(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");
    setDateObj(null);

    if (!value.trim()) return;

    try {
      let parsedDate: Date;

      // Check if the input is purely a number (Timestamp)
      if (/^\d+$/.test(value)) {
        const num = parseInt(value, 10);
        // Smart detection: if 10 digits or less, it's seconds. Multiply by 1000 for JS.
        if (value.length <= 10) {
          parsedDate = new Date(num * 1000);
        } else {
          parsedDate = new Date(num);
        }
      } else {
        // Otherwise, assume it is a Date string (e.g., "2026-08-19")
        parsedDate = new Date(value);
      }

      // Check if the resulting date is valid
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date or timestamp");
      }

      setDateObj(parsedDate);
    } catch (err) {
      setError("Please enter a valid timestamp or date string.");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // We could use a toast here, but keeping it simple for the MVP
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleReset = () => {
    setInput("");
    setDateObj(null);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Timestamp Converter</h1>
        <p className="text-muted-foreground">
          Convert Unix timestamps to dates, and dates to Unix timestamps.
        </p>
      </div>

      {/* Live Current Time */}
      <div className="flex items-center gap-2 p-4 bg-muted/30 border rounded-lg text-sm">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">Current Unix Timestamp (seconds):</span>
        <span className="font-mono font-bold text-primary">{currentEpoch}</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6" onClick={() => handleInputChange(currentEpoch.toString())}>
          Use Current
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time-input">Enter Timestamp or Date String</Label>
            <Input
              id="time-input"
              placeholder="e.g. 1787135430 or 2026-08-19"
              className="font-mono"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            {error && <p className="text-sm text-destructive font-medium mt-1">{error}</p>}
          </div>

          <Button onClick={handleReset} variant="outline" className="w-full">
            <Trash className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Output Area */}
        <div className="space-y-4 border rounded-lg p-4 bg-background">
          <Label className="text-lg font-semibold border-b pb-2 block">Converted Results</Label>
          
          {dateObj ? (
            <div className="space-y-4 pt-2">
              <ResultRow 
                label="Timestamp (Seconds)" 
                value={Math.floor(dateObj.getTime() / 1000).toString()} 
                onCopy={copyToClipboard} 
              />
              <ResultRow 
                label="Timestamp (Milliseconds)" 
                value={dateObj.getTime().toString()} 
                onCopy={copyToClipboard} 
              />
              <ResultRow 
                label="Local Time" 
                value={dateObj.toLocaleString()} 
                onCopy={copyToClipboard} 
              />
              <ResultRow 
                label="UTC Time" 
                value={dateObj.toUTCString()} 
                onCopy={copyToClipboard} 
              />
              <ResultRow 
                label="ISO 8601" 
                value={dateObj.toISOString()} 
                onCopy={copyToClipboard} 
              />
            </div>
          ) : (
            <div className="text-muted-foreground text-sm italic py-8 text-center">
              Awaiting input...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable component just for this file to keep the code clean
function ResultRow({ label, value, onCopy }: { label: string, value: string, onCopy: (val: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded border">
        <span className="font-mono text-sm break-all">{value}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onCopy(value)}>
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}