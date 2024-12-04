import { useEffect, useState } from "react";
import PricesAPI from "../utils/PricesAPI";

export default function Precos() {
	const [precos, setPrecos] = useState<any[]>([]);

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

	return (
		<div className="flex flex-col gap-4">
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

			<div className="flex justify-end">
				<button className="btn btn-primary text-white">
					+ Adicionar Preço
				</button>
			</div>
		</div>
	);
}

