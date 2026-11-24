import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Layout, useSmoothScroll } from "./components/chrome";
import { ContactsPage, Home, MastersPage, NotFound, ServicesPage } from "./pages";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const t = window.setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 140);
        return () => window.clearTimeout(t);
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 260);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useSmoothScroll();

  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/masters" element={<MastersPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
