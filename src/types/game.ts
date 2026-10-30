export interface StudentProfile {
  name: string;
  className: string;
}

export interface SyllableChoice {
  text: string;
  isCorrect: boolean;
}

export interface MissionQuestion {
  id: string;
  animalName: string;
  title: string;
  firstSyllable: string;
  secondSyllable: string;
  missingPart: 'first' | 'second' | 'word';
  promptText: string;
  imageSrc: string;
  animalSoundName: string;
  animalSoundDescription: string;
  speechText: string;
  phoneticSpeech: string;
  syllableChoices: SyllableChoice[];
  wordChoices: { text: string; isCorrect: boolean }[];
  hint: string;
  funFact: string;
}

export interface MissionProgress {
  [missionId: string]: {
    completed: boolean;
    stars: number;
    score: number;
    attempts: number;
  };
}
