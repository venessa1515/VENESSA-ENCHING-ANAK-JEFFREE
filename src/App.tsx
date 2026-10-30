/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { SlideContainer } from './components/SlideContainer';
import { Slide1Intro } from './components/Slide1Intro';
import { Slide2Profile } from './components/Slide2Profile';
import { Slide3Manual } from './components/Slide3Manual';
import { Slide4Map } from './components/Slide4Map';
import { SlideMission } from './components/SlideMission';
import { Slide10Score } from './components/Slide10Score';
import { Slide11Congratulations } from './components/Slide11Congratulations';
import { MISSIONS_DATA } from './data/missions';
import { StudentProfile, MissionProgress } from './types/game';
import { soundManager } from './utils/soundEffects';

const TOTAL_SLIDES = 11;
const STORAGE_KEY = 'misi_zoo_pintar_progress';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (saved) return JSON.parse(saved);
    } catch {
      // safe fallback
    }
    return { name: 'Adib', className: '1 Pintar' };
  });

  const [missionProgress, setMissionProgress] = useState<MissionProgress>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
      if (saved) return JSON.parse(saved);
    } catch {
      // safe fallback
    }
    return {};
  });

  // Calculate total score
  const totalScore = Object.values(missionProgress).reduce(
    (acc, m) => acc + (m.score || 0),
    0
  );

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(studentProfile));
    } catch {
      // safe
    }
  }, [studentProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missionProgress));
    } catch {
      // safe
    }
  }, [missionProgress]);

  // Navigate Handler
  const handleNavigate = useCallback(
    (slideNum: number) => {
      const target = Math.max(1, Math.min(TOTAL_SLIDES, slideNum));
      setCurrentSlide(target);
    },
    []
  );

  // Keyboard navigation support for presentation clicker / keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSlide < TOTAL_SLIDES) {
          soundManager.playClick();
          handleNavigate(currentSlide + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlide > 1) {
          soundManager.playClick();
          handleNavigate(currentSlide - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, handleNavigate]);

  // Handle answering correctly in a mission
  const handleAnswerCorrect = (
    missionId: string,
    scoreEarned: number,
    stars: number
  ) => {
    setMissionProgress((prev) => ({
      ...prev,
      [missionId]: {
        completed: true,
        score: scoreEarned,
        stars: stars,
        attempts: (prev[missionId]?.attempts || 0) + 1,
      },
    }));
  };

  // Reset entire game
  const handleResetGame = () => {
    setMissionProgress({});
    setCurrentSlide(1);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_missions`);
    } catch {
      // safe
    }
  };

  // Render active slide content
  const renderCurrentSlide = () => {
    switch (currentSlide) {
      case 1:
        return <Slide1Intro onStart={() => handleNavigate(2)} />;

      case 2:
        return (
          <Slide2Profile
            studentProfile={studentProfile}
            onUpdateProfile={setStudentProfile}
            onNext={() => handleNavigate(3)}
          />
        );

      case 3:
        return <Slide3Manual onNext={() => handleNavigate(4)} />;

      case 4:
        return (
          <Slide4Map
            progress={missionProgress}
            onSelectMission={(targetSlide) => handleNavigate(targetSlide)}
            onStartFirstMission={() => handleNavigate(5)}
          />
        );

      case 5:
      case 6:
      case 7:
      case 8:
      case 9: {
        const missionIndex = currentSlide - 5;
        const mission = MISSIONS_DATA[missionIndex];
        return (
          <SlideMission
            key={mission.id}
            mission={mission}
            missionNumber={missionIndex + 1}
            totalMissions={MISSIONS_DATA.length}
            progress={missionProgress}
            onAnswerCorrect={handleAnswerCorrect}
            onNextSlide={() => handleNavigate(currentSlide + 1)}
            onBackToMap={() => handleNavigate(4)}
          />
        );
      }

      case 10:
        return (
          <Slide10Score
            progress={missionProgress}
            totalScore={totalScore}
            studentProfile={studentProfile}
            onNavigateToSlide={(targetSlide) => handleNavigate(targetSlide)}
            onProceedToCertificate={() => handleNavigate(11)}
          />
        );

      case 11:
        return (
          <Slide11Congratulations
            studentProfile={studentProfile}
            totalScore={totalScore}
            progress={missionProgress}
            onResetGame={handleResetGame}
          />
        );

      default:
        return <Slide1Intro onStart={() => handleNavigate(2)} />;
    }
  };

  return (
    <SlideContainer
      currentSlide={currentSlide}
      totalSlides={TOTAL_SLIDES}
      onNavigate={handleNavigate}
      studentProfile={studentProfile}
      totalScore={totalScore}
      onReset={handleResetGame}
    >
      {renderCurrentSlide()}
    </SlideContainer>
  );
}
