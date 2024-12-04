import { useState, useEffect } from "react";
import VagasAPI from "../utils/VagasAPI";

export default function Estacionamento() {
	const [vagas, setVagas] = useState<any[]>([]);
	const [matrix, setMatrix] = useState<any[][]>([]);

	const fetchVagas = async () => {
		try {
			const data = await VagasAPI.getAllVagas();
			if (data) {
				setVagas(data);
				createMatrix(data);
			}
		} catch (error) {
			console.error('Error fetching all vagas:', error);
		}
	};

	const createMatrix = (vagas: any[]) => {
		const maxHorizontal = Math.max(...vagas.map(vaga => vaga.locHorizontal));
		const maxVertical = Math.max(...vagas.map(vaga => vaga.locVertical));
		const newMatrix = Array.from({ length: maxVertical }, () => Array(maxHorizontal).fill(null));

		vagas.forEach(vaga => {
			newMatrix[vaga.locVertical - 1][vaga.locHorizontal - 1] = vaga.numero;
		});

		setMatrix(newMatrix);
	};

	useEffect(() => {
		fetchVagas();
	}, []);

	return (
		<div className="flex items-center justify-center">
			<div className="matrix bg-base-300 p-2 rounded-lg">
				{matrix.map((row, rowIndex) => (
					<div key={rowIndex} className="matrix-row">
						{row.map((vaga, colIndex) => (
							<div key={colIndex} className="matrix-cell">
								{vaga !== null ? vaga : '?'}
							</div>
						))}
					</div>
				))}
			</div>
		</div>

	);
}
