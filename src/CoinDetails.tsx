import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CoinDetails = () => {
  const params = useParams();

  const API_DETAILS_URL = import.meta.env[
    "VITE_API_COINGECKO_DETAILS_BASE_URL"
  ];

  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const goToHome = () => navigate("/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const new_url = `${API_DETAILS_URL}/${params["id"]}?sparkline=true`;
        console.log(new_url);
        const response = await fetch(new_url);
        if (!response.ok) {
          throw new Error(`status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const mappedCoin: CoinDetailsData = {
          name: data.name,
          symbol: data.symbol.toUpperCase(),
          logo: data.image.large,
          price: data.market_data.current_price.brl,
          change: data.market_data.price_change_percentage_24h,
          marketCap: data.market_data.market_cap.brl,
          volume24h: data.market_data.total_volume.brl,
          high24h: data.market_data.high_24h.brl,
          low24h: data.market_data.low_24h.brl,
          chart: data.market_data.sparkline_7d.price.slice(-24),
        };
        console.log("mapeano");
        console.log(mappedCoin);
        setCoin(mappedCoin);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log("fetchando");
    fetchData();
  }, []);

  const formatBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-warning"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="orange"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (!coin) return <p className="text-white p-4">Nenhuma moeda encontrada</p>;
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-4 space-y-6">
      <button
        onClick={goToHome}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Voltar
      </button>

      <section className="flex items-center gap-4">
        <img
          src={coin.logo}
          alt={coin.name}
          className="w-14 h-14 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-semibold">{coin.name}</h1>
          <p className="text-neutral-400 text-sm">{coin.symbol}</p>
        </div>
      </section>

      <section className="space-y-1">
        <p className="text-neutral-400 text-sm">Preço Atual</p>

        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{formatBRL(coin.price)}</span>

          <span
            className={`font-semibold text-sm ${
              coin.change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {coin.change >= 0 ? "↗" : "↘"} {coin.change.toFixed(2)}%
          </span>
        </div>
      </section>

      {/* GRÁFICO */}
      {coin.chart && coin.chart.length > 0 && (
        <section className="bg-neutral-800 rounded-xl p-4">
          <h2 className="text-neutral-300 mb-2">Últimas 24 horas</h2>

          {/* Container com overflow-x para scroll horizontal em telas pequenas */}
          <div className="w-full overflow-x-auto pb-2">
            {/* Largura mínima para garantir que o gráfico não fique espremido */}
            <div className="min-w-[600px] h-48 relative">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full absolute top-0 left-0"
              >
                <polyline
                  fill="none"
                  stroke={coin.change >= 0 ? "#22c55e" : "#ef4444"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  points={(() => {
                    const min = Math.min(...coin.chart);
                    const max = Math.max(...coin.chart);
                    const range = max - min || 1;
                    return coin.chart
                      .map(
                        (p: number, i: number) =>
                          `${(i / (coin.chart.length - 1)) * 100},${
                            100 - ((p - min) / range) * 80 - 10 // Margem de 10% cima/baixo
                          }`,
                      )
                      .join(" ");
                  })()}
                />
              </svg>

              {/* Labels de Horário */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 mt-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const now = new Date();
                  const hour = new Date(
                    now.getTime() - (24 - i * 4) * 60 * 60 * 1000,
                  ).getHours();
                  return (
                    <span key={i}>{hour.toString().padStart(2, "0")}:00</span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ESTATÍSTICAS */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Estatísticas</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-800 p-4 rounded-xl">
            <p className="text-neutral-400 text-sm">Cap. de Mercado</p>
            <p className="text-lg font-semibold">{formatBRL(coin.marketCap)}</p>
          </div>

          <div className="bg-neutral-800 p-4 rounded-xl">
            <p className="text-neutral-400 text-sm">Volume 24h</p>
            <p className="text-lg font-semibold">{formatBRL(coin.volume24h)}</p>
          </div>

          <div className="bg-neutral-800 p-4 rounded-xl">
            <p className="text-neutral-400 text-sm">Máxima 24h</p>
            <p className="text-lg font-semibold">{formatBRL(coin.high24h)}</p>
          </div>

          <div className="bg-neutral-800 p-4 rounded-xl">
            <p className="text-neutral-400 text-sm">Mínima 24h</p>
            <p className="text-lg font-semibold">{formatBRL(coin.low24h)}</p>
          </div>
        </div>
      </section>

      {/* BOTÕES */}
      <footer className="flex gap-4 pt-4">
        <button
          className="flex-1 py-3 bg-green-600 rounded-xl font-semibold cursor-pointer"
          onClick={() => alert("em construção")}
        >
          Comprar
        </button>

        <button
          className="flex-1 py-3 bg-red-600 rounded-xl font-semibold cursor-pointer"
          onClick={() => alert("em construção")}
        >
          Vender
        </button>
      </footer>

      {/* <pre>{JSON.stringify(coin, null, 2)}</pre> */}
    </main>
  );
};

type CoinDetailsData = {
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  chart: number[];
};

export default CoinDetails;
