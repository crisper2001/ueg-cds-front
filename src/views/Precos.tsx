import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import PrecosAPI from "../utils/PrecosAPI";

export default function Precos() {
  const [precos, setPrecos] = useState<any[]>([]);
  const [tempoInicialAdd, setTempoInicialAdd] = useState<number>(0);
  const [tempoAdicionalAdd, setTempoAdicionalAdd] = useState<number>(0);
  const [valorInicialAdd, setValorInicialAdd] = useState<number>(0);
  const [valorAdicionalAdd, setValorAdicionalAdd] = useState<number>(0);
  const [tempoInicialEdit, setTempoInicialEdit] = useState<number>(0);
  const [tempoAdicionalEdit, setTempoAdicionalEdit] = useState<number>(0);
  const [valorInicialEdit, setValorInicialEdit] = useState<number>(0);
  const [valorAdicionalEdit, setValorAdicionalEdit] = useState<number>(0);
  const [precoBeingEdited, setPrecoBeingEdited] = useState<any>(null);

  const fetchPrecos = async () => {
    try {
      const data = await PrecosAPI.getAllPrices();
      if (data) {
        setPrecos(data);
      }
    } catch (error) {
      console.error('Error fetching all funcionarios:', error);
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
      const response = await PrecosAPI.createPrice(precoData);
      if (response) {
        alert('Preço criado com sucesso');
        fetchPrecos();
      }
    } catch (error) {
      console.error('Error creating preco:', error);
    }
  };

  const handleEditPreco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempoInicialEdit || !tempoAdicionalEdit || !valorInicialEdit || !valorAdicionalEdit) {
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
      const response = await PrecosAPI.updatePrice(precoData);
      if (response) {
        (document.getElementById("edit_preco") as HTMLDialogElement)?.close();
        alert("Preço atualizado com sucesso");
        fetchPrecos();
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
              <th>Valor Inicial</th>
              <th>Valor Adicional</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {precos.sort((a, b) => a.id - b.id).map((preco) => (
              <tr key={preco.id}>
                <td>{preco.id}</td>
                <td>{preco.tempoInicial}</td>
                <td>{preco.tempoAdicional}</td>
                <td>{preco.valorInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{preco.valorAdicional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
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
                      PrecosAPI.deletePrice(preco.id).then(() => {
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
              <label className="label">
                <span className="label-text">Tempo Inicial (min)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempoInicialAdd}
                onChange={(e) => setTempoInicialAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Tempo Adicional (min)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempoAdicionalAdd}
                onChange={(e) => setTempoAdicionalAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Valor Inicial (R$)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={valorInicialAdd}
                onChange={(e) => setValorInicialAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Valor Adicional (R$)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
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
              <label className="label">
                <span className="label-text">Tempo Inicial (min)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempoInicialEdit}
                onChange={(e) => setTempoInicialEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Tempo Adicional (min)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Tempo Adicional (min)"
                value={tempoAdicionalEdit}
                onChange={(e) => setTempoAdicionalEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Valor Inicial (R$)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Inicial (R$)"
                value={valorInicialEdit}
                onChange={(e) => setValorInicialEdit(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Valor Adicional (R$)</span>
              </label>
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

