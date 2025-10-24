import { useState, useEffect } from "react";

const ProfessorPanel = () => {
  const [assunto, setAssunto] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [imagem, setImagem] = useState(null);
  const [alternativas, setAlternativas] = useState(["", "", "", "", ""]);
  const [correta, setCorreta] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem("questoes")) || [];
    setQuestoes(salvas);
  }, []);

  const salvarQuestoes = (lista) => {
    setQuestoes(lista);
    localStorage.setItem("questoes", JSON.stringify(lista));
  };

  const limparFormulario = () => {
    setAssunto("");
    setEnunciado("");
    setImagem(null);
    setAlternativas(["", "", "", "", ""]);
    setCorreta(null);
    setEditandoId(null);
  };

  const handleImagemUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagem(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const adicionarOuEditarQuestao = () => {
    if (!assunto || !enunciado || alternativas.some((alt) => !alt) || correta === null) {
      alert("Preencha todos os campos e selecione a alternativa correta.");
      return;
    }

    let novaLista;

    if (editandoId) {
      // Editar questão existente
      novaLista = questoes.map((q) =>
        q.id === editandoId
          ? { ...q, assunto, enunciado, imagem, alternativas, correta }
          : q
      );
    } else {
      // Criar nova questão
      const novaQuestao = {
        id: Date.now(),
        assunto,
        enunciado,
        imagem,
        alternativas,
        correta,
      };
      novaLista = [...questoes, novaQuestao];
    }

    salvarQuestoes(novaLista);
    limparFormulario();
  };

  const removerQuestao = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta questão?")) return;
    const novaLista = questoes.filter((q) => q.id !== id);
    salvarQuestoes(novaLista);
  };

  const editarQuestao = (id) => {
    const q = questoes.find((q) => q.id === id);
    if (!q) return;
    setAssunto(q.assunto);
    setEnunciado(q.enunciado);
    setImagem(q.imagem || null);
    setAlternativas(q.alternativas);
    setCorreta(q.correta);
    setEditandoId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const alterarAlternativa = (index, valor) => {
    const novas = [...alternativas];
    novas[index] = valor;
    setAlternativas(novas);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Painel do Professor
      </h2>

      <div className="bg-white shadow-md p-4 rounded-lg">
        <label className="block mb-2 font-semibold">Assunto:</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Enunciado:</label>
        <textarea
          className="w-full p-2 border rounded mb-4"
          value={enunciado}
          onChange={(e) => setEnunciado(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Imagem (opcional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagemUpload}
          className="mb-2"
        />
        {imagem && (
          <div className="mb-4">
            <img
              src={imagem}
              alt="Pré-visualização"
              className="max-h-40 object-contain border rounded"
            />
            <button
              onClick={() => setImagem(null)}
              className="block mt-2 text-red-600 underline"
            >
              Remover imagem
            </button>
          </div>
        )}

        <h3 className="font-semibold mb-2">Alternativas:</h3>
        {alternativas.map((alt, i) => (
          <div key={i} className="flex items-center mb-2">
            <input
              type="radio"
              name="correta"
              checked={correta === i}
              onChange={() => setCorreta(i)}
              className="mr-2"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => alterarAlternativa(i, e.target.value)}
              placeholder={`Alternativa ${i + 1}`}
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setAlternativas([...alternativas, ""])}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Alternativa
          </button>
          <button
            onClick={() =>
              setAlternativas(alternativas.length > 2 ? alternativas.slice(0, -1) : alternativas)
            }
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            - Alternativa
          </button>
        </div>

        <button
          onClick={adicionarOuEditarQuestao}
          className={`mt-4 ${
            editandoId ? "bg-yellow-600" : "bg-green-600"
          } text-white px-4 py-2 rounded`}
        >
          {editandoId ? "Salvar Alterações" : "Salvar Questão"}
        </button>

        {editandoId && (
          <button
            onClick={limparFormulario}
            className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">
        Questões Cadastradas
      </h3>
      <ul>
        {questoes.map((q) => (
          <li
            key={q.id}
            className="bg-gray-100 p-3 rounded mb-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {q.imagem && (
                <img
                  src={q.imagem}
                  alt="miniatura"
                  className="w-12 h-12 object-cover rounded border"
                />
              )}
              <div>
                <strong>{q.assunto}</strong> — {q.enunciado.slice(0, 40)}...
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editarQuestao(q.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => removerQuestao(q.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessorPanel;
