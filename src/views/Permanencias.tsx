import { useEffect, useState } from "react";
import PermanenciasAPI from "../utils/PermanenciasAPI";

export default function Permanencias() {
	const [permanencias, setPermanencias] = useState<any[]>([]);

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

	useEffect(() => {
		fetchPermanencias();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<table className="table w-full border-2 border-base-200">
				<thead>
					<tr className="bg-base-200">
						<th>ID</th>
						<th>Data Hora Entrada</th>
						<th>Data Hora Saida</th>
						<th>Placa do Veiculo</th>
						<th>Valor</th>
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

			<div className="flex justify-end">
				<button className="btn btn-primary text-white">
					+ Adicionar Permanência
				</button>
			</div>
		</div>
	);
}

