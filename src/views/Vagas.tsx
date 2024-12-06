import { useEffect, useState } from "react";
import VagasAPI from "../utils/VagasAPI";
import { FaPencil, FaTrash } from "react-icons/fa6";

export default function Vagas() {
  const [vagas, setVagas] = useState<any[]>([]);
  const [numeroAdd, setNumeroAdd] = useState<number>(0);
  const [locHorizontalAdd, setLocHorizontalAdd] = useState<number>(0);
  const [locVerticalAdd, setLocVerticalAdd] = useState<number>(0);
  const [numeroEdit, setNumeroEdit] = useState<number>(0);
  const [locHorizontalEdit, setLocHorizontalEdit] = useState<number>(0);
  const [locVerticalEdit, setLocVerticalEdit] = useState<number>(0);
  const [vagaBeingEdited, setVagaBeingEdited] = useState<any>(null);

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
    if (numeroAdd === undefined || locHorizontalAdd === undefined || locVerticalAdd === undefined) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const vagaData = {
        numero: numeroAdd,
        locHorizontal: locHorizontalAdd,
        locVertical: locVerticalAdd,
      };
      const response = await VagasAPI.createVaga(vagaData);
      if (response) {
        console.log("Vaga criada com sucesso:", response);
        fetchVagas();
      }
    } catch (error) {
      console.error("Error creating vaga:", error);
    }
  };

  const handleEditVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numeroEdit === undefined || locHorizontalEdit === undefined || locVerticalEdit === undefined) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const vagaData = {
        id: vagaBeingEdited.id,
        numero: numeroEdit,
        locHorizontal: locHorizontalEdit,
        locVertical: locVerticalEdit,
      };
      const response = await VagasAPI.updateVaga(vagaData);
      if (response) {
        console.log("Vaga atualizada com sucesso:", response);
        fetchVagas();
        (document.getElementById("edit_vaga") as HTMLDialogElement)?.close();
      }
    } catch (error) {
      console.error("Error updating vaga:", error);
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
              <th>Ocupada?</th>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {vagas.sort((a, b) => a.id - b.id).map((vaga) => (
              <tr key={vaga.id}>
                <td>{vaga.id}</td>
                <td>{vaga.numero}</td>
                <td>{vaga.locHorizontal}</td>
                <td>{vaga.locVertical}</td>
                <td>{vaga.isOcupada ? "Sim" : "Não"}</td>
                <td>
                  <button className="btn btn-xs btn-ghost" onClick={() => {
                    (document.getElementById("edit_vaga") as HTMLDialogElement)?.showModal();
                    setVagaBeingEdited(vaga);
                    setNumeroEdit(vaga.numero);
                    setLocHorizontalEdit(vaga.locHorizontal);
                    setLocVerticalEdit(vaga.locVertical);
                  }}>
                    <FaPencil />
                  </button>
                  <button className="btn btn-xs btn-ghost text-red-400" onClick={() => {
                    if (confirm(`Você tem certeza que deseja excluir a vaga ${vaga.numero}?`)) {
                      VagasAPI.deleteVaga(vaga.id).then(() => {
                        fetchVagas();
                      });
                    }
                  }}>
                    <FaTrash />
                    </button>
                </td>
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
              <label htmlFor="numero_add" className="label">
                Número
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                id="numero_add"
                placeholder="Número"
                value={numeroAdd}
                onChange={(e) => setNumeroAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="loc_horizontal_add" className="label">
                Localização Horizontal
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                id="loc_horizontal_add"
                placeholder="Localização Horizontal"
                value={locHorizontalAdd}
                onChange={(e) => setLocHorizontalAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="loc_vertical_add" className="label">
                Localização Vertical
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                id="loc_vertical_add"
                placeholder="Localização Vertical"
                value={locVerticalAdd}
                onChange={(e) => setLocVerticalAdd(Number(e.target.value))}
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

      <dialog id="edit_vaga" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Editar Vaga</h3>
          <form className="flex flex-col gap-4" onSubmit={handleEditVaga}>
            <div>
              <label htmlFor="numero_edit" className="label">
                Número
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                id="numero_edit"
                placeholder="Número"
                value={numeroEdit}
                onChange={(e) => setNumeroEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="loc_horizontal_edit" className="label">
                Localização Horizontal
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                id="loc_horizontal_edit"
                placeholder="Localização Horizontal"
                value={locHorizontalEdit}
                onChange={(e) => setLocHorizontalEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="loc_vertical_edit" className="label">
                Localização Vertical
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                id="loc_vertical_edit"
                placeholder="Localização Vertical"
                value={locVerticalEdit}
                onChange={(e) => setLocVerticalEdit(Number(e.target.value))}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary text-white w-1/3 mx-auto"
            >
              Salvar
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
