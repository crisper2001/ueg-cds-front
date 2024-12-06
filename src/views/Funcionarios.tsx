import { useEffect, useState } from "react";
import FuncionariosAPI from "../utils/FuncionariosAPI";

export default function Funcionarios() {
	const [funcionarios, setFuncionarios] = useState<any[]>([]);

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
		fetchFuncionarios();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{funcionarios.length > 0 ? (
				<table className="table w-full border-2 border-base-200">
					<thead>
						<tr className="bg-base-200">
							<th>ID</th>
							<th>Nome</th>
							<th>E-mail</th>
						</tr>
					</thead>
					<tbody>
						{funcionarios.sort((a, b) => a.id - b.id).map((funcionario) => (
							<tr key={funcionario.id}>
								<td>{funcionario.id}</td>
								<td>{funcionario.nome}</td>
								<td>{funcionario.email}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p className="text-lg text-center">Nenhum funcionário encontrado.</p>
			)}

		</div>
	);
}

