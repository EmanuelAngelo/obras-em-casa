<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title">Prévia 3D do Projeto</h2>
        <button class="btn btn-sm" @click="resetCamera">Reset câmera</button>
      </div>

      <div class="text-sm opacity-70">
        Visualização 3D simples gerada a partir das medidas (piso, paredes e box).
      </div>

      <div ref="mount" class="mt-4 w-full h-[420px] rounded-xl overflow-hidden bg-base-200"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useAppStore } from "@/stores/app";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const store = useAppStore();
const mount = ref(null);

let renderer, scene, camera, controls, rafId;
let rootGroup;

function buildLayout(ambientes) {
  // Packing simples: coloca em linha, quebra “linha” quando estourar larguraMax
  const larguraMax = 10; // metros (ajuste conforme quiser)
  let x = 0, z = 0, rowDepth = 0;

  return ambientes.map((a) => {
    const w = Number(a.dimensoes?.larguraM) || 0;
    const l = Number(a.dimensoes?.comprimentoM) || 0;

    if (x + w > larguraMax) {
      x = 0;
      z += rowDepth + 0.5;
      rowDepth = 0;
    }

    const pos = { x: x + w / 2, z: z + l / 2 };
    x += w + 0.5;
    rowDepth = Math.max(rowDepth, l);

    return { a, w, l, pos };
  });
}

function clearRoot() {
  if (!rootGroup) return;
  scene.remove(rootGroup);
  rootGroup.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
  rootGroup = null;
}

function addRoom({ a, w, l, pos }) {
  const g = new THREE.Group();

  // Piso (plano)
  const floorGeo = new THREE.BoxGeometry(w || 0.01, 0.05, l || 0.01);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(pos.x, 0.025, pos.z);
  g.add(floor);

  // Paredes (opcional)
  const wallOn = Boolean(a.parede?.aplicar);
  const h = Number(a.parede?.alturaM) || 0;

  if (wallOn && w > 0 && l > 0 && h > 0) {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8d8c7 });
    const t = 0.06; // espessura

    // 4 paredes (simplificado, sem descontos)
    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), wallMat);
    wall1.position.set(pos.x, h / 2, pos.z - l / 2);
    g.add(wall1);

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), wallMat);
    wall2.position.set(pos.x, h / 2, pos.z + l / 2);
    g.add(wall2);

    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(t, h, l), wallMat);
    wall3.position.set(pos.x - w / 2, h / 2, pos.z);
    g.add(wall3);

    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(t, h, l), wallMat);
    wall4.position.set(pos.x + w / 2, h / 2, pos.z);
    g.add(wall4);
  }

  // Box (só se ativado)
  const boxOn = Boolean(a.box?.aplicar);
  const bw = Number(a.box?.larguraM) || 0;
  const bl = Number(a.box?.comprimentoM) || 0;
  const bh = Number(a.box?.alturaM) || 0;

  if (boxOn && bw > 0 && bl > 0 && bh > 0) {
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xbad7ff });
    const t = 0.05;

    // Coloca box no canto inferior esquerdo do cômodo (padrão)
    const bx = pos.x - w / 2 + bw / 2;
    const bz = pos.z - l / 2 + bl / 2;

    // 3 paredes do box (U): esquerda, fundo, direita (simplificação)
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bl), boxMat);
    wallL.position.set(bx - bw / 2, bh / 2, bz);
    g.add(wallL);

    const wallB = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, t), boxMat);
    wallB.position.set(bx, bh / 2, bz - bl / 2);
    g.add(wallB);

    const wallR = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bl), boxMat);
    wallR.position.set(bx + bw / 2, bh / 2, bz);
    g.add(wallR);
  }

  return g;
}

function rebuildScene() {
  if (!scene) return;

  clearRoot();
  rootGroup = new THREE.Group();

  const layout = buildLayout(store.ambientes);

  layout.forEach((item) => {
    const room = addRoom(item);
    rootGroup.add(room);
  });

  scene.add(rootGroup);

  // Ajusta câmera
  const box = new THREE.Box3().setFromObject(rootGroup);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const dist = Math.max(size.x, size.z, 4) * 1.2;
  camera.position.set(center.x + dist, dist * 0.9, center.z + dist);
  controls.target.copy(center);
  controls.update();
}

function animate() {
  rafId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function resetCamera() {
  rebuildScene();
}

onMounted(() => {
  const el = mount.value;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3f4f6);

  const w = el.clientWidth;
  const h = el.clientHeight;

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
  camera.position.set(8, 7, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  el.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Luzes
  const amb = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(amb);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(10, 15, 10);
  scene.add(dir);

  // Grade (chão)
  const grid = new THREE.GridHelper(30, 30);
  grid.position.y = 0;
  scene.add(grid);

  rebuildScene();
  animate();

  // Resize
  const onResize = () => {
    if (!mount.value) return;
    const nw = mount.value.clientWidth;
    const nh = mount.value.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  };
  window.addEventListener("resize", onResize);

  // cleanup
  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });
});

watch(
  () => store.ambientes,
  () => rebuildScene(),
  { deep: true }
);

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  clearRoot();
  if (controls) controls.dispose();
  if (renderer) renderer.dispose();
  if (renderer?.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
});
</script>
