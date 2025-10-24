import { useState, useEffect } from "react";

const AlunoPanel = ({ onVoltar }) => {
  const [assuntoSelecionado, setAssuntoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(5);
  const [questoesDisponiveis, setQuestoesDisponiveis] = useState([]);
  const [simulado, setSimulado] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const questoes = JSON.parse(localStorage.getItem("questoes")) || [];
    setQuestoesDisponiveis(questoes);
  }, []);

  const assuntosUnicos = [...new Set(questoesDisponiveis.map((q) => q.assunto))];

  const gerarSimulado = () => {
    if (!assuntoSelecionado || quantidade <= 0) {
      alert("Selecione o assunto e a quantidade de questões.");
      return;
    }

    const filtradas = questoesDisponiveis.filter(
      (q) => q.assunto === assuntoSelecionado
    );

    if (filtradas.length === 0) {
      alert("Não há questões cadastradas para este assunto.");
      return;
    }

    const sorteadas = filtradas
      .sort(() => 0.5 - Math.random())
      .slice(0, quantidade);

    setSimulado(sorteadas);
    setRespostas({});
    setResultado(null);
  };

  const responder = (id, indice) => {
    setRespostas({ ...respostas, [id]: indice });
  };

  const finalizarSimulado = () => {
    let acertos = 0;

    simulado.forEach((q) => {
      if (respostas[q.id] === q.correta) acertos++;
    });

    setResultado({
      total: simulado.length,
      acertos,
      nota: ((acertos / simulado.length) * 10).toFixed(2),
    });
  };

  const voltarInicio = () => {
    setSimulado([]);
    setResultado(null);
    onVoltar();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {!simulado.length ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Gerar Simulado
          </h2>

          <div className="bg-white p-4 rounded shadow">
            <label className="block mb-2 font-semibold">Assunto:</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={assuntoSelecionado}
              onChange={(e) => setAssuntoSelecionado(e.target.value)}
            >
              <option value="">Selecione um assunto</option>
              {assuntosUnicos.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">
              Quantidade de Questões:
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="w-full p-2 border rounded mb-4"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            />

            <button
              onClick={gerarSimulado}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Iniciar Simulado
            </button>
          </div>
        </>
      ) : resultado ? (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Correção do Simulado
          </h2>

          {simulado.map((q, index) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded shadow mb-4 border border-gray-200"
            >
              <p className="font-semibold mb-2">
                {index + 1}. {q.enunciado}
              </p>

              {q.imagem && (
                <img
                  src={q.imagem}
                  alt="Imagem da questão"
                  className="max-h-60 mb-3 rounded border mx-auto"
                />
              )}

              {q.alternativas.map((alt, i) => {
                const ehCorreta = q.correta === i;
                const ehEscolhida = respostas[q.id] === i;
                const acertou = ehCorreta && ehEscolhida;
                const errou = !ehCorreta && ehEscolhida;

                return (
                  <div
                    key={i}
                    className={`p-2 rounded mb-1 border ${
                      acertou
                        ? "bg-green-100 border-green-400"
                        : errou
                        ? "bg-red-100 border-red-400"
                        : ehCorreta
                        ? "bg-green-50 border-green-300"
                        : "bg-white"
                    }`}
                  >
                    {ehCorreta ? "✅ " : errou ? "❌ " : ""}
                    {alt}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-xl font-bold mb-2">Resultado Final</h3>
            <p>
              Você acertou{" "}
              <span className="font-semibold">{resultado.acertos}</span> de{" "}
              <span className="font-semibold">{resultado.total}</span> questões.
            </p>
            <p className="text-lg font-semibold mt-2">
              Nota final: {resultado.nota} / 10
            </p>

            <button
              onClick={voltarInicio}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Voltar à Página Inicial
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Simulado - {assuntoSelecionado}
          </h2>

          {simulado.map((q, index) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded shadow mb-4 border border-gray-200"
            >
              <p className="font-semibold mb-2">
                {index + 1}. {q.enunciado}
              </p>

              {q.imagem && (
                <img
                  src={q.imagem}
                  alt="Imagem da questão"
                  className="max-h-60 mb-3 rounded border mx-auto"
                />
              )}

              {q.alternativas.map((alt, i) => (
                <label
                  key={i}
                  className={`block p-2 rounded cursor-pointer border mb-1 ${
                    respostas[q.id] === i
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name={`questao-${q.id}`}
                    className="mr-2"
                    checked={respostas[q.id] === i}
                    onChange={() => responder(q.id, i)}
                  />
                  {alt}
                </label>
              ))}
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={voltarInicio}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Voltar
            </button>

            <button
              onClick={finalizarSimulado}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Finalizar Simulado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlunoPanel;
