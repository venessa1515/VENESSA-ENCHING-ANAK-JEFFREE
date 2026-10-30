import React, { useState } from 'react';
import { User, School, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface Slide2ProfileProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onNext: () => void;
}

export const Slide2Profile: React.FC<Slide2ProfileProps> = ({
  studentProfile,
  onUpdateProfile,
  onNext,
}) => {
  const [name, setName] = useState(studentProfile.name || 'Adib');
  const [className, setClassName] = useState(studentProfile.className || '1 Pintar');
  const [activeAudioSyllable, setActiveAudioSyllable] = useState<string | null>(null);

  const handleSyllableAudio = (syllable: string, speech: string) => {
    soundManager.playClick();
    setActiveAudioSyllable(syllable);
    soundManager.speak(speech, {
      onEnd: () => setActiveAudioSyllable(null),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();
    onUpdateProfile({
      name: name.trim() || 'Murid Pintar',
      className: className.trim() || 'Tahun 1',
    });
    onNext();
  };

  const handleExplanationAudio = () => {
    soundManager.playClick();
    soundManager.playAudioOrSpeak(
      'kv_explanation',
      'Kemahiran K V tambah K V. Huruf K ialah Konsonan, dan huruf V ialah Vokal. Contohnya, k, u bunyi ku. d, a bunyi da. ku tambah da jadi kuda!',
      { rate: 0.8 }
    );
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-y-auto bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/40 p-4 sm:p-8 gap-6">
      {/* Left Column: Maklumat Murid Form */}
      <div className="w-full md:w-5/12 flex flex-col justify-between p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <User className="w-4 h-4 text-emerald-600" />
            <span>PROFIL MURID</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Maklumat Murid
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sila masukkan nama dan kelas murid sebelum memulakan misi.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Nama Penuh Murid
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Adam Haris"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-medium text-sm text-slate-800 transition-all"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Kelas
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: 1 Arif / 1 Melur"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-medium text-sm text-slate-800 transition-all"
                  required
                />
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-xs transition-all active:scale-98"
              >
                <span>Sahkan & Simpan Profil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Nama ini akan dicetak pada Sijil Penghargaan akhir!</span>
        </div>
      </div>

      {/* Right Column: Penerangan Kemahiran KV+KV */}
      <div className="w-full md:w-7/12 flex flex-col justify-between p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Kandungan Pembelajaran
            </span>
            <button
              onClick={handleExplanationAudio}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 hover:bg-amber-100/80 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Dengar Penerangan 🔊</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-2">
            Kemahiran 5: Perkataan KV + KV
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Murid belajar menggabungkan huruf Konsonan (K) dan huruf Vokal (V) untuk membentuk suku
            kata terbuka, seterusnya membina perkataan bermakna.
          </p>

          {/* Formula Cards */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-xs">
              <div className="text-xs font-bold text-emerald-700">K = KONSONAN</div>
              <div className="text-lg font-mono font-bold text-emerald-900 mt-0.5">k, d, r, s, b, n</div>
              <p className="text-[11px] text-slate-500 mt-1">Huruf selain huruf vokal</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs">
              <div className="text-xs font-bold text-amber-700">V = VOKAL</div>
              <div className="text-lg font-mono font-bold text-amber-900 mt-0.5">a, e, i, u, o</div>
              <p className="text-[11px] text-slate-500 mt-1">Huruf vokal asas</p>
            </div>
          </div>

          {/* Interactive Syllable Builder Example */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between mb-2">
              <span>Cuba Tekan Suku Kata Di Bawah:</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ada Suara!
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => handleSyllableAudio('ku', 'k, u, ku')}
                className={`px-4 py-3 rounded-xl font-display font-bold text-xl sm:text-2xl transition-all border-2 ${
                  activeAudioSyllable === 'ku'
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 active:scale-95'
                }`}
              >
                ku
              </button>

              <span className="text-2xl font-bold text-slate-400">+</span>

              <button
                type="button"
                onClick={() => handleSyllableAudio('da', 'd, a, da')}
                className={`px-4 py-3 rounded-xl font-display font-bold text-xl sm:text-2xl transition-all border-2 ${
                  activeAudioSyllable === 'da'
                    ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-md'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 active:scale-95'
                }`}
              >
                da
              </button>

              <span className="text-2xl font-bold text-slate-400">=</span>

              <button
                type="button"
                onClick={() => handleSyllableAudio('kuda', 'kuda! Seekor haiwan kuda yang pantas.')}
                className={`px-5 py-3 rounded-xl font-display font-bold text-xl sm:text-2xl transition-all border-2 ${
                  activeAudioSyllable === 'kuda'
                    ? 'bg-teal-600 text-white border-teal-700 scale-105 shadow-md'
                    : 'bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100 active:scale-95'
                }`}
              >
                kuda 🐴
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Suku Kata 1 (KV) + Suku Kata 2 (KV) = Perkataan KV+KV
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onNext();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <span>Faham, Teruskan ke Manual Penggunaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
