"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Palette } from "lucide-react";

export default function ColorConverter() {
  // State: Source of truth is always a valid HEX color
  const [hex, setHex] = useState("#3b82f6"); 
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [error, setError] = useState("");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Math: HEX to RGB
  const hexToRgbVals = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h[1] + h[2], 16);
      g = parseInt(h[3] + h[4], 16);
      b = parseInt(h[5] + h[6], 16);
    }
    return { r, g, b };
  };

  // Math: RGB to HSL
  const rgbToHslVals = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };

  // Math: RGB to HEX
  const rgbToHexStr = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
  };

  // Recalculate RGB and HSL strings whenever HEX changes
  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
      setError("");
      const { r, g, b } = hexToRgbVals(hex);
      setRgb(`rgb(${r}, ${g}, ${b})`);
      
      const { h, s, l } = rgbToHslVals(r, g, b);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    }
  }, [hex]);

  // Handlers for inputs
  const handleHexChange = (val: string) => {
    let newHex = val.startsWith("#") ? val : "#" + val;
    setHex(newHex);
    if (!/^#[0-9A-F]{6}$/i.test(newHex) && !/^#[0-9A-F]{3}$/i.test(newHex)) {
      setError("Invalid HEX color.");
    }
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const match = val.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i);
    if (match) {
      const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
      if (r <= 255 && g <= 255 && b <= 255) {
        setHex(rgbToHexStr(r, g, b));
        setError("");
        return;
      }
    }
    setError("Invalid RGB format. Use rgb(255, 255, 255)");
  };

  const handleCopy = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Color Converter</h1>
        <p className="text-muted-foreground">
          Convert colors instantly between HEX, RGB, and HSL formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Visuals */}
        <div className="space-y-6 flex flex-col">
          <div 
            className="w-full h-48 rounded-xl border-4 shadow-inner transition-colors duration-200 flex items-end justify-end p-4"
            style={{ backgroundColor: error ? "transparent" : hex }}
          >
            {/* Native color picker overlaid invisibly over a button */}
            <div className="relative">
              <Button variant="secondary" className="pointer-events-none relative z-10 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                <Palette className="w-4 h-4 mr-2" />
                Pick Color
              </Button>
              <input
                type="color"
                value={error ? "#000000" : (hex.length === 4 ? rgbToHexStr(hexToRgbVals(hex).r, hexToRgbVals(hex).g, hexToRgbVals(hex).b) : hex)}
                onChange={(e) => handleHexChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
        </div>

        {/* Right Column: Inputs */}
        <div className="space-y-4">
          <ColorInputRow 
            label="HEX" 
            value={hex} 
            onChange={handleHexChange} 
            onCopy={() => handleCopy(hex, "hex")}
            copied={copiedFormat === "hex"}
            placeholder="#3b82f6"
          />
          <ColorInputRow 
            label="RGB" 
            value={rgb} 
            onChange={handleRgbChange} 
            onCopy={() => handleCopy(rgb, "rgb")}
            copied={copiedFormat === "rgb"}
            placeholder="rgb(59, 130, 246)"
          />
          <ColorInputRow 
            label="HSL" 
            value={hsl} 
            // HSL input is read-only for MVP to save complexity, it updates automatically based on HEX/RGB
            onChange={() => {}} 
            onCopy={() => handleCopy(hsl, "hsl")}
            copied={copiedFormat === "hsl"}
            placeholder="hsl(217, 90%, 60%)"
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
}

// Reusable UI component for the rows
function ColorInputRow({ 
  label, value, onChange, onCopy, copied, placeholder, readOnly = false 
}: { 
  label: string, value: string, onChange: (v: string) => void, onCopy: () => void, copied: boolean, placeholder: string, readOnly?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <div className="flex gap-2">
        <Input
          className="font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
        <Button variant="outline" size="icon" onClick={onCopy} className="shrink-0">
          {copied ? <span className="text-xs font-bold text-green-500">✓</span> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}