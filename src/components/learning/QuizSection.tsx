
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getQuizQuestionsByLessonId } from '@/services/lessonService';
import { Json } from '@/integrations/supabase/types';

interface Question {
  id: string;
  question: string;
  options: string[] | Record<string, string>;
  correct_answer: number;
  explanation?: string;
}

interface QuizSectionProps {
  lessonId: number;
  onComplete: (score: number) => void;
  completed: boolean;
  questions?: Question[];
}

const QuizSection: React.FC<QuizSectionProps> = ({ lessonId, onComplete, completed, questions = [] }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizFinished, setQuizFinished] = useState(completed);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      if (questions.length > 0) {
        console.log("Using provided questions:", questions);
        setQuizQuestions(questions);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Fetching quiz questions for lesson ID:", lessonId);
        const fetchedQuestions = await getQuizQuestionsByLessonId(lessonId.toString());
        
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          console.log("Fetched quiz questions:", fetchedQuestions);
          // Convert the JSON options to string array
          const formattedQuestions: Question[] = fetchedQuestions.map(q => {
            // Handle different option formats
            let optionsArray: string[] = [];
            
            if (Array.isArray(q.options)) {
              optionsArray = q.options.map(String);
            } else if (typeof q.options === 'object' && q.options !== null) {
              optionsArray = Object.values(q.options).map(String);
            } else if (typeof q.options === 'string') {
              try {
                const parsedOptions = JSON.parse(q.options);
                if (Array.isArray(parsedOptions)) {
                  optionsArray = parsedOptions.map(String);
                } else if (typeof parsedOptions === 'object' && parsedOptions !== null) {
                  optionsArray = Object.values(parsedOptions).map(String);
                }
              } catch (e) {
                console.error('Failed to parse options:', e);
                optionsArray = [];
              }
            }
            
            return {
              id: q.id,
              question: q.question,
              options: optionsArray,
              correct_answer: q.correct_answer,
              explanation: q.explanation
            };
          });
          console.log("Formatted questions:", formattedQuestions);
          setQuizQuestions(formattedQuestions);
        } else {
          // Fallback to default questions if none found in the database
          console.log("No questions found, using default questions");
          const defaultQuestions = [
            {
              id: '1',
              question: "What does CSS stand for?",
              options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
              correct_answer: 1
            },
            {
              id: '2',
              question: "What does API stand for?",
              options: [
                "Application Programming Interface",
                "Application Process Integration",
                "Automated Programming Interface",
                "Application Protocol Interface"
              ],
              correct_answer: 0
            },
            {
              id: '3',
              question: "Which of these is NOT a JavaScript framework?",
              options: ["React", "Angular", "Django", "Vue"],
              correct_answer: 2
            }
          ];
          setQuizQuestions(defaultQuestions);
        }
      } catch (error) {
        console.error("Error loading quiz questions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, [lessonId, questions]);

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return; // Prevent changing after showing answer
    setSelectedOption(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    setShowAnswer(true);
    if (selectedOption === quizQuestions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      setQuizFinished(true);
      onComplete(score + (selectedOption === quizQuestions[currentQuestionIndex].correct_answer ? 1 : 0));
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No quiz questions available for this lesson.</p>
      </div>
    );
  }

  if (quizFinished) {
    const finalScore = score + (selectedOption === quizQuestions[currentQuestionIndex].correct_answer && !completed ? 1 : 0);
    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-600 mb-6">
          You scored {finalScore} out of {quizQuestions.length} ({percentage}%)
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="bg-green-500 h-4 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleRestartQuiz}>
            Restart Quiz
          </Button>
          <Button onClick={() => window.history.back()}>
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Handle different option formats
  const getOptions = (question: Question): string[] => {
    if (Array.isArray(question.options)) {
      return question.options.map(String);
    } 
    if (typeof question.options === 'object' && question.options !== null) {
      return Object.values(question.options).map(String);
    }
    return [];
  };
  
  const options = getOptions(currentQuestion);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Lesson Quiz</h2>
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          <span className="text-base font-medium">
            Score: {score}/{currentQuestionIndex}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full mb-8">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
        <div className="space-y-4">
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === index 
                  ? showAnswer 
                    ? index === currentQuestion.correct_answer 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-6 h-6 mr-3 rounded-full border ${
                  selectedOption === index 
                    ? showAnswer 
                      ? index === currentQuestion.correct_answer 
                        ? 'border-green-500' 
                        : 'border-red-500'
                      : 'border-blue-500'
                    : 'border-gray-300'
                } flex items-center justify-center`}>
                  {selectedOption === index && !showAnswer && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                  {showAnswer && index === currentQuestion.correct_answer && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {showAnswer && selectedOption === index && index !== currentQuestion.correct_answer && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span className="text-base">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAnswer && currentQuestion.explanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-center">
        {!showAnswer ? (
          <Button 
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className="w-full py-4 text-lg bg-purple-400 hover:bg-purple-500"
          >
            Check Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNextQuestion}
            className="w-full py-4 text-lg bg-blue-500 hover:bg-blue-600"
          >
            {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
