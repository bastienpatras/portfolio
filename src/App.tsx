import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { Toaster } from '@/components/ui/Toaster';
import { Home } from '@/pages/Home';
import { Research } from '@/pages/Research';
import { Publications } from '@/pages/Publications';
import { PublicationDetail } from '@/pages/PublicationDetail';
import { APIs } from '@/pages/APIs';
import { APIDetail } from '@/pages/APIDetail';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { DPEMatcher } from '@/pages/DPEMatcher';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header onSearchOpen={() => setSearchOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onSearchOpen={() => setSearchOpen(true)} />} />
            <Route path="/research" element={<Research />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications/:id" element={<PublicationDetail />} />
            <Route path="/dpe-matcher" element={<DPEMatcher />} />
            <Route path="/apis" element={<APIs />} />
            <Route path="/apis/:id" element={<APIDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
