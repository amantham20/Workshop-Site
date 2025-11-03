"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronDown,
  ClipboardList,
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
}

export default function Quiz({ title, questions }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length === questions.length) {
      setSubmitted(true);
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setSubmitted(false);
  };

  const getScore = () => {
    const correct = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const score = getScore();
  const canSubmit =
    Object.keys(selectedAnswers).length === questions.length && !submitted;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-slate-600 dark:text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-6 pt-0">
          <div className="flex items-center justify-end mb-6">
            {submitted && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Quiz
              </button>
            )}
          </div>

          {showResults && (
            <div
              className={`mb-6 p-4 rounded-lg border-l-4 ${
                score.percentage >= 80
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                  : score.percentage >= 60
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                    : "bg-red-50 dark:bg-red-900/20 border-red-500"
              }`}
            >
              <h4
                className={`font-bold mb-2 ${
                  score.percentage >= 80
                    ? "text-green-900 dark:text-green-300"
                    : score.percentage >= 60
                      ? "text-yellow-900 dark:text-yellow-300"
                      : "text-red-900 dark:text-red-300"
                }`}
              >
                Quiz Results: {score.correct}/{score.total} ({score.percentage}
                %)
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                {score.percentage >= 80
                  ? "Excellent! You have a strong understanding of this topic."
                  : score.percentage >= 60
                    ? "Good job! Review the explanations below to strengthen your understanding."
                    : "Keep studying! Review the page content and explanations to improve your understanding."}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[question.id];
              const isCorrect = selectedAnswer === question.correctAnswer;

              return (
                <div key={question.id} className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {index + 1}. {question.question}
                  </h4>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer === optionIndex;
                      const isCorrectOption =
                        optionIndex === question.correctAnswer;

                      let buttonClasses =
                        "w-full text-left p-3 rounded-lg border transition-colors ";

                      if (submitted) {
                        if (isCorrectOption) {
                          buttonClasses +=
                            "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-300";
                        } else if (isSelected && !isCorrectOption) {
                          buttonClasses +=
                            "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-300";
                        } else {
                          buttonClasses +=
                            "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300";
                        }
                      } else {
                        if (isSelected) {
                          buttonClasses +=
                            "bg-primary-100 dark:bg-primary-900/20 border-primary-500 text-primary-900 dark:text-primary-300";
                        } else {
                          buttonClasses +=
                            "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700";
                        }
                      }

                      return (
                        <button
                          key={optionIndex}
                          onClick={() =>
                            handleAnswerSelect(question.id, optionIndex)
                          }
                          disabled={submitted}
                          className={buttonClasses}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="flex-1">{option}</span>
                            {submitted && (
                              <div className="flex-shrink-0">
                                {isCorrectOption && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {isSelected && !isCorrectOption && (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                            {isCorrect ? "Correct!" : "Incorrect"}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  canSubmit
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                }`}
              >
                Submit Quiz
              </button>
            </div>
          )}

          {!submitted && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              Answer all questions to submit the quiz (
              {Object.keys(selectedAnswers).length}/{questions.length} answered)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
