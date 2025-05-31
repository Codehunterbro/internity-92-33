
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { getQuizQuestionsByLessonId } from '@/services/lessonService';
import { markAttendance, checkTodayAttendance } from '@/services/attendanceService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[] | Record<string, string>;
  correct_answer: number;
  explanation?: string;
  is_quiz_locked?: boolean;
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
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizLocked, setIsQuizLocked] = useState(false);
  const [attendanceAlreadyMarked, setAttendanceAlreadyMarked] = useState(false);
  const [lockReason, setLockReason] = useState<string>('');
  
  const { user } = useAuth();

  // Helper function to get options array from question
  const getOptions = (question: Question): string[] => {
    if (Array.isArray(question.options)) {
      return question.options.map(String);
    } 
    if (typeof question.options === 'object' && question.options !== null) {
      return Object.values(question.options).map(String);
    }
    return [];
  };

  // Initialize quiz state
  useEffect(() => {
    const initializeQuiz = async () => {
      if (!user) {
        setIsQuizLocked(true);
        setLockReason('Please log in to access the quiz.');
        setIsLoading(false);
        return;
      }

      if (!lessonId) {
        setIsQuizLocked(true);
        setLockReason('Invalid lesson ID.');
        setIsLoading(false);
        return;
      }

      try {
        console.log("Initializing quiz for lesson:", lessonId, "user:", user.id);
        
        // Check if attendance is already marked for today
        const attendanceMarked = await checkTodayAttendance(user.id, lessonId.toString());
        console.log("Attendance check result:", attendanceMarked);
        
        if (attendanceMarked) {
          setAttendanceAlreadyMarked(true);
          setIsQuizLocked(true);
          setLockReason('You have already completed this quiz today and attendance has been marked.');
          setQuizFinished(true);
          setIsLoading(false);
          return;
        }

        // Load quiz questions
        let questionsToUse: Question[] = [];
        
        if (questions && questions.length > 0) {
          console.log("Using provided questions:", questions);
          questionsToUse = questions;
        } else {
          console.log("Fetching questions from database for lesson:", lessonId);
          const fetchedQuestions = await getQuizQuestionsByLessonId(lessonId.toString());
          
          if (!fetchedQuestions || fetchedQuestions.length === 0) {
            setIsQuizLocked(true);
            setLockReason('No quiz questions are available for this lesson.');
            setIsLoading(false);
            return;
          }

          // Process fetched questions and properly type cast the options
          questionsToUse = fetchedQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options as string[] | Record<string, string>, // Type cast the Json to our expected type
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            is_quiz_locked: q.is_quiz_locked
          }));
        }

        console.log("Questions to use:", questionsToUse);

        // Check if quiz is locked based on question data
        const firstQuestion = questionsToUse[0];
        if (firstQuestion?.is_quiz_locked === true) {
          console.log("Quiz is locked based on is_quiz_locked flag");
          setIsQuizLocked(true);
          setLockReason('This quiz is currently locked and not available for completion.');
          setIsLoading(false);
          return;
        }

        // Validate questions have proper options
        const invalidQuestions = questionsToUse.filter(q => {
          const options = getOptions(q);
          return options.length === 0;
        });

        if (invalidQuestions.length > 0) {
          console.log("Found questions with invalid options:", invalidQuestions);
          setIsQuizLocked(true);
          setLockReason('Quiz questions are not properly configured.');
          setIsLoading(false);
          return;
        }

        // Quiz is available
        console.log("Quiz is available with", questionsToUse.length, "questions");
        setQuizQuestions(questionsToUse);
        setIsQuizLocked(false);
        
      } catch (error) {
        console.error("Error initializing quiz:", error);
        setIsQuizLocked(true);
        setLockReason('Failed to load quiz. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, [user, lessonId, questions]);

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return;
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
      handleQuizComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const handleQuizComplete = async () => {
    const isCorrect = selectedOption === quizQuestions[currentQuestionIndex].correct_answer;
    const finalScore = score + (isCorrect ? 1 : 0);
    
    console.log("Quiz completed with score:", finalScore);
    setQuizFinished(true);
    
    // Mark attendance
    if (user && !attendanceAlreadyMarked) {
      try {
        console.log("Marking attendance for user:", user.id, "lesson:", lessonId);
        
        // Use a hardcoded course ID for now - this should ideally come from props or context
        const courseId = 'c98ef198-e152-4d3b-bb8c-cd4c6694a79c';
        const result = await markAttendance(user.id, lessonId.toString(), courseId);
        
        console.log("Attendance marking result:", result);
        
        if (result.success) {
          if (result.alreadyMarked) {
            toast.info('Attendance was already marked for today');
          } else {
            toast.success('Quiz completed! Attendance marked successfully.');
            setAttendanceAlreadyMarked(true);
          }
        } else {
          console.error('Failed to mark attendance:', result.error);
          toast.error('Quiz completed but failed to mark attendance. Please contact support.');
        }
      } catch (error) {
        console.error('Error marking attendance:', error);
        toast.error('Quiz completed but failed to mark attendance. Please contact support.');
      }
    }
    
    onComplete(finalScore);
  };

  // Loading state
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

  // Locked state
  if (isQuizLocked) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
            <Lock className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Quiz Locked</h2>
        <p className="text-gray-600 mb-4">{lockReason}</p>
        
        {attendanceAlreadyMarked && (
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-medium">
              ✅ Today's attendance has been marked!
            </p>
          </div>
        )}
        
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
        >
          Back to Lessons
        </Button>
      </div>
    );
  }

  // Quiz completed state
  if (quizFinished) {
    const isCorrect = selectedOption === quizQuestions[currentQuestionIndex].correct_answer;
    const finalScore = score + (isCorrect ? 1 : 0);
    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-600 mb-4">
          You scored {finalScore} out of {quizQuestions.length} ({percentage}%)
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="bg-green-500 h-4 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-700 font-medium">
            🎉 Quiz completed successfully! Attendance has been marked for today.
          </p>
        </div>
        
        <Button onClick={() => window.history.back()}>
          Back to Lessons
        </Button>
      </div>
    );
  }

  // No questions available
  if (quizQuestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">No Quiz Available</h2>
        <p className="text-gray-600 mb-4">
          No quiz questions are available for this lesson at the moment.
        </p>
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
        >
          Back to Lessons
        </Button>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestion = quizQuestions[currentQuestionIndex];
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
