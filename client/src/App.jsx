import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImageConverter from "./pages/ImageConverter";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Templates from "./pages/Templates";
import TemplateDetails from "./pages/TemplateDetails";
import Builder from "./pages/Builder";
import ColorPickerFromImage from "./pages/ColorPickerFromImage";
import ImageResizerCropper from "./pages/ImageResizerCropper";
import VideoCompressor from "./pages/VideoCompressor";
import VideoToAudio from "./pages/VideoToAudio";
import VideoTrimmerMerger from "./pages/VideoTrimmerMerger";
import GifCreator from "./pages/GifCreator";
import VoiceToText from "./pages/VoiceToText";
import DirectVideoDownloader from "./pages/DirectVideoDownloader";
import PDFCompressor from "./pages/PDFCompressor";
import PDFToWord from "./pages/PDFToWord";
import ImageToPDF from "./pages/ImageToPDF";
import WordToPDF from "./pages/WordToPDF";
import PDFPasswordRemover from "./pages/PDFPasswordRemover";
import PDFPasswordProtect from "./pages/PDFPasswordProtect";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import RobotsTxtGenerator from "./pages/RobotsTxtGenerator";
import SitemapGenerator from "./pages/SitemapGenerator";
import AgeCalculator from "./pages/AgeCalculator";
import EMICalculator from "./pages/EMICalculator";
import GSTCalculator from "./pages/GSTCalculator";
import CurrencyConverter from "./pages/CurrencyConverter";
import SalaryCalculator from "./pages/SalaryCalculator";
import ToolsChatbot from "./components/ToolsChatbot";
import ScrollToTop from "./components/ScrollToTop";
import QuestionPaperGenerator from "./pages/QuestionPaperGenerator";
import DomainAgeDaPaChecker from "./pages/DomainAgeChecker";
import ImageBackgroundRemover from "./pages/ImageBackgroundRemover";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BulkImageConverter from "./pages/BulkImageConverter";
import RemoveDuplicateLines from "./pages/RemoveDuplicateLines";
import ImageRotateFlip from "./pages/ImageRotateFlip";
import ImageCropCircle from "./pages/ImageCropCircle";
import ImageToBase64 from "./pages/ImageToBase64";
import ImageWatermark from "./pages/ImageWatermark";
import Base64ToImage from "./pages/Base64ToImage";
import FaviconGenerator from "./pages/FaviconGenerator";
import PDFMerger from "./pages/PDFMerger";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import PDFSplitter from "./pages/PDFSplitter";
import PDFPageExtractor from "./pages/PDFPageExtractor";
import PDFPageReorder from "./pages/PDFPageReorder";
import WordCounter from "./pages/WordCounter";
import PDFPageDelete from "./pages/PDFPageDelete";
import PDFWatermark from "./pages/PDFWatermark";
import PDFMetadataViewer from "./pages/PDFMetadataViewer";
import CharacterCounter from "./pages/CharacterCounter";
import ToolsCategoryPage from "./pages/ToolsCategoryPage";
import CaseConverter from "./pages/CaseConverter";
import PDFPageNumberAdder from "./pages/PDFPageNumberAdder";
import CsvToJson from "./pages/CsvToJson";
import LoremIpsumGenerator from "./pages/LoremIpsumGenerator";
import SlugGenerator from "./pages/SlugGenerator";
import RandomPasswordGenerator from "./pages/RandomPasswordGenerator";
import TextCompareTool from "./pages/TextCompareTool";
import TextToHTML from "./pages/TextToHTML";
import XmlToJson from "./pages/XmlToJson";
import JsonFormatter from "./pages/JsonFormatter";
import UUIDGenerator from "./pages/UUIDGenerator";
import JsonValidator from "./pages/JsonValidator";
import JsonToCsv from "./pages/JsonToCsv";
import JwtDecoder from "./pages/JwtDecoder";
import XmlFormatter from "./pages/XmlFormatter";
import UrlEncoderDecoder from "./pages/UrlEncoderDecoder";
import Base64EncoderDecoder from "./pages/Base64EncoderDecoder";
import RegexTester from "./pages/RegexTester";
import SchemaGenerator from "./pages/SchemaGenerator";
import SitemapChecker from "./pages/SitemapChecker";
import RobotsTxtTester from "./pages/RobotsTxtTester";
import OpenGraphGenerator from "./pages/OpenGraphGenerator";
import FaqSchemaGenerator from "./pages/FAQSchemaGenerator";
import YouTubeThumbnailDownloader from "./pages/YouTubeThumbnailDownloader";
import EmojiPicker from "./pages/EmojiPicker";

const SETTINGS_EVENT = "convertwala-settings-change";
const STORAGE_THEME = "ath_theme";

function getSavedTheme() {
  return localStorage.getItem(STORAGE_THEME) === "dark" ? "dark" : "light";
}

function RoutePreloader() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 900);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`ath-page-loader ${loading ? "show" : ""}`}
      aria-hidden={!loading}
      aria-live="polite"
    >
      <div className="ath-loader-card">
        <div className="ath-loader-mark">
          <span>CW</span>
        </div>
        <div className="ath-loader-progress" />
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    const syncTheme = () => setTheme(getSavedTheme());

    syncTheme();
    window.addEventListener(SETTINGS_EVENT, syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("dark-mode", theme === "dark");
    document.body.classList.toggle("light-mode", theme !== "dark");
  }, [theme]);

  return (
    <div className={`ath-app-shell ${theme}`}>
      <RoutePreloader />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:categorySlug" element={<ToolsCategoryPage />} />
        <Route path="/resume-builder/templates" element={<Templates />} />
        <Route path="/emoji-picker" element={<EmojiPicker />} />
        <Route
          path="/resume-builder/template/:templateId"
          element={<TemplateDetails />}
        />
        <Route
          path="/resume-builder/build/:templateId"
          element={<Builder />}
        />
        <Route
          path="/youtube-thumbnail-downloader"
          element={<YouTubeThumbnailDownloader />}
        />
        <Route path="/xml-to-json" element={<XmlToJson />} />
        <Route path="/image-converter" element={<ImageConverter />} />
        <Route path="/faq-schema-generator" element={<FaqSchemaGenerator />} />
        <Route path="/image-resizer-cropper" element={<ImageResizerCropper />} />
        <Route path="/case-converter" element={<CaseConverter />} />
        <Route path="/video-compressor" element={<VideoCompressor />} />
        <Route path="/video-to-audio" element={<VideoToAudio />} />
        <Route path="/video-trimmer-merger" element={<VideoTrimmerMerger />} />
        <Route path="/sitemap-checker" element={<SitemapChecker />} />
        <Route path="/open-graph-generator" element={<OpenGraphGenerator />} />
        <Route path="/json-formatter" element={<JsonFormatter />} />
        <Route path="/xml-formatter" element={<XmlFormatter />} />
        <Route path="/robots-txt-tester" element={<RobotsTxtTester />} />
        <Route path="/jwt-decoder" element={<JwtDecoder />} />
        <Route path="/gif-creator" element={<GifCreator />} />
        <Route path="/schema-generator" element={<SchemaGenerator />} />
        <Route path="/json-to-csv" element={<JsonToCsv />} />
        <Route path="/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
        <Route path="/voice-to-text" element={<VoiceToText />} />
        <Route path="/direct-video-downloader" element={<DirectVideoDownloader />} />
        <Route path="/pdf-compressor" element={<PDFCompressor />} />
        <Route path="/url-encoder-decoder" element={<UrlEncoderDecoder />} />
        <Route path="/csv-to-json" element={<CsvToJson />} />
        <Route path="/pdf-watermark" element={<PDFWatermark />} />
        <Route path="/text-to-html" element={<TextToHTML />} />
        <Route path="/pdf-to-word" element={<PDFToWord />} />
        <Route path="/json-validator" element={<JsonValidator />} />
        <Route path="/regex-tester" element={<RegexTester />} />
        <Route path="/word-to-pdf" element={<WordToPDF />} />
        <Route path="/slug-generator" element={<SlugGenerator />} />
        <Route
          path="/random-password-generator"
          element={<RandomPasswordGenerator />}
        />
        <Route path="/uuid-generator" element={<UUIDGenerator />} />
        <Route
          path="/remove-duplicate-lines"
          element={<RemoveDuplicateLines />}
        />
        <Route path="/character-counter" element={<CharacterCounter />} />
        <Route path="/image-to-pdf" element={<ImageToPDF />} />
        <Route path="/pdf-password-protect" element={<PDFPasswordProtect />} />
        <Route path="/pdf-password-remover" element={<PDFPasswordRemover />} />
        <Route path="/invoice-generator" element={<InvoiceGenerator />} />
        <Route path="/word-counter" element={<WordCounter />} />
        <Route path="/pdf-page-reorder" element={<PDFPageReorder />} />
        <Route path="/robots-txt-generator" element={<RobotsTxtGenerator />} />
        <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
        <Route path="/sitemap-generator" element={<SitemapGenerator />} />
        <Route path="/age-calculator" element={<AgeCalculator />} />
        <Route path="/image-watermark" element={<ImageWatermark />} />
        <Route path="/pdf-metadata-viewer" element={<PDFMetadataViewer />} />
        <Route path="/emi-calculator" element={<EMICalculator />} />
        <Route path="/pdf-page-number-adder" element={<PDFPageNumberAdder />} />
        <Route path="/pdf-merger" element={<PDFMerger />} />
        <Route path="/pdf-page-extractor" element={<PDFPageExtractor />} />
        <Route path="/gst-calculator" element={<GSTCalculator />} />
        <Route path="/base64-to-image" element={<Base64ToImage />} />
        <Route path="/pdf-splitter" element={<PDFSplitter />} />
        <Route path="/pdf-page-delete" element={<PDFPageDelete />} />
        <Route path="/text-compare" element={<TextCompareTool />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/favicon-generator" element={<FaviconGenerator />} />
        <Route path="/image-to-base64" element={<ImageToBase64 />} />
        <Route path="/color-picker-from-image" element={<ColorPickerFromImage />} />
        <Route path="/salary-calculator" element={<SalaryCalculator />} />
        <Route path="/question-paper-generator" element={<QuestionPaperGenerator />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/image-rotate-flip" element={<ImageRotateFlip />} />
        <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
        <Route
          path="/image-background-remover"
          element={<ImageBackgroundRemover />}
        />
        <Route path="/image-crop-circle" element={<ImageCropCircle />} />
        <Route path="/bulk-image-converter" element={<BulkImageConverter />} />
        <Route
          path="/domain-age-da-pa-checker"
          element={<DomainAgeDaPaChecker />}
        />
      </Routes>
      <ToolsChatbot />
      <Footer />
    </div>
  );
}
