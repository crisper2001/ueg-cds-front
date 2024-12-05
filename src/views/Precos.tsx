import { useEffect, useState } from "react";
import PricesAPI from "../utils/PricesAPI";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function Precos() {
  const [precos, setPrecos] = useState<any[]>([]);
  const [tempoInicialAdd, setTempoInicialAdd] = useState<number>();
  const [tempoAdicionalAdd, setTempoAdicionalAdd] = useState<number>();
  const [valorInicialAdd, setValorInicialAdd] = useState<number>();
  const [valorAdicionalAdd, setValorAdicionalAdd] = useState<number>();
  const [tempoInicialEdit, setTempoInicialEdit] = useState<number>();
  const [tempoAdicionalEdit, setTempoAdicionalEdit] = useState<number>();
  const [valorInicialEdit, setValorInicialEdit] = useState<number>();
  const [valorAdicionalEdit, setValorAdicionalEdit] = useState<number>();
  const [precoBeingEdited, setPrecoBeingEdited] = useState<any>(null);

  const fetchPrecos = async () => {
    try {
      const data = await PricesAPI.getAllPrices();
      if (data) {
        setPrecos(data);
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  useEffect(() => {
    fetchPrecos();
  }, []);

  const handleAddPreco = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tempoInicialAdd === undefined || tempoAdicionalAdd === undefined || valorInicialAdd === undefined || valorAdicionalAdd === undefined) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const precoData = {
        tempoInicial: tempoInicialAdd,
        tempoAdicional: tempoAdicionalAdd,
        valorInicial: valorInicialAdd,
        valorAdicional: valorAdicionalAdd,
      };
      const response = await PricesAPI.createPrice(precoData);
      if (response) {
        console.log('Preco criado com sucesso:', response);
        fetchPrecos();
      }
    } catch (error) {
      console.error('Error creating preco:', error);
    }
  };

  const handleEditPreco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempoInicialEdit === undefined || tempoAdicionalEdit === undefined || valorInicialEdit === undefined || valorAdicionalEdit === undefined) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const precoData = {
        id: precoBeingEdited.id,
        tempoInicial: tempoInicialEdit,
        tempoAdicional: tempoAdicionalEdit,
        valorInicial: valorInicialEdit,
        valorAdicional: valorAdicionalEdit,
      };
      const response = await PricesAPI.updatePrice(precoData);
      if (response) {
        console.log("Preco atualizado com sucesso:", response);
        fetchPrecos();
        (document.getElementById("edit_preco") as HTMLDialogElement)?.close();
      }
    } catch (error) {
      console.error("Error updating preco:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {precos.length > 0 ? (
        <table className="table w-full border-2 border-base-200">
          <thead>
            <tr className="bg-base-200">
              <th>ID</th>
              <th>Tempo Inicial (min)</th>
              <th>Tempo Adicional (min)</th>
              <th>Valor Inicial (R$)</th>
              <th>Valor Adicional (R$)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {precos.sort((a, b) => a.id - b.id).map((preco) => (
              <tr key={preco.id}>
                <td>{preco.id}</td>
                <td>{preco.tempoInicial}</td>
                <td>{preco.tempoAdicional}</td>
                <td>{preco.valorInicial}</td>
                <td>{preco.valorAdicional}</td>
                <td>
                  <button className="btn btn-xs btn-ghost" onClick={() => {
                    (document.getElementById("edit_preco") as HTMLDialogElement)?.showModal();
                    setPrecoBeingEdited(preco);
                    setTempoInicialEdit(preco.tempoInicial);
                    setTempoAdicionalEdit(preco.tempoAdicional);
                    setValorInicialEdit(preco.valorInicial);
                    setValorAdicionalEdit(preco.valorAdicional);
                  }}>
                    <FaPencil />
                  </button>
                  <button className="btn btn-xs btn-ghost text-red-400" onClick={() => {
                    if (confirm(`Você tem certeza que deseja excluir o preço com ID ${preco.id}?`)) {
                      PricesAPI.deletePrice(preco.id).then(() => {
                        fetchPrecos();
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
        <p className="text-lg text-center">Nenhum preço encontrado.</p>
      )}

      <div className="flex justify-end">
        <button className="btn btn-primary text-white" onClick={() => {
          (document.getElementById('add_preco') as HTMLDialogElement)?.showModal();
        }}>
          + Adicionar Preço
        </button>
      </div>

      <dialog id="add_preco" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Adicionar Preço</h3>
          <form onSubmit={handleAddPreco} className="flex flex-col gap-4">
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Tempo Inicial (min)"
                value={tempoInicialAdd}
                onChange={(e) => setTempoInicialAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Tempo Adicional (min)"
                value={tempoAdicionalAdd}
                onChange={(e) => setTempoAdicionalAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Inicial (R$)"
                value={valorInicialAdd}
                onChange={(e) => setValorInicialAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Adicional (R$)"
                value={valorAdicionalAdd}
                onChange={(e) => setValorAdicionalAdd(Number(e.target.value))}
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

      <dialog id="edit_preco" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Editar Preço</h3>
          <form className="flex flex-col gap-4" onSubmit={handleEditPreco}>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Tempo Inicial (min)"
                value={tempoInicialEdit}
                onChange={(e) => setTempoInicialEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Tempo Adicional (min)"
                value={tempoAdicionalEdit}
                onChange={(e) => setTempoAdicionalEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Inicial (R$)"
                value={valorInicialEdit}
                onChange={(e) => setValorInicialEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Adicional (R$)"
                value={valorAdicionalEdit}
                onChange={(e) => setValorAdicionalEdit(Number(e.target.value))}
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

