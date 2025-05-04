
import { useParams } from "react-router-dom";

// Импортируем новые шаблоны страниц моделей
import TextToTextPage from "./model/TextToTextPage";
import TextToImagePage from "./model/TextToImagePage";
import ImageToTextPage from "./model/ImageToTextPage";
import ImageToImagePage from "./model/ImageToImagePage";
import TextImageToImagePage from "./model/TextImageToImagePage";

import ImageDetectionPage from "./model/ImageDetectionPage";
import ImageClassificationPage from "./model/ImageClassificationPage";

// Фолбэк — предыдущая универсальная страница
import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import * as React from "react";

const MODEL_TYPE_MAP: Record<string, React.FC> = {
  "text-text": TextToTextPage,
  "text-image": TextToImagePage,
  "image-text": ImageToTextPage,
  "image-image": ImageToImagePage,
  "text+image-image": TextImageToImagePage,

  "image-detection": ImageDetectionPage,
  "image-classification": ImageClassificationPage,
};

const ModelPage = () => {
  const { id } = useParams();

  // Специализированные страницы (варианты моделей)
  if (id && MODEL_TYPE_MAP[id]) {
    const Component = MODEL_TYPE_MAP[id];
    return <Component />;
  }

  // Универсальная "по умолчанию" страница (оставляем старую)
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setResult('Демо-результат для модели: ' + input);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Демонстрация модели
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input"
                className="py-1 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Введите текст
              </label>
              <textarea
                id="input"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите текст для обработки..."
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? 'Обработка...' : 'Отправить'}
            </button>
          </form>

          {result && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Результат:</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre className="whitespace-pre-wrap dark:text-gray-200">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default ModelPage;
