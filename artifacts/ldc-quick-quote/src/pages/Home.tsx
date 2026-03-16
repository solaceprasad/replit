import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, PhoneCall, CheckCircle2, ArrowRight } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleOptions = [
  { value: "small-van", label: "Small Van" },
  { value: "short-wheel-base", label: "Short Wheel Base" },
  { value: "long-wheel-base", label: "Long Wheel Base" },
  { value: "luton-7-5t", label: "Luton / 7.5T Vehicle" },
] as const;

const quoteSchema = z.object({
  collection: z.string().min(2, "Please enter a collection postcode"),
  delivery: z.string().min(2, "Please enter a delivery postcode"),
  vehicle: z.enum(["small-van", "short-wheel-base", "long-wheel-base", "luton-7-5t"], {
    required_error: "Please select a vehicle type",
  }),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export default function Home() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      collection: "",
      delivery: "",
      vehicle: "small-van",
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setIsRedirecting(true);
    
    // Simulate network delay for polish
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const params = new URLSearchParams({
      pickup_suite: data.collection.trim().toUpperCase(),
      dropoff_suite: data.delivery.trim().toUpperCase(),
      vehicle: data.vehicle,
    });

    const portalUrl = `https://portal.ldccourier.co.uk/order/where?${params.toString()}`;
    window.open(portalUrl, "_blank");
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-background">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.jpg`}
          alt="LDC Courier logistics background"
          className="w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 w-full"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="LDC Courier"
              className="h-16 object-contain drop-shadow-lg brightness-0 invert"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Instant Courier Quote
          </h1>
          <p className="text-lg text-muted-foreground max-w-[320px] mx-auto balance leading-relaxed">
            Fast, reliable same-day & next-day delivery across the UK.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <Card className="border-white/10 shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
            
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!isRedirecting ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="collection"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/80">Collection Postcode</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. DY10 1AA" 
                                    className="h-12 bg-input/50 border-white/10 focus-visible:ring-primary focus-visible:bg-input text-white uppercase"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400 text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="delivery"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/80">Delivery Postcode</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. B1 1AA" 
                                    className="h-12 bg-input/50 border-white/10 focus-visible:ring-primary focus-visible:bg-input text-white uppercase"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="vehicle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Vehicle Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-input/50 border-white/10 focus:ring-primary text-white">
                                    <SelectValue placeholder="Select vehicle type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-popover border-white/10 text-white">
                                  {vehicleOptions.map((option) => (
                                    <SelectItem 
                                      key={option.value} 
                                      value={option.value}
                                      className="focus:bg-white/10 focus:text-white cursor-pointer py-3"
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400 text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 group"
                            disabled={form.formState.isSubmitting}
                          >
                            {form.formState.isSubmitting ? (
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                              <>
                                Get Quote
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center space-y-4"
                  >
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Opening Portal</h3>
                    <p className="text-muted-foreground">
                      Redirecting you to complete your quote in a new tab...
                    </p>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsRedirecting(false);
                        form.reset();
                      }}
                      className="mt-4 text-white/60 hover:text-white"
                    >
                      Start another quote
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Contact Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <a 
            href="tel:0156260360" 
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
          >
            <PhoneCall className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="font-medium text-lg">Or call us: 01562 60360</span>
          </a>
          <p className="text-xs text-white/40 mt-2 uppercase tracking-wider font-semibold">
            Available Mon–Fri 8am–6pm
          </p>
        </motion.div>
      </div>
    </div>
  );
}
