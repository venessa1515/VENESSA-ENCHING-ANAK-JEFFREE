import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  ListOrdered,
  Sparkles,
  User,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { StudentProfile } from '../types/game';

interface SlideContainerProps {
  currentSlide: number;
  totalSlides: number;
  onNavigate: (slideIndex: number) => void;
  studentProfile: StudentProfile;
  totalScore: number;
  onReset: () => void;
  children: React.ReactNode;
}

export const SLIDE_TITLES = [
  'Pengenalan Zoo Pintar',
  'Profil Murid & Kemahiran KV+KV',
  'Manual Penggunaan',
  'Peta 5 Misi Zoo',
  'Misi 1: Kuda (ku + da)',
  'Misi 2: Rusa (ru + sa)',
  'Misi 3: Kera (ke + ra)',
  'Misi 4: Babi (ba + bi)',
  'Misi 5: Nuri (nu + ri)',
  'Skor & Kemajuan Murid',
  'Tahniah & Sijil Pencapaian',
];

export const SlideContainer: React.FC<SlideContainerProps> = ({
  currentSlide,
  totalSlides,
  onNavigate,
  studentProfile,
  totalScore,
  onReset,
  children,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSlideMenu, setShowSlideMenu] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundManager.setMuted(nextState);
    if (!nextState) {
      soundManager.playClick();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentSlide > 1) {
      soundManager.playClick();
      onNavigate(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      soundManager.playClick();
      onNavigate(currentSlide + 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-emerald-50/40 to-teal-50 flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* Top Presentation Bar */}
      <header className="w-full max-w-6xl flex items-center justify-between gap-4 py-2 px-3 sm:px-5 bg-white/85 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-xs">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-display font-bold text-lg shadow-xs">
            🐾
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-display font-bold text-emerald-900 tracking-tight leading-tight">
              Misi Zoo Pintar
            </h1>
            <p className="text-xs text-emerald-700/80 font-medium hidden sm:block">
              Kemahiran KV+KV · Pemulihan Khas BM Tahun 1
            </p>
          </div>
        </div>

        {/* Student info if filled */}
        {studentProfile.name && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/70 rounded-full text-xs font-semibold text-emerald-800">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{studentProfile.name}</span>
            {studentProfile.className && (
              <>
                <span className="text-emerald-300">·</span>
                <span className="text-emerald-700">{studentProfile.className}</span>
              </>
            )}
            <span className="text-emerald-300">·</span>
            <span className="text-amber-600 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {totalScore} Markah
            </span>
          </div>
        )}

        {/* Top Control Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Slide Drawer Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowSlideMenu(!showSlideMenu);
            }}
            title="Senarai Slaid"
            aria-label="Senarai Slaid"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline font-mono">
              Slaid {currentSlide}/{totalSlides}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Buka Suara' : 'Senyapkan Suara'}
            aria-label={isMuted ? 'Buka Suara' : 'Senyapkan Suara'}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Skrin Penuh"
            aria-label="Skrin Penuh"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowResetModal(true);
            }}
            title="Mula Semula"
            aria-label="Mula Semula"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              🔄
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              Mula Semula Permainan?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Semua markah misi akan diset semula ke Slaid 1. Adakah anda pasti?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  onReset();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Ya, Mula Semula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Drawer Dropdown Modal */}
      {showSlideMenu && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Lompat ke Slaid Pembentangan
              </h3>
              <button
                onClick={() => setShowSlideMenu(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {SLIDE_TITLES.map((title, idx) => {
                const sNum = idx + 1;
                const isCurrent = sNum === currentSlide;
                return (
                  <button
                    key={sNum}
                    onClick={() => {
                      soundManager.playClick();
                      onNavigate(sNum);
                      setShowSlideMenu(false);
                    }}
                    className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sNum}
                    </span>
                    <span className="leading-snug">{title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main 16:9 Presentation Slide Canvas */}
      <main className="w-full max-w-6xl my-auto py-2 flex items-center justify-center">
        <div className="w-full aspect-[16/9] max-h-[76vh] bg-white rounded-3xl shadow-xl border-2 border-emerald-100/80 overflow-hidden relative flex flex-col">
          {children}
        </div>
      </main>

      {/* Bottom Presentation Slide Navigation Toolbar */}
      <footer className="w-full max-w-6xl flex items-center justify-between gap-4 py-2 px-4 bg-white/85 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-xs">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentSlide === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
            currentSlide === 1
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 active:scale-95 border border-emerald-200'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Slide Progress Indicator Dots */}
        <div className="flex items-center gap-1 sm:gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => {
            const sNum = i + 1;
            const isCurrent = sNum === currentSlide;
            const isPassed = sNum < currentSlide;
            return (
              <button
                key={sNum}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate(sNum);
                }}
                title={`Slaid ${sNum}: ${SLIDE_TITLES[i]}`}
                className={`transition-all rounded-full ${
                  isCurrent
                    ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-emerald-600 rounded-full'
                    : isPassed
                    ? 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-emerald-300 hover:bg-emerald-400'
                    : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentSlide === totalSlides}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
            currentSlide === totalSlides
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-sm'
          }`}
        >
          <span className="hidden sm:inline">Seterusnya</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
