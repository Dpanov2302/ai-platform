
import { Card } from '@/components/ui/card';
import { ModelCard } from './ModelCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const DEMO_MODELS = [
  {
    id: "text-generation",
    title: "Генерация текста",
    description: "Создание текстового контента на основе промпта",
    tags: ["GPT", "NLP"]
  },
  {
    id: "image-classification",
    title: "Классификация изображений", 
    description: "Определение объектов на изображениях",
    tags: ["Computer Vision", "CNN"]
  },
  {
    id: "sentiment-analysis", 
    title: "Анализ тональности",
    description: "Определение эмоциональной окраски текста",
    tags: ["NLP", "BERT"]
  },
  {
    id: "text-summarization",
    title: "Суммаризация текста",
    description: "Автоматическое создание кратких резюме текстов",  
    tags: ["NLP", "Transformer"]
  },
  {
    id: "translation",
    title: "Машинный перевод",
    description: "Перевод текстов между различными языками",
    tags: ["NLP", "Seq2Seq"]
  }
];

export const ModelsGrid = () => {
  return (
    <section id='models' className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Доступные модели</h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {DEMO_MODELS.map((model) => (
                <CarouselItem key={model.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <ModelCard {...model} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 hover:bg-gray-100 dark:hover:bg-gray-800" />
            <CarouselNext className="hidden md:flex -right-12 hover:bg-gray-100 dark:hover:bg-gray-800" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

