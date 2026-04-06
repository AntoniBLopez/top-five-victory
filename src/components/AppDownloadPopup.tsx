import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone, Apple, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import pulpoMascot from "@/assets/logo.png";

// Placeholder store URLs — replace with real ones
const IOS_STORE_URL = "https://apps.apple.com/app/verboflow/id0000000000";
const ANDROID_STORE_URL = "https://play.google.com/store/apps/details?id=app.lovable.a6cd04ea6d3c4934ba5109b6f5333b25";

// Placeholder QR images (using QR code API)
const IOS_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(IOS_STORE_URL)}&bgcolor=ffffff&color=000000`;
const ANDROID_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ANDROID_STORE_URL)}&bgcolor=ffffff&color=000000`;

type OS = "ios" | "android" | "desktop";

function detectOS(): OS {
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

function isMobileOrTablet(): boolean {
  return detectOS() !== "desktop";
}

interface AppDownloadPopupProps {
  open: boolean;
  onClose: () => void;
}

const AppDownloadPopup = ({ open, onClose }: AppDownloadPopupProps) => {
  const [os, setOs] = useState<OS>("desktop");

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const mobile = os !== "desktop";

  const handleDownload = () => {
    const url = os === "ios" ? IOS_STORE_URL : ANDROID_STORE_URL;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-transparent px-6 pb-4 pt-6 text-center">
              <img
                src={pulpoMascot}
                alt="VerboFlow mascota"
                className="mx-auto mb-3 h-24 w-24 rounded-2xl object-cover shadow-lg ring-2 ring-primary/20"
              />
              <h3 className="text-xl font-extrabold text-foreground">
                Descarga VerboFlow
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Aprende conjugaciones alemanas donde quieras 🇩🇪
              </p>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-4">
              {mobile ? (
                /* Mobile: single button */
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    {os === "ios" ? (
                      <Apple className="h-7 w-7 text-foreground" />
                    ) : (
                      <Smartphone className="h-7 w-7 text-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {os === "ios"
                      ? "Disponible en App Store"
                      : "Disponible en Google Play"}
                  </p>
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    className="h-14 w-full rounded-2xl text-base font-bold gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Descargar para {os === "ios" ? "iPhone / iPad" : "Android"}
                  </Button>
                  <button
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Continuar en el navegador
                  </button>
                </div>
              ) : (
                /* Desktop: QR codes */
                <div className="space-y-5">
                  <p className="text-center text-sm text-muted-foreground">
                    Escanea el código QR con tu teléfono
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* iOS */}
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-md">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Apple className="h-4 w-4" />
                        iOS
                      </div>
                      <div className="overflow-hidden rounded-xl bg-white p-2">
                        <img
                          src={IOS_QR}
                          alt="QR App Store"
                          className="h-32 w-32"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">App Store</span>
                    </div>

                    {/* Android */}
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-md">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Smartphone className="h-4 w-4" />
                        Android
                      </div>
                      <div className="overflow-hidden rounded-xl bg-white p-2">
                        <img
                          src={ANDROID_QR}
                          alt="QR Google Play"
                          className="h-32 w-32"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">Google Play</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    <a
                      href={IOS_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      App Store
                    </a>
                    <span className="text-muted-foreground">·</span>
                    <a
                      href={ANDROID_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Google Play
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppDownloadPopup;
