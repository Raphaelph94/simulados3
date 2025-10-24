export default function Header({ user, onLogin, onLogout }) {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Simulador de Questões</h1>
      <nav className="space-x-4">
        <button className="hover:underline">Sobre</button>
        <button className="hover:underline">Contato</button>
        {user ? (
          <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">
            Sair
          </button>
        ) : (
          <button onClick={onLogin} className="bg-green-500 px-3 py-1 rounded">
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
