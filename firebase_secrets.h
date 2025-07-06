import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAPGd4dUVVyveg6HDQXN-WIs_EvYydUXCU",
  authDomain: "drivethru-20f18.firebaseapp.com",
  databaseURL: "https://drivethru-20f18-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "drivethru-20f18",
  storageBucket: "drivethru-20f18.appspot.com",
  messagingSenderId: "148265935156",
  appId: "1:148265935156:web:0721a01f186602079f4561",
  measurementId: "G-LS4BB57Z42"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function monitorizar() {
  const janelasRef = ref(database, 'janelas');
  const atendenteRef = ref(database, 'atendente');

  onValue(janelasRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Janelas:", data);
    atualizarUI(data);
  });

  onValue(atendenteRef, (snapshot) => {
    const estado = snapshot.val();
    console.log("Atendente:", estado);
    atualizarAtendente(estado);
  });
}

function atualizarUI(janelas) {
  // Atualiza o layout
}

function atualizarAtendente(estado) {
  // Atualiza o layout
}

monitorizar();
