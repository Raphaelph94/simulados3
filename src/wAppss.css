import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CarouselSection from "./components/CarouselSection";
import LoginModal from "./components/LoginModal";
import ProfessorPanel from "./components/ProfessorPanel";
import AlunoPanel from "./components/AlunoPanel";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-4">
        {!user && <CarouselSection />}
        {!user && showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} setUser={setUser} />
        )}
        {user?.role === "professor" && <ProfessorPanel />}
        {user?.role === "aluno" && <AlunoPanel />}
      </main>
      <Footer />
    </div>
  );
}
