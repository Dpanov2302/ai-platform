
import { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader, Image as ImageIcon } from "lucide-react";

const TextImageToImagePage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !input) return;
    setIsLoading(true);
    setTimeout(() => {
      setImgUrl("https://placehold.co/512x320/png?text=Результирующее+изображение");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Модель: Текст + Изображение → Изображение
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Загрузите изображение
              </label>
              <input
                key={image ? image.name : "empty"}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-gray-800 dark:text-gray-100 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                required={!image}
              />
              {image && (
                <div className="mt-2 flex items-center space-x-4">
                  <ImageIcon className="w-7 h-7 text-blue-400" />
                  <span className="text-gray-800 dark:text-gray-100 text-sm">{image.name}</span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="input-timg2i" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Введите текстовый промпт
              </label>
              <textarea
                id="input-timg2i"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Описание задания для модели..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !image || !input}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? (<><Loader className="mr-2 h-4 w-4 animate-spin" />Обработка...</>) : "Сгенерировать изображение"}
            </button>
          </form>
          {imgUrl && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Результат:</h2>
              <div className="flex justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <img src={imgUrl} alt="Результирующее изображение" className="rounded-md max-h-80 max-w-full shadow" />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextImageToImagePage;
