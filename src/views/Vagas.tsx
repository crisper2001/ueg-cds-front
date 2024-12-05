import { useEffect, useState } from "react";
import VagasAPI from "../utils/VagasAPI";

export default function Vagas() {
  const [vagas, setVagas] = useState<any[]>([]);
  const [numero, setNumero] = useState<number>();
  const [locHorizontal, setLocHorizontal] = useState<number>();
  const [locVertical, setLocVertical] = useState<number>();

  const fetchVagas = async () => {
    try {
      const data = await VagasAPI.getAllVagas();
      if (data) {
        setVagas(data);
      }
    } catch (error) {
      console.error("Error fetching all vagas:", error);
    }
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  const handleAddVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero || !locHorizontal || !locVertical) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const vagaData = {
        numero,
        locHorizontal,
        locVertical,
      };
      console.log(vagaData);
      const response = await VagasAPI.createVaga(vagaData);
      if (response) {
        console.log("Vaga criada com sucesso:", response);
        fetchVagas();
      }
    } catch (error) {
      console.error("Error creating vaga:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {vagas.length > 0 ? (
        <table className="table w-full border-2 border-base-200">
          <thead>
            <tr className="bg-base-200">
              <th>ID</th>
              <th>Número</th>
              <th>Localização Horizontal</th>
              <th>Localização Vertical</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map((vaga) => (
              <tr key={vaga.id}>
                <td>{vaga.id}</td>
                <td>{vaga.numero}</td>
                <td>{vaga.locHorizontal}</td>
                <td>{vaga.locVertical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-center">Nenhuma vaga encontrada.</p>
      )}

      <div className="flex justify-end">
        <button
          className="btn btn-primary text-white"
          onClick={() => (document.getElementById("add_vaga") as HTMLDialogElement)?.showModal()}
        >
          + Adicionar Vaga
        </button>
      </div>

      <dialog id="add_vaga" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Adicionar Vaga</h3>
          <form className="flex flex-col gap-4" onSubmit={handleAddVaga}>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Número"
                value={numero}
                onChange={(e) => setNumero(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Localização Horizontal"
                value={locHorizontal}
                onChange={(e) => setLocHorizontal(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Localização Vertical"
                value={locVertical}
                onChange={(e) => setLocVertical(Number(e.target.value))}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary text-white w-1/3 mx-auto"
            >
              Adicionar
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

