import { memo } from 'react';
import { CardProps } from '../ui/Card';

export interface QuizCardProps extends Omit<CardProps, 'children'> {
  quiz: {
    id: string;
    title: string;
    status: number;
    questions: Array<{ questionText: string }>;
  };
  onClick?: () => void;
}

const QuizCard = memo(function QuizCard({ quiz, onClick, className = '', ...props }: QuizCardProps) {
  const isPublished = quiz.status === 1;
  const questionCount = quiz.questions.length;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{quiz.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>📝 {questionCount} questions</span>
              {isPublished && <span className="text-green-600 font-medium">+5-15 coins</span>}
            </div>
          </div>
          <div className="text-4xl">🧠</div>
        </div>
        {!isPublished && (
          <div className="mt-3 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs inline-block">
            Draft
          </div>
        )}
      </div>
    </div>
  );
});

export default QuizCard;