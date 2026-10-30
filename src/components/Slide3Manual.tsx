import React, { useState } from 'react';
import { Volume2, CheckCircle2, Star, Award, Compass, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface Slide3ManualProps {
  onNext: () => void;
}

export const Slide3Manual: React.FC<Slide3ManualProps> = ({ onNext }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [testedStar, setTestedStar] = useState(false);

  const manualSpeech =
    'Manual penggunaan Misi Zoo Pintar. Pertama: Tekan butang pembesar suara untuk mendengar sebutan suku kata dan bunyi haiwan. Kedua: Pilih suku kata yang betul daripada pilihan jawapan. Ketiga: Kumpul tiga bintang dan markah penuh bagi setiap misi. Keempat: Buka kunci Sijil Pencapaian digital anda!';

  const handleReadManual = () => {
    soundManager.playClick();
    setIsSpeaking(true);
    soundManager.playAudioOrSpeak('manual_narration', manualSpeech, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleTestChime = () => {
    soundManager.playStarEarned();
    setTestedStar(true);
    setTimeout(() => setTestedStar(false), 1200);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-amber-50/40 p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>PANDUAN & CARA BERMAIN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-950 mt-0.5">
            Manual Penggunaan Misi Zoo Pintar
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleReadManual}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              isSpeaking
                ? 'bg-amber-100 border-amber-300 text-amber-900 animate-gentle-pulse'
                : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50 shadow-xs'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{isSpeaking ? 'Sedang Membaca...' : 'Dengar Manual 🔊'}</span>
          </button>
        </div>
      </div>

      {/* 4 Interactive Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-auto py-2">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-display font-bold text-lg mb-3">
              1
            </div>
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
              <span>Dengar Audio</span>
              <Volume2 className="w-4 h-4 text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Tekan ikon pembesar suara 🔊 untuk mendengar sebutan suku kata yang jelas dan bunyi
              haiwan yang comel.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                soundManager.playAnimalEffect('kuda');
                soundManager.speak('ku... da... kuda!');
              }}
              className="w-full text-center py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-xs transition-colors"
            >
              Uji Bunyi Kuda 🔊
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-display font-bold text-lg mb-3">
              2
            </div>
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
              <span>Pilih Jawapan</span>
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Lengkapkan suku kata yang hilang. Tekan kad pilihan jawapan yang betul untuk
              melengkapkan perkataan KV+KV.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <span className="px-2 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-xs rounded-md">
              ku
            </span>
            <span className="text-xs text-slate-400">+</span>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-mono font-bold text-xs rounded-md">
              da
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-display font-bold text-lg mb-3">
              3
            </div>
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
              <span>Kumpul Bintang</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Setiap cubaan yang betul akan memberikan 3 bintang dan 20 markah bonus untuk skor
              keseluruhan anda!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={handleTestChime}
              className={`w-full py-1.5 px-2 font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${
                testedStar
                  ? 'bg-amber-400 text-white scale-102 shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{testedStar ? 'Dentang Bintang! ⭐' : 'Uji Bintang Emas'}</span>
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-display font-bold text-lg mb-3">
              4
            </div>
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
              <span>Sijil Digital</span>
              <Award className="w-4 h-4 text-rose-600" />
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Setelah menamatkan 5 misi haiwan, cetak atau simpan Sijil Pencapaian rasmi dengan nama
              anda dan lencana Wira Zoo.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-md">
              Boleh dicetak & disimpan 🖨️
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
        <p className="text-xs text-slate-500 font-medium">
          Disediakan khas untuk guru & murid Pemulihan Khas Tahun 1
        </p>

        <button
          onClick={() => {
            soundManager.playCorrect();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-xs transition-all active:scale-95"
        >
          <span>Buka Peta Misi Zoo</span>
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
