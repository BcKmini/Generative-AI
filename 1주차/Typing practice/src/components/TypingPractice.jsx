import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RotateCcw, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import '../styles/TypingPractice.css';

// 영어 단어 목록
const ENGLISH_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what"
];

// 한글 단어 목록
const KOREAN_WORDS = [
  "안녕하세요", "감사합니다", "사랑합니다", "행복하다", "즐겁다",
  "아름답다", "친구", "가족", "학교", "회사",
  "시간", "장소", "마음", "생각", "사람",
  "하늘", "바다", "산", "강", "꽃"
];

const TypingPractice = () => {
  const [isKorean, setIsKorean] = useState(false);
  const [words, setWords] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);

  // 단어 목록 섞기
  const shuffleWords = useCallback(() => {
    const wordList = isKorean ? KOREAN_WORDS : ENGLISH_WORDS;
    const shuffled = [...wordList]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20); // 20개 단어만 선택
    setWords(shuffled);
  }, [isKorean]);

  // 게임 초기화
  const resetGame = useCallback(() => {
    shuffleWords();
    setCurrentInput('');
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
  }, [shuffleWords]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    resetGame();
  }, [resetGame, isKorean]);

  // WPM과 정확도 계산
  const calculateStats = useCallback(() => {
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // 분 단위
      const wordsTyped = currentWordIndex;
      const newWpm = Math.round(wordsTyped / timeElapsed);
      const newAccuracy = Math.round(
        (correctWords / (correctWords + incorrectWords)) * 100
      );
      setWpm(newWpm);
      setAccuracy(newAccuracy || 100);
    }
  }, [startTime, currentWordIndex, correctWords, incorrectWords]);

  // 입력 처리
  const handleInput = (e) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    // 스페이스바 입력 시 단어 체크
    if (e.key === ' ' || e.key === 'Enter') {
      const word = value.trim();
      
      if (word === words[currentWordIndex]) {
        setCorrectWords(prev => prev + 1);
      } else {
        setIncorrectWords(prev => prev + 1);
      }

      // 다음 단어로 이동
      if (currentWordIndex === words.length - 1) {
        setIsFinished(true);
        calculateStats();
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
      
      setCurrentInput('');
      e.preventDefault();
    } else {
      setCurrentInput(value);
    }

    calculateStats();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isKorean ? '한글 타자 연습' : 'English Typing Practice'}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsKorean(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              <Globe size={20} />
              {isKorean ? 'English' : '한글'}
            </button>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-lg mb-4 bg-gray-100 p-4 rounded">
            {words.map((word, index) => (
              <span
                key={index}
                className={`
                  ${index === currentWordIndex ? 'bg-yellow-200' : ''}
                  ${index < currentWordIndex ? 'text-gray-400' : ''}
                  mx-1
                `}
              >
                {word}
              </span>
            ))}
          </div>

          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleInput}
            disabled={isFinished}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isFinished ? "연습 완료!" : "여기에 입력하세요..."}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded">
            <div className="text-sm text-gray-600">WPM (분당 타자수)</div>
            <div className="text-2xl font-bold">{wpm}</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <div className="text-sm text-gray-600">정확도</div>
            <div className="text-2xl font-bold">{accuracy}%</div>
          </div>
        </div>

        {isFinished && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              연습이 완료되었습니다! Reset 버튼을 눌러 다시 시작하세요.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TypingPractice;