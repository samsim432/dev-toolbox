"use client";

import Link from "next/link";
import { tools } from "@/lib/tools";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

// Framer Motion variants for smooth loading - NOW WITH STRICT TYPES
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 350, damping: 25 } 
  }
};

// Map categories to professional Tailwind color palettes
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Formatting": 
      return "text-blue-500 bg-blue-500/10 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-blue-500/25 border-blue-500/20";
    case "Security": 
      return "text-rose-500 bg-rose-500/10 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-rose-500/25 border-rose-500/20";
    case "Encoding": 
      return "text-amber-500 bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-amber-500/25 border-amber-500/20";
    case "Testing": 
      return "text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-500/25 border-emerald-500/20";
    case "Generators": 
      return "text-purple-500 bg-purple-500/10 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-purple-500/25 border-purple-500/20";
    case "Conversion": 
      return "text-cyan-500 bg-cyan-500/10 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-cyan-500/25 border-cyan-500/20";
    default: 
      return "text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-primary/25 border-primary/20";
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-4 md:space-y-6 pt-6 pb-6 md:pt-12 md:pb-10 border-b px-2"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Developer tools, <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            all in one place.
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-[650px] leading-relaxed px-4">
          Fast, private, and free developer utilities that run directly in your browser. No data is ever sent to our servers.
        </p>
      </motion.section>

      {/* Tools Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          const colorStyles = getCategoryColor(tool.category || "");

          return (
            <motion.div key={tool.name} variants={itemVariants} whileHover={{ y: -4 }}>
              <Link href={tool.href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                <Card className="h-full hover:border-muted-foreground/30 hover:shadow-xl active:scale-[0.98] transition-all duration-300 cursor-pointer group bg-background/50 backdrop-blur-sm relative overflow-hidden">
                  
                  {/* Subtle top border accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-opacity opacity-0 group-hover:opacity-100 ${colorStyles.split(' ')[0].replace('text-', 'from-').concat(' to-transparent')}`} />

                  <CardHeader className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                      <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-sm ${colorStyles}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg md:text-xl font-semibold tracking-tight">{tool.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}