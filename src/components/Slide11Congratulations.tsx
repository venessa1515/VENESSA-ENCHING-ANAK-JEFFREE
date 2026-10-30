import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, Volume2, Star, Sparkles, Heart } from 'lucide-react';
import { StudentProfile, MissionProgress } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface Slide11CongratulationsProps {
  studentProfile: StudentProfile;
  totalScore: number;
  progress: MissionProgress;
  onResetGame: () => void;
}

export const Slide11Congratulations: React.FC<Slide11CongratulationsProps> = ({
  studentProfile,
  totalScore,
  progress,
  onResetGame,
}) => {
  const currentDate = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);

  useEffect(() => {
    // Fire celebratory confetti bursts
    soundManager.playFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);
    } catch {
      // safe fallback
    }

    soundManager.playAudioOrSpeak(
      'praise_speech',
      `Tahniah dan syabas kepada ${studentProfile.name || 'murid pintar'} dari kelas ${
        studentProfile.className || 'Tahun 1'
      }! Anda telah berjaya menjadi Wira Zoo Pintar dan menguasai kemahiran K V tambah K V dengan cemerlang!`,
      { rate: 0.82 }
    );
  }, [studentProfile.name, studentProfile.className]);

  const handlePrintCertificate = () => {
    soundManager.playClick();
    window.print();
  };

  const handleReadAloud = () => {
    soundManager.playClick();
    soundManager.playAudioOrSpeak(
      'praise_speech',
      `Tahniah dan syabas kepada ${studentProfile.name || 'murid pintar'} dari kelas ${
        studentProfile.className || 'Tahun 1'
      }! Anda telah berjaya menjadi Wira Zoo Pintar dan menguasai kemahiran K V tambah K V dengan cemerlang!`,
      { rate: 0.82 }
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-amber-50/60 via-emerald-50/50 to-teal-50/50 p-4 sm:p-6">
      {/* Top Praise Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-100 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-xs animate-gentle-bounce">
            🏆
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-emerald-950 tracking-tight leading-tight">
              Tahniah & Syabas!
            </h2>
            <p className="text-xs text-emerald-700 font-semibold">
              Anda telah berjaya menamatkan semua misi haiwan KV+KV dengan cemerlang!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReadAloud}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dengar Ucapan 🔊</span>
          </button>

          <button
            onClick={handlePrintCertificate}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-display font-bold transition-all shadow-xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Sijil 🖨️</span>
          </button>
        </div>
      </div>

      {/* Digital Certificate Container */}
      <div
        id="printable-certificate"
        className="my-auto py-2 flex items-center justify-center"
      >
        <div className="w-full max-w-2xl bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-300 text-xl font-bold select-none">✦</div>
          <div className="absolute top-2 right-2 text-amber-300 text-xl font-bold select-none">✦</div>
          <div className="absolute bottom-2 left-2 text-amber-300 text-xl font-bold select-none">✦</div>
          <div className="absolute bottom-2 right-2 text-amber-300 text-xl font-bold select-none">✦</div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Sijil Pencapaian Rasmi
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight">
              SIJIL PENGHARGAAN WIRA ZOO PINTAR
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Dengan ini diperakui bahawa
            </p>

            {/* Student Name */}
            <div className="py-1">
              <div className="inline-block border-b-2 border-emerald-500 px-6 sm:px-10 pb-1">
                <span className="font-display font-black text-2xl sm:text-3xl text-emerald-800 uppercase tracking-wide">
                  {studentProfile.name || 'Murid Pintar'}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">
                Kelas: <span className="text-emerald-700">{studentProfile.className || 'Tahun 1'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed pt-1">
              Telah berjaya menguasai kemahiran membaca dan membina perkataan{' '}
              <strong className="text-emerald-800 font-bold">KV + KV</strong> bagi 5 misi haiwan zoo:
            </p>

            {/* 5 Mastered Word Badges */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap py-1">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-bold">
                🐴 ku + da
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-mono font-bold">
                🦌 ru + sa
              </span>
              <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-mono font-bold">
                🐒 ke + ra
              </span>
              <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-mono font-bold">
                🐷 ba + bi
              </span>
              <span className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-mono font-bold">
                🦜 nu + ri
              </span>
            </div>

            {/* Bottom Certificate Meta Row */}
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Tarikh</span>
                <span className="font-medium text-slate-700">{currentDate}</span>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-400 flex items-center justify-center text-amber-900 font-extrabold text-xs shadow-xs">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-600" />
                </div>
                <span className="text-[9px] font-bold text-amber-800 mt-0.5">Misi Zoo Pintar</span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Pencapaian</span>
                <span className="font-mono font-bold text-emerald-700">
                  {totalStars} ⭐ · {totalScore} Pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Play Again Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-100 no-print">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Terima kasih kerana menyertai pengembaraan Misi Zoo Pintar!</span>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onResetGame();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Main Semula dari Awal</span>
        </button>
      </div>
    </div>
  );
};
