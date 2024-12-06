import { useState, useEffect } from "react";
import VagasAPI from "../utils/VagasAPI";
import { FaCheck, FaNotdef } from "react-icons/fa6";
import PermanenciasAPI from "../utils/PermanenciasAPI";
import PrecosAPI from "../utils/PrecosAPI";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [vagas, setVagas] = useState<any[]>([]);
  const [matrix, setMatrix] = useState<any[][]>([]);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  const [placaVeiculo, setPlacaVeiculo] = useState<string>('');
  const [vagaNumero, setVagaNumero] = useState<number>(0);
  const [dataHoraEntrada, setDataHoraEntrada] = useState<string>(new Date().toISOString());
  const [precos, setPrecos] = useState<any[]>([]);
  const [permanenciaSaida, setPermanenciaSaida] = useState<any>(null);

  const fetchPrecos = async () => {
    try {
      const data = await PrecosAPI.getAllPrices();
      if (data) {
        setPrecos(data);
      }
    } catch (error) {
      console.error('Error fetching all precos:', error);
    }
  };

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
    fetchPrecos();
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEntrada = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!placaVeiculo) {
      alert("Informe a placa do veículo");
      return;
    } else if (placaVeiculo.length < 7) {
      alert("Informe a placa do veículo corretamente");
      return;
    }
    try {
      const vaga = vagas.find(vaga => !vaga.isOcupada);
      if (vaga) {
        setVagaNumero(vaga.numero);
        setDataHoraEntrada(new Date().toISOString());
        const permanenciaData = {
          dataHoraEntrada: dataHoraEntrada,
          dataHoraSaida: undefined,
          placaVeiculo: placaVeiculo,
          vagaId: vaga.id,
          funcionarioId: JSON.parse(localStorage.getItem('funcionario') || '{}').id,
          precoId: precos.length ? precos[precos.length - 1].id : 1,
        };
        const response = await PermanenciasAPI.createPermanencia(permanenciaData);
        if (response) {
          fetchVagas();
          (document.getElementById("entrada") as HTMLDialogElement)?.close();
          (document.getElementById("entrada_sucesso") as HTMLDialogElement)?.showModal();
        }
      } else {
        alert('Não há vagas disponíveis');
      }
    } catch (error) {
      console.error('Error creating permanencia:', error);
    }
  };

  const handleSaida = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const permanencias = await PermanenciasAPI.getAllPermanencias();
      const permanencia = permanencias.find((p: any) => p.placaVeiculo === placaVeiculo && !p.dataHoraSaida);
      if (permanencia) {
        const permanenciaData = {
          ...permanencia,
          dataHoraSaida: new Date().toISOString(),
        };
        console.log(permanenciaData);
        const response = await PermanenciasAPI.updatePermanencia(permanenciaData);
        if (response) {
          setPermanenciaSaida(response);
          fetchVagas();
          (document.getElementById("saida") as HTMLDialogElement)?.close();
          (document.getElementById("saida_sucesso") as HTMLDialogElement)?.showModal();
        }
      } else {
        alert('Permanência não encontrada');
      }
    } catch (error) {
      console.error('Error updating permanencia:', error);
    }
  };

  const handleGerarBilheteEntrada = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a7", putOnlyUsedFonts: true });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);

    doc.text("ESTACIONAMENTO", 10, 10);

    doc.text(`Vaga: ${vagaNumero}`, 10, 15);
    doc.text(`Placa: ${placaVeiculo}`, 10, 20);
    const entradaDate = new Date(dataHoraEntrada);
    const formattedEntrada = `${entradaDate.getDate().toString().padStart(2, '0')}/${(entradaDate.getMonth() + 1).toString().padStart(2, '0')}/${entradaDate.getFullYear()}, ${entradaDate.getHours().toString().padStart(2, '0')}:${entradaDate.getMinutes().toString().padStart(2, '0')}`;

    doc.text(`Entrada: ${formattedEntrada}`, 10, 25);

    if (precos.length > 0) {
      const { tempoInicial, valorInicial, valorAdicional, tempoAdicional } = precos[precos.length - 1];
      doc.text(`Tempo Inicial: ${tempoInicial} minutos com valor R$ ${valorInicial}`, 10, 30);
      doc.text(`Tempo Adicional: R$ ${valorAdicional} a cada ${tempoAdicional} minutos`, 10, 35);
    } else {
      doc.text("Preço: nenhum", 10, 30);
    }

    doc.setDrawColor(0);
    doc.line(5, 40, 70, 40);

    doc.text("Obrigado por utilizar nosso estacionamento!", 10, 45);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${placaVeiculo}`;
    doc.addImage(qrCodeUrl, "PNG", 10, 50, 30, 30);

    const dateTimeString = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
    doc.save(`bilhete_${vagaNumero}_${placaVeiculo}_${dateTimeString}.pdf`);

    (document.getElementById("entrada_sucesso") as HTMLDialogElement)?.close();
  };

  const handleGerarBilheteSaida = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a7", putOnlyUsedFonts: true });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);

    doc.text("ESTACIONAMENTO", 10, 10);

    doc.text(`Vaga: ${vagaNumero}`, 10, 15);
    doc.text(`Placa: ${permanenciaSaida.placaVeiculo}`, 10, 20);
    const entradaDate = new Date(permanenciaSaida.dataHoraEntrada);
    const formattedEntrada = `${entradaDate.getDate().toString().padStart(2, '0')}/${(entradaDate.getMonth() + 1).toString().padStart(2, '0')}/${entradaDate.getFullYear()}, ${entradaDate.getHours().toString().padStart(2, '0')}:${entradaDate.getMinutes().toString().padStart(2, '0')}`;

    const saidaDate = new Date(permanenciaSaida.dataHoraSaida);
    const formattedSaida = `${saidaDate.getDate().toString().padStart(2, '0')}/${(saidaDate.getMonth() + 1).toString().padStart(2, '0')}/${saidaDate.getFullYear()}, ${saidaDate.getHours().toString().padStart(2, '0')}:${saidaDate.getMinutes().toString().padStart(2, '0')}`;

    doc.text(`Entrada: ${formattedEntrada}`, 10, 25);
    doc.text(`Saída: ${formattedSaida}`, 10, 30);

    if (precos.length > 0) {
      const { tempoInicial, valorInicial, valorAdicional, tempoAdicional } = precos[precos.length - 1];
      const permanenciaHoras = Math.ceil((saidaDate.getTime() - entradaDate.getTime()) / (1000 * 60 * 60));
      const valorTotal = valorInicial + Math.max(0, (permanenciaHoras - tempoInicial / 60) * (valorAdicional / (tempoAdicional / 60)));

      doc.text(`Tempo Inicial: ${tempoInicial} minutos com valor R$ ${valorInicial}`, 10, 35);
      doc.text(`Tempo Adicional: R$ ${valorAdicional} a cada ${tempoAdicional} minutos`, 10, 40);
      doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 10, 45);
    } else {
      doc.text("Preço: nenhum", 10, 35);
    }

    doc.setDrawColor(0);
    doc.line(5, 50, 70, 50);

    doc.text("Obrigado por utilizar nosso estacionamento!", 10, 55);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PIX`;
    doc.addImage(qrCodeUrl, "PNG", 10, 60, 30, 30);

    const dateTimeString = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
    doc.save(`bilhete_saida_${vagaNumero}_${permanenciaSaida.placaVeiculo}_${dateTimeString}.pdf`);

    (document.getElementById("saida_sucesso") as HTMLDialogElement)?.close();
  };

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

          <div className="flex gap-2">
            <button className="btn btn-primary text-white" onClick={() => (document.getElementById('entrada') as HTMLDialogElement).showModal()}>
              + Registrar Entrada
            </button>

            <button className="btn btn-secondary text-white" onClick={() => (document.getElementById('saida') as HTMLDialogElement).showModal()}>
              + Registrar Saída
            </button>
          </div>
        </>
      ) : (
        <div className="text-lg text-center">
          Nenhuma vaga encontrada.
        </div>
      )}

      <dialog id="entrada" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Registrar Entrada</h3>
          <form className="flex flex-col gap-4" onSubmit={handleEntrada}>
            <div>
              <label htmlFor="placa_add" className="label">
                Placa do Veículo
              </label>
              <input
                maxLength={7}
                type="text"
                className="input input-bordered w-full"
                id="placa_add"
                placeholder="Placa do Veículo"
                value={placaVeiculo}
                onChange={(e) => setPlacaVeiculo(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary text-white w-1/3 mx-auto"
            >
              Registrar
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="entrada_sucesso" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Entrada Registrada com Sucesso</h3>
          <p><b>Placa:</b> {placaVeiculo}</p>
          <p><b>Vaga:</b> {vagaNumero}</p>
          <p><b>Data:</b> {new Date(dataHoraEntrada).toLocaleDateString('pt-BR')}</p>
          <p><b>Horário:</b> {new Date(dataHoraEntrada).toLocaleTimeString('pt-BR')}</p>
          <button className="btn btn-primary text-white w-2/3 mx-auto flex items-center justify-center mt-4" onClick={handleGerarBilheteEntrada}>
            Gerar Bilhete
          </button>
        </div>
      </dialog>

      <dialog id="saida" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Registrar Saída</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSaida}>
            <div>
              <label htmlFor="placa_add" className="label">
                Placa do Veículo
              </label>
              <input
                maxLength={7}
                type="text"
                className="input input-bordered w-full"
                id="placa_add"
                placeholder="Placa do Veículo"
                value={placaVeiculo}
                onChange={(e) => setPlacaVeiculo(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary text-white w-1/3 mx-auto"
            >
              Registrar
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="saida_sucesso" className="modal">
        <div className="modal-box w-96">
          <h3 className="font-bold text-lg pb-4">Saída Registrada com Sucesso</h3>
          <p><b>Placa:</b> {permanenciaSaida?.placaVeiculo}</p>
          <p><b>Valor:</b> {permanenciaSaida?.valor}</p>
          <p><b>Data de Entrada:</b> {new Date(permanenciaSaida?.dataHoraEntrada).toLocaleDateString('pt-BR')}</p>
          <p><b>Horário de Entrada:</b> {new Date(permanenciaSaida?.dataHoraEntrada).toLocaleTimeString('pt-BR')}</p>
          <p><b>Data de Saída:</b> {new Date(permanenciaSaida?.dataHoraSaida).toLocaleDateString('pt-BR')}</p>
          <p><b>Horário de Saída:</b> {new Date(permanenciaSaida?.dataHoraSaida).toLocaleTimeString('pt-BR')}</p>
          <button className="btn btn-primary text-white w-2/3 mx-auto flex items-center justify-center mt-4" onClick={handleGerarBilheteSaida}>
            Gerar Boleto
          </button>
        </div>
      </dialog>

    </div>
  );
}
