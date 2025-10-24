import { useState } from "react";

export default function QuestionForm({ onSave, question, label }) {
  const [assunto, setAssunto] = useState(question?.assunto || "");
  const [enunciado, setEnunciado] = useState(question?.enunciado || "");
  const [alternativas, setAlternativas] = useState(question?.alternativas || ["", "", "", "", ""]);
  const [imagem, setImagem] = useState(question?.imagem || null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const q = { assunto, enunciado, alternativas, imagem };
    onSave(q);
    setAssunto("");
    setEnunciado("");
    setAlternativas(["", "", "", "", ""]);
    setImagem(null);
  };

  return (
    <div className="border p-3 bg-gray-50 rounded mb-3">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Assunto"
        value={assunto}
        onChange={(e) => setAssunto(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Enunciado"
        value={enunciado}
        onChange={(e) => setEnunciado(e.target.value)}
      />
      <input type="file" onChange={handleImageUpload} className="mb-2" />
      {imagem && <img src={imagem} alt="Preview" className="max-h-32 mb-2" />}
      {alternativas.map((alt, i) => (
        <input
          key={i}
          className="border p-2 w-full mb-1"
          placeholder={`Alternativa ${i + 1}`}
          value={alt}
          onChange={(e) => {
            const newAlts = [...alternativas];
            newAlts[i] = e.target.value;
            setAlternativas(newAlts);
          }}
        />
      ))}
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSave}>
        {label}
      </button>
    </div>
  );
}
