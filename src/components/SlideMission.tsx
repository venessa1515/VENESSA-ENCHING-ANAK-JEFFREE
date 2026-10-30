import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Star,
  Music,
} from 'lucide-react';
import { MissionQuestion, MissionProgress } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface SlideMissionProps {
  mission: MissionQuestion;
  missionNumber: number;
  totalMissions: number;
  progress: MissionProgress;
  onAnswerCorrect: (missionId: string, scoreEarned: number, stars: number) => void;
  onNextSlide: () => void;
  onBackToMap: () => void;
}

export const SlideMission: React.FC<SlideMissionProps> = ({
  mission,
  missionNumber,
  totalMissions,
  progress,
  onAnswerCorrect,
  onNextSlide,
  onBackToMap,
}) => {
  const [selectedSyllable, setSelectedSyllable] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSyllableSolved, setIsSyllableSolved] = useState<boolean>(false);
  const [isWordSolved, setIsWordSolved] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Sync if already completed in progress
  useEffect(() => {
    const existing = progress[mission.id];
    if (existing?.completed) {
      setIsSyllableSolved(true);
      setIsWordSolved(true);
      setSelectedSyllable(
        mission.missingPart === 'first' ? mission.firstSyllable : mission.secondSyllable
      );
      setSelectedWord(mission.animalName);
      setFeedbackMessage({
        type: 'success',
        text: 'Tahniah! Misi ini telah berjaya diselesaikan dengan cemerlang!',
      });
    } else {
      setSelectedSyllable(null);
      setSelectedWord(null);
      setIsSyllableSolved(false);
      setIsWordSolved(false);
      setFeedbackMessage(null);
      setAttempts(0);
    }
  }, [mission.id, progress]);

  // Audio Handlers
  const handleAnimalSound = () => {
    soundManager.playAnimalEffect(mission.animalName);
  };

  const handleSyllableSpeech = () => {
    soundManager.playClick();
    soundManager.playAudioOrSpeak(
      `${mission.animalName}_speech`,
      mission.speechText,
      { rate: 0.8 }
    );
  };

  const handlePromptSpeech = () => {
    soundManager.playClick();
    soundManager.speak(
      `${mission.promptText}. Suku kata pertama ${mission.firstSyllable}, suku kata kedua ${mission.secondSyllable}. Pilih jawapan yang betul.`
    );
  };

  // Handle Syllable Choice Selection
  const handleSelectSyllable = (choice: { text: string; isCorrect: boolean }) => {
    soundManager.playClick();
    setSelectedSyllable(choice.text);
    setAttempts((prev) => prev + 1);

    // Speak the clicked syllable
    soundManager.speak(choice.text, { rate: 0.85 });

    if (choice.isCorrect) {
      setTimeout(() => {
        soundManager.playCorrect();
        setIsSyllableSolved(true);
        setFeedbackMessage({
          type: 'success',
          text: `Betul! Suku kata "${choice.text}" adalah tepat! Sekarang pilih perkataan penuh.`,
        });
        soundManager.speak(`Betul! Suku kata ${choice.text} adalah tepat!`);
      }, 400);
    } else {
      setTimeout(() => {
        soundManager.playTryAgain();
        setFeedbackMessage({
          type: 'error',
          text: `Kurang tepat. Dengar bunyi "${mission.missingPart === 'first' ? mission.firstSyllable : mission.secondSyllable}" dan cuba lagi!`,
        });
      }, 300);
    }
  };

  // Handle Word Choice Selection
  const handleSelectWord = (choice: { text: string; isCorrect: boolean }) => {
    soundManager.playClick();
    setSelectedWord(choice.text);

    if (choice.isCorrect) {
      soundManager.playFanfare();
      soundManager.playStarEarned();
      setIsWordSolved(true);
      setFeedbackMessage({
        type: 'success',
        text: `Syabas! Anda berjaya mengeja "${mission.animalName.toUpperCase()}"! +20 Markah & 3 Bintang!`,
      });

      const stars = attempts <= 1 ? 3 : attempts <= 3 ? 2 : 1;
      const score = stars * 10;
      onAnswerCorrect(mission.id, score, stars);

      soundManager.speak(`Syabas! Anda berjaya mengeja ${mission.animalName}! Hebat sekali!`);
    } else {
      soundManager.playTryAgain();
      setFeedbackMessage({
        type: 'error',
        text: `Bukan "${choice.text}". Cari perkataan "${mission.animalName}".`,
      });
    }
  };

  const handleResetMission = () => {
    soundManager.playClick();
    setSelectedSyllable(null);
    setSelectedWord(null);
    setIsSyllableSolved(false);
    setIsWordSolved(false);
    setFeedbackMessage(null);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-y-auto bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/30 p-3 sm:p-6 gap-4 sm:gap-6">
      {/* Left Column: Gambar Haiwan & Kawalan Audio */}
      <div className="w-full md:w-5/12 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs">
        <div>
          {/* Top Mission Pill */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              Misi {missionNumber} daripada {totalMissions}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              {mission.animalName}
            </span>
          </div>

          {/* Animal Image with interactive sound trigger */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-200/80 shadow-xs group bg-emerald-50">
            <img
              src={mission.imageSrc}
              alt={mission.animalName}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />

            {/* Click-to-hear Overlay Badge on the Image */}
            <button
              onClick={handleSyllableSpeech}
              title="Tekan untuk dengar sebutan gambar"
              className="absolute bottom-2 left-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs text-emerald-900 border border-emerald-300 font-display font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4 text-emerald-600 animate-gentle-pulse" />
              <span>Dengar Sebutan 🔊</span>
            </button>
          </div>

          {/* Animal Audio & Info Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={handleAnimalSound}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-display font-semibold text-xs transition-colors"
            >
              <Music className="w-3.5 h-3.5 text-amber-600" />
              <span>Bunyi Haiwan 🐾</span>
            </button>

            <button
              onClick={handleSyllableSpeech}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-display font-semibold text-xs transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Eja Suku Kata 🗣️</span>
            </button>
          </div>
        </div>

        {/* Fun Fact Callout */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Tahukah Anda?</strong> {mission.funFact}
          </div>
        </div>
      </div>

      {/* Right Column: Soalan Interaktif & Pilihan Jawapan */}
      <div className="w-full md:w-7/12 flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs overflow-y-auto">
        <div className="space-y-3.5">
          {/* Header & Prompt with Audio */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 leading-tight">
                {mission.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                {mission.promptText}
              </p>
            </div>

            <button
              onClick={handlePromptSpeech}
              title="Dengar soalan"
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 shrink-0 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          {/* Interactive Syllable Equation Display */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {/* First Syllable Block */}
            {mission.missingPart === 'first' ? (
              <div
                className={`min-w-16 sm:min-w-20 py-2.5 px-3 rounded-xl font-display font-extrabold text-2xl sm:text-3xl text-center border-2 transition-all ${
                  isSyllableSolved
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105'
                    : 'bg-white text-slate-400 border-dashed border-amber-300 animate-gentle-pulse'
                }`}
              >
                {isSyllableSolved ? mission.firstSyllable : selectedSyllable || '?'}
              </div>
            ) : (
              <div className="min-w-16 sm:min-w-20 py-2.5 px-3 rounded-xl bg-white border-2 border-emerald-300 font-display font-extrabold text-2xl sm:text-3xl text-emerald-800 text-center shadow-xs">
                {mission.firstSyllable}
              </div>
            )}

            <span className="text-2xl font-bold text-slate-400">+</span>

            {/* Second Syllable Block */}
            {mission.missingPart === 'second' ? (
              <div
                className={`min-w-16 sm:min-w-20 py-2.5 px-3 rounded-xl font-display font-extrabold text-2xl sm:text-3xl text-center border-2 transition-all ${
                  isSyllableSolved
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105'
                    : 'bg-white text-slate-400 border-dashed border-amber-300 animate-gentle-pulse'
                }`}
              >
                {isSyllableSolved ? mission.secondSyllable : selectedSyllable || '?'}
              </div>
            ) : (
              <div className="min-w-16 sm:min-w-20 py-2.5 px-3 rounded-xl bg-white border-2 border-amber-300 font-display font-extrabold text-2xl sm:text-3xl text-amber-800 text-center shadow-xs">
                {mission.secondSyllable}
              </div>
            )}

            <span className="text-2xl font-bold text-slate-400">=</span>

            {/* Result Word Block */}
            <div
              className={`py-2.5 px-4 rounded-xl font-display font-extrabold text-2xl sm:text-3xl text-center border-2 transition-all ${
                isWordSolved
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {isWordSolved ? mission.animalName : '________'}
            </div>
          </div>

          {/* PHASE 1: Suku Kata Choices (Pilihan Jawapan Suku Kata) */}
          {!isSyllableSolved && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Pilih Suku Kata Yang Betul:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Tekan kad untuk menjawab
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {mission.syllableChoices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSyllable(choice)}
                    className="group py-3.5 px-3 rounded-xl bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 font-display font-extrabold text-2xl sm:text-3xl text-slate-800 hover:text-emerald-800 shadow-xs hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
                  >
                    <span>{choice.text}</span>
                    <span className="text-[10px] font-sans font-medium text-slate-400 group-hover:text-emerald-600">
                      Tekan & Dengar
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2: Word Choices (Pilih Perkataan Penuh) */}
          {isSyllableSolved && !isWordSolved && (
            <div className="animate-gentle-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Langkah 2: Pilih Perkataan Yang Lengkap:</span>
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  ⭐ Dapatkan Bintang!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {mission.wordChoices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectWord(choice)}
                    className="py-3 px-4 rounded-xl bg-white hover:bg-teal-50 border-2 border-emerald-300 hover:border-teal-500 font-display font-bold text-lg sm:text-xl text-slate-800 hover:text-teal-900 shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Message Alert */}
          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold transition-all ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{feedbackMessage.text}</span>
              </div>

              {feedbackMessage.type === 'error' && (
                <button
                  onClick={handleResetMission}
                  className="px-2 py-1 bg-white border border-rose-200 rounded-lg text-rose-700 hover:bg-rose-100/50 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Cuba Lagi
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToMap();
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ← Kembali ke Peta
          </button>

          <div className="flex items-center gap-2">
            {isWordSolved && (
              <div className="flex items-center gap-0.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>3 Bintang</span>
              </div>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onNextSlide();
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 ${
                isWordSolved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{missionNumber === totalMissions ? 'Lihat Skor Murid' : 'Misi Seterusnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
