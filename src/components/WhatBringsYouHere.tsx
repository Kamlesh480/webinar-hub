import { Button } from "@/components/ui/button";
import { Rocket, RefreshCw, TrendingUp, Compass } from "lucide-react";

interface WhatBringsYouHereProps {
  allCategories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

const categoryIcons: Record<string, any> = {
  "Getting Started": Rocket,
  "Data Migration": RefreshCw,
  "Performance & Scale": TrendingUp,
  "Explore Features": Compass,
};

const WhatBringsYouHere = ({
  allCategories,
  onCategorySelect,
  selectedCategory,
}: WhatBringsYouHereProps) => {
  if (allCategories.length === 0) return null;

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    // Scroll to the webinar cards section smoothly
    const cardsSection = document.getElementById('webinar-cards');
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
          <h2 className="text-lg font-semibold whitespace-nowrap">What brings you to Atlan today?</h2>
          
          <div className="flex flex-wrap gap-3">
            {allCategories.slice(0, 4).map((category) => {
              const Icon = categoryIcons[category] || Compass;
              const isSelected = selectedCategory === category;
              
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleCategoryClick(category)}
                  className="rounded-full flex items-center gap-2 transition-all"
                >
                  <Icon className="h-4 w-4" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatBringsYouHere;
