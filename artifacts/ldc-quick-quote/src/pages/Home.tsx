import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  Phone,
  MessageCircle,
  X,
  CheckCircle2,
  Zap,
  MapPin,
} from "lucide-react";

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
  vehicle: z.enum(
    ["small-van", "short-wheel-base", "long-wheel-base", "luton-7-5t"],
    { required_error: "Please select a vehicle type" }
  ),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

function QuoteModal({ onClose }: { onClose: () => void }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { collection: "", delivery: "", vehicle: "small-van" },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setIsRedirecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const params = new URLSearchParams({
      pickup_suite: data.collection.trim().toUpperCase(),
      dropoff_suite: data.delivery.trim().toUpperCase(),
      vehicle: data.vehicle,
    });

    window.open(
      `https://portal.ldccourier.co.uk/order/where?${params.toString()}`,
      "_blank"
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-[#0d1f5c] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#e84b1f]/60 via-[#e84b1f] to-[#e84b1f]/60" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Get Instant Quote</h2>
            <p className="text-sm text-white/50 mt-0.5">
              No waiting. No delays.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form / Success */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {!isRedirecting ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="collection"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70 text-xs uppercase tracking-wide">
                              Collection Postcode
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. DY10..."
                                className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[#e84b1f] focus-visible:border-[#e84b1f]/50 uppercase"
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
                            <FormLabel className="text-white/70 text-xs uppercase tracking-wide">
                              Delivery Postcode
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. B1..."
                                className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[#e84b1f] focus-visible:border-[#e84b1f]/50 uppercase"
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
                          <FormLabel className="text-white/70 text-xs uppercase tracking-wide">
                            Vehicle Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-white/5 border-white/15 text-white focus:ring-[#e84b1f]">
                                <SelectValue placeholder="Select vehicle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#0d1f5c] border-white/15 text-white">
                              {vehicleOptions.map((opt) => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                  className="focus:bg-white/10 focus:text-white cursor-pointer py-2.5"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-bold mt-2 bg-[#e84b1f] hover:bg-[#d43d14] text-white shadow-lg shadow-[#e84b1f]/25 border-0"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <>
                          Get Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-3"
              >
                <div className="h-14 w-14 bg-[#e84b1f]/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-[#e84b1f]" />
                </div>
                <h3 className="text-lg font-bold text-white">Opening Portal</h3>
                <p className="text-white/50 text-sm">
                  Redirecting you to complete your quote in a new tab...
                </p>
                <button
                  onClick={() => {
                    setIsRedirecting(false);
                    form.reset();
                  }}
                  className="text-white/40 hover:text-white text-sm transition-colors mt-2"
                >
                  Start another quote
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* ── Top Announcement Bar ── */}
      <div className="bg-[#092370] text-white text-sm py-2 px-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 opacity-70" />
          Kidderminster, Worcestershire, UK
        </span>
        <a
          href="tel:+447763734549"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <Phone className="h-3.5 w-3.5" />
          + 44 7763 734549
        </a>
      </div>

      {/* ── Navigation Bar ── */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="LDC Courier"
              className="h-16 object-contain"
            />
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="text-[#092370] font-semibold border-b-2 border-[#092370] pb-0.5">Home</a>
            <a href="#" className="hover:text-[#092370] transition-colors">About Us</a>
            <a href="#" className="hover:text-[#092370] transition-colors">Our Services</a>
            <a href="#" className="hover:text-[#092370] transition-colors">Carpet &amp; Flooring Transport</a>
            <a href="#" className="hover:text-[#092370] transition-colors">Contact Us</a>
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#092370] hover:bg-[#0a2a85] text-white font-semibold px-5 py-3 rounded-lg transition-colors text-sm"
          >
            Get instant quote
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative bg-[#092370] overflow-hidden flex-1">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.jpg`}
            alt="LDC Courier fleet"
            className="w-full h-full object-cover object-center opacity-20"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left: Headline + CTA */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
                Fast.<br />
                Secure.<br />
                UK-wide.
              </h1>
              <p className="text-white/70 text-base mb-8 max-w-md leading-relaxed">
                instant estimate and guest booking for sameday, next day, pallet
                and long distance courier service across the UK
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {/* Get instant quote button */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 bg-white text-[#092370] font-bold px-6 py-3.5 rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-sm"
                >
                  Get instant<br className="hidden" /> quote
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </button>

                {/* Info blurb */}
                <div className="text-white/60 text-sm">
                  Get an Instant Quote in Seconds No<br />
                  Waiting, No Delays.
                </div>

                {/* Phone */}
                <a
                  href="tel:+447763734549"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-semibold border border-white/20"
                >
                  <Phone className="h-4 w-4" />
                  +44 7763<br />734549
                </a>
              </div>
            </div>

            {/* Right: Action Cards */}
            <div className="flex flex-col gap-4">
              {/* Top row: two cards */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="tel:+447763734549"
                  className="bg-[#0d2878]/80 hover:bg-[#0d2878] border border-white/10 rounded-xl p-5 flex items-center gap-3 transition-colors group"
                >
                  <div className="bg-white/10 rounded-full p-2.5 group-hover:bg-white/20 transition-colors">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Click to call</p>
                    <p className="text-white/50 text-xs">Speak To Dispatch</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/447763734549"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0d2878]/80 hover:bg-[#0d2878] border border-white/10 rounded-xl p-5 flex items-center gap-3 transition-colors group"
                >
                  <div className="bg-white/10 rounded-full p-2.5 group-hover:bg-white/20 transition-colors">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Whatsapp</p>
                    <p className="text-white/50 text-xs">Send Pickup Details</p>
                  </div>
                </a>
              </div>

              {/* Bottom: wide banner card */}
              <div className="bg-[#0d2878]/80 border border-white/10 rounded-xl p-5 flex items-center gap-3">
                <Zap className="h-5 w-5 text-[#e84b1f] flex-shrink-0" />
                <p className="text-white text-sm font-semibold leading-snug">
                  Instant Pricing. Immediate Confirmation. Seamless Booking Experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Modal ── */}
      <AnimatePresence>
        {modalOpen && <QuoteModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
