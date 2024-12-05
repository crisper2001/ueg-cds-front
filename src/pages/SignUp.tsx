import { useEffect, useState } from "react";
import { FaAt, FaKey, FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import UsersAPI from "../utils/UsersAPI";
// import UsersAPI from "../utils/UsersAPI";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // UseEffect para redirecionar para página principal caso o usuário esteja logado
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username && email && password) {
      try {
        const userData = { nome: username, email, senha: password };
        await UsersAPI.createUser(userData);
        console.log("Usuário criado com sucesso:", userData);
        navigate("/");
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        alert("Erro ao criar usuário. Tente novamente.");
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-base-200 gap-4">
        <div className="card bg-base-100 w-96 shadow-lg p-8 gap-8">
          <div className="text-center">
            <h1 className="text-4xl text-primary font-semibold">Estacionamento</h1>
          </div>
          <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaUser className="text-neutral-content" />
              <input
                type="text"
                className="grow"
                placeholder="Nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaAt className="text-neutral-content" />
              <input
                type="email"
                className="grow"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaKey className="text-neutral-content" />
              <input
                type="password"
                className="grow"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary text-white w-1/3"
            >
              Criar conta
            </button>
          </form>
          <div>
            <p className="text-sm text-center">
              Já possui uma conta? <Link to="/" className="text-primary">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}