import { useContext } from "react";
import { CenaContext } from "../context/CenaContext";

export default function useCena() { return useContext(CenaContext); }