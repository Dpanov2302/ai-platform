
import { Link } from 'react-router-dom';

export interface ModelCardProps {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

export const ModelCard = ({ id, title, description, tags = [] }: ModelCardProps) => {
  return (
    <Link
      to={`/model/${id}`}
      className="block min-h-64 max-w-96 group relative bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl min-h-8 font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="min-h-12 text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
        Запустить
        <svg 
          className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14 5l7 7m0 0l-7 7m7-7H3" 
          />
        </svg>
      </div>
    </Link>
  );
};

