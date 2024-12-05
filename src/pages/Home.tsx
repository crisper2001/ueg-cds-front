import { useEffect, useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Funcionarios from "../views/Funcionarios";
import Precos from "../views/Precos";
import Vagas from "../views/Vagas";
import Permanencias from "../views/Permanencias";
import UsersAPI from "../utils/UsersAPI";
import Dashboard from "../views/Dashboard";

export default function Home() {

  const [view, setView] = useState("dashboard");
  const navigate = useNavigate();

  // UseEffect para redirecionar para página de login caso o usuário não esteja logado ou não exista mais
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      UsersAPI.getUser(JSON.parse(user).id).catch((error) => {
        if (error.response.status === 404) {
          localStorage.removeItem("user");
        }
        navigate("/login");
      });
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
        <div className="navbar bg-base-200 fixed top-0 left-0 right-0 z-50">

          {/* Logo */}
          <div className="navbar-start">
            <span className="text-primary text-2xl font-semibold">Estacionamento</span>
          </div>

          {/* Visualizações */}
          <div className="navbar-center">
            <ul className="menu menu-horizontal p-0 m-0">
              <li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "dashboard" ? "text-primary" : ""}`} onClick={() => setView("dashboard")}>Dashboard</button></li>
              <li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "funcionarios" ? "text-primary" : ""}`} onClick={() => setView("funcionarios")}>Funcionários</button></li>
              <li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "precos" ? "text-primary" : ""}`} onClick={() => setView("precos")}>Preços</button></li>
              <li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "vagas" ? "text-primary" : ""}`} onClick={() => setView("vagas")}>Vagas</button></li>
              <li><button className={`btn btn-ghost rounded-lg p-2 m-1 ${view === "permanencias" ? "text-primary" : ""}`} onClick={() => setView("permanencias")}>Permanências</button></li>
            </ul>
          </div>

          {/* Perfil */}
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-primary text-white rounded-full size-12">
                <span className="text-2xl">{JSON.parse(localStorage.getItem('user') || '{}').nome[0]}</span>
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 m-1 shadow">
                <li className="p-2">
                  {JSON.parse(localStorage.getItem('user') || '{}').nome}
                  <br />
                  {JSON.parse(localStorage.getItem('user') || '{}').email}
                </li>
                <hr />
                <li className="p-2">
                  <a className="text-red-600" onClick={handleLogout}><FaArrowRightFromBracket />Sair</a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-24 px-4">
          {view === "dashboard" && <Dashboard />}
          {view === "funcionarios" && <Funcionarios />}
          {view === "precos" && <Precos />}
          {view === "vagas" && <Vagas />}
          {view === "permanencias" && <Permanencias />}
        </div>

      </>
    )
  )
}
