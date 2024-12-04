import { useEffect, useState } from "react";
import VagasAPI from "../utils/VagasAPI";

export default function Vagas() {
	const [vagas, setVagas] = useState<any[]>([]);

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

	useEffect(() => {
		fetchVagas();
	}, []);

	return (
		<div className="flex flex-col gap-4">

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

			<div className="flex justify-end">
				<button className="btn btn-primary text-white">
					+ Adicionar Vaga
				</button>
			</div>

		</div>
	);
}

