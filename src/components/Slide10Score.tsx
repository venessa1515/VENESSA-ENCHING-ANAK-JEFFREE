import React, { useEffect } from 'react';
import { Award, Star, Volume2, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { MISSIONS_DATA } from '../data/missions';
import { MissionProgress, StudentProfile } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface Slide10ScoreProps {
  progress: MissionProgress;
  totalScore: number;
  studentProfile: StudentProfile;
  onNavigateToSlide: (slideIndex: number) => void;
  onProceedToCertificate: () => void;
}

export const Slide10Score: React.FC<Slide10ScoreProps> = ({
  progress,
  totalScore,
  studentProfile,
  onNavigateToSlide,
  onProceedToCertificate,
}) => {
  const completedMissions = MISSIONS_DATA.filter((m) => progress[m.id]?.completed);
  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);
  const maxPossibleScore = MISSIONS_DATA.length * 30; // 5 * 30 = 150 or 5 * 20 = 100
  const maxPossibleStars = MISSIONS_DATA.length * 3; // 15 stars

  useEffect(() => {
    soundManager.playCorrect();
    soundManager.speak(
      `Tahniah ${studentProfile.name || 'murid'}! Anda telah memperoleh ${totalScore} markah dan ${totalStars} bintang dalam Misi Zoo Pintar!`,
      { rate: 0.85 }
    );
  }, [totalScore, totalStars, studentProfile.name]);

  const handleSpeakWord = (word: string, syllables: string) => {
    soundManager.playClick();
    soundManager.speak(`${word}. ${syllables}`, { rate: 0.8 });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-amber-50/50 via-emerald-50/40 to-teal-50/50 p-4 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>PAPAN SKOR & PENGUASAAN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-950 mt-0.5">
            Laporan Skor: {studentProfile.name || 'Murid Pintar'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Kelas: {studentProfile.className || 'Tahun 1'} · Kemahiran KV+KV Pemulihan Khas
          </p>
        </div>

        {/* Score & Star Pill Displays */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-200 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Jumlah Markah</span>
            <span className="text-lg sm:text-xl font-mono font-bold text-emerald-700">
              {totalScore} / {maxPossibleScore}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Bintang Emas</span>
            <span className="text-lg sm:text-xl font-mono font-bold text-amber-900 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {totalStars} / {maxPossibleStars}
            </span>
          </div>
        </div>
      </div>

      {/* Mastery List: 5 Animal KV+KV Words */}
      <div className="my-auto py-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span>Senarai Perkataan KV + KV Yang Dikuasai:</span>
          <span className="text-emerald-700 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Tekan audio untuk dengar semula
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {MISSIONS_DATA.map((mission, idx) => {
            const isCompleted = progress[mission.id]?.completed;
            const stars = progress[mission.id]?.stars || 0;
            const slideNum = 5 + idx;

            return (
              <div
                key={mission.id}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-white border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Misi {idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] text-amber-600 font-bold">Belum</span>
                    )}
                  </div>

                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-200">
                    <img
                      src={mission.imageSrc}
                      alt={mission.animalName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 text-center capitalize">
                    {mission.animalName}
                  </h3>

                  <div className="flex items-center justify-center gap-1 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 py-1 rounded-md mt-1">
                    <span>{mission.firstSyllable}</span>
                    <span className="text-slate-400">+</span>
                    <span>{mission.secondSyllable}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      handleSpeakWord(mission.animalName, `${mission.firstSyllable}... ${mission.secondSyllable}`)
                    }
                    title="Dengar sebutan"
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  </button>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => onNavigateToSlide(slideNum)}
                      className="text-[10px] font-bold text-amber-700 underline"
                    >
                      Cuba
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
        <button
          onClick={() => onNavigateToSlide(4)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembali ke Peta Misi</span>
        </button>

        <button
          onClick={() => {
            soundManager.playFanfare();
            onProceedToCertificate();
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <span>Buka Sijil Tahniah & Syabas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
