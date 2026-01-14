export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  focus: string;
  activities: string[];
}

export interface StudyPlan {
  examName: string;
  targetDate: string;
  schedule: StudyPlanDay[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  topic: string;
  date: string;
}
