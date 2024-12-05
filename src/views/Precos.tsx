import { useEffect, useState } from "react";
import PricesAPI from "../utils/PricesAPI";

export default function Precos() {
	const [precos, setPrecos] = useState<any[]>([]);
	const [tempoInicial, setTempoInicial] = useState<number>();
	const [tempoAdicional, setTempoAdicional] = useState<number>();
	const [valorInicial, setValorInicial] = useState<number>();
	const [valorAdicional, setValorAdicional] = useState<number>();

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
    if (tempoInicial === undefined || tempoAdicional === undefined || valorInicial === undefined || valorAdicional === undefined) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const precoData = {
        tempoInicial,
        tempoAdicional,
        valorInicial,
        valorAdicional,
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
						</tr>
					</thead>
					<tbody>
						{precos.map((preco) => (
							<tr key={preco.id}>
								<td>{preco.id}</td>
								<td>{preco.tempoInicial}</td>
								<td>{preco.tempoAdicional}</td>
								<td>{preco.valorInicial}</td>
								<td>{preco.valorAdicional}</td>
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
                value={tempoInicial}
                onChange={(e) => setTempoInicial(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Tempo Adicional (min)"
                value={tempoAdicional}
                onChange={(e) => setTempoAdicional(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Inicial (R$)"
                value={valorInicial}
                onChange={(e) => setValorInicial(Number(e.target.value))}
              />
            </div>
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Valor Adicional (R$)"
                value={valorAdicional}
                onChange={(e) => setValorAdicional(Number(e.target.value))}
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

