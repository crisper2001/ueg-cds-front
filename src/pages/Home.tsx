import { useEffect, useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Funcionarios from "../views/Funcionarios";
import Precos from "../views/Precos";
import Vagas from "../views/Vagas";
import Permanencias from "../views/Permanencias";
import Estacionamento from "../views/Estacionamento";

export default function Home() {

	const [ view, setView ] = useState("vagas");
	const navigate = useNavigate();

	// UseEffect para redirecionar para página de login caso o usuário não esteja logado
	useEffect(() => {
		const user = localStorage.getItem("user");
		if (!user) {
			navigate("/login");
		}
	}, []);

	// Função para sair da conta
	const handleLogout = () => {
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		localStorage.getItem("user") && (
			<>
				{/* Barra de navegação */}
				<div className="navbar bg-base-200 fixed top-0 left-0 right-0 z-50 drop-shadow-lg">

					{/* Logo */}
					<div className="navbar-start">
						<button className="btn btn-ghost text-primary text-xl rounded-lg p-2 m-1" onClick={() => setView("estacionamento")}>Estacionamento</button>
					</div>

					{/* Visualizações */}
					<div className="navbar-center">
						<ul className="menu menu-horizontal p-0 m-0">
							<li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "funcionarios" ? "text-primary" : ""}`} onClick={() => setView("funcionarios")}>Funcionários</button></li>
							<li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "precos" ? "text-primary" : ""}`} onClick={() => setView("precos")}>Preços</button></li>
							<li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "vagas" ? "text-primary" : ""}`} onClick={() => setView("vagas")}>Vagas</button></li>
							<li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "permanencias" ? "text-primary" : ""}`} onClick={() => setView("permanencias")}>Permanências</button></li>
						</ul>
					</div>

					{/* Perfil */}
					<div className="navbar-end">
						<details className="dropdown dropdown-end">
							<summary tabIndex={0} role="button" className="btn btn-primary text-white rounded-full size-12">
								<span className="text-2xl">{JSON.parse(localStorage.getItem('user') || '{}').nome[0]}</span>
							</summary>
							<ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-60 p-2 m-1 shadow">
								<li className="p-2">
									{JSON.parse(localStorage.getItem('user') || '{}').nome}
									<br />
									{JSON.parse(localStorage.getItem('user') || '{}').email}
								</li>
								<hr />
								<li>
									<a className="text-red-600" onClick={handleLogout}><FaArrowRightFromBracket />Sair</a>
								</li>
							</ul>
						</details>
					</div>

				</div>

				<div className="pt-24 px-4">
					{view === "estacionamento" && <Estacionamento />}
					{view === "funcionarios" && <Funcionarios />}
					{view === "precos" && <Precos />}
					{view === "vagas" && <Vagas />}
					{view === "permanencias" && <Permanencias />}
				</div>

			</>
		)
	)
}
