import React, { useState } from 'react';
import { Play, Volume2, Sparkles, BookOpen, Heart } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { ZOO_BANNER_IMG } from '../data/missions';

interface Slide1IntroProps {
  onStart: () => void;
}

export const Slide1Intro: React.FC<Slide1IntroProps> = ({ onStart }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const introText =
    'Selamat datang ke Misi Zoo Pintar! Mari kita mengembara di Zoo sambil belajar kemahiran Konsonan Vokal tambah Konsonan Vokal bersama haiwan-haiwan yang comel. Tekan butang Mula Pengembaraan untuk bermula.';

  const handleReadAloud = () => {
    soundManager.playClick();
    setIsSpeaking(true);
    soundManager.playAudioOrSpeak('intro_narration', introText, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="w-full h-full relative flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-emerald-50/70 via-amber-50/50 to-teal-50/60 p-4 sm:p-8">
      {/* Left Column: Image banner */}
      <div className="w-full md:w-1/2 h-44 sm:h-auto rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-sm relative group shrink-0">
        <img
          src={ZOO_BANNER_IMG}
          alt="Pintu Gerbang Misi Zoo Pintar"
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent flex items-end p-3">
          <span className="text-xs font-semibold text-white/95 px-2.5 py-1 rounded-md bg-emerald-900/60 backdrop-blur-xs flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            Mesra Murid Pemulihan Bahasa Melayu Tahun 1
          </span>
        </div>
      </div>

      {/* Right Column: Title & Actions */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-2 sm:p-6 overflow-y-auto">
        <div className="space-y-3 sm:space-y-4">
          {/* Subtle Category Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wide">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>PEMULIHAN KHAS BAHASA MELAYU</span>
            <span aria-hidden="true">·</span>
            <span>KEMAHIRAN 5</span>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-emerald-950 leading-tight tracking-tight">
              Misi Zoo <span className="text-emerald-600 underline decoration-amber-300 decoration-wavy underline-offset-8">Pintar</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Pengembaraan interaktif membaca & membina perkataan{' '}
              <strong className="text-emerald-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
                KV + KV
              </strong>
            </p>
          </div>

          {/* Audio helper button */}
          <div className="pt-1">
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isSpeaking
                  ? 'bg-amber-100 border-amber-300 text-amber-900 animate-gentle-pulse'
                  : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>{isSpeaking ? 'Sedang Membaca Arahan...' : 'Dengar Arahan Suara 🔊'}</span>
            </button>
          </div>

          {/* Features Checklist */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-emerald-100">
              <span className="text-base">🐴</span>
              <span className="font-semibold">5 Misi Haiwan</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-emerald-100">
              <span className="text-base">🔊</span>
              <span className="font-semibold">Sokongan Audio</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-emerald-100">
              <span className="text-base">⭐</span>
              <span className="font-semibold">Kutip Bintang</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-emerald-100">
              <span className="text-base">📜</span>
              <span className="font-semibold">Sijil Digital</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 sm:pt-6">
          <button
            onClick={() => {
              soundManager.playFanfare();
              onStart();
            }}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-display font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Mula Pengembaraan</span>
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
