export default function Marca({ compacta = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden="true" className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] bg-forest dark:bg-sage">
        <span className="h-3 w-3 rounded-full bg-sage dark:bg-forest" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ambar" />
      </span>
      {!compacta && <span className="font-display text-[1.375rem] font-semibold tracking-[-0.03em]">VIVVA</span>}
    </span>
  );
}