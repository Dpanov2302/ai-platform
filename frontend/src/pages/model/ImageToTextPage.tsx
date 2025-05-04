
import { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader, Image as ImageIcon } from "lucide-react";

const ImageToTextPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setIsLoading(true);
    setTimeout(() => {
      setResult("Распознанный или сгенерированный текст для изображения '" + image.name + "'");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Модель: Изображение → Текст
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
            <button
              type="submit"
              disabled={isLoading || !image}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? (<><Loader className="mr-2 h-4 w-4 animate-spin" />Обработка...</>) : "Отправить"}
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
      <Footer />
    </div>
  );
};

export default ImageToTextPage;
