import { useState } from "react";

export default function LoginModal({ onClose, setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("aluno");

  const handleSubmit = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (isRegister) {
      if (users.some((u) => u.email === email)) {
        alert("Usuário já existe!");
        return;
      }
      const newUser = { email, password, role };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setUser(newUser);
      onClose();
    } else {
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        setUser(found);
        onClose();
      } else {
        alert("Credenciais inválidas!");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-3">
          {isRegister ? "Cadastrar" : "Entrar"}
        </h2>
        <input
          type="email"
          placeholder="E-mail"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegister && (
          <select
            className="border p-2 w-full mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>
        )}
        <button
          className="bg-blue-500 text-white w-full py-2 rounded"
          onClick={handleSubmit}
        >
          {isRegister ? "Cadastrar" : "Entrar"}
        </button>
        <button
          className="text-sm text-gray-600 mt-2 underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Já tem conta?" : "Criar conta"}
        </button>
        <button
          className="block w-full mt-2 text-red-500 underline"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
