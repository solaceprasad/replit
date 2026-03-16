import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Background"
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-white/10 bg-card/80 backdrop-blur-md">
        <CardContent className="pt-10 pb-8 px-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-destructive/20 p-4 rounded-full">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-display text-white">404</h1>
            <p className="text-muted-foreground text-lg">Page not found</p>
          </div>

          <p className="text-sm text-white/60">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="w-full mt-4" size="lg">
              Return to Quick Quote
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
