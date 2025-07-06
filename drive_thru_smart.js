import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Car } from "lucide-react";
import "./index.css";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App = () => {
  const [janelas, setJanelas] = useState({});
  const [sugestao, setSugestao] = useState("Carregando...");
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const janelasRef = ref(database, "/janelas");
    const statsRef = ref(database, "/stats");

    onValue(janelasRef, (snapshot) => {
      setJanelas(snapshot.val() || {});
    });

    onValue(statsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formatted = Object.keys(data).map((hora) => ({
        hora,
        carros: data[hora],
      }));
      setHistorico(formatted);

      const melhorHora = formatted.reduce((max, item) =>
        item.carros < max.carros ? item : max, formatted[0]);

      setSugestao(`Melhor hora para ir: ${melhorHora?.hora || "N/A"}`);
    });
  }, []);

  const janelasInfo = Object.entries(janelas).map(([key, val]) => {
    let status = "Livre";
    let color = "bg-green-200 text-green-800";

    if (val.ocupada) {
      status = "Ocupada";
      color = "bg-red-200 text-red-800";
    } else if (val.atendenteSaiu) {
      status = "Atendente saiu";
      color = "bg-yellow-200 text-yellow-800";
    }

    return (
      <Card key={key} className="w-64 p-4 shadow-xl rounded-2xl">
        <CardContent>
          <div className={`text-center py-2 rounded-lg ${color}`}>{status}</div>
          <div className="mt-2 text-lg font-semibold">{key.toUpperCase()}</div>
          <div className="text-3xl mt-3">
            <Car className="inline-block" />
          </div>
        </CardContent>
      </Card>
    );
  });

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <header className="p-6 bg-white shadow flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="text-blue-500" /> Drive-thru Smart
        </h1>
        <Button variant="outline" onClick={() => window.open("https://t.me/+6RGXoCeApNkzY2I0", "_blank")}>Telegram</Button>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {janelasInfo}
      </main>

      <section className="p-6">
        <h2 className="text-xl font-semibold mb-4">Sugestão inteligente</h2>
        <p className="mb-4">{sugestao}</p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="carros" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Estatísticas adicionais</h3>
            <p>Total de carros hoje: {historico.reduce((acc, item) => acc + item.carros, 0)}</p>
            <p>Média por hora: {historico.length ? (historico.reduce((acc, item) => acc + item.carros, 0) / historico.length).toFixed(1) : 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Legenda</h3>
            <p><span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span> Livre</p>
            <p><span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-2"></span> Ocupada</p>
            <p><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span> Atendente saiu</p>
          </CardContent>
        </Card>
      </section>

      <footer className="p-4 text-center text-gray-500">Drive-thru Smart © 2025</footer>
    </div>
  );
};

export default App;
