import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader, Image as ImageIcon } from "lucide-react";

const ImageClassificationPage = () => {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(image);
        setPreviewUrl(objectUrl);

        // Очищаем URL при размонтировании компонента
        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;
        setIsLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await fetch("http://localhost:8000/classify-image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Ошибка при классификации изображения");
            }

            const data = await response.json();
            setResult(`Класс ID: ${data.class_id}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setResult(`Ошибка: ${error.message}`);
            } else {
                setResult("Произошла неизвестная ошибка");
            }
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
                        Модель: Классификация изображения
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
                                    <ImageIcon className="w-5 h-5 text-blue-400" />
                                    <span className="text-gray-800 dark:text-gray-100 text-sm">{image.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Предпросмотр загруженного изображения */}
                        {previewUrl && (
                            <div className="mt-4 animate-fadeIn">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Предпросмотр:</p>
                                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 flex justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Предпросмотр"
                                        className="max-h-48 rounded shadow-sm"
                                        style={{objectFit: "contain"}}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !image}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            {isLoading ? (<><Loader className="mr-2 h-4 w-4 animate-spin" />Обработка...</>) : "Классифицировать"}
                        </button>
                    </form>
                    {result && (
                        <div className="mt-8 animate-fadeIn">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Результат:</h2>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
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

export default ImageClassificationPage;
