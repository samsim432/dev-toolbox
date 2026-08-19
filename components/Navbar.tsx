"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { tools } from "@/lib/tools";
import { motion } from "framer-motion";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Instantly filter tools based on user input
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) || 
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.category?.toLowerCase().includes(query.toLowerCase())
  );

  // Close the search dropdown if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (href: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(href); // Navigate to the tool!
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        
        {/* Animated Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-lg shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded group"
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Terminal className="h-6 w-6 text-primary group-hover:text-blue-500 transition-colors duration-300" />
          </motion.div>
          <span className="hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-500">
            DevTools
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search tools (e.g. JSON, decode)..."
              className="pl-9 pr-9 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary rounded-full transition-all"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
            {/* Clear Button */}
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground rounded-full"
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isOpen && query && (
            <div className="absolute top-full mt-2 w-full bg-background border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[350px] overflow-y-auto z-50">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => handleSelect(tool.href)}
                      className="flex items-start gap-3 p-3 hover:bg-muted text-left transition-colors border-b last:border-b-0 outline-none focus-visible:bg-muted"
                    >
                      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm text-foreground">{tool.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-sm text-center text-muted-foreground flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 opacity-20" />
                  No tools found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex rounded-full transition-all hover:border-primary hover:text-primary"
            onClick={() => window.open("https://github.com", "_blank", "noreferrer")}
          >
            GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}