import React from 'react';
import { MapPin, Star, Play, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { MISSIONS_DATA } from '../data/missions';
import { MissionProgress } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface Slide4MapProps {
  progress: MissionProgress;
  onSelectMission: (slideIndex: number) => void;
  onStartFirstMission: () => void;
}

export const Slide4Map: React.FC<Slide4MapProps> = ({
  progress,
  onSelectMission,
  onStartFirstMission,
}) => {
  const handleMapAudio = () => {
    soundManager.playClick();
    soundManager.playAudioOrSpeak(
      'map_narration',
      'Terdapat lima misi haiwan di Zoo Pintar. Misi satu: Kuda. Misi dua: Rusa. Misi tiga: Kera. Misi empat: Babi. Misi lima: Nuri. Pilih satu misi untuk mula bermain!'
    );
  };

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-teal-50/50 via-emerald-50/40 to-amber-50/50 p-4 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>PETA PENGEMBARAAN ZOO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-950 mt-0.5">
            5 Misi Zoo Pintar (KV + KV)
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleMapAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dengar Arahan Peta 🔊</span>
          </button>

          <div className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{completedCount}/5 Selesai</span>
          </div>
        </div>
      </div>

      {/* 5 Animal Mission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-auto py-2">
        {MISSIONS_DATA.map((mission, idx) => {
          const missionNum = idx + 1;
          const slideNumber = 4 + missionNum; // Slide 5 to 9
          const missionProg = progress[mission.id];
          const isDone = missionProg?.completed;
          const starsEarned = missionProg?.stars || 0;

          return (
            <div
              key={mission.id}
              onClick={() => {
                soundManager.playAnimalEffect(mission.animalName);
                onSelectMission(slideNumber);
              }}
              className={`group cursor-pointer rounded-2xl bg-white border-2 transition-all p-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              {/* Mission Badge & Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Misi {missionNum}
                  </span>
                  {isDone ? (
                    <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="text-amber-600 text-[11px] font-bold">Terbuka</span>
                  )}
                </div>

                {/* Animal Thumbnail */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative mb-2.5">
                  <img
                    src={mission.imageSrc}
                    alt={mission.animalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-white/90 shadow-xs">
                    <Volume2 className="w-3 h-3 text-emerald-700" />
                  </div>
                </div>

                {/* Animal Name & Syllable preview */}
                <h3 className="font-display font-bold text-base text-slate-900 capitalize flex items-center justify-between">
                  <span>{mission.animalName}</span>
                  <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    {mission.firstSyllable}+{mission.secondSyllable}
                  </span>
                </h3>
              </div>

              {/* Bottom Star Rating & Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 ${
                        starIdx <= starsEarned
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-bold text-emerald-700 group-hover:underline">
                  Masuk ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Row */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
        <p className="text-xs text-slate-500">
          Tip: Anda boleh menyelesaikan misi dalam apa jua urutan pilihan!
        </p>

        <button
          onClick={() => {
            soundManager.playCorrect();
            onStartFirstMission();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-xs transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Mula Misi 1 (Kuda)</span>
        </button>
      </div>
    </div>
  );
};
