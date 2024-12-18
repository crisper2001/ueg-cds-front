import { useEffect, useState } from "react";
import PermanenciasAPI from "../utils/PermanenciasAPI";
import VagasAPI from "../utils/VagasAPI";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import PrecosAPI from "../utils/PrecosAPI";
import FuncionariosAPI from "../utils/FuncionariosAPI";

export default function Permanencias() {
  const [permanencias, setPermanencias] = useState<any[]>([]);
  const [dataHoraEntradaAdd, setDataHoraEntradaAdd] = useState<string>('');
  const [dataHoraSaidaAdd, setDataHoraSaidaAdd] = useState<string>('');
  const [placaVeiculoAdd, setPlacaVeiculoAdd] = useState<string>('');
  const [vagaIdAdd, setVagaIdAdd] = useState<number>(0);
  const [precoIdAdd, setPrecoIdAdd] = useState<number>(0);
  const [funcionarioIdAdd, setFuncionarioIdAdd] = useState<number>(0);
  const [dataHoraEntradaEdit, setDataHoraEntradaEdit] = useState<string>('');
  const [dataHoraSaidaEdit, setDataHoraSaidaEdit] = useState<string>('');
  const [placaVeiculoEdit, setPlacaVeiculoEdit] = useState<string>('');
  const [vagaIdEdit, setVagaIdEdit] = useState<number>(0);
  const [funcionarioIdEdit, setFuncionarioIdEdit] = useState<number>(0);
  const [precoIdEdit, setPrecoIdEdit] = useState<number>(0);
  const [vagas, setVagas] = useState<any[]>([]);
  const [precos, setPrecos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [permanenciaBeingEdited, setPermanenciaBeingEdited] = useState<any>(null);

  const fetchPermanencias = async () => {
    try {
      const data = await PermanenciasAPI.getAllPermanencias();
      if (data) {
        setPermanencias(data);
      }
    } catch (error) {
      console.error('Error fetching all permanencias:', error);
    }
  };

  const fetchVagas = async () => {
    try {
      const data = await VagasAPI.getAllVagas();
      if (data) {
        setVagas(data);
      }
    } catch (error) {
      console.error('Error fetching all vagas:', error);
    }
  };

  const fetchPrecos = async () => {
    try {
      const data = await PrecosAPI.getAllPrices();
      if (data) {
        setPrecos(data);
      }
    } catch (error) {
      console.error('Error fetching all precos:', error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const data = await FuncionariosAPI.getAllFuncionarios();
      if (data) {
        setFuncionarios(data);
      }
    } catch (error) {
      console.error('Error fetching all funcionarios:', error);
    }
  };

  useEffect(() => {
    fetchPermanencias();
    fetchVagas();
    fetchPrecos();
    fetchFuncionarios();
  }, []);

  const handleAddPermanencia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dataHoraEntradaAdd || !placaVeiculoAdd || !vagaIdAdd || !precoIdAdd) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const permanenciaData = {
        dataHoraEntrada: dataHoraEntradaAdd,
        placaVeiculo: placaVeiculoAdd,
        vagaId: vagaIdAdd,
        funcionarioId: funcionarioIdAdd,
        precoId: precoIdAdd,
        dataHoraSaida: dataHoraSaidaAdd ?? undefined,
      };
      console.log(permanenciaData);
      const response = await PermanenciasAPI.createPermanencia(permanenciaData);
      if (response) {
        (document.getElementById("add_permanencia") as HTMLDialogElement)?.close();
        alert('Permanência criada com sucesso');
        fetchPermanencias();
      }
    } catch (error) {
      console.error('Error creating permanencia:', error);
    }
  };

  const handleEditPermanencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dataHoraEntradaEdit === undefined || placaVeiculoEdit === undefined || vagaIdEdit === undefined || funcionarioIdEdit === undefined || precoIdEdit === undefined) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const permanenciaData = {
        id: permanenciaBeingEdited.id,
        dataHoraEntrada: dataHoraEntradaEdit,
        dataHoraSaida: dataHoraSaidaEdit ?? undefined,
        placaVeiculo: placaVeiculoEdit,
      };
      const response = await PermanenciasAPI.updatePermanencia(permanenciaData);
      if (response) {
        (document.getElementById("edit_permanencia") as HTMLDialogElement)?.close();
        alert("Permanencia atualizada com sucesso");
        fetchPermanencias();
      }
    } catch (error) {
      console.error("Error updating permanencia:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {permanencias.length > 0 ? (
        <table className="table w-full border-2 border-base-200">
          <thead>
            <tr className="bg-base-200">
              <th>ID</th>
              <th>Data-Hora de Entrada</th>
              <th>Data-Hora de Saída</th>
              <th>Placa do Veículo</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {permanencias.sort((a, b) => a.id - b.id).map((permanencia) => (
              <tr key={permanencia.id}>
                <td>{permanencia.id}</td>
                <td>{new Date(new Date(permanencia.dataHoraEntrada).getTime() - 3 * 60 * 60 * 1000).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td>{permanencia.dataHoraSaida ? new Date(new Date(permanencia.dataHoraSaida).getTime() - 3 * 60 * 60 * 1000).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td>{permanencia.placaVeiculo}</td>
                <td>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(permanencia.valor)}</td>
                <td>
                  <button className="btn btn-xs btn-ghost" onClick={() => {
                    (document.getElementById("edit_permanencia") as HTMLDialogElement)?.showModal();
                    setPermanenciaBeingEdited(permanencia);
                    setDataHoraEntradaEdit(permanencia.dataHoraEntrada);
                    setDataHoraSaidaEdit(permanencia.dataHoraSaida ?? undefined);
                    setPlacaVeiculoEdit(permanencia.placaVeiculo);
                    setVagaIdEdit(permanencia.vagaId);
                    setFuncionarioIdEdit(permanencia.funcionarioId);
                    setPrecoIdEdit(permanencia.precoId);
                  }}>
                    <FaPencil />
                  </button>
                  <button className="btn btn-xs btn-ghost text-red-400" onClick={() => {
                    if (confirm(`Você tem certeza que deseja excluir a permanência com ID ${permanencia.id}?`)) {
                      PermanenciasAPI.deletePermanencia(permanencia.id).then(() => {
                        fetchPermanencias();
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
        <p className="text-lg text-center">Nenhuma permanência encontrada.</p>
      )}

      <div className="flex justify-end">
        <button className="btn btn-primary text-white" onClick={() => (document.getElementById('add_permanencia') as HTMLDialogElement).showModal()}>
          + Adicionar Permanência
        </button>
      </div>

      <dialog id="add_permanencia" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Adicionar Permanência</h3>
          <form onSubmit={handleAddPermanencia} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="dataHoraEntradaAdd">
                Data/Hora Entrada
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                id="dataHoraEntradaAdd"
                value={dataHoraEntradaAdd}
                onChange={(e) => setDataHoraEntradaAdd(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="dataHoraSaidaAdd">
                Data/Hora Saida (opcional)
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                id="dataHoraSaidaAdd"
                value={dataHoraSaidaAdd}
                onChange={(e) => setDataHoraSaidaAdd(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="placaVeiculoAdd">
                Placa do Veiculo
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                id="placaVeiculoAdd"
                value={placaVeiculoAdd}
                onChange={(e) => setPlacaVeiculoAdd(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="vagaIdAdd">
                Vaga
              </label>
              <select
                id="vagaIdAdd"
                className="select select-bordered w-full"
                value={vagaIdAdd}
                onChange={(e) => setVagaIdAdd(Number(e.target.value))}
              >
                <option value={0}>Selecione uma vaga</option>
                {vagas
                  .sort((a, b) => a.numero - b.numero)
                  .map((vaga) => (
                    <option key={vaga.id} value={vaga.id}>
                      {vaga.numero}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="precoIdAdd">
                Preço
              </label>
              <select
                id="precoIdAdd"
                className="select select-bordered w-full"
                value={precoIdAdd}
                onChange={(e) => setPrecoIdAdd(Number(e.target.value))}
              >
                <option value={0}>Selecione um preço</option>
                {precos.map((preco) => (
                  <option key={preco.id} value={preco.id}>
                    {preco.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="funcionarioIdAdd">
                Funcionário
              </label>
              <select
                id="funcionarioIdAdd"
                className="select select-bordered w-full"
                value={funcionarioIdAdd}
                onChange={(e) => setFuncionarioIdAdd(Number(e.target.value))}
              >
                <option value={0}>Selecione um funcionário</option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
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

      <dialog id="edit_permanencia" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Editar Permanência</h3>
          <form className="flex flex-col gap-4" onSubmit={handleEditPermanencia}>
            <div>
              <label className="label" htmlFor="dataHoraEntradaEdit">
                Data/Hora Entrada
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                id="dataHoraEntradaEdit"
                value={dataHoraEntradaEdit}
                onChange={(e) => setDataHoraEntradaEdit(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="dataHoraSaidaEdit">
                Data/Hora Saída (opcional)
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                id="dataHoraSaidaEdit"
                value={dataHoraSaidaEdit}
                onChange={(e) => setDataHoraSaidaEdit(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="placaVeiculoEdit">
                Placa do Veículo
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                id="placaVeiculoEdit"
                placeholder="Placa do Veículo"
                value={placaVeiculoEdit}
                onChange={(e) => setPlacaVeiculoEdit(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="vagaIdEdit">
                Vaga
              </label>
              <select
                id="vagaIdEdit"
                className="select select-bordered w-full"
                value={vagaIdEdit}
                onChange={(e) => setVagaIdEdit(Number(e.target.value))}
              >
                <option value={0}>Selecione uma vaga</option>
                {vagas
                  .sort((a, b) => a.numero - b.numero)
                  .map((vaga) => (
                    <option key={vaga.id} value={vaga.id}>
                      {vaga.numero}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="funcionarioIdEdit">
                Funcionário
              </label>
              <select
                id="funcionarioIdEdit"
                className="select select-bordered w-full"
                value={funcionarioIdEdit}
                onChange={(e) => setFuncionarioIdEdit(Number(e.target.value))}
              >
                <option value={0}>Selecione um funcionário</option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="precoIdEdit">
                Preço
              </label>
              <select
                id="precoIdEdit"
                className="select select-bordered w-full"
                value={precoIdEdit}
                onChange={(e) => setPrecoIdEdit(Number(e.target.value))}
              >
                <option value={0}>Selecione um preço</option>
                {precos.map((preco) => (
                  <option key={preco.id} value={preco.id}>
                    {preco.id}
                  </option>
                ))}
              </select>
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
