import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ModelPage from "@/pages/ModelPage";
import NotFound from "@/pages/NotFound";
import TextGenerationPage from "@/pages/model/TextGenerationPage";
import TextToImagePage from "@/pages/model/TextToImagePage";
import ImageToTextPage from "@/pages/model/ImageToTextPage";
import ImageToImagePage from "@/pages/model/ImageToImagePage";
import TextImageToImagePage from "@/pages/model/TextImageToImagePage";
import ImageDetectionPage from "@/pages/model/ImageDetectionPage.tsx";
import ImageClassificationPage from "@/pages/model/ImageClassificationPage.tsx";
import ScrollToTop from "@/components/utils/ScrollToTop.tsx";

const App = () => (
    <BrowserRouter>
        <ScrollToTop/>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/model/:id" element={<ModelPage/>}/>
            <Route path="/model/text-generation" element={<TextGenerationPage/>}/>
            <Route path="/model/text-to-image" element={<TextToImagePage/>}/>
            <Route path="/model/image-to-text" element={<ImageToTextPage/>}/>
            <Route path="/model/image-to-image" element={<ImageToImagePage/>}/>
            <Route path="/model/text-image-to-image" element={<TextImageToImagePage/>}/>

            <Route path="/model/image-detection" element={<ImageDetectionPage/>}/>
            <Route path="/model/image-classification" element={<ImageClassificationPage/>}/>

            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>
);

export default App;
