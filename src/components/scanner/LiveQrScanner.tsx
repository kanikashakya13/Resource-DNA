import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  ArrowLeft,
  Camera,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  QrCode,
  FileCheck,
  Building,
  User,
  Calendar,
  Layers,
} from 'lucide-react';
import { Booking } from '../../types';

interface LiveQrScannerProps {
  scannerRole: 'researcher';
  action: 'handover' | 'return';
  onBack: () => void;
}

export const LiveQrScanner: React.FC<LiveQrScannerProps> = ({ scannerRole, action, onBack }) => {
  const { user, verifyQrCode, bookings } = useApp();

  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    booking?: Booking;
    actionType?: 'handover' | 'return';
  } | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const qrRegionId = 'reader-region';
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsCameraActive(false);
  }, []);

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    // Stop camera immediately upon detection
    await stopCamera();

    const result = verifyQrCode(decodedText, action);
    setScanResult(result);
  }, [stopCamera, verifyQrCode, action]);

  // Start real camera stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setScanResult(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // parse error / scanning frame (silent)
        }
      );
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera start error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Permission') || errMsg.includes('NotAllowedError')) {
        setCameraError('Camera permission was denied. Allow camera access in your browser settings, then retry or enter a demo token below.');
      } else if (errMsg.includes('NotFoundError') || errMsg.includes('DevicesNotFoundError')) {
        setCameraError('No camera is available on this device. You can enter a demo token below.');
      } else if (errMsg.includes('NotReadableError')) {
        setCameraError('The camera is busy or unavailable. Close other camera apps and retry, or enter a demo token below.');
      } else {
        setCameraError('Could not start the camera. Camera access may require HTTPS or localhost. You can enter a demo token below.');
      }
      setIsCameraActive(false);
    }
  }, [handleScanSuccess]);

  // Camera permission is requested only after the user explicitly starts scanning.
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop()
          .then(() => html5QrCodeRef.current?.clear())
          .catch((error: unknown) => console.warn('Error cleaning up scanner:', error));
      }
    };
  }, []);

  const handleManualVerify = (codeToTest?: string) => {
    const code = (codeToTest || manualCode).trim();
    if (!code) return;
    const result = verifyQrCode(code, action);
    setScanResult(result);
  };

  const handleSafeExit = async () => {
    await stopCamera();
    onBack();
  };

  // Find sample valid QR tokens for test verification convenience
  const relevantBookings = bookings.filter((booking) => {
    if (booking.researcherId !== user?.id) return false;
    if (action === 'handover') {
      return Boolean(booking.handoverQrCode) &&
        !booking.handoverVerifiedAt &&
        ((!booking.requiresDelivery && booking.status === 'approved') ||
          (booking.requiresDelivery && booking.status === 'in_delivery' && booking.deliveryStatus === 'in_transit'));
    }
    return Boolean(booking.returnQrCode) &&
      !booking.returnVerifiedAt &&
      ((!booking.requiresDelivery && booking.status === 'active') ||
        (booking.requiresDelivery && booking.status === 'return_pending' && booking.deliveryStatus === 'return_transit'));
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Bar with Visible Back Button */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleSafeExit}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-bold text-white">
            {action === 'handover' ? 'Scan Handover QR' : 'Scan Return QR'}
          </span>
        </div>

        <div className="w-20 text-right">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
            {scannerRole}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col items-center">
        {/* Scanner Viewfinder Box */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-base font-bold text-white">
              {action === 'handover' ? 'Researcher Handover Verification' : 'Researcher Return Verification'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Scan the {action} QR displayed by the provider or assigned delivery partner.
            </p>
          </div>

          {/* Video Container */}
          <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
            <div id={qrRegionId} className="w-full h-full" />

            {/* Viewfinder Target Graphic */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-cyan-400/80 rounded-xl relative">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-cyan-400" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-cyan-400" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-cyan-400" />
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {!isCameraActive && !cameraError && (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Camera is off until you start scanning.</p>
                <button
                  onClick={startCamera}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Start Camera
                </button>
              </div>
            )}

            {cameraError && (
              <div className="p-4 text-center max-w-xs">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-amber-200 leading-relaxed">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-md border border-slate-600 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Retry Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* Camera controls */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Local demo validation only — not server authenticated</span>
            </span>
            {isCameraActive && (
              <button
                onClick={stopCamera}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Pause Camera
              </button>
            )}
          </div>
        </div>

        {/* Verification Result Card */}
        {scanResult && (
          <div
            className={`w-full max-w-md rounded-2xl p-5 mb-6 border transition-all ${
              scanResult.success
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100 shadow-lg shadow-emerald-950/50'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {scanResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-sm">
                  {scanResult.success ? 'Verification Successful' : 'Verification Issue'}
                </h3>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{scanResult.message}</p>

                {scanResult.booking && (
                  <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5 text-xs">
                    <p className="font-semibold text-white">
                      Resource: {scanResult.booking.resourceName}
                    </p>
                    <p className="text-slate-300">Booking ID: {scanResult.booking.id}</p>
                    <p className="text-slate-300">
                      Researcher: {scanResult.booking.researcherName} ({scanResult.booking.researcherInstitution})
                    </p>
                    <p className="text-slate-300">
                      Current Status: <span className="font-mono text-cyan-300 uppercase">{scanResult.booking.status}</span>
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSafeExit}
                    className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setScanResult(null);
                      startCamera();
                    }}
                    className="py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Code Verification (Direct Token Input & Quick Selection) */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-300 font-semibold">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Direct QR Token Input / Simulation</span>
          </div>
          <p className="text-slate-400 mb-3 text-[11px]">
            In this browser-only demo, camera scanning and manual entry use local demo data; no backend validates the token:
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={action === 'handover' ? 'Scan or enter a handover demo token' : 'Scan or enter a return demo token'}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500"
            />
            <button
              onClick={() => handleManualVerify()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg cursor-pointer"
            >
              Verify
            </button>
          </div>

          {/* Quick clickable tokens from active records */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Eligible {action} demo tokens:</p>
            {relevantBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                <span className="truncate max-w-[190px] text-slate-300 text-[11px]">
                  {b.resourceName.split(' ')[0]} ({b.id})
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const code = action === 'handover' ? b.handoverQrCode : b.returnQrCode;
                      setManualCode(code);
                      handleManualVerify(code);
                    }}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] rounded"
                  >
                    Test {action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
