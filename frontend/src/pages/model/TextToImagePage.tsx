
import { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader, Image as ImageIcon } from "lucide-react";

const TextToImagePage = () => {
  const [input, setInput] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setImgUrl(null);

    try {
      const response = await fetch("http://localhost:8000/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: input })
      });

      const data = await response.json();
      setImgUrl("data:image/png;base64," + data.image_base64);
    } catch (err) {
      console.error("Ошибка генерации:", err);
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
            Модель: Текст → Изображение
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input-t2i" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Введите текст (описание изображения)
              </label>
              <textarea
                id="input-t2i"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Например: Кот на скамейке в парке"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? (<><Loader className="mr-2 h-4 w-4 animate-spin" />Генерация...</>) : "Создать изображение"}
            </button>
          </form>
          {imgUrl && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Сгенерированное изображение:</h2>
              <div className="flex justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <img src={imgUrl} alt="Сгенерированное изображение" className="rounded-md max-h-80 max-w-full shadow" />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextToImagePage;
