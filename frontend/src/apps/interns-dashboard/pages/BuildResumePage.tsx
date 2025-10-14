import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const BuildResumePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Link to="/interns" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="shadow-medium">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Build Your Resume</CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                This is a placeholder page for the resume builder feature. 
                Here you would be able to create and customize your professional resume.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-gradient-primary">
                  Start Building Resume
                </Button>
                <Button variant="outline" className="w-full">
                  Upload Existing Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BuildResumePage;


