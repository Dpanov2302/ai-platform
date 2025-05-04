
import { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader } from "lucide-react";

const TextToTextPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/text-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input_text: input })
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.response);
    } catch (error) {
      console.error("API Error:", error);
      setError(typeof error === 'object' && error !== null ? (error as Error).message : "Ошибка при обращении к серверу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Модель: Текст → Текст
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input-t2t" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Введите текст
              </label>
              <textarea
                id="input-t2t"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите текст для обработки..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? (<><Loader className="mr-2 h-4 w-4 animate-spin" />Обработка...</>) : "Отправить"}
            </button>
          </form>
          
          {error && (
            <div className="mt-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
          
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
      <Footer />
    </div>
  );
};

export default TextToTextPage;
