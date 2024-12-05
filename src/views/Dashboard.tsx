import { useState, useEffect } from "react";
import VagasAPI from "../utils/VagasAPI";

export default function Dashboard() {
	const [vagas, setVagas] = useState<any[]>([]);
	const [matrix, setMatrix] = useState<any[][]>([]);
	const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
	const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

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
			newMatrix[vaga.locHorizontal - 1][vaga.locVertical - 1] = vaga.numero;
		});

		setMatrix(newMatrix);
	};

	useEffect(() => {
		fetchVagas();
		const timer = setInterval(() => {
			const now = new Date();
			setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
			setCurrentDate(now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="text-center">
        <p className="text-2xl">Bem-vindo!</p>
        <p className="text-lg">Hoje é {currentDate}. São {currentTime}.</p>
			</div>
			{vagas.length > 0 ? (
				<>
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

					<div className="text-lg text-center bg-base-300 p-2 rounded-lg">
						Total de vagas: {vagas.length}
					</div>
				</>
			) : (
				<div className="text-lg text-center">
					Nenhuma vaga encontrada.
				</div>
			)}
		</div>
	);
}

