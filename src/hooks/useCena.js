import { useContext } from "react";
import { CenaContext } from "../context/cenaContextValue";

export default function useCena() { return useContext(CenaContext); }