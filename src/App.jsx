import { useEffect, useState } from "react";

function App() {
  const [dados, setDados] = useState([]);
  const [buscaOlt, setBuscaOlt] = useState("");
  const [buscaPon, setBuscaPon] = useState("");
  const [resultado, setResultado] = useState([]);

  // 🔹 normaliza qualquer formato de OLT
  function normalizarOlts(lista) {
    return lista.map((item) => ({
      olt:
        item.oltCentralNet ||
        item.oltCentro ||
        item.oltVertentes ||
        item.oltJoaoAlfredo ||
        item.oltBaraunas ||
        item.oltVertenteLerio ||
        item.oltLagoaVaca ||
        item.oltTambor ||
        item.oltEncruzilhada ||
        item.oltMimoso ||
        item.oltJunco ||
        item.oltBarraOnca ||
        item.oltCapivara ||
        item.oltTatus ||
        item.olt ||
        "",
      cto: item.cto,
      pon: Number(item.pon),
      vlan: Number(item.vlan),
    }));
  }

  useEffect(() => {
    fetch("/dados.json")
      .then((res) => res.json())
      .then((data) => {
        const lista = data.oltsCentral || data;
        const normalizado = normalizarOlts(lista);
        setDados(normalizado);
        setResultado(normalizado); // mostra tudo no início
      })
      .catch((err) => console.error(err));
  }, []);

  function handleBuscar() {
  const oltBusca = buscaOlt.toLowerCase().trim();
  const ponBusca = buscaPon.trim();

  const filtrado = dados.filter((item) => {
    // proteção total
    const nomeOlt = (item.olt || "").toLowerCase();

    const matchOlt = oltBusca === ""
      ? true
      : nomeOlt.includes(oltBusca);

    const matchPon = ponBusca === ""
      ? true
      : String(item.pon) === ponBusca;

    return matchOlt && matchPon;
  });

    setResultado(filtrado);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-100">
      <div className="w-full max-w-xl bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Busca Por Olt</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Digite uma olt (ex: centralnet, cto/sao)"
            className="border p-2 rounded"
            value={buscaOlt}
            onChange={(e) => setBuscaOlt(e.target.value)}
          />

          <input
            type="number"
            placeholder="Digite a PON"
            className="border p-2 rounded"
            value={buscaPon}
            onChange={(e) => setBuscaPon(e.target.value)}
          />

          <button
            onClick={handleBuscar}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">OLT</th>
              <th className="border p-2 text-left">Cto</th>
              <th className="border p-2 text-left">PON</th>
              <th className="border p-2 text-left">VLAN</th>
            </tr>
          </thead>
          <tbody>
            {resultado.length > 0 ? (
              resultado.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border p-2">{item.olt}</td>
                  <td className="border p-2">{item.cto}</td>
                  <td className="border p-2">{item.pon}</td>
                  <td className="border p-2">{item.vlan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
