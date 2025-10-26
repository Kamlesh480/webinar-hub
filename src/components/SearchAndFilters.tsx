import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/types/webinar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
  allTopics: string[];
  allAuthors: string[];
  allIntegrations: string[];
  hideAllTimeFilter?: boolean;
}

const SearchAndFilters = ({
  filters,
  onFilterChange,
  totalResults,
  allTopics,
  allAuthors,
  allIntegrations,
  hideAllTimeFilter = false,
}: SearchAndFiltersProps) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ ...filters, search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleTopic = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];
    onFilterChange({ ...filters, topics: newTopics });
  };

  const toggleAuthor = (author: string) => {
    const newAuthors = filters.authors.includes(author)
      ? filters.authors.filter((a) => a !== author)
      : [...filters.authors, author];
    onFilterChange({ ...filters, authors: newAuthors });
  };

  const toggleIntegration = (integration: string) => {
    const newIntegrations = filters.integrations.includes(integration)
      ? filters.integrations.filter((i) => i !== integration)
      : [...filters.integrations, integration];
    onFilterChange({ ...filters, integrations: newIntegrations });
  };

  const toggleDuration = (duration: string) => {
    const newDurations = filters.durations.includes(duration)
      ? filters.durations.filter((d) => d !== duration)
      : [...filters.durations, duration];
    onFilterChange({ ...filters, durations: newDurations });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    onFilterChange({
      search: "",
      topics: [],
      durations: [],
      dateRange: "",
      authors: [],
      integrations: [],
      categories: [],
    });
  };

  const activeFilterCount =
    filters.topics.length +
    filters.durations.length +
    filters.authors.length +
    filters.integrations.length +
    (filters.dateRange ? 1 : 0) +
    (filters.search ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Duration Filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Duration</h3>
        <div className="space-y-2">
          {["<15 min", "15-30 min", "30-60 min", "60+ min"].map((duration) => (
            <label key={duration} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.durations.includes(duration)}
                onCheckedChange={() => toggleDuration(duration)}
              />
              <span className="text-sm">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      {!hideAllTimeFilter && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Recency</h3>
          <Select value={filters.dateRange} onValueChange={(value) => onFilterChange({ ...filters, dateRange: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Topics Filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Topics</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allTopics.map((topic) => (
            <label key={topic} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.topics.includes(topic)}
                onCheckedChange={() => toggleTopic(topic)}
              />
              <span className="text-sm">{topic}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Authors Filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Speakers</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allAuthors.map((author) => (
            <label key={author} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.authors.includes(author)}
                onCheckedChange={() => toggleAuthor(author)}
              />
              <span className="text-sm">{author}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Integrations Filter */}
      {allIntegrations.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Integrations</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allIntegrations.map((integration) => (
              <label key={integration} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.integrations.includes(integration)}
                  onCheckedChange={() => toggleIntegration(integration)}
                />
                <span className="text-sm">{integration}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Desktop: Filters + Search in One Row */}
      <div className="hidden md:flex items-center gap-4">
        {/* Filters on the left */}
        <div className="flex gap-3 flex-1">
          {/* Duration */}
          <Select value={filters.durations[0] || ""} onValueChange={(value) => onFilterChange({ ...filters, durations: value ? [value] : [] })}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<15 min">&lt;15 min</SelectItem>
              <SelectItem value="15-30 min">15-30 min</SelectItem>
              <SelectItem value="30-60 min">30-60 min</SelectItem>
              <SelectItem value="60+ min">60+ min</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          {!hideAllTimeFilter && (
            <Select value={filters.dateRange} onValueChange={(value) => onFilterChange({ ...filters, dateRange: value })}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Topics */}
          <Select value={filters.topics[0] || ""} onValueChange={(value) => toggleTopic(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Topics" />
            </SelectTrigger>
            <SelectContent>
              {allTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Speakers */}
          <Select value={filters.authors[0] || ""} onValueChange={(value) => toggleAuthor(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Speakers" />
            </SelectTrigger>
            <SelectContent>
              {allAuthors.map((author) => (
                <SelectItem key={author} value={author}>{author}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Integrations */}
          {allIntegrations.length > 0 && (
            <Select value={filters.integrations[0] || ""} onValueChange={(value) => toggleIntegration(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Integrations" />
              </SelectTrigger>
              <SelectContent>
                {allIntegrations.map((integration) => (
                  <SelectItem key={integration} value={integration}>{integration}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Search on the right */}
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search webinars..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Mobile: Search + Filter Button */}
      <div className="flex md:hidden flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search webinars by title, topic, or speaker..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search results
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Legacy desktop filters - removed, now using inline filters above */}
      <div className="hidden">
        <div className="grid grid-cols-5 gap-4">
          {/* Duration */}
          <Select value={filters.durations[0] || ""} onValueChange={(value) => onFilterChange({ ...filters, durations: value ? [value] : [] })}>
            <SelectTrigger>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<15 min">&lt;15 min</SelectItem>
              <SelectItem value="15-30 min">15-30 min</SelectItem>
              <SelectItem value="30-60 min">30-60 min</SelectItem>
              <SelectItem value="60+ min">60+ min</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          {!hideAllTimeFilter && (
            <Select value={filters.dateRange} onValueChange={(value) => onFilterChange({ ...filters, dateRange: value })}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Topics */}
          <Select value={filters.topics[0] || ""} onValueChange={(value) => toggleTopic(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Topics" />
            </SelectTrigger>
            <SelectContent>
              {allTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Speakers */}
          <Select value={filters.authors[0] || ""} onValueChange={(value) => toggleAuthor(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Speakers" />
            </SelectTrigger>
            <SelectContent>
              {allAuthors.map((author) => (
                <SelectItem key={author} value={author}>{author}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Integrations */}
          {allIntegrations.length > 0 && (
            <Select value={filters.integrations[0] || ""} onValueChange={(value) => toggleIntegration(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Integrations" />
              </SelectTrigger>
              <SelectContent>
                {allIntegrations.map((integration) => (
                  <SelectItem key={integration} value={integration}>{integration}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Search on the right */}
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search webinars..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <button onClick={() => setSearchInput("")} className="ml-1 hover:bg-muted rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="gap-1">
              {topic}
              <button onClick={() => toggleTopic(topic)} className="ml-1 hover:bg-muted rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.durations.map((duration) => (
            <Badge key={duration} variant="secondary" className="gap-1">
              {duration}
              <button onClick={() => toggleDuration(duration)} className="ml-1 hover:bg-muted rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.authors.map((author) => (
            <Badge key={author} variant="secondary" className="gap-1">
              {author}
              <button onClick={() => toggleAuthor(author)} className="ml-1 hover:bg-muted rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.integrations.map((integration) => (
            <Badge key={integration} variant="secondary" className="gap-1">
              {integration}
              <button onClick={() => toggleIntegration(integration)} className="ml-1 hover:bg-muted rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              Last {filters.dateRange} days
              <button onClick={() => onFilterChange({ ...filters, dateRange: "" })} className="ml-1 hover:bg-muted rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {totalResults} {totalResults === 1 ? "result" : "results"}
      </div>
    </div>
  );
};

export default SearchAndFilters;
