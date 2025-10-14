import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { internshipService, InternshipResponse } from "@/services/internship.service";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredResults, setFilteredResults] = useState<InternshipResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      if (debouncedSearchTerm) {
        try {
          const results = await internshipService.getAllInternships();
          const filtered = results.filter(
            (result) =>
              result.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              (result.company_name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              (result.location || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              (result.skills || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
          setFilteredResults(filtered);
        } catch (error) {
          console.error("Error fetching internships:", error);
          setFilteredResults([]);
        }
      } else {
        setFilteredResults([]);
      }
    };

    fetchInternships();
  }, [debouncedSearchTerm]);

  const handleResultClick = (id: string) => {
    onClose();
    navigate(`/internship-description/${id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center p-6 border-b bg-gradient-subtle">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence>
              {filteredResults.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No results found" : "Start typing to search..."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => handleResultClick(result.id)}
                      className="p-4 border rounded-lg cursor-pointer hover:shadow-medium transition-smooth bg-gradient-card"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 truncate">
                            {result.title}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium">
                            {result.company_name || 'Company'}
                          </p>
                        </div>
                        <Badge className="ml-2 bg-primary text-primary-foreground flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs">{result.match_percentage || 85}%</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {result.location || 'Location not specified'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {result.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {(result.skills || '').split(',').filter((s: string) => s.trim()).slice(0, 3).map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs border-primary/20 text-primary"
                          >
                            {skill.trim()}
                          </Badge>
                        ))}
                        {(result.skills || '').split(',').filter((s: string) => s.trim()).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(result.skills || '').split(',').filter((s: string) => s.trim()).length - 3}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};


