import { 
  Braces, ShieldAlert, FileDigit, Link, 
  Regex, Fingerprint, Clock, Palette, 
  KeyRound, Hash
} from "lucide-react";

export const tools = [
  {
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON instantly.",
    href: "/tools/json-formatter",
    icon: Braces,
    category: "Formatting",
  },
  {
    name: "JWT Decoder",
    description: "Decode JWT header, payload, and signature locally.",
    href: "/tools/jwt-decoder",
    icon: ShieldAlert,
    category: "Security",
  },
  {
    name: "Base64 Encoder/Decoder",
    description: "Easily encode and decode Base64 strings.",
    href: "/tools/base64",
    icon: FileDigit,
    category: "Encoding",
  },
  {
    name: "URL Encoder/Decoder",
    description: "Encode or decode URL strings safely.",
    href: "/tools/url-encoder",
    icon: Link,
    category: "Encoding",
  },
  {
    name: "Regex Tester",
    description: "Test regular expressions against sample text.",
    href: "/tools/regex-tester",
    icon: Regex,
    category: "Testing",
  },
  {
    name: "UUID Generator",
    description: "Generate v4 UUIDs instantly.",
    href: "/tools/uuid-generator",
    icon: Fingerprint,
    category: "Generators",
  },
  {
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to human-readable dates.",
    href: "/tools/timestamp",
    icon: Clock,
    category: "Conversion",
  },
  {
    name: "Color Converter",
    description: "Convert between HEX, RGB, and HSL formats.",
    href: "/tools/color-converter",
    icon: Palette,
    category: "Conversion",
  },
  {
    name: "Password Generator",
    description: "Generate secure, random passwords.",
    href: "/tools/password-generator",
    icon: KeyRound,
    category: "Security",
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, and SHA-256 hashes.",
    href: "/tools/hash-generator",
    icon: Hash,
    category: "Security",
  },
];