import { useEffect, useState } from "react";
import UsersAPI from "../utils/UsersAPI";

export default function Funcionarios() {
	const [users, setUsers] = useState<any[]>([]);

	const fetchUsers = async () => {
		try {
			const data = await UsersAPI.getAllUsers();
			if (data) {
				setUsers(data);
			}
		} catch (error) {
			console.error('Error fetching all users:', error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{users.length > 0 ? (
				<table className="table w-full border-2 border-base-200">
					<thead>
						<tr className="bg-base-200">
							<th>ID</th>
							<th>Nome</th>
							<th>E-mail</th>
						</tr>
					</thead>
					<tbody>
						{users.sort((a, b) => a.id - b.id).map((user) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.nome}</td>
								<td>{user.email}</td>
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

