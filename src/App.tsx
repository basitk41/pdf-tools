import { Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import MergePdf from './pages/MergePdf';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Tools from './pages/Tools';
import PdfToWord from './pages/PdfToWord';
import WordToPdf from './pages/WordToPdf';
import PdfToExcel from './pages/PdfToExcel';
import ExcelToPdf from './pages/ExcelToPdf';
import PdfToPowerPoint from './pages/PdfToPowerPoint';
import PowerPointToPdf from './pages/PowerPointToPdf';
import { SplitPdf } from './pages/SplitPdf';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import BlogManagement from './pages/BlogManagement'; // New import
import BlogDetailPage from './pages/BlogDetailPage'; // New import
import Blogs from './pages/Blogs'; // New import
import BlogPublicDetailPage from './pages/BlogPublicDetailPage'; // New import
import ContactRequests from './pages/ContactRequests'; // New import
import ProtectedRoute from './components/ProtectedRoute';
import { EditPdf } from './pages/EditPdf';

const App = () => (
  <I18nextProvider i18n={i18n}>
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/merge-pdf' element={<MergePdf />} />
        <Route path='/pdf-to-word' element={<PdfToWord />} />
        <Route path='/word-to-pdf' element={<WordToPdf />} />
        <Route path='/pdf-to-excel' element={<PdfToExcel />} />
        <Route path='/excel-to-pdf' element={<ExcelToPdf />} />
        <Route path='/pdf-to-powerpoint' element={<PdfToPowerPoint />} />
        <Route path='/powerpoint-to-pdf' element={<PowerPointToPdf />} />
        <Route path='/split-pdf' element={<SplitPdf />} />
        <Route path='/pdf-editor' element={<EditPdf />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/tools' element={<Tools />} />
        <Route path='/blogs' element={<Blogs />} />{' '}
        {/* New public blogs route */}
        <Route path='/blogs/:id' element={<BlogPublicDetailPage />} />{' '}
        {/* New public single blog route */}
      </Route>
      <Route path='/admin/login' element={<LoginPage />} />
      <Route
        path='/admin/dashboard'
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/blogs'
        element={
          <ProtectedRoute>
            <BlogManagement />
          </ProtectedRoute>
        }
      />
        <Route
          path='/admin/blogs/:id'
          element={
            <ProtectedRoute>
              <BlogDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/contact-requests'
          element={
            <ProtectedRoute>
              <ContactRequests />
            </ProtectedRoute>
          }
        />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  </I18nextProvider>
);

export default App;
