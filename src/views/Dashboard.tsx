import { useState, useEffect } from "react";
import VagasAPI from "../utils/VagasAPI";
import { FaCheck, FaNotdef } from "react-icons/fa6";

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
		const newMatrix = Array.from({ length: maxHorizontal }, () => Array(maxVertical).fill(null));

		vagas.forEach(vaga => {
			newMatrix[vaga.locHorizontal - 1][vaga.locVertical - 1] = vaga;
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
				<p className="text-2xl">Bem-vindo, {JSON.parse(localStorage.getItem('funcionario') || '{}').nome}!</p>
				<p className="text-lg">Hoje é {currentDate}. São {currentTime}.</p>
			</div>
			{vagas.length > 0 ? (
				<>
					<div className="flex flex-col bg-gray-900 p-2 rounded-lg">
						{matrix.map((row, rowIndex) => (
							<div key={rowIndex} className="flex">
								{row.map((vaga, colIndex) => (
									<div key={colIndex} className={vaga === null ? 'p-2 w-24 h-40 text-center text-red-600' : 'border-2 border-yellow-400 p-2 w-24 h-40 text-center text-3xl'}>
										{vaga !== null ? (
											<div className="flex flex-col items-center justify-center gap-2">
												<p className="text-yellow-400">{vaga.numero}</p>
												<div>{vaga.isOcupada ? <FaNotdef className="text-red-500" /> : <FaCheck className="text-green-500" />}</div>
											</div>
										) : ''}
									</div>
								))}
							</div>
						))}
					</div>

					<div className="flex items-center justify-center gap-8 bg-base-300 p-2 rounded-lg">
						<span>Vagas disponíveis: {vagas.filter(vaga => !vaga.isOcupada).length}</span>
						<span>Vagas ocupadas: {vagas.filter(vaga => vaga.isOcupada).length}</span>
						<span>Total de vagas: {vagas.length}</span>
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
