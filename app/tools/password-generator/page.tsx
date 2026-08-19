"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw, ShieldCheck } from "lucide-react";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  
  // Options state
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  // Generate a password on first load
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Prevent user from unchecking ALL boxes
      if (!Object.values(next).includes(true)) {
        return prev;
      }
      return next;
    });
  };

  const generatePassword = () => {
    setCopied(false);
    
    // 1. Build the pool of allowed characters
    let charset = "";
    if (options.uppercase) charset += CHAR_SETS.uppercase;
    if (options.lowercase) charset += CHAR_SETS.lowercase;
    if (options.numbers) charset += CHAR_SETS.numbers;
    if (options.symbols) charset += CHAR_SETS.symbols;

    if (!charset) return;

    // 2. Cryptographically secure generation
    let newPassword = "";
    // Create an array to hold our secure random numbers
    const randomValues = new Uint32Array(length);
    // Ask the browser/OS to fill the array with secure randomness
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      // Map the random number to an index in our charset pool
      const randomIndex = randomValues[i] % charset.length;
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          Generate secure, random passwords directly in your browser. 
          <span className="flex items-center text-green-600 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 mr-1" />
            100% Private
          </span>
        </p>
      </div>

      <div className="space-y-6 bg-muted/30 p-6 rounded-xl border shadow-sm">
        {/* Output Display */}
        <div className="relative">
          <Input 
            readOnly 
            value={password} 
            className="font-mono text-2xl h-16 text-center pr-24 tracking-wider bg-background"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <Button variant="ghost" size="icon" onClick={generatePassword} title="Regenerate">
              <RefreshCw className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Button>
            <Button variant="default" size="icon" onClick={handleCopy} title="Copy Password">
              {copied ? <span className="text-xs font-bold">✓</span> : <Copy className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 pt-4 border-t">
          
          {/* Length Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">Password Length</Label>
              <span className="font-mono text-lg font-bold text-primary">{length}</span>
            </div>
            <Slider
              value={[length]}
              onValueChange={(vals) => setLength(Array.isArray(vals) ? vals[0] : vals)}
              min={8}
              max={128}
              step={1}
              className="py-4"
            />
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionCheckbox 
              id="uppercase" 
              label="Uppercase Letters" 
              example="(A-Z)" 
              checked={options.uppercase} 
              onChange={() => handleOptionChange("uppercase")} 
            />
            <OptionCheckbox 
              id="lowercase" 
              label="Lowercase Letters" 
              example="(a-z)" 
              checked={options.lowercase} 
              onChange={() => handleOptionChange("lowercase")} 
            />
            <OptionCheckbox 
              id="numbers" 
              label="Numbers" 
              example="(0-9)" 
              checked={options.numbers} 
              onChange={() => handleOptionChange("numbers")} 
            />
            <OptionCheckbox 
              id="symbols" 
              label="Symbols" 
              example="(!@#)" 
              checked={options.symbols} 
              onChange={() => handleOptionChange("symbols")} 
            />
          </div>

        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        This tool uses the cryptographically secure <strong>window.crypto.getRandomValues()</strong> API. Passwords are never stored or transmitted.
      </p>
    </div>
  );
}

// Reusable checkbox component for the options
function OptionCheckbox({ 
  id, label, example, checked, onChange 
}: { 
  id: string, label: string, example: string, checked: boolean, onChange: () => void 
}) {
  return (
    <div className="flex items-center space-x-2 bg-background p-3 rounded-md border cursor-pointer hover:border-primary transition-colors" onClick={onChange}>
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <div className="grid gap-1.5 leading-none cursor-pointer">
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-muted-foreground font-mono">{example}</p>
      </div>
    </div>
  );
}