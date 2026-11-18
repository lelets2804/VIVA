import RevelarTexto from "./RevelarTexto";

export default function TituloPagina({ children, sub, sobre }) {
  return (
    <div>
      {sobre && <p className="sobretitulo mb-3">{sobre}</p>}
      <h1 className="titulo-pagina">
        <RevelarTexto>{children}</RevelarTexto>
      </h1>
      {sub && <p className="mt-3 max-w-xl text-lg opacity-80">{sub}</p>}
    </div>
  );
}