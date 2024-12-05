import { useEffect, useState } from "react";
import PermanenciasAPI from "../utils/PermanenciasAPI";
import PricesAPI from "../utils/PricesAPI";
import UsersAPI from "../utils/UsersAPI";
import VagasAPI from "../utils/VagasAPI";

export default function Permanencias() {
	const [permanencias, setPermanencias] = useState<any[]>([]);
	const [dataHoraEntrada, setDataHoraEntrada] = useState<string>();
	const [dataHoraSaida, setDataHoraSaida] = useState<string>();
	const [placaVeiculo, setPlacaVeiculo] = useState<string>();
	const [vagaId, setVagaId] = useState<number>();
	const [funcionarioId, setFuncionarioId] = useState<number>();
	const [precoId, setPrecoId] = useState<number>();
	const [vagas, setVagas] = useState<any[]>([]);
	const [funcionarios, setFuncionarios] = useState<any[]>([]);
	const [precos, setPrecos] = useState<any[]>([]);

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

	const fetchFuncionarios = async () => {
		try {
			const data = await UsersAPI.getAllUsers();
			if (data) {
				setFuncionarios(data);
			}
		} catch (error) {
			console.error('Error fetching all funcionarios:', error);
		}
	};

	const fetchPrecos = async () => {
		try {
			const data = await PricesAPI.getAllPrices();
			if (data) {
				setPrecos(data);
			}
		} catch (error) {
			console.error('Error fetching all precos:', error);
		}
	};

	useEffect(() => {
		fetchPermanencias();
		fetchVagas();
		fetchFuncionarios();
		fetchPrecos();
	}, []);

	const handleAddPermanencia = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (dataHoraEntrada === undefined || dataHoraSaida === undefined || placaVeiculo === undefined || vagaId === undefined || funcionarioId === undefined || precoId === undefined) {
			alert("Preencha todos os campos");
			return;
		}
		try {
			const permanenciaData = {
				dataHoraEntrada,
				dataHoraSaida,
				placaVeiculo,
				vagaId,
				funcionarioId,
				precoId,
			};
			const response = await PermanenciasAPI.createPermanencia(permanenciaData);
			if (response) {
				console.log('Permanencia criada com sucesso:', response);
				fetchPermanencias();
			}
		} catch (error) {
			console.error('Error creating permanencia:', error);
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
							<th>Valor (R$)</th>
						</tr>
					</thead>
					<tbody>
						{permanencias.map((permanencia) => (
							<tr key={permanencia.id}>
								<td>{permanencia.id}</td>
								<td>{new Date(permanencia.dataHoraEntrada).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
								<td>{new Date(permanencia.dataHoraSaida).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
								<td>{permanencia.placaVeiculo}</td>
								<td>{permanencia.valor}</td>
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
              <label className="label" htmlFor="dataHoraEntrada">
                Data Hora Entrada
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                id="dataHoraEntrada"
                value={dataHoraEntrada}
                onChange={(e) => setDataHoraEntrada(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="dataHoraSaida">
                Data Hora Saida
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                id="dataHoraSaida"
                value={dataHoraSaida}
                onChange={(e) => setDataHoraSaida(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="placaVeiculo">
                Placa do Veiculo
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                id="placaVeiculo"
                value={placaVeiculo}
                onChange={(e) => setPlacaVeiculo(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="vagaId">
                Vaga
              </label>
              <select
                id="vagaId"
                className="select select-bordered w-full"
                value={vagaId}
                onChange={(e) => setVagaId(Number(e.target.value))}
              >
                <option value={0}>Selecione uma vaga</option>
                {vagas.map((vaga) => (
                  <option key={vaga.id} value={vaga.id}>
                    {vaga.numero}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="funcionarioId">
                Funcionário
              </label>
              <select
                id="funcionarioId"
                className="select select-bordered w-full"
                value={funcionarioId}
                onChange={(e) => setFuncionarioId(Number(e.target.value))}
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
              <label className="label" htmlFor="precoId">
                Preço
              </label>
              <select
                id="precoId"
                className="select select-bordered w-full"
                value={precoId}
                onChange={(e) => setPrecoId(Number(e.target.value))}
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

