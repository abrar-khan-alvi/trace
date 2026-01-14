import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Loader2, CheckCircle2, XCircle, ArrowRight, BrainCircuit } from 'lucide-react';

const Quiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    setQuizComplete(false);
    setScore(0);
    setCurrentIndex(0);
    
    try {
      const qs = await generateQuiz(topic, difficulty, 5);
      setQuestions(qs);
    } catch (err) {
      alert("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p>Generating {difficulty} questions for "{topic}"...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Adaptive Quiz</h2>
          </div>
          
          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Calculus, US Constitution, Chemistry"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {['Easy', 'Intermediate', 'Hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-3 text-sm font-medium rounded-lg border transition-all
                      ${difficulty === level 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-6 inline-flex p-4 rounded-full bg-indigo-50">
            <CheckCircle2 className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
          
          <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>

          <button 
            onClick={() => setQuestions([])}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500">Question {currentIndex + 1}/{questions.length}</span>
        <span className="text-sm font-medium text-indigo-600">{topic} • {difficulty}</span>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let stateClass = "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
            
            if (isAnswered) {
              if (idx === currentQ.correctAnswerIndex) {
                stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
              } else if (idx === selectedOption) {
                stateClass = "border-rose-500 bg-rose-50 text-rose-900";
              } else {
                stateClass = "border-slate-100 text-slate-400 opacity-50";
              }
            } else if (selectedOption === idx) {
              stateClass = "border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between group ${stateClass}`}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQ.correctAnswerIndex && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswerIndex && <XCircle className="w-5 h-5 text-rose-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-2">
          <h4 className="font-bold text-indigo-900 mb-1">Explanation</h4>
          <p className="text-indigo-800 leading-relaxed">{currentQ.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
