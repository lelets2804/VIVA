import { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";
import { AdditiveBlending, DoubleSide, CatmullRomCurve3, Color, Object3D, Vector2, Vector3, MathUtils } from "three";
import useReducedMotion from "../hooks/useReducedMotion";
import useCena from "../hooks/useCena";

const CHAO = -1.4;
const NOS = [
  { id: "rotina", to: "/rotina", cor: "#8FD6A4", pos: [-3.1, CHAO, 0.6] },
  { id: "mobilidade", to: "/mobilidade", cor: "#C0C7CE", pos: [0.4, CHAO, -3.0] },
  { id: "seguranca", to: "/seguranca", cor: "#7C6CFF", pos: [3.3, CHAO, 0.9] },
];
const PONTOS_ROTA = [[-3.1, -1.2, 0.6], [-1.6, -0.2, -1.9], [0.4, -1.2, -3.0], [2.4, -0.3, -1.2], [3.3, -1.2, 0.9], [0.2, -0.4, 2.2]];

const CEU_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }`;
const CEU_FRAG = `varying vec2 vUv; uniform float uHora; uniform float uAspect;
float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  float ang = (uHora - 6.0) / 12.0 * 3.14159265;
  float alt = sin(ang);
  float dia = smoothstep(-0.2, 0.4, alt);
  float ocaso = 1.0 - smoothstep(0.0, 0.5, abs(alt + 0.05));
  float y = vUv.y;
  vec3 noite = mix(vec3(0.03, 0.06, 0.06), vec3(0.07, 0.06, 0.20), y);
  vec3 claro = mix(vec3(0.46, 0.78, 0.72), vec3(0.20, 0.45, 0.55), y);
  vec3 col = mix(noite, claro, dia);
  vec3 vio = mix(vec3(0.62, 0.56, 0.95), vec3(0.50, 0.76, 0.60), smoothstep(0.0, 0.7, y));
  col = mix(col, vio * 0.8, ocaso * (1.0 - y) * 0.7);
  float solVis = smoothstep(-0.12, 0.08, alt);
  vec2 sp = vec2(0.5 - cos(ang) * 0.36, 0.64 + alt * 0.24);
  vec2 ds = vec2((vUv.x - sp.x) * uAspect, vUv.y - sp.y);
  float rs = length(ds);
  col += vec3(1.0, 0.97, 0.9) * ((1.0 - smoothstep(0.038, 0.045, rs)) * 1.7 + 0.012 / (rs * rs + 0.012) * 0.3) * solVis;
  vec2 mp = vec2(0.5 + cos(ang) * 0.36, 0.64 - alt * 0.24);
  vec2 dm = vec2((vUv.x - mp.x) * uAspect, vUv.y - mp.y);
  float rm = length(dm);
  col += vec3(0.80, 0.84, 1.0) * ((1.0 - smoothstep(0.026, 0.032, rm)) * 1.5 + 0.006 / (rm * rm + 0.01) * 0.3) * (1.0 - dia);
  vec2 g = vUv * vec2(uAspect, 1.0) * 120.0;
  float estrela = step(0.997, rnd(floor(g))) * (1.0 - smoothstep(0.1, 0.25, length(fract(g) - 0.5))) * smoothstep(0.3, 0.9, y) * (1.0 - dia);
  col += vec3(0.9, 0.95, 1.0) * estrela * 0.9;
  gl_FragColor = vec4(col, 1.0);
}`;

const CHAO_VERT = `varying vec2 vW; void main(){ vW = vec2(position.x, -position.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const CHAO_FRAG = `varying vec2 vW; uniform float uTime; uniform vec2 uNos[3]; uniform vec3 uCores[3]; uniform vec3 uFoco;
void main(){
  vec2 f = abs(fract(vW * 0.8) - 0.5);
  float linha = smoothstep(0.455, 0.5, max(f.x, f.y));
  float fade = 1.0 - smoothstep(1.5, 15.0, length(vW - vec2(0.0, -1.0)));
  vec3 base = mix(vec3(0.56, 0.84, 0.64), vec3(0.49, 0.42, 1.0), smoothstep(-6.0, 6.0, vW.x));
  vec3 acc = base * linha * 0.25 * fade;
  for (int i = 0; i < 3; i++) {
    float d = distance(vW, uNos[i]);
    float w = fract(d * 0.45 - uTime * 0.16 + float(i) * 0.3);
    float anel = smoothstep(0.0, 0.06, w) * (1.0 - smoothstep(0.06, 0.3, w)) * exp(-d * 0.3);
    float halo = exp(-d * 1.4);
    float foco = uFoco[i];
    acc += uCores[i] * (anel * (0.5 + foco) + halo * (0.35 + foco * 0.9));
  }
  gl_FragColor = vec4(acc, 1.0);
}`;

const ROTA_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const ROTA_FRAG = `varying vec2 vUv; uniform float uTime;
void main(){
  float p = fract(vUv.x * 3.0 - uTime * 0.12);
  float cometa = exp(-p * 7.0);
  vec3 c = mix(vec3(0.56, 0.84, 0.64), vec3(0.49, 0.42, 1.0), 0.5 + 0.5 * sin(vUv.x * 9.42478));
  gl_FragColor = vec4(c * (0.35 + cometa * 2.2), 1.0);
}`;

const FEIXE_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FEIXE_FRAG = `varying vec2 vUv; uniform float uI; uniform vec3 uCor;
void main(){ float a = pow(1.0 - vUv.y, 1.6); gl_FragColor = vec4(uCor * a * uI * 0.9, 1.0); }`;

const PREDIO_VERT = `varying vec3 vP; varying vec3 vN; varying float vId;
void main(){
  vec4 p = vec4(position, 1.0);
  float id = 0.0;
  #ifdef USE_INSTANCING
    p = instanceMatrix * p;
    id = instanceMatrix[3].x * 12.9898 + instanceMatrix[3].z * 78.233;
  #endif
  vec4 w = modelMatrix * p;
  vP = w.xyz;
  vN = normal;
  vId = fract(sin(id) * 43758.5453);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const PREDIO_FRAG = `varying vec3 vP; varying vec3 vN; varying float vId; uniform float uNoite;
float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  float h = clamp((vP.y + 1.4) / 3.2, 0.0, 1.0);
  vec3 vidro = mix(vec3(0.16, 0.27, 0.30), vec3(0.05, 0.10, 0.13), h);
  float dia = 1.0 - uNoite;
  vec3 col = vidro * (0.55 + 0.6 * dia) * (0.7 + 0.3 * abs(vN.z));
  vec2 cel = vec2((vP.x + vP.z) * 3.2, vP.y * 3.6);
  vec2 f = fract(cel);
  float janela = step(0.22, f.x) * (1.0 - step(0.78, f.x)) * step(0.3, f.y) * (1.0 - step(0.7, f.y)) * (1.0 - step(0.5, abs(vN.y)));
  float acesa = step(0.5, rnd(floor(cel) + vId * 40.0));
  vec3 luz = mix(vec3(0.56, 0.84, 0.64), vec3(0.62, 0.56, 1.0), rnd(floor(cel) + vId * 9.0));
  col += luz * janela * acesa * (0.18 + 0.9 * uNoite);
  col = mix(col, vec3(0.55, 0.62, 0.68) * (0.45 + 0.5 * dia), step(0.5, vN.y) * 0.9);
  gl_FragColor = vec4(col, 1.0);
}`;

const semente = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

function gerarPredios() {
  const rnd = semente(7);
  const rota = new CatmullRomCurve3(PONTOS_ROTA.map((p) => new Vector3(...p)), true).getPoints(160);
  const lista = [];
  for (let x = -9; x <= 9; x += 1.15) {
    for (let z = -8; z <= 3.4; z += 1.15) {
      const px = x + (rnd() - 0.5) * 0.5;
      const pz = z + (rnd() - 0.5) * 0.5;
      if (rnd() < 0.22) continue;
      if (NOS.some((n) => Math.hypot(px - n.pos[0], pz - n.pos[2]) < 1.9)) continue;
      if (rota.some((r) => Math.hypot(px - r.x, pz - r.z) < 1.0)) continue;
      if (NOS.some((n) => pz > n.pos[2] && Math.abs(px - (-1.4 + (n.pos[0] + 1.4) * (10 - pz) / (10 - n.pos[2]))) < 1.9)) continue;
      const frente = pz > 1.4;
      const altura = frente ? 0.35 + rnd() * 0.45 : 0.6 + rnd() * 1.9 + Math.max(0, -pz) * 0.12;
      lista.push({ x: px, z: pz, w: 0.55 + rnd() * 0.4, h: altura });
    }
  }
  return lista;
}

const suavizar = (t) => t * t * (3 - 2 * t);
const misturar = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const deslocar = (e, dx) => ({ pos: [e.pos[0] + dx, e.pos[1], e.pos[2]], alvo: [e.alvo[0] + dx, e.alvo[1], e.alvo[2]] });
const VISAO = { pos: [0, 3.3, 9.5], alvo: [0, 0.1, 0] };
const ETAPAS = {
  rotina: { pos: [-3.7, 0.5, 4.2], alvo: [-3.1, 0.2, 0.6] },
  seguranca: { pos: [4.3, 0.4, 4.5], alvo: [3.3, 0.2, 0.9] },
  mobilidade: { pos: [1.0, 1.9, 2.6], alvo: [0.4, 0.0, -3.0] },
};
const ROTEIRO = [VISAO, deslocar(ETAPAS.rotina, -1.1), deslocar(ETAPAS.seguranca, -1.1), deslocar(ETAPAS.mobilidade, -1.1)];
const POR_ROTA = { "/rotina": ETAPAS.rotina, "/seguranca": ETAPAS.seguranca, "/mobilidade": ETAPAS.mobilidade };

function alvoPorScroll(p) {
  const n = ROTEIRO.length - 1;
  const x = Math.min(Math.max(p, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const t = suavizar(Math.min(Math.max((x - i - 0.25) / 0.5, 0), 1));
  return { pos: misturar(ROTEIRO[i].pos, ROTEIRO[i + 1].pos, t), alvo: misturar(ROTEIRO[i].alvo, ROTEIRO[i + 1].alvo, t) };
}

function Ceu({ hora }) {
  const mat = useRef();
  const uniforms = useMemo(() => ({ uHora: { value: hora }, uAspect: { value: 1 } }), []);
  useFrame((state, delta) => { const u = mat.current.uniforms; u.uHora.value = MathUtils.damp(u.uHora.value, hora, 4, delta); u.uAspect.value = state.size.width / state.size.height; });
  return (<mesh renderOrder={-1} frustumCulled={false}><planeGeometry args={[2, 2]} /><shaderMaterial ref={mat} vertexShader={CEU_VERT} fragmentShader={CEU_FRAG} uniforms={uniforms} depthTest={false} depthWrite={false} /></mesh>);
}

function Cidade({ hora }) {
  const ref = useRef();
  const suave = useRef(hora);
  const predios = useMemo(gerarPredios, []);
  const uniforms = useMemo(() => ({ uNoite: { value: 0 } }), []);
  useLayoutEffect(() => {
    const o = new Object3D();
    predios.forEach((p, i) => { o.position.set(p.x, CHAO + p.h / 2, p.z); o.scale.set(p.w, p.h, p.w); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix); });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [predios]);
  useFrame((_, delta) => {
    suave.current = MathUtils.damp(suave.current, hora, 4, delta);
    const alt = Math.sin(((suave.current - 6) / 12) * Math.PI);
    uniforms.uNoite.value = 1 - MathUtils.smoothstep(alt, -0.2, 0.4);
  });
  return (<instancedMesh ref={ref} args={[null, null, predios.length]} frustumCulled={false}><boxGeometry args={[1, 1, 1]} /><shaderMaterial vertexShader={PREDIO_VERT} fragmentShader={PREDIO_FRAG} uniforms={uniforms} /></instancedMesh>);
}

function Chao({ foco, calmo, progresso }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uNos: { value: NOS.map((n) => new Vector2(n.pos[0], n.pos[2])) }, uCores: { value: NOS.map((n) => new Color(n.cor)) }, uFoco: { value: new Vector3() } }), []);
  useFrame((state, delta) => {
    if (!calmo) uniforms.uTime.value = state.clock.elapsedTime;
    const v = uniforms.uFoco.value;
    v.set(...NOS.map((n, i) => MathUtils.damp(v.getComponent(i), (foco === n.id ? 1 : 0) + (n.id === "rotina" ? (progresso / 100) * 0.5 : 0), 6, delta)));
  });
  return (<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, CHAO, 0]}><planeGeometry args={[40, 40]} /><shaderMaterial vertexShader={CHAO_VERT} fragmentShader={CHAO_FRAG} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} /></mesh>);
}

function Rota({ calmo }) {
  const curva = useMemo(() => new CatmullRomCurve3(PONTOS_ROTA.map((p) => new Vector3(...p)), true), []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => { if (!calmo) uniforms.uTime.value = state.clock.elapsedTime; });
  return (<mesh><tubeGeometry args={[curva, 240, 0.035, 8, true]} /><shaderMaterial vertexShader={ROTA_VERT} fragmentShader={ROTA_FRAG} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} /></mesh>);
}

function Farol({ no, calmo, ativo, aoFocar, onSelect, progresso }) {
  const orbe = useRef();
  const anel = useRef();
  const ehRotina = no.id === "rotina";
  const uf = useMemo(() => ({ uI: { value: 0.7 }, uCor: { value: new Color(no.cor) } }), [no.cor]);
  const brilho = useMemo(() => new Color(no.cor).multiplyScalar(2.4), [no.cor]);
  useEffect(() => () => { document.body.style.cursor = "auto"; }, []);
  useFrame((state, delta) => {
    const t = calmo ? 0 : state.clock.elapsedTime;
    const baseLuz = ehRotina ? 0.3 + progresso / 100 : 0.7;
    const baseTam = ehRotina ? 0.8 + progresso / 250 : 1;
    orbe.current.scale.setScalar(MathUtils.damp(orbe.current.scale.x, ativo ? baseTam * 1.5 : baseTam, 6, delta));
    orbe.current.position.y = 1 + Math.sin(t * 1.4 + no.pos[0]) * 0.08;
    anel.current.scale.setScalar(1 + Math.sin(t * 1.6 + no.pos[0]) * 0.1 + (ativo ? 0.35 : 0));
    uf.uI.value = MathUtils.damp(uf.uI.value, ativo ? baseLuz + 1 : baseLuz, 6, delta);
  });
  return (
    <group position={no.pos} onClick={() => onSelect(no.to)} onPointerOver={(e) => { e.stopPropagation(); aoFocar(no.id); document.body.style.cursor = "pointer"; }} onPointerOut={() => { aoFocar(null); document.body.style.cursor = "auto"; }}>
      <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.05, 0.2, 2.4, 24, 1, true]} /><shaderMaterial vertexShader={FEIXE_VERT} fragmentShader={FEIXE_FRAG} uniforms={uf} transparent depthWrite={false} blending={AdditiveBlending} side={DoubleSide} /></mesh>
      <mesh ref={orbe} position={[0, 1, 0]}><sphereGeometry args={[0.24, 32, 32]} /><meshBasicMaterial color={brilho} toneMapped={false} /></mesh>
      <mesh ref={anel} position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.55, 0.014, 8, 64]} /><meshBasicMaterial color={brilho} toneMapped={false} /></mesh>
      <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.9, 16, 16]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    </group>
  );
}

function Camera({ calmo, escala, base, rota, scroll, pointer }) {
  const atual = useRef(null);
  const pd = useRef(new Vector3());
  const ad = useRef(new Vector3());
  useFrame((state, delta) => {
    const e = rota === "/" ? alvoPorScroll(scroll.current) : POR_ROTA[rota] || VISAO;
    const mundo = (p) => [base[0] + escala * p[0], base[1] + escala * p[1], base[2] + escala * p[2]];
    const p = mundo(e.pos);
    const a = mundo(e.alvo);
    pd.current.set(p[0] + (calmo ? 0 : pointer.current.x * 0.5), p[1] + (calmo ? 0 : pointer.current.y * 0.25), p[2]);
    ad.current.set(a[0], a[1], a[2]);
    if (!atual.current) atual.current = { pos: pd.current.clone(), alvo: ad.current.clone() };
    const k = calmo ? 1 : 1 - Math.exp(-2.4 * delta);
    atual.current.pos.lerp(pd.current, k);
    atual.current.alvo.lerp(ad.current, k);
    state.camera.position.copy(atual.current.pos);
    state.camera.lookAt(atual.current.alvo);
  });
  return null;
}

function Cena({ hora, calmo, foco, aoFocar, onSelect, progresso, rota, scroll, pointer }) {
  const { size } = useThree();
  const desktop = size.width / size.height > 1;
  const larguraRef = 2 * Math.tan((42 * Math.PI) / 360) * 9.5 * (size.width / size.height);
  const escala = Math.min(1, larguraRef / (desktop ? 11 : 8));
  const pos = desktop ? [larguraRef * 0.14, -0.2, 0] : [0, -0.4, 0];
  return (
    <>
      <Ceu hora={hora} />
      <Camera calmo={calmo} escala={escala} base={pos} rota={rota} scroll={scroll} pointer={pointer} />
      <group position={pos} scale={escala}>
        <Cidade hora={hora} />
        <Chao foco={foco} calmo={calmo} progresso={progresso} />
        <Rota calmo={calmo} />
        {NOS.map((n) => <Farol key={n.id} no={n} calmo={calmo} ativo={foco === n.id} aoFocar={aoFocar} onSelect={onSelect} progresso={progresso} />)}
        <Sparkles count={70} scale={[12, 3.5, 9]} position={[0, -0.3, 0]} size={3.5} speed={calmo ? 0 : 0.35} color="#9AEAD5" />
      </group>
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.0} luminanceThreshold={0.9} luminanceSmoothing={0.1} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

export default function FundoCidade() {
  const calmo = useReducedMotion();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { foco, setFoco, hora, scroll, rotina } = useCena();
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mover = (e) => { pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1); };
    window.addEventListener("pointermove", mover);
    return () => window.removeEventListener("pointermove", mover);
  }, []);
  return (
    <div aria-hidden="true" className="h-full w-full">
      <Canvas camera={{ position: [0, 3.3, 9.5], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Cena hora={hora} calmo={calmo} foco={foco} aoFocar={setFoco} onSelect={navigate} progresso={rotina.progresso} rota={pathname} scroll={scroll} pointer={pointer} />
      </Canvas>
    </div>
  );
}