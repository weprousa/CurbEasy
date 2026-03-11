import React, { useRef, useState, useEffect } from 'react';
import { scanSignRules } from '../services/geminiService';
import { Theme } from '../types';

interface ScannerViewProps {
  onBack: () => void;
  onAnalysisResult: (result: string) => void;
  theme: Theme;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onBack, onAnalysisResult, theme }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Try with environment camera first
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { ideal: 'environment' } } 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.warn("Primary camera constraint failed, trying fallback:", err);
        try {
          // Fallback to any available camera
          const s = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        } catch (fallbackErr) {
          console.error("Camera access error:", fallbackErr);
          setError("Camera access denied. Please enable camera permissions.");
        }
      }
    };

    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || scanning) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64 = dataUrl.split(',')[1];

    setScanning(true);
    const result = await scanSignRules(base64);
    setScanning(false);
    onAnalysisResult(result);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      
      setScanning(true);
      const result = await scanSignRules(base64);
      setScanning(false);
      onAnalysisResult(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="p-4 flex items-center justify-between text-white bg-black/50 absolute top-0 w-full z-10">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="font-bold">Scan Parking Sign</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow relative overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-white text-center p-10 space-y-4">
            <span className="material-symbols-outlined text-6xl text-red-500">error</span>
            <p>{error}</p>
            <button 
              onClick={onBack} 
              className={`px-6 py-2 rounded-full transition-colors ${
                theme === 'colorful' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-primary'
              }`}
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Scanner Frame Overlay */}
            <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-80 border-2 border-white/80 rounded-lg relative">
                <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${theme === 'dark' ? 'border-blue-500' : 'border-primary'}`}></div>
                <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${theme === 'dark' ? 'border-blue-500' : 'border-primary'}`}></div>
                <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${theme === 'dark' ? 'border-blue-500' : 'border-primary'}`}></div>
                <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${theme === 'dark' ? 'border-blue-500' : 'border-primary'}`}></div>
                {scanning && (
                  <div className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_15px] animate-[scan_2s_infinite] ${
                    theme === 'dark' ? 'bg-blue-500 shadow-blue-500' : 'bg-primary shadow-primary'
                  }`}></div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="p-10 bg-black flex flex-col items-center gap-4">
        <p className="text-white/70 text-sm text-center">Position the parking sign within the frame</p>
        <div className="flex items-center gap-10">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            title="Upload from gallery"
          >
            <span className="material-symbols-outlined text-[28px]">image</span>
          </button>

          <button 
            onClick={takePhoto}
            disabled={scanning || !!error}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-8 border-white/20 hover:scale-105 transition-transform disabled:opacity-50"
          >
            {scanning ? (
               <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${
                 theme === 'dark' ? 'border-blue-500' : 'border-primary'
               }`}></div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-300"></div>
            )}
          </button>

          <div className="w-12"></div> {/* Spacer for symmetry */}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScannerView;
