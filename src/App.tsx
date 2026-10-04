import { useEffect } from "react";
import Verdant from "./Verdant";

export default function App() {
  useEffect(() => {
    document.title = "Verdant — Atelier d'Architecture & Paysage";
  }, []);

  return <Verdant />;
}
