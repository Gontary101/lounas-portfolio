/* Three.js sims — vanilla modules. Exports the SIMS object consumed by App. */
import * as THREE from 'three';

export const SIMS = {};

const C = {
  bg: 0xF4EFE6,
  bg2: 0xEDE6D7,
  ink: 0x1B0C0C,
  forest: 0x313E17,
  moss: 0x4C5C2D,
  yellow: 0xFFDE42,
  red: 0xC94A2B,
  hair: 0x9e938a,
};

// ---------- shared helpers ----------
function makeRenderer(container){
  const r = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  // Pixelated look: render at sub-native resolution, let CSS nearest-neighbor upscale.
  r.setPixelRatio(0.75);
  const rect = container.getBoundingClientRect();
  r.setSize(rect.width, rect.height, false);
  r.setClearColor(C.bg, 0);
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(r.domElement);
  return r;
}
function resizeObserver(container, onResize){
  const ro = new ResizeObserver(()=>{
    const r = container.getBoundingClientRect();
    onResize(r.width, r.height);
  });
  ro.observe(container);
  return ro;
}
function rafLoop(update){
  let id, last = performance.now();
  function tick(now){
    const dt = Math.min(0.05, (now-last)/1000);
    last = now;
    update(dt, now/1000);
    id = requestAnimationFrame(tick);
  }
  id = requestAnimationFrame(tick);
  return ()=>cancelAnimationFrame(id);
}

// Simple grid floor in paper tone
function paperFloor(scene, size=40, div=40){
  const g = new THREE.GridHelper(size, div, C.hair, C.hair);
  g.material.opacity = 0.35;
  g.material.transparent = true;
  g.position.y = -0.001;
  scene.add(g);
  // ground plane
  const mat = new THREE.MeshStandardMaterial({ color: C.bg2, roughness: 1, metalness: 0 });
  const geo = new THREE.PlaneGeometry(size, size);
  const p = new THREE.Mesh(geo, mat);
  p.rotation.x = -Math.PI/2;
  p.receiveShadow = true;
  scene.add(p);
  return p;
}
function standardLights(scene){
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const d = new THREE.DirectionalLight(0xffffff, 0.9);
  d.position.set(6, 10, 5);
  d.castShadow = true;
  d.shadow.mapSize.set(1024,1024);
  d.shadow.camera.left = -10; d.shadow.camera.right = 10;
  d.shadow.camera.top = 10; d.shadow.camera.bottom = -10;
  d.shadow.bias = -0.0005;
  scene.add(d);
  const f = new THREE.DirectionalLight(0xffe8a0, 0.25);
  f.position.set(-5, 4, -4);
  scene.add(f);
}

// ==================================================
// HERO — cursor-tracking 6DOF arm + floating probes
// ==================================================
SIMS.hero = function(container){
  const scene = new THREE.Scene();
  const renderer = makeRenderer(container);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const rect = container.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width/rect.height; camera.updateProjectionMatrix();

  camera.position.set(6, 4.2, 8);
  camera.lookAt(0, 1.6, 0);

  standardLights(scene);
  paperFloor(scene, 24, 24);

  // build articulated 6DOF arm as nested pivots
  // base -> shoulder_yaw -> shoulder_pitch -> elbow -> wrist_pitch -> wrist_roll -> gripper
  const mat = (col)=> new THREE.MeshStandardMaterial({ color: col, roughness: 0.6, metalness: 0.15 });
  const linkMat = mat(C.ink);
  const jointMat = mat(C.yellow);
  const accentMat = mat(C.forest);

  function cyl(r, h, m){ const g = new THREE.CylinderGeometry(r, r, h, 20); const x = new THREE.Mesh(g, m); x.castShadow = true; x.receiveShadow = true; return x; }
  function box(w,h,d, m){ const g = new THREE.BoxGeometry(w,h,d); const x=new THREE.Mesh(g,m); x.castShadow=true; x.receiveShadow=true; return x;}

  const base = new THREE.Group(); scene.add(base);
  // base plate
  const plate = cyl(0.9, 0.14, accentMat); plate.position.y = 0.07; base.add(plate);

  const j1 = new THREE.Group(); base.add(j1); j1.position.y = 0.14;
  const j1Puck = cyl(0.42, 0.28, jointMat); j1Puck.position.y = 0.14; j1.add(j1Puck);

  const j2 = new THREE.Group(); j1.add(j2); j2.position.y = 0.3;
  const link1 = box(0.28, 1.4, 0.28, linkMat); link1.position.y = 0.7; j2.add(link1);
  // accent band
  const band1 = box(0.34, 0.08, 0.34, mat(C.yellow)); band1.position.y = 1.25; j2.add(band1);

  const j3 = new THREE.Group(); j2.add(j3); j3.position.y = 1.4;
  const j3Puck = cyl(0.28, 0.26, jointMat); j3Puck.rotation.z = Math.PI/2; j3.add(j3Puck);
  const link2 = box(0.22, 1.1, 0.22, linkMat); link2.position.y = 0.55; j3.add(link2);
  const band2 = box(0.28, 0.06, 0.28, mat(C.yellow)); band2.position.y = 0.95; j3.add(band2);

  const j4 = new THREE.Group(); j3.add(j4); j4.position.y = 1.1;
  const j4Puck = cyl(0.2, 0.22, jointMat); j4Puck.rotation.z = Math.PI/2; j4.add(j4Puck);
  const link3 = box(0.16, 0.7, 0.16, linkMat); link3.position.y = 0.35; j4.add(link3);

  const j5 = new THREE.Group(); j4.add(j5); j5.position.y = 0.7;
  const j5Puck = cyl(0.15, 0.16, jointMat); j5Puck.rotation.x = Math.PI/2; j5.add(j5Puck);

  const j6 = new THREE.Group(); j5.add(j6);
  // gripper
  const wrist = box(0.22, 0.18, 0.22, linkMat); wrist.position.y = 0.12; j6.add(wrist);
  const finger1 = box(0.05, 0.22, 0.1, mat(C.red)); finger1.position.set(0.08, 0.32, 0); j6.add(finger1);
  const finger2 = box(0.05, 0.22, 0.1, mat(C.red)); finger2.position.set(-0.08, 0.32, 0); j6.add(finger2);

  // target cursor sphere
  const target = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 24, 24),
    new THREE.MeshStandardMaterial({ color: C.red, emissive: C.red, emissiveIntensity: 0.3 })
  );
  target.position.set(2, 2, 0); scene.add(target);
  // target ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.28, 0.34, 48),
    new THREE.MeshBasicMaterial({ color: C.red, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI/2;
  target.add(ring);
  ring.position.y = -0.001;

  // dashed line from end effector to target
  const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const line = new THREE.Line(lineGeo, new THREE.LineDashedMaterial({ color: C.ink, dashSize: 0.12, gapSize: 0.08 }));
  scene.add(line);

  // pointer -> world target
  const mouse = { x: 0, y: 0 };
  function onMove(e){
    const r = container.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left)/r.width)*2 - 1;
    mouse.y = -(((e.clientY - r.top)/r.height)*2 - 1);
  }
  container.addEventListener("mousemove", onMove);
  container.addEventListener("touchmove", e=>{
    if(e.touches[0]) onMove(e.touches[0]);
  }, { passive: true });

  const plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
  const raycaster = new THREE.Raycaster();
  const tgtWorld = new THREE.Vector3(2, 2, 0);

  // 2R IK in the yaw-aligned (Y, Z) plane of j2's local frame.
  // Chain: j1 yaw (Y) → j2 shoulder pitch (X) → j3 elbow pitch (X).
  // Upper arm along +Y of j2 (length LA), forearm along +Y of j3 (length LB).
  // Positive X-rotation of j2 tilts the arm from +Y toward +Z — i.e. "forward"
  // in the post-yaw frame. Elbow-up config keeps the elbow on the upper side
  // of the shoulder→wrist line.
  const L1 = 1.4, L2 = 1.1, L3 = 0.7;
  const J2_WORLD_Y = 0.44;  // j1(0.14) + j2.position.y(0.3)

  function solveAngles(target){
    const yaw = Math.atan2(target.x, target.z);
    const R = Math.hypot(target.x, target.z);         // planar reach in post-yaw frame
    const H = target.y - J2_WORLD_Y;                   // height above shoulder pivot
    const LA = L1, LB = L2 + L3;                       // combine forearm + wrist visually
    const REACH_MAX = LA + LB - 0.08;
    // clamp to reachable sphere around the shoulder
    let d = Math.hypot(R, H);
    const clamped = d > REACH_MAX;
    if(clamped){
      const s = REACH_MAX / d;
      d = REACH_MAX;
    }
    const d2 = d * d;
    // law of cosines — elbow interior from straight, β ∈ [0, π], positive = bent
    let cosBeta = (d2 - LA*LA - LB*LB) / (2 * LA * LB);
    cosBeta = Math.max(-1, Math.min(1, cosBeta));
    const beta = Math.acos(cosBeta);
    // angle of the hand vector p = (LA + LB cosβ, LB sinβ) from +Y in j2-local
    const angleP = Math.atan2(LB * Math.sin(beta), LA + LB * cosBeta);
    // target angle from +Y in j2-local — note H is along +Y, R along +Z
    const angleT = Math.atan2(R, H);
    // shoulder tilt α chosen so rotating p by α lands it on the target direction
    const alpha = angleT - angleP;
    return { yaw, alpha, beta };
  }

  let smoothed = { yaw: 0, alpha: 0, beta: 0 };

  const stop = rafLoop((dt, t)=>{
    // project mouse onto Z=0 plane in world
    raycaster.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), camera);
    const hit = new THREE.Vector3();
    // plane whose normal faces camera at y=2
    const pl = new THREE.Plane(new THREE.Vector3(0,0,1), -1.2);
    raycaster.ray.intersectPlane(pl, hit);
    if(hit){
      tgtWorld.lerp(hit, 0.12);
    }
    // Gentle float on idle
    const idleX = Math.cos(t*0.6)*2.2;
    const idleY = 1.9 + Math.sin(t*0.8)*0.6;
    const idleZ = Math.sin(t*0.5)*1.4;
    // mix actual target w/ idle
    const mixed = new THREE.Vector3(
      tgtWorld.x*0.75 + idleX*0.25,
      tgtWorld.y*0.7 + idleY*0.3,
      tgtWorld.z*0.7 + idleZ*0.3,
    );
    target.position.lerp(mixed, 0.08);

    const ang = solveAngles(target.position);
    smoothed.yaw   += (ang.yaw   - smoothed.yaw)*0.1;
    smoothed.alpha += (ang.alpha - smoothed.alpha)*0.1;
    smoothed.beta  += (ang.beta  - smoothed.beta)*0.1;

    j1.rotation.y = smoothed.yaw;
    // j2 shoulder pitch, j3 elbow pitch (elbow-up)
    j2.rotation.x = smoothed.alpha;
    j3.rotation.x = smoothed.beta;
    j4.rotation.x = -smoothed.beta*0.25;
    j5.rotation.y = Math.sin(t*0.8)*0.3;
    j6.rotation.z = Math.sin(t*1.2)*0.4;

    // end effector position
    const eePos = new THREE.Vector3();
    finger1.getWorldPosition(eePos);
    const tgtP = target.position.clone();
    lineGeo.setFromPoints([eePos, tgtP]);
    line.computeLineDistances();

    ring.rotation.z += dt*0.8;

    // slight camera parallax
    camera.position.x = 6 + mouse.x*0.5;
    camera.position.y = 4.2 - mouse.y*0.4;
    camera.lookAt(0, 1.6, 0);

    renderer.render(scene, camera);
  });

  resizeObserver(container, (w,h)=>{
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });

  return { destroy(){ stop(); renderer.dispose(); renderer.domElement.remove(); } };
};

// ==================================================
// A* pathfinding on 2D grid — click to toggle obstacles, drag start/goal
// ==================================================
SIMS.astar = function(container){
  const scene = new THREE.Scene();
  const rect = container.getBoundingClientRect();
  const renderer = makeRenderer(container);
  renderer.setSize(rect.width, rect.height, false);

  const ortho = () => {
    const r = container.getBoundingClientRect();
    const aspect = r.width / r.height;
    const sz = 12;
    return new THREE.OrthographicCamera(-sz*aspect/2, sz*aspect/2, sz/2, -sz/2, -50, 50);
  };
  let camera = ortho();
  camera.position.set(10, 14, 10);
  camera.lookAt(0,0,0);

  standardLights(scene);

  const N = 24; // grid N x N
  const CELL = 0.45;
  const half = (N*CELL)/2;
  const origin = new THREE.Vector3(-half, 0, -half);

  const grid = []; // 0=free, 1=obstacle
  for(let i=0; i<N; i++){ grid.push(new Array(N).fill(0)); }
  // seed obstacles
  (function seed(){
    const r = ()=>Math.floor(Math.random()*N);
    for(let k=0; k<70; k++){ const x=r(), z=r(); if(Math.random()<0.6) grid[x][z] = 1;}
    for(let i=6; i<18; i++){ grid[i][12] = 1;}
    for(let i=4; i<16; i++){ grid[14][i] = 1;}
    grid[14][10] = 0; grid[14][11] = 0; // door
  })();

  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(N*CELL+0.2, N*CELL+0.2),
    new THREE.MeshStandardMaterial({ color: C.bg2, roughness: 1 })
  );
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);

  // grid lines
  const gh = new THREE.GridHelper(N*CELL, N, C.hair, C.hair);
  gh.position.y = 0.001;
  gh.material.opacity = 0.4; gh.material.transparent = true;
  scene.add(gh);

  // obstacles group (instanced for perf)
  const obstGeo = new THREE.BoxGeometry(CELL*0.92, CELL*1.6, CELL*0.92);
  const obstMat = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.8 });
  let obstMesh = null;

  // visited + frontier + path meshes
  const visitedMat = new THREE.MeshBasicMaterial({ color: C.moss, transparent: true, opacity: 0.35 });
  const frontierMat = new THREE.MeshBasicMaterial({ color: C.yellow, transparent: true, opacity: 0.7 });
  const pathMat = new THREE.MeshBasicMaterial({ color: C.red });
  let visitedMesh = null, frontierMesh = null, pathMesh = null;

  function cellCenter(i, j){
    return new THREE.Vector3(origin.x + (i+0.5)*CELL, 0, origin.z + (j+0.5)*CELL);
  }

  function rebuildObstacles(){
    if(obstMesh){ scene.remove(obstMesh); obstMesh.dispose?.(); }
    const count = grid.flat().filter(v=>v===1).length;
    obstMesh = new THREE.InstancedMesh(obstGeo, obstMat, Math.max(1, count));
    obstMesh.castShadow = true; obstMesh.receiveShadow = true;
    let idx = 0;
    const m = new THREE.Matrix4();
    for(let i=0; i<N; i++) for(let j=0; j<N; j++) if(grid[i][j]===1){
      const c = cellCenter(i,j);
      m.makeTranslation(c.x, CELL*0.8, c.z);
      obstMesh.setMatrixAt(idx++, m);
    }
    obstMesh.count = idx;
    obstMesh.instanceMatrix.needsUpdate = true;
    scene.add(obstMesh);
  }
  rebuildObstacles();

  // start + goal markers
  let start = { i: 1, j: 1 };
  let goal  = { i: N-2, j: N-2 };

  const startMk = new THREE.Mesh(
    new THREE.CylinderGeometry(CELL*0.42, CELL*0.42, 0.1, 24),
    new THREE.MeshStandardMaterial({ color: C.yellow })
  );
  startMk.position.copy(cellCenter(start.i, start.j)).y = 0.05;
  scene.add(startMk);

  const goalMk = new THREE.Mesh(
    new THREE.TorusGeometry(CELL*0.55, 0.08, 12, 32),
    new THREE.MeshStandardMaterial({ color: C.red, emissive: C.red, emissiveIntensity: 0.2 })
  );
  goalMk.rotation.x = Math.PI/2;
  const gp = cellCenter(goal.i, goal.j); gp.y = 0.06; goalMk.position.copy(gp);
  scene.add(goalMk);

  // agent (yellow puck) that walks the path
  const agent = new THREE.Mesh(
    new THREE.SphereGeometry(CELL*0.3, 18, 18),
    new THREE.MeshStandardMaterial({ color: C.ink })
  );
  agent.castShadow = true;
  agent.position.copy(cellCenter(start.i, start.j)); agent.position.y = CELL*0.3;
  scene.add(agent);

  // ---- planner ----
  function neighbors(i, j){
    const out = [];
    const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    for(const [di,dj] of dirs){
      const ni = i+di, nj = j+dj;
      if(ni<0||nj<0||ni>=N||nj>=N) continue;
      if(grid[ni][nj]===1) continue;
      // prevent diagonal corner cutting
      if(di!==0 && dj!==0){
        if(grid[i+di][j]===1 || grid[i][j+dj]===1) continue;
      }
      const cost = (di!==0 && dj!==0) ? 1.4142 : 1;
      out.push([ni, nj, cost]);
    }
    return out;
  }
  function heuristic(a, b){
    const dx = Math.abs(a.i-b.i), dz = Math.abs(a.j-b.j);
    return Math.max(dx,dz) + (Math.SQRT2-1)*Math.min(dx,dz);
  }

  // Incrementally-animated A* using a priority queue
  let planState = null;
  function startPlan(){
    const openSet = [];
    const gScore = new Map();
    const parent = new Map();
    const key = (i,j)=>i*N+j;
    gScore.set(key(start.i, start.j), 0);
    openSet.push({ i: start.i, j: start.j, f: heuristic(start, goal) });
    planState = { openSet, gScore, parent, visited: new Set(), found: false, path: [], stepsPerTick: 6, total: 0 };
  }
  function stepPlan(){
    if(!planState || planState.found) return;
    const key = (i,j)=>i*N+j;
    for(let s=0; s<planState.stepsPerTick; s++){
      if(planState.openSet.length===0){ planState.found = true; break; }
      planState.openSet.sort((a,b)=>a.f - b.f);
      const cur = planState.openSet.shift();
      planState.total++;
      if(cur.i === goal.i && cur.j === goal.j){
        // reconstruct
        const path = [];
        let ck = key(cur.i, cur.j);
        let node = {i: cur.i, j: cur.j};
        path.push(node);
        while(planState.parent.has(ck)){
          const p = planState.parent.get(ck);
          path.push(p);
          ck = key(p.i, p.j);
        }
        path.reverse();
        planState.path = path;
        planState.found = true;
        break;
      }
      const k = key(cur.i, cur.j);
      if(planState.visited.has(k)) continue;
      planState.visited.add(k);
      for(const [ni, nj, cost] of neighbors(cur.i, cur.j)){
        const nk = key(ni, nj);
        if(planState.visited.has(nk)) continue;
        const tentative = planState.gScore.get(k) + cost;
        if(!planState.gScore.has(nk) || tentative < planState.gScore.get(nk)){
          planState.gScore.set(nk, tentative);
          planState.parent.set(nk, { i: cur.i, j: cur.j });
          const f = tentative + heuristic({i:ni, j:nj}, goal);
          planState.openSet.push({ i: ni, j: nj, f });
        }
      }
    }
    renderPlanVis();
  }
  function renderPlanVis(){
    if(visitedMesh){ scene.remove(visitedMesh); }
    if(frontierMesh){ scene.remove(frontierMesh); }
    if(pathMesh){ scene.remove(pathMesh); }
    const boxGeo = new THREE.PlaneGeometry(CELL*0.85, CELL*0.85);
    // visited
    const vc = planState.visited.size;
    visitedMesh = new THREE.InstancedMesh(boxGeo, visitedMat, Math.max(1, vc));
    visitedMesh.rotation.x = -Math.PI/2;
    let vi = 0; const m = new THREE.Matrix4();
    for(const k of planState.visited){
      const i = Math.floor(k/N), j = k%N;
      const c = cellCenter(i,j);
      m.makeTranslation(c.x, 0.01, c.z);
      visitedMesh.setMatrixAt(vi++, m);
    }
    visitedMesh.count = vi;
    visitedMesh.instanceMatrix.needsUpdate = true;
    // HACK: instanced mesh rotation is via matrix; easier to flatten:
    for(let ii=0; ii<visitedMesh.count; ii++){
      const k = [...planState.visited][ii];
      const i = Math.floor(k/N), j = k%N;
      const c = cellCenter(i,j);
      const mm = new THREE.Matrix4();
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0));
      mm.compose(new THREE.Vector3(c.x, 0.008, c.z), q, new THREE.Vector3(1,1,1));
      visitedMesh.setMatrixAt(ii, mm);
    }
    visitedMesh.rotation.set(0,0,0);
    visitedMesh.instanceMatrix.needsUpdate = true;
    scene.add(visitedMesh);

    // frontier
    const fc = planState.openSet.length;
    frontierMesh = new THREE.InstancedMesh(boxGeo, frontierMat, Math.max(1, fc));
    let fi = 0;
    for(const node of planState.openSet){
      const c = cellCenter(node.i, node.j);
      const mm = new THREE.Matrix4();
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0));
      mm.compose(new THREE.Vector3(c.x, 0.012, c.z), q, new THREE.Vector3(1,1,1));
      frontierMesh.setMatrixAt(fi++, mm);
    }
    frontierMesh.count = fi;
    frontierMesh.instanceMatrix.needsUpdate = true;
    scene.add(frontierMesh);

    // path
    if(planState.path.length){
      const pts = planState.path.map(n=>{ const c = cellCenter(n.i,n.j); c.y = 0.2; return c; });
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, pts.length*4, 0.04, 8, false);
      pathMesh = new THREE.Mesh(geo, pathMat);
      scene.add(pathMesh);
    }
  }

  // agent follow path
  let agentT = 0;
  function animateAgent(dt){
    if(!planState?.path?.length) return;
    const path = planState.path;
    agentT += dt * 3.0;
    if(agentT >= path.length-1){ agentT = 0; }
    const idx = Math.floor(agentT);
    const frac = agentT - idx;
    const a = cellCenter(path[idx].i, path[idx].j);
    const b = cellCenter(path[Math.min(idx+1, path.length-1)].i, path[Math.min(idx+1, path.length-1)].j);
    agent.position.lerpVectors(a, b, frac);
    agent.position.y = CELL*0.3 + Math.abs(Math.sin(agentT*3))*0.05;
  }

  // pick cell
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function cellFromEvent(e){
    const r = container.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left)/r.width)*2 - 1;
    pointer.y = -(((e.clientY - r.top)/r.height)*2 - 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0), 0), hit);
    if(!hit) return null;
    const i = Math.floor((hit.x - origin.x)/CELL);
    const j = Math.floor((hit.z - origin.z)/CELL);
    if(i<0||j<0||i>=N||j>=N) return null;
    return { i, j };
  }

  let drag = null; // "start" | "goal" | "toggle"
  container.addEventListener("pointerdown", (e)=>{
    const c = cellFromEvent(e); if(!c) return;
    if(c.i===start.i && c.j===start.j) drag = "start";
    else if(c.i===goal.i && c.j===goal.j) drag = "goal";
    else { drag = "toggle"; toggleCell(c); }
  });
  container.addEventListener("pointermove", (e)=>{
    if(!drag) return;
    const c = cellFromEvent(e); if(!c) return;
    if(drag==="start"){ if(grid[c.i][c.j]===1) return; start = c; placeStart(); replan(); }
    else if(drag==="goal"){ if(grid[c.i][c.j]===1) return; goal = c; placeGoal(); replan(); }
    else if(drag==="toggle"){ toggleCell(c, true); }
  });
  container.addEventListener("pointerup", ()=>{ drag=null; });
  container.addEventListener("pointerleave", ()=>{ drag=null; });

  function toggleCell(c, keepPaint){
    if((c.i===start.i && c.j===start.j) || (c.i===goal.i && c.j===goal.j)) return;
    if(keepPaint){ grid[c.i][c.j] = 1; } else { grid[c.i][c.j] = grid[c.i][c.j]===1 ? 0 : 1; }
    rebuildObstacles();
    replan();
  }
  function placeStart(){ startMk.position.copy(cellCenter(start.i, start.j)); startMk.position.y = 0.05; }
  function placeGoal(){ goalMk.position.copy(cellCenter(goal.i, goal.j)); goalMk.position.y = 0.06; }

  // public readout
  const readout = { visited: 0, path: 0, status: "idle" };
  function replan(){
    startPlan();
    readout.status = "planning";
  }
  replan();

  const stop = rafLoop((dt, t)=>{
    if(planState && !planState.found){ stepPlan(); }
    if(planState && planState.found){
      readout.visited = planState.visited.size;
      readout.path = planState.path.length;
      readout.status = planState.path.length ? "found" : "no path";
      animateAgent(dt);
    } else if(planState){
      readout.visited = planState.visited.size;
      readout.status = "planning";
    }
    goalMk.rotation.z += dt*1.5;
    // push readout to HUD
    if(container.__hud) container.__hud.textContent = `visited ${readout.visited} · path ${readout.path} · ${readout.status}`;
    renderer.render(scene, camera);
  });

  resizeObserver(container, (w,h)=>{
    renderer.setSize(w,h,false);
    const aspect = w/h;
    const sz = 12;
    camera.left = -sz*aspect/2; camera.right = sz*aspect/2;
    camera.top = sz/2; camera.bottom = -sz/2;
    camera.updateProjectionMatrix();
  });

  return {
    reset(){
      for(let i=0;i<N;i++) for(let j=0;j<N;j++) grid[i][j] = 0;
      rebuildObstacles();
      replan();
    },
    randomize(){
      for(let i=0;i<N;i++) for(let j=0;j<N;j++) grid[i][j] = (Math.random() < 0.28) ? 1 : 0;
      grid[start.i][start.j] = 0; grid[goal.i][goal.j] = 0;
      rebuildObstacles();
      replan();
    },
    destroy(){ stop(); renderer.dispose(); renderer.domElement.remove(); },
  };
};

// ==================================================
// 6DOF quad navigation toward draggable goal, with obstacle avoidance
// ==================================================
SIMS.quad = function(container){
  const scene = new THREE.Scene();
  const rect = container.getBoundingClientRect();
  const renderer = makeRenderer(container);
  renderer.setSize(rect.width, rect.height, false);

  const camera = new THREE.PerspectiveCamera(40, rect.width/rect.height, 0.1, 200);
  camera.position.set(10, 9, 12);
  camera.lookAt(0, 2, 0);

  standardLights(scene);
  paperFloor(scene, 36, 36);

  // obstacles: vertical cylinders
  const obs = [];
  function addObs(x, z, r, h){
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, h, 24),
      new THREE.MeshStandardMaterial({ color: C.forest, roughness: 0.8 })
    );
    m.position.set(x, h/2, z); m.castShadow=true; m.receiveShadow=true;
    scene.add(m);
    obs.push({ x, z, r, h, mesh: m });
  }
  for(let i=0; i<8; i++){
    const x = (Math.random()-0.5)*18;
    const z = (Math.random()-0.5)*18;
    if(Math.hypot(x,z) < 3) continue;
    addObs(x, z, 0.5 + Math.random()*0.5, 2 + Math.random()*4);
  }

  // quad body: cross frame with 4 rotors
  const quad = new THREE.Group();
  const frameArm = (rot)=>{
    const g = new THREE.Group();
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.06, 0.08),
      new THREE.MeshStandardMaterial({ color: C.ink })
    );
    arm.castShadow = true;
    g.add(arm);
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: C.yellow })
    );
    motor.position.x = 0.55; g.add(motor);
    const rotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.02, 24),
      new THREE.MeshStandardMaterial({ color: C.red, transparent:true, opacity: 0.55 })
    );
    rotor.position.set(0.55, 0.08, 0); g.add(rotor);
    g.rotation.y = rot;
    g.userData.rotor = rotor;
    return g;
  };
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.12, 0.35),
    new THREE.MeshStandardMaterial({ color: C.ink })
  );
  body.castShadow = true;
  quad.add(body);
  const arms = [0, Math.PI/2, Math.PI, 3*Math.PI/2].map(frameArm);
  arms.forEach(a=>quad.add(a));
  quad.position.set(-6, 2.5, -6);
  scene.add(quad);

  // goal sphere
  const goal = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 24, 24),
    new THREE.MeshStandardMaterial({ color: C.red, emissive: C.red, emissiveIntensity: 0.4 })
  );
  goal.position.set(6, 3, 6); scene.add(goal);
  const goalRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.04, 10, 40),
    new THREE.MeshBasicMaterial({ color: C.red })
  );
  goalRing.rotation.x = Math.PI/2;
  goal.add(goalRing);

  // ground shadow for goal
  const goalShadow = new THREE.Mesh(
    new THREE.RingGeometry(0.4, 0.5, 32),
    new THREE.MeshBasicMaterial({ color: C.ink, transparent:true, opacity:0.25 })
  );
  goalShadow.rotation.x = -Math.PI/2;
  scene.add(goalShadow);

  // trajectory trail
  const trailGeo = new THREE.BufferGeometry();
  const trailMat = new THREE.LineBasicMaterial({ color: C.moss, transparent:true, opacity: 0.7 });
  const trail = new THREE.Line(trailGeo, trailMat);
  scene.add(trail);
  const trailPts = [];

  // safe-corridor visual: a set of line segments projecting down from drone
  // state
  const state = {
    pos: new THREE.Vector3(-6, 2.5, -6),
    vel: new THREE.Vector3(),
    att: new THREE.Euler(),
  };

  // drag goal in XZ plane (shift-click for height)
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let draggingGoal = false;
  function onDown(e){
    const r = container.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left)/r.width)*2 - 1;
    pointer.y = -(((e.clientY - r.top)/r.height)*2 - 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(goal, true);
    if(hit.length){ draggingGoal = true; return; }
    // else: click-to-place in XZ
    const p = new THREE.Vector3();
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0), -goal.position.y), p);
    if(p){ goal.position.x = p.x; goal.position.z = p.z; }
  }
  function onMove(e){
    if(!draggingGoal) return;
    const r = container.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left)/r.width)*2 - 1;
    pointer.y = -(((e.clientY - r.top)/r.height)*2 - 1);
    raycaster.setFromCamera(pointer, camera);
    const p = new THREE.Vector3();
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0), -goal.position.y), p);
    if(p){ goal.position.x = Math.max(-16, Math.min(16, p.x)); goal.position.z = Math.max(-16, Math.min(16, p.z)); }
  }
  function onUp(){ draggingGoal = false; }
  container.addEventListener("pointerdown", onDown);
  container.addEventListener("pointermove", onMove);
  container.addEventListener("pointerup", onUp);

  // wheel → adjust goal height
  container.addEventListener("wheel", (e)=>{
    e.preventDefault();
    goal.position.y = Math.max(1, Math.min(8, goal.position.y - e.deltaY*0.01));
  }, { passive: false });

  // control: PID-ish towards goal with repulsive field for obstacles
  function control(dt){
    const toGoal = goal.position.clone().sub(state.pos);
    const dist = toGoal.length();
    const desired = toGoal.normalize().multiplyScalar(Math.min(3.5, dist*1.4));
    // repulsion from obstacles
    const repulse = new THREE.Vector3();
    for(const o of obs){
      const dx = state.pos.x - o.x;
      const dz = state.pos.z - o.z;
      const d = Math.hypot(dx, dz);
      const safeR = o.r + 0.9;
      if(d < safeR*2.2){
        const strength = (safeR*2.2 - d)*2.0;
        repulse.x += (dx/d)*strength;
        repulse.z += (dz/d)*strength;
      }
    }
    // altitude hold separate
    desired.y = (goal.position.y - state.pos.y)*1.6;
    // accel
    const accel = desired.clone().sub(state.vel.clone().multiplyScalar(0.8)).add(repulse);
    state.vel.add(accel.multiplyScalar(dt));
    state.vel.multiplyScalar(0.985); // damping
    // clamp speed
    const sp = state.vel.length();
    if(sp > 5) state.vel.multiplyScalar(5/sp);
    state.pos.add(state.vel.clone().multiplyScalar(dt));
    state.pos.y = Math.max(0.4, state.pos.y);

    // yaw toward velocity with shortest-path wrapping (avoid ±π sign flip)
    const vhSq = state.vel.x*state.vel.x + state.vel.z*state.vel.z;
    if(vhSq > 0.04){
      const yawTarget = Math.atan2(state.vel.x, state.vel.z);
      let dyaw = yawTarget - state.att.y;
      dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
      state.att.y += dyaw * 0.08;
    }
    // bank in the body frame so pitch/roll don't fight yaw
    const cy = Math.cos(state.att.y), sy = Math.sin(state.att.y);
    const vForward = state.vel.x*sy + state.vel.z*cy;
    const vRight   = state.vel.x*cy - state.vel.z*sy;
    const pitchTarget = vForward * 0.12;
    const rollTarget  = -vRight * 0.14;
    state.att.x += (pitchTarget - state.att.x) * 0.1;
    state.att.z += (rollTarget  - state.att.z) * 0.1;

    quad.position.copy(state.pos);
    quad.rotation.order = 'YXZ';
    quad.rotation.set(state.att.x, state.att.y, state.att.z);
  }

  // cam orbit idle
  let camT = 0;
  function updateCam(dt){
    camT += dt*0.15;
    camera.position.x = Math.cos(camT)*16;
    camera.position.z = Math.sin(camT)*16;
    camera.position.y = 9;
    camera.lookAt(state.pos.x*0.3, 2, state.pos.z*0.3);
  }

  const stop = rafLoop((dt)=>{
    control(dt);
    updateCam(dt);
    // rotor spin
    arms.forEach((a, i)=>{ a.userData.rotor.rotation.y += dt*40 * (i%2 ? 1 : -1);});

    // trail
    if(trailPts.length === 0 || trailPts[trailPts.length-1].distanceTo(state.pos) > 0.1){
      trailPts.push(state.pos.clone());
      if(trailPts.length > 120) trailPts.shift();
      trailGeo.setFromPoints(trailPts);
    }
    goalShadow.position.set(goal.position.x, 0.02, goal.position.z);
    goal.rotation.y += dt*0.8;

    if(container.__hud){
      const d = state.pos.distanceTo(goal.position);
      container.__hud.textContent = `Δ ${d.toFixed(2)}m · v ${state.vel.length().toFixed(2)}m/s · goal (${goal.position.x.toFixed(1)}, ${goal.position.y.toFixed(1)}, ${goal.position.z.toFixed(1)})`;
    }

    renderer.render(scene, camera);
  });

  resizeObserver(container, (w,h)=>{
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  });

  return {
    randomize(){
      obs.forEach(o=>scene.remove(o.mesh)); obs.length = 0;
      for(let i=0; i<8; i++){
        const x = (Math.random()-0.5)*18;
        const z = (Math.random()-0.5)*18;
        if(Math.hypot(x,z)<3) continue;
        addObs(x, z, 0.5+Math.random()*0.5, 2+Math.random()*4);
      }
    },
    destroy(){ stop(); renderer.dispose(); renderer.domElement.remove(); },
  };
};


// ==================================================
// Isometric manipulator — 6-DOF autonomous pick-and-place
//
// Chain: base yaw (Y) → shoulder pitch (Z) → elbow ROLL (Y) →
//        elbow pitch (Z) → wrist pitch (Z) → wrist roll (Y) → grab point
//
// Reachable pick/place poses are generated via rejection sampling on
// forward kinematics, with q_pitch3 = π − q_pitch1 − q_pitch2 forcing the
// gripper to point straight down. The elbow-roll joint (q_er) is driven
// cosmetically during transit phases to showcase the extra DOF without
// breaking the reach sampler.
// ==================================================
SIMS.manip = function(container){
  const scene = new THREE.Scene();
  const renderer = makeRenderer(container);

  // isometric orthographic — slightly higher angle than reference to show base
  const SZ = 12;
  const makeCam = () => {
    const r = container.getBoundingClientRect();
    const aspect = r.width / r.height;
    return new THREE.OrthographicCamera(-SZ*aspect/2, SZ*aspect/2, SZ/2, -SZ/2, -60, 60);
  };
  let camera = makeCam();
  camera.position.set(10, 9, 10);
  camera.lookAt(0, 1.2, 0);

  // --- lights: match the warm paper scene ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xfff5d8, 0.85);
  key.position.set(6, 10, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.0005;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8ecd0, 0.3);
  fill.position.set(-5, 5, -4);
  scene.add(fill);

  // --- link lengths (longer, slimmer than before) ---
  const L1 = 2.0, L2 = 1.6, L3 = 0.7;
  const GRAB_OFF = 0.35;

  // ============================================================
  //  WORLD SURFACE
  // ============================================================
  // Cream paper table surface (matches site bg-2), with thin ink outline.
  const tableGroup = new THREE.Group();
  scene.add(tableGroup);

  const topThick = 0.12;
  const topW = 14, topD = 10;
  const topMat = new THREE.MeshStandardMaterial({ color: C.bg2, roughness: 0.95, metalness: 0 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(topW, topThick, topD), topMat);
  top.position.y = -topThick/2;
  top.receiveShadow = true;
  tableGroup.add(top);
  // ink outline on top face
  const topOutline = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(topW, topThick, topD)),
    new THREE.LineBasicMaterial({ color: C.ink })
  );
  topOutline.position.copy(top.position);
  tableGroup.add(topOutline);

  // subtle grid on the table top — hair-weight lines
  const grid = new THREE.GridHelper(14, 14, C.hair, C.hair);
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  grid.position.y = 0.001;
  tableGroup.add(grid);

  // Thin ink tracks at ±center (blueprint-style registration marks)
  function regLine(x1,z1,x2,z2, color=C.hair){
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, 0.002, z1),
      new THREE.Vector3(x2, 0.002, z2),
    ]);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 }));
  }
  tableGroup.add(regLine(-6, 0, 6, 0));
  tableGroup.add(regLine(0, -4, 0, 4));

  // Corner registration ticks
  function cornerTick(x, z){
    const g = new THREE.Group();
    g.add(regLine(-0.35, 0, 0.35, 0, C.ink));
    g.add(regLine(0, -0.35, 0, 0.35, C.ink));
    g.position.set(x, 0, z);
    return g;
  }
  tableGroup.add(cornerTick(-5.5, -3.5));
  tableGroup.add(cornerTick(5.5, -3.5));
  tableGroup.add(cornerTick(-5.5, 3.5));
  tableGroup.add(cornerTick(5.5, 3.5));

  // ============================================================
  //  PAYLOAD (yellow cube) — shaped like a signal marker
  // ============================================================
  const CUBE_H = 0.34;
  const objGroup = new THREE.Group();
  scene.add(objGroup);
  const objMesh = new THREE.Mesh(
    new THREE.BoxGeometry(CUBE_H, CUBE_H, CUBE_H),
    new THREE.MeshLambertMaterial({ color: C.yellow })
  );
  objMesh.castShadow = true;
  objMesh.receiveShadow = true;
  objGroup.add(objMesh);
  const objEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(objMesh.geometry),
    new THREE.LineBasicMaterial({ color: C.ink })
  );
  objGroup.add(objEdges);
  // bullseye on top
  const bulls = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.09, 32),
    new THREE.MeshBasicMaterial({ color: C.ink, side: THREE.DoubleSide })
  );
  bulls.rotation.x = -Math.PI/2;
  bulls.position.y = CUBE_H/2 + 0.001;
  objGroup.add(bulls);

  // ============================================================
  //  DROP ZONE (outlined pad)
  // ============================================================
  const binGroup = new THREE.Group();
  scene.add(binGroup);
  // subtle filled pad
  const padPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.6),
    new THREE.MeshBasicMaterial({ color: C.forest, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
  );
  padPlane.rotation.x = -Math.PI/2;
  padPlane.position.y = 0.002;
  binGroup.add(padPlane);
  // outlined square
  const padOutline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.8, 0.003, -0.8),
      new THREE.Vector3( 0.8, 0.003, -0.8),
      new THREE.Vector3( 0.8, 0.003,  0.8),
      new THREE.Vector3(-0.8, 0.003,  0.8),
    ]),
    new THREE.LineBasicMaterial({ color: C.ink })
  );
  binGroup.add(padOutline);
  // inner yellow bracket marks at corners
  function bracket(sx, sz){
    const g = new THREE.Group();
    const m = new THREE.LineBasicMaterial({ color: C.yellow });
    const a = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.004, 0), new THREE.Vector3(0.2 * sx, 0.004, 0),
    ]), m);
    const b = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.004, 0), new THREE.Vector3(0, 0.004, 0.2 * sz),
    ]), m);
    g.add(a); g.add(b);
    g.position.set(-0.6 * sx, 0, -0.6 * sz);
    return g;
  }
  binGroup.add(bracket(1, 1));
  binGroup.add(bracket(-1, 1));
  binGroup.add(bracket(1, -1));
  binGroup.add(bracket(-1, -1));

  // ============================================================
  //  ROBOT ARM — slim silhouette, ink bodies, yellow details
  // ============================================================
  const inkMat   = new THREE.MeshLambertMaterial({ color: C.ink });
  const mossMat  = new THREE.MeshLambertMaterial({ color: C.moss });
  const yellowMat= new THREE.MeshLambertMaterial({ color: C.yellow });
  const forestMat= new THREE.MeshLambertMaterial({ color: C.forest });

  function castBox(w,h,d,m){
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m);
    mesh.castShadow = true; mesh.receiveShadow = true;
    return mesh;
  }
  function linkMesh(length, cross, bodyMat, edgeColor){
    const g = new THREE.Group();
    const body = castBox(cross, length, cross, bodyMat);
    body.position.y = length/2;
    g.add(body);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry),
      new THREE.LineBasicMaterial({ color: edgeColor })
    );
    edges.position.copy(body.position);
    g.add(edges);
    return g;
  }
  function jointPuck(radius, height, color, accentColor){
    const g = new THREE.Group();
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 32),
      new THREE.MeshLambertMaterial({ color })
    );
    m.castShadow = true; m.rotation.z = Math.PI/2; // horizontal pivot (visually "pin")
    g.add(m);
    const ring = new THREE.LineSegments(
      new THREE.EdgesGeometry(m.geometry),
      new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.8 })
    );
    ring.rotation.copy(m.rotation);
    g.add(ring);
    return g;
  }

  // -- base (yaw Y) --
  const base = new THREE.Group();
  scene.add(base);
  // plinth
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.7, 0.25, 48),
    new THREE.MeshLambertMaterial({ color: C.forest })
  );
  plinth.position.y = 0.125;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  base.add(plinth);
  const plinthRing = new THREE.LineSegments(
    new THREE.EdgesGeometry(plinth.geometry),
    new THREE.LineBasicMaterial({ color: C.ink, transparent: true, opacity: 0.6 })
  );
  plinthRing.position.copy(plinth.position);
  base.add(plinthRing);
  // yellow bezel ring on top of plinth
  const bezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.025, 8, 48),
    yellowMat
  );
  bezel.rotation.x = Math.PI/2;
  bezel.position.y = 0.255;
  base.add(bezel);
  // yoke column that holds the shoulder joint
  const yoke = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.24, 0.55, 24),
    mossMat
  );
  yoke.position.y = 0.525;
  yoke.castShadow = true;
  base.add(yoke);

  // -- shoulder pitch (joint1, Z) --
  const joint1 = new THREE.Group();
  joint1.position.set(0, 0.8, 0);
  base.add(joint1);
  joint1.add(jointPuck(0.22, 0.36, C.ink, C.yellow));
  const upper = linkMesh(L1, 0.22, inkMat, C.yellow);
  joint1.add(upper);

  // -- elbow ROLL (new DOF, around Y of upper-arm frame) --
  // inserted *before* the pitch joint at the same position so the elbow pivot
  // stays at (0, L1, 0) regardless of roll value.
  const elbowRoll = new THREE.Group();
  elbowRoll.position.set(0, 0, 0);
  joint1.add(elbowRoll);

  // -- elbow pitch (joint2, Z) --
  const joint2 = new THREE.Group();
  joint2.position.set(0, L1, 0);
  elbowRoll.add(joint2);
  joint2.add(jointPuck(0.18, 0.32, C.ink, C.yellow));
  const fore = linkMesh(L2, 0.18, inkMat, C.yellow);
  joint2.add(fore);

  // -- wrist pitch (joint3, Z) --
  const joint3 = new THREE.Group();
  joint3.position.set(0, L2, 0);
  joint2.add(joint3);
  joint3.add(jointPuck(0.14, 0.28, C.ink, C.yellow));
  const wristArm = linkMesh(L3, 0.14, inkMat, C.yellow);
  joint3.add(wristArm);

  // -- wrist roll (effector, Y) --
  const effector = new THREE.Group();
  effector.position.set(0, L3, 0);
  joint3.add(effector);

  // palm: wider, flatter, moss with yellow edges
  const palm = castBox(0.48, 0.12, 0.56, mossMat);
  palm.position.y = 0.06;
  effector.add(palm);
  const palmEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(palm.geometry),
    new THREE.LineBasicMaterial({ color: C.yellow })
  );
  palmEdges.position.copy(palm.position);
  effector.add(palmEdges);

  // fingertip sockets (decorative ink pins)
  for(const sx of [-0.18, 0.18]){
    for(const sz of [-0.22, 0.22]){
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.03, 12),
        inkMat
      );
      pin.position.set(sx, 0.135, sz);
      effector.add(pin);
    }
  }

  // grippers — open/close along Z. Slim ink fingers w/ yellow tip accent.
  function makeFinger(){
    const g = new THREE.Group();
    const body = castBox(0.09, 0.42, 0.05, inkMat);
    body.position.y = 0.21;
    g.add(body);
    const tip = castBox(0.11, 0.06, 0.07, yellowMat);
    tip.position.y = 0.42 + 0.03;
    g.add(tip);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry),
      new THREE.LineBasicMaterial({ color: C.yellow, transparent: true, opacity: 0.7 })
    );
    edges.position.copy(body.position);
    g.add(edges);
    return g;
  }
  const gripLeft = makeFinger();
  gripLeft.position.set(0, 0.12, 0.28);
  effector.add(gripLeft);
  const gripRight = makeFinger();
  gripRight.position.set(0, 0.12, -0.28);
  effector.add(gripRight);

  // tool-center-point (grab point) between the fingers
  const grabPoint = new THREE.Object3D();
  grabPoint.position.set(0, 0.42 + 0.08, 0);  // at finger tips' mid-height
  effector.add(grabPoint);

  // Small "laser pointer" visual under the gripper — just a yellow line
  const laserGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.3, 0),
  ]);
  const laser = new THREE.Line(
    laserGeom,
    new THREE.LineBasicMaterial({ color: C.yellow, transparent: true, opacity: 0.6 })
  );
  laser.position.set(0, 0.48, 0);
  effector.add(laser);

  // ============================================================
  // FORWARD KINEMATICS (now 6-DOF)
  // q = [yaw, shoulder_pitch, elbow_roll, elbow_pitch, wrist_pitch, wrist_roll]
  //      q0   q1              q_er         q2           q3            q4
  // GRAB_OFF is applied along the effector's +Y (between fingers).
  // ============================================================
  function computeFK(q0, q1, q_er, q2, q3, q4){
    const dB = new THREE.Object3D();
    const d1 = new THREE.Object3D(); d1.position.set(0, 0.8, 0); dB.add(d1);
    const dRoll = new THREE.Object3D(); dRoll.position.set(0, 0, 0); d1.add(dRoll);
    const d2 = new THREE.Object3D(); d2.position.set(0, L1, 0); dRoll.add(d2);
    const d3 = new THREE.Object3D(); d3.position.set(0, L2, 0); d2.add(d3);
    const dE = new THREE.Object3D(); dE.position.set(0, L3, 0); d3.add(dE);
    const dG = new THREE.Object3D(); dG.position.set(0, GRAB_OFF + 0.15, 0); dE.add(dG);
    dB.rotation.y   = q0;
    d1.rotation.z   = q1;
    dRoll.rotation.y = q_er;
    d2.rotation.z   = q2;
    d3.rotation.z   = q3;
    dE.rotation.y   = q4;
    dB.updateMatrixWorld(true);
    const pos = new THREE.Vector3(); dG.getWorldPosition(pos);
    const quat = new THREE.Quaternion(); dG.getWorldQuaternion(quat);
    return { pos, quat };
  }

  // Sampler: q_er is fixed to 0 during pick/place so the standard
  // planar reach constraint applies. The longer arm reaches further,
  // so widen the radial band accordingly.
  function sampleValidPose(){
    const MIN_R = 1.4, MAX_R = L1 + L2 + L3 - 0.3;
    for(let i = 0; i < 800; i++){
      const q0 = (Math.random() - 0.5) * Math.PI * 1.6;
      const q1 = Math.random() * Math.PI * 0.35 + 0.1;
      const q2 = Math.random() * Math.PI * 0.45 + 0.1;
      const q3 = Math.PI - (q1 + q2);
      const q4 = (Math.random() - 0.5) * Math.PI;
      const { pos, quat } = computeFK(q0, q1, 0, q2, q3, q4);
      const rad = Math.hypot(pos.x, pos.z);
      if(pos.y > 0.12 && pos.y < 0.24 && rad > MIN_R && rad < MAX_R){
        return { angles: [q0, q1, 0, q2, q3, q4], pos, quat };
      }
    }
    // fallback at a known-reachable pose
    const q1 = 0.5, q2 = 0.5, q3 = Math.PI - 1.0;
    const { pos, quat } = computeFK(0, q1, 0, q2, q3, 0);
    return { angles: [0, q1, 0, q2, q3, 0], pos, quat };
  }

  // Transit pose: same yaw, retract the pitches, add a mild elbow roll sway
  // (purely cosmetic — shows the extra DOF while the arm is clear of payload).
  function liftAngles(a, rollPhase){
    const q0 = a[0];
    const q1 = Math.max(0.05, a[1] - 0.55);
    const q2 = Math.max(0.05, a[2] - 0.55);
    const q3 = Math.PI - (q1 + q2);
    const q_er = 0.55 * Math.sin(rollPhase);
    const q4 = a[5];
    return [q0, q1, q_er, q2, q3, q4];
  }

  // ============================================================
  //  SCENE STATE & FSM
  // ============================================================
  let poses = { pick: sampleValidPose(), place: sampleValidPose() };
  function resetScene(){
    objGroup.position.copy(poses.pick.pos);
    objGroup.quaternion.copy(poses.pick.quat);
    binGroup.position.set(poses.place.pos.x, 0, poses.place.pos.z);
  }
  resetScene();

  const PHASES = ["REST", "APPROACH", "GRASP", "LIFT", "TRANSIT", "LOWER", "RELEASE"];
  const st = {
    phase: 0,
    timer: 0,
    rollPhase: 0,   // drives the transit elbow-roll sway
    q: [0, 0.25, 0, 0.25, Math.PI - 0.5, 0], // [q0, q1, q_er, q2, q3, q4]
    grip: 0.28,
    holding: false,
  };
  const GRIP_OPEN = 0.30;
  const GRIP_CLOSED = 0.15;

  function targetsForPhase(){
    const p = poses;
    switch(st.phase){
      case 0: return { q: [0, 0.25, 0, 0.25, Math.PI - 0.5, 0], grip: GRIP_OPEN, speed: 1.0 };
      case 1: return { q: [...p.pick.angles], grip: GRIP_OPEN, speed: 2.2 };
      case 2: return { q: [...p.pick.angles], grip: GRIP_CLOSED, speed: 2.0 };
      case 3: return { q: liftAngles(p.pick.angles, st.rollPhase), grip: GRIP_CLOSED, speed: 2.4 };
      case 4: return { q: liftAngles(p.place.angles, st.rollPhase), grip: GRIP_CLOSED, speed: 1.8 };
      case 5: return { q: [...p.place.angles], grip: GRIP_CLOSED, speed: 2.2 };
      case 6: return { q: [...p.place.angles], grip: GRIP_OPEN, speed: 3.5 };
      default: return { q: [0, 0.25, 0, 0.25, Math.PI - 0.5, 0], grip: GRIP_OPEN, speed: 1.0 };
    }
  }

  function stepFSM(dt){
    // advance transit-roll clock only while the arm is clear of payload
    if(st.phase === 3 || st.phase === 4){
      st.rollPhase += dt * 1.4;
    }
    const tgt = targetsForPhase();
    let err = 0;
    for(let i = 0; i < 6; i++){
      st.q[i] += (tgt.q[i] - st.q[i]) * dt * tgt.speed;
      err += Math.abs(tgt.q[i] - st.q[i]);
    }
    st.grip += (tgt.grip - st.grip) * dt * tgt.speed * 2;
    const gripErr = Math.abs(tgt.grip - st.grip);

    const converged = err < 0.06 && gripErr < 0.02;
    if(converged){
      st.timer += dt;
      const dwell = (st.phase === 2 || st.phase === 6) ? 0.35 : 0.08;
      if(st.timer > dwell){
        st.timer = 0;
        if(st.phase === 2) st.holding = true;
        if(st.phase === 6){
          st.holding = false;
          // leave cube where it was dropped, then spawn new pick/place
          objGroup.position.copy(poses.place.pos);
          objGroup.quaternion.copy(poses.place.quat);
          poses = { pick: sampleValidPose(), place: sampleValidPose() };
          objGroup.position.copy(poses.pick.pos);
          objGroup.quaternion.copy(poses.pick.quat);
          binGroup.position.set(poses.place.pos.x, 0, poses.place.pos.z);
          st.phase = 0;
        } else {
          st.phase += 1;
        }
      }
    } else {
      st.timer = 0;
    }
  }

  function applyKinematics(){
    base.rotation.y       = st.q[0];
    joint1.rotation.z     = st.q[1];
    elbowRoll.rotation.y  = st.q[2];
    joint2.rotation.z     = st.q[3];
    joint3.rotation.z     = st.q[4];
    effector.rotation.y   = st.q[5];
    gripLeft.position.z   = st.grip;
    gripRight.position.z  = -st.grip;

    if(st.holding){
      const wp = new THREE.Vector3(); grabPoint.getWorldPosition(wp);
      const wq = new THREE.Quaternion(); grabPoint.getWorldQuaternion(wq);
      objGroup.position.copy(wp);
      objGroup.quaternion.copy(wq);
    }
  }

  const stop = rafLoop((dt) => {
    stepFSM(dt);
    applyKinematics();
    if(container.__hud){
      container.__hud.textContent =
        `${PHASES[st.phase]} · ${st.holding ? 'HOLD' : 'FREE'} · ` +
        `yaw ${(st.q[0]*57.3).toFixed(0)}° · roll ${(st.q[2]*57.3).toFixed(0)}°`;
    }
    renderer.render(scene, camera);
  });

  resizeObserver(container, (w, h) => {
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.left = -SZ*aspect/2;
    camera.right = SZ*aspect/2;
    camera.top = SZ/2;
    camera.bottom = -SZ/2;
    camera.updateProjectionMatrix();
  });

  return {
    randomize(){
      poses = { pick: sampleValidPose(), place: sampleValidPose() };
      st.holding = false;
      st.phase = 0;
      st.timer = 0;
      resetScene();
    },
    destroy(){
      stop();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};

// ==================================================
// SLAM — differential-drive ground robot in a procedural room.
// 120-beam 2D LiDAR feeds a log-odds occupancy grid (mapping),
// a particle filter (MCL) estimates pose against the live map,
// and an EKF fuses the PF mean as a pseudo-observation so the
// covariance ellipse tightens as the belief converges.
// ==================================================
SIMS.slam = function(container){
  const scene = new THREE.Scene();
  const renderer = makeRenderer(container);
  const rect = container.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);

  const ortho = () => {
    const r = container.getBoundingClientRect();
    const aspect = r.width / r.height;
    const sz = 18;
    return new THREE.OrthographicCamera(-sz*aspect/2, sz*aspect/2, sz/2, -sz/2, -80, 80);
  };
  let camera = ortho();
  camera.position.set(10, 12, 10); // true isometric-ish tilt (~45° azimuth, ~40° elevation)
  camera.lookAt(0, 0, 0);

  standardLights(scene);

  // ---- floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 15),
    new THREE.MeshStandardMaterial({ color: C.bg2, roughness: 1 })
  );
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);

  // ---- world walls (line segments in XZ plane; y is world-Z)
  let segments = [];
  let wallGroup = null;

  function makeWorld(){
    segments = [];
    const W = 9, H = 6;
    segments.push({x0:-W,y0:-H,x1: W,y1:-H});
    segments.push({x0: W,y0:-H,x1: W,y1: H});
    segments.push({x0: W,y0: H,x1:-W,y1: H});
    segments.push({x0:-W,y0: H,x1:-W,y1:-H});

    // Generate candidate internal walls, rejecting any that come too close
    // to the robot spawn, the patrol waypoints, OR any previously accepted
    // wall. That keeps corridors wide enough for the robot to fit.
    const protect = [[0,0], ...waypoints];
    const POINT_CLEAR = 0.9;
    const WALL_CLEAR  = ROBOT_R * 2 + 0.35;   // ≈ 1 m corridor width
    let tries = 0;
    while(segments.length < 10 && tries++ < 120){
      let cand;
      if(Math.random()<0.5){
        const y  = (Math.random()-0.5)*2*(H-1.5);
        const cx = (Math.random()-0.5)*2*(W-2.5);
        const L  = 1.4 + Math.random()*2.6;
        cand = {x0:cx-L/2, y0:y, x1:cx+L/2, y1:y};
      } else {
        const x  = (Math.random()-0.5)*2*(W-1.5);
        const cy = (Math.random()-0.5)*2*(H-2);
        const L  = 1.2 + Math.random()*2;
        cand = {x0:x, y0:cy-L/2, x1:x, y1:cy+L/2};
      }
      let ok = true;
      for(const p of protect){
        if(distPointSeg(p[0], p[1], cand).d < POINT_CLEAR){ ok = false; break; }
      }
      if(ok){
        // Minimum separation from every existing wall — skip the outer 4 walls
        // (candidate endpoints are already inside the room).
        for(let i = 4; i < segments.length; i++){
          const s2 = segments[i];
          const dA = Math.min(
            distPointSeg(cand.x0, cand.y0, s2).d,
            distPointSeg(cand.x1, cand.y1, s2).d,
            distPointSeg(s2.x0, s2.y0, cand).d,
            distPointSeg(s2.x1, s2.y1, cand).d
          );
          if(dA < WALL_CLEAR){ ok = false; break; }
        }
      }
      if(ok) segments.push(cand);
    }
    rebuildWalls();
    resetMap();
    robot.x = 0; robot.y = 0; robot.th = 0;
    desiredTh = 0; rotAccum = 0; lastGD = Infinity; stuckTimer = 0;
    wpI = 0;
    resetBelief();
  }

  function rebuildWalls(){
    if(wallGroup){ scene.remove(wallGroup); wallGroup.traverse(o=>o.geometry?.dispose?.()); }
    wallGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.9 });
    for(const s of segments){
      const dx = s.x1 - s.x0, dy = s.y1 - s.y0;
      const L = Math.hypot(dx, dy);
      const geo = new THREE.BoxGeometry(L, 0.38, 0.14);
      const m = new THREE.Mesh(geo, mat);
      m.position.set((s.x0+s.x1)/2, 0.19, (s.y0+s.y1)/2);
      m.rotation.y = -Math.atan2(dy, dx);
      m.castShadow = true; m.receiveShadow = true;
      wallGroup.add(m);
    }
    scene.add(wallGroup);
  }

  // ---- ray–segment intersection
  function raycast(ox, oy, dx, dy, maxR){
    let best = maxR;
    for(const s of segments){
      const vx = s.x1 - s.x0, vy = s.y1 - s.y0;
      const denom = dx * (-vy) + dy * vx;
      if(Math.abs(denom) < 1e-9) continue;
      const t = ((s.x0 - ox) * (-vy) + (s.y0 - oy) * (vx)) / denom;
      const u = ((s.x0 - ox) * (-dy) + (s.y0 - oy) * (dx)) / denom;
      if(t >= 0 && t < best && u >= 0 && u <= 1) best = t;
    }
    return best;
  }

  // ---- wall collision helpers
  const ROBOT_R = 0.32;          // physical robot radius
  const WALL_PAD = 0.12;         // wall half-thickness + slim safety slack
  const SLOW_R  = 0.75;          // slowdown starts here (measured from lookahead)

  // Closest-point distance from (px, py) to segment s
  function distPointSeg(px, py, s){
    const vx = s.x1 - s.x0, vy = s.y1 - s.y0;
    const L2 = vx*vx + vy*vy;
    let t = ((px - s.x0)*vx + (py - s.y0)*vy) / Math.max(1e-9, L2);
    t = Math.max(0, Math.min(1, t));
    const cx = s.x0 + t*vx, cy = s.y0 + t*vy;
    return { d: Math.hypot(px - cx, py - cy), cx, cy };
  }

  // True if the circular robot at (px,py) overlaps any wall (+ its half-thickness)
  function inCollision(px, py){
    const clear = ROBOT_R + WALL_PAD;
    for(const s of segments) if(distPointSeg(px, py, s).d < clear) return true;
    return false;
  }

  // Minimum distance from (px,py) to any wall's nearest point.
  function nearestWall(px, py){
    let best = Infinity;
    for(const s of segments){
      const d = distPointSeg(px, py, s).d;
      if(d < best) best = d;
    }
    return best;
  }

  // Sum repulsive vector from every nearby wall (nearest-point normal, 1/d falloff)
  function wallRepulse(px, py, lookahead){
    let fx = 0, fy = 0;
    for(const s of segments){
      const q = distPointSeg(px, py, s);
      if(q.d > lookahead) continue;
      const nx = (px - q.cx), ny = (py - q.cy);
      const L = Math.max(0.01, Math.hypot(nx, ny));
      const strength = (lookahead - q.d) / lookahead;   // 0..1
      fx += (nx / L) * strength;
      fy += (ny / L) * strength;
    }
    return { fx, fy };
  }

  // ---- occupancy grid (log-odds)
  const GRID_W = 100, GRID_H = 70;       // cells
  const WORLD_W = 22, WORLD_H = 15;      // meters covered by the grid plane
  const CELL = WORLD_W / GRID_W;         // 0.22 m
  const logodds = new Float32Array(GRID_W * GRID_H);
  const L_FREE = -0.35, L_OCC = 0.85, L_MIN = -4, L_MAX = 4;
  function w2g(x, y){
    return [
      Math.floor((x + WORLD_W/2) / CELL),
      Math.floor((y + WORLD_H/2) / CELL)
    ];
  }
  function resetMap(){ logodds.fill(0); }

  function bresenham(x0, y0, x1, y1, cb){
    const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, x = x0, y = y0;
    for(let k=0; k<400; k++){
      if(!cb(x, y)) return;
      if(x === x1 && y === y1) return;
      const e2 = 2 * err;
      if(e2 > -dy){ err -= dy; x += sx; }
      if(e2 <  dx){ err += dx; y += sy; }
    }
  }

  function integrateScan(rx, ry, rth, beams, maxR){
    const [gx0, gy0] = w2g(rx, ry);
    for(let i=0; i<beams.length; i+=2){  // every 2nd beam for speed
      const b = beams[i];
      const hit = b.r < maxR - 0.05;
      const wa = rth + b.rel;              // world bearing consistent with rx,ry,rth
      const ex = rx + Math.cos(wa) * b.r;
      const ey = ry + Math.sin(wa) * b.r;
      const [gx1, gy1] = w2g(ex, ey);
      bresenham(gx0, gy0, gx1, gy1, (x, y) => {
        if(x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;
        const idx = y * GRID_W + x;
        if(x === gx1 && y === gy1 && hit){
          logodds[idx] = Math.min(L_MAX, logodds[idx] + L_OCC);
        } else {
          logodds[idx] = Math.max(L_MIN, logodds[idx] + L_FREE);
        }
        return true;
      });
    }
  }

  // ---- occupancy grid → canvas texture
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = GRID_W; mapCanvas.height = GRID_H;
  const mapCtx = mapCanvas.getContext('2d');
  const mapImg = mapCtx.createImageData(GRID_W, GRID_H);
  const mapTex = new THREE.CanvasTexture(mapCanvas);
  mapTex.magFilter = THREE.NearestFilter;
  mapTex.minFilter = THREE.NearestFilter;
  mapTex.generateMipmaps = false;
  const mapPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_W, WORLD_H),
    new THREE.MeshBasicMaterial({ map: mapTex, transparent: true, depthWrite: false })
  );
  mapPlane.rotation.x = -Math.PI/2;
  mapPlane.position.y = 0.03;
  scene.add(mapPlane);

  function redrawMap(){
    const d = mapImg.data;
    for(let y=0; y<GRID_H; y++){
      for(let x=0; x<GRID_W; x++){
        const l = logodds[y * GRID_W + x];
        const p = 1 / (1 + Math.exp(-l));
        let r=0, g=0, b=0, a=0;
        if(l === 0){ a = 0; }
        else if(p > 0.55){ r=0x1B; g=0x0C; b=0x0C; a=Math.min(255, (p-0.5)*2*260); }
        else if(p < 0.45){ r=0x4C; g=0x5C; b=0x2D; a=Math.min(110, (0.5-p)*2*110); }
        const cy = GRID_H - 1 - y;  // flip V so +world-Z is "up" in texture
        const j = (cy * GRID_W + x) * 4;
        d[j]=r; d[j+1]=g; d[j+2]=b; d[j+3]=a;
      }
    }
    mapCtx.putImageData(mapImg, 0, 0);
    mapTex.needsUpdate = true;
  }

  // ---- robot state
  const robot = { x:0, y:0, th:0, v:0.9, w:0 };
  const waypoints = [[6,3],[6,-3],[-6,-3],[-6,3]];
  let wpI = 0;

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.18, 24),
    new THREE.MeshStandardMaterial({ color: C.yellow, roughness: 0.55 })
  );
  body.castShadow = true; scene.add(body);
  const nose = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.04, 0.08),
    new THREE.MeshBasicMaterial({ color: C.ink })
  );
  scene.add(nose);

  // ---- LiDAR visualization
  const BEAMS = 120, MAX_R = 9;
  const rayGeo = new THREE.BufferGeometry();
  const rayPos = new Float32Array(BEAMS * 2 * 3);
  rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPos, 3));
  const rays = new THREE.LineSegments(
    rayGeo,
    new THREE.LineBasicMaterial({ color: C.yellow, transparent: true, opacity: 0.22 })
  );
  scene.add(rays);
  const endGeo = new THREE.BufferGeometry();
  const endPos = new Float32Array(BEAMS * 3);
  endGeo.setAttribute('position', new THREE.BufferAttribute(endPos, 3));
  const ends = new THREE.Points(
    endGeo,
    new THREE.PointsMaterial({ color: C.red, size: 0.09, sizeAttenuation: true })
  );
  scene.add(ends);

  // ---- particle filter
  const NP = 180;
  let particles = [];
  function resetBelief(){
    particles = [];
    for(let i=0; i<NP; i++){
      particles.push({
        x:  robot.x + (Math.random()-0.5)*0.8,
        y:  robot.y + (Math.random()-0.5)*0.8,
        th: robot.th + (Math.random()-0.5)*0.3,
        w:  1/NP
      });
    }
    ekf.x = robot.x; ekf.y = robot.y; ekf.th = robot.th;
    ekf.P = [[0.4,0,0],[0,0.4,0],[0,0,0.15]];
  }

  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(NP * 3);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pCloud = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: C.forest, size: 0.08 })
  );
  scene.add(pCloud);

  // ---- EKF state + covariance ellipse
  const ekf = { x:0, y:0, th:0, P:[[0.4,0,0],[0,0.4,0],[0,0,0.15]] };
  let lastK = [[0,0,0],[0,0,0],[0,0,0]];

  const ELL_N = 72;
  const ellGeo = new THREE.BufferGeometry();
  const ellPos = new Float32Array((ELL_N+1) * 3);
  ellGeo.setAttribute('position', new THREE.BufferAttribute(ellPos, 3));
  const ell = new THREE.Line(
    ellGeo,
    new THREE.LineBasicMaterial({ color: C.red })
  );
  scene.add(ell);
  // EKF center: small red '+' crosshair so it reads as "estimate", not a
  // second robot.
  const ekfMark = new THREE.Group();
  {
    const mkLine = (ax, ay, bx, by) => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ax, 0, ay),
        new THREE.Vector3(bx, 0, by),
      ]);
      return new THREE.Line(g, new THREE.LineBasicMaterial({ color: C.red }));
    };
    const L = 0.18;
    ekfMark.add(mkLine(-L, 0,  L, 0));
    ekfMark.add(mkLine( 0,-L,  0, L));
  }
  scene.add(ekfMark);

  // ---- small linear algebra
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
  const m3 = {
    mul(A,B){ const C=[[0,0,0],[0,0,0],[0,0,0]];
      for(let i=0;i<3;i++)for(let j=0;j<3;j++)
        C[i][j]=A[i][0]*B[0][j]+A[i][1]*B[1][j]+A[i][2]*B[2][j];
      return C;
    },
    T(A){ return [[A[0][0],A[1][0],A[2][0]],[A[0][1],A[1][1],A[2][1]],[A[0][2],A[1][2],A[2][2]]]; },
    add(A,B){ const C=[[0,0,0],[0,0,0],[0,0,0]]; for(let i=0;i<3;i++)for(let j=0;j<3;j++)C[i][j]=A[i][j]+B[i][j]; return C; },
    sub(A,B){ const C=[[0,0,0],[0,0,0],[0,0,0]]; for(let i=0;i<3;i++)for(let j=0;j<3;j++)C[i][j]=A[i][j]-B[i][j]; return C; },
    inv(A){
      const a=A[0][0],b=A[0][1],c=A[0][2],d=A[1][0],e=A[1][1],f=A[1][2],g=A[2][0],h=A[2][1],i=A[2][2];
      const det=a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
      if(Math.abs(det)<1e-10) return [[1,0,0],[0,1,0],[0,0,1]];
      const k=1/det;
      return [
        [(e*i-f*h)*k, -(b*i-c*h)*k,  (b*f-c*e)*k],
        [-(d*i-f*g)*k, (a*i-c*g)*k, -(a*f-c*d)*k],
        [(d*h-e*g)*k, -(a*h-b*g)*k,  (a*e-b*d)*k],
      ];
    }
  };
  const I3 = [[1,0,0],[0,1,0],[0,0,1]];

  // ---- sim steps
  let step = 0, resamples = 0;

  let stuckTimer = 0;
  let desiredTh = 0;      // low-pass filtered heading setpoint
  let rotAccum = 0;       // unsigned rotation since last waypoint progress
  let lastGD = Infinity;  // distance to current goal last frame

  function driveWaypoint(dt){
    const wp = waypoints[wpI];
    const gx = wp[0] - robot.x, gy = wp[1] - robot.y;
    const gd = Math.hypot(gx, gy);
    if(gd < 0.5){
      wpI = (wpI + 1) % waypoints.length;
      stuckTimer = 0; rotAccum = 0; lastGD = Infinity;
    }

    // desired heading = goal direction + repulsion from nearby walls
    const REPEL_R = 1.0, REPEL_K = 1.2;
    const rep = wallRepulse(robot.x, robot.y, REPEL_R);
    const dx = (gx / Math.max(0.001, gd)) + rep.fx * REPEL_K;
    const dy = (gy / Math.max(0.001, gd)) + rep.fy * REPEL_K;
    const rawWant = Math.atan2(dy, dx);

    // dt-correct low-pass so the filter behaves the same across frame rates.
    const TAU = 0.18;
    const alpha = 1 - Math.exp(-dt / TAU);
    const dTarget = wrap(rawWant - desiredTh);
    desiredTh = wrap(desiredTh + dTarget * alpha);

    const dth = wrap(desiredTh - robot.th);
    robot.w = Math.max(-1.4, Math.min(1.4, dth * 1.7));

    // Forward speed strongly gated by heading error — turn first, drive second.
    // Zero forward speed past ~50° error prevents nose-into-wall wobble.
    let v = 1.0 * Math.max(0, Math.cos(dth));
    if(Math.abs(dth) > 0.9) v = 0;

    // Slow down only when the direction we're actually going is close to
    // a wall. Use a lookahead point instead of the robot center, so a wall
    // 0.7 m to the side doesn't throttle us when we're heading past it.
    const look = 0.45;
    const px = robot.x + Math.cos(robot.th) * look;
    const py = robot.y + Math.sin(robot.th) * look;
    const nwAhead = nearestWall(px, py);
    const clear = ROBOT_R + WALL_PAD;
    if(nwAhead < SLOW_R){
      const scale = Math.max(0, (nwAhead - clear) / (SLOW_R - clear));
      v *= scale;
    }

    // ESCAPE: when the forward path is genuinely blocked, override the
    // potential-field command with a rotation toward whichever side has
    // more clearance. Breaks local minima where goal and repulsion cancel
    // along the robot's heading.
    if(nwAhead < clear + 0.05){
      const SIDE = 0.7;        // rad, check clearance this far off-axis
      const pxL = robot.x + Math.cos(robot.th + SIDE) * look;
      const pyL = robot.y + Math.sin(robot.th + SIDE) * look;
      const pxR = robot.x + Math.cos(robot.th - SIDE) * look;
      const pyR = robot.y + Math.sin(robot.th - SIDE) * look;
      const nwL = nearestWall(pxL, pyL);
      const nwR = nearestWall(pxR, pyR);
      robot.w  = (nwL > nwR ? +1 : -1) * 1.3;
      desiredTh = robot.th + (nwL > nwR ? +SIDE : -SIDE); // nudge the filter
      v = 0;
    }
    robot.v = v;

    // Circling escape: if robot has rotated a lot without making progress
    // toward the goal, force the next waypoint.
    rotAccum += Math.abs(robot.w) * dt;
    if(gd < lastGD - 0.01) rotAccum = Math.max(0, rotAccum - 0.5); // progress credit
    lastGD = gd;
    if(rotAccum > Math.PI * 3){
      wpI = (wpI + 1) % waypoints.length;
      rotAccum = 0; lastGD = Infinity;
    }

    // Candidate next pose; reject if it would enter a wall
    const nx = robot.x + Math.cos(robot.th) * robot.v * dt;
    const ny = robot.y + Math.sin(robot.th) * robot.v * dt;
    if(!inCollision(nx, ny)){
      robot.x = nx; robot.y = ny;
      stuckTimer = 0;
    } else {
      // blocked — try sliding along each world axis independently
      const nx2 = robot.x + Math.cos(robot.th) * robot.v * dt;
      const ny2 = robot.y;
      if(!inCollision(nx2, ny2)){ robot.x = nx2; }
      else {
        const nx3 = robot.x;
        const ny3 = robot.y + Math.sin(robot.th) * robot.v * dt;
        if(!inCollision(nx3, ny3)) robot.y = ny3;
      }
      robot.v = 0;
      stuckTimer += dt;
      // if we've been pinned to a wall for >1.5 s, skip to the next waypoint
      if(stuckTimer > 1.5){ wpI = (wpI + 1) % waypoints.length; stuckTimer = 0; }
    }
    robot.th = wrap(robot.th + robot.w * dt);
  }

  function lidarScan(){
    const beams = new Array(BEAMS);
    for(let i=0; i<BEAMS; i++){
      const rel = -Math.PI + (i/BEAMS) * 2*Math.PI;   // body-frame bearing
      const a   = robot.th + rel;                     // world bearing (truth)
      const r   = raycast(robot.x, robot.y, Math.cos(a), Math.sin(a), MAX_R);
      beams[i] = { rel, a, r: r + (Math.random()-0.5)*0.04 };
    }
    return beams;
  }

  function drawBeams(beams){
    for(let i=0; i<BEAMS; i++){
      const b = beams[i];
      const ex = robot.x + Math.cos(b.a) * b.r;
      const ey = robot.y + Math.sin(b.a) * b.r;
      rayPos[i*6+0]=robot.x; rayPos[i*6+1]=0.05; rayPos[i*6+2]=robot.y;
      rayPos[i*6+3]=ex;      rayPos[i*6+4]=0.05; rayPos[i*6+5]=ey;
      endPos[i*3+0]=ex; endPos[i*3+1]=0.06; endPos[i*3+2]=ey;
    }
    rayGeo.attributes.position.needsUpdate = true;
    endGeo.attributes.position.needsUpdate = true;
  }

  function pfPredict(dt){
    for(const p of particles){
      const v = robot.v + (Math.random()-0.5) * 0.2;
      const w = robot.w + (Math.random()-0.5) * 0.3;
      p.x += Math.cos(p.th) * v * dt;
      p.y += Math.sin(p.th) * v * dt;
      p.th = wrap(p.th + w * dt);
    }
  }

  function pfWeight(beams){
    const K = 18;
    const sub = new Array(K);
    for(let i=0; i<K; i++) sub[i] = beams[Math.floor(i * BEAMS / K)];
    const sigma = 0.4;
    let wSum = 0;
    for(const p of particles){
      let logw = 0;
      for(const b of sub){
        const a = p.th + b.rel;
        const predR = raycast(p.x, p.y, Math.cos(a), Math.sin(a), MAX_R);
        const diff = predR - b.r;
        logw += -(diff*diff) / (2*sigma*sigma);
      }
      p.w = Math.exp(logw / 4);  // temperature softens collapse
      wSum += p.w;
    }
    if(wSum < 1e-20){ for(const p of particles) p.w = 1/NP; }
    else            { for(const p of particles) p.w /= wSum; }
  }

  function pfResampleIfNeeded(){
    let sqw = 0;
    for(const p of particles) sqw += p.w*p.w;
    const Neff = 1 / sqw;
    if(Neff > NP * 0.5) return;
    const stepW = 1/NP;
    let u = Math.random() * stepW;
    let c = particles[0].w, i = 0;
    const out = new Array(NP);
    for(let m=0; m<NP; m++){
      while(u > c && i < NP-1){ i++; c += particles[i].w; }
      const s = particles[i];
      out[m] = {
        x:  s.x  + (Math.random()-0.5)*0.025,
        y:  s.y  + (Math.random()-0.5)*0.025,
        th: wrap(s.th + (Math.random()-0.5)*0.012),
        w:  1/NP
      };
      u += stepW;
    }
    particles = out;
    resamples++;
  }

  function pfMean(){
    let mx=0, my=0, ss=0, cc=0;
    for(const p of particles){ mx+=p.x*p.w; my+=p.y*p.w; ss+=Math.sin(p.th)*p.w; cc+=Math.cos(p.th)*p.w; }
    return { x: mx, y: my, th: Math.atan2(ss, cc) };
  }
  function pfCov(m){
    let sxx=0, sxy=0, syy=0, sth=0;
    for(const p of particles){
      const dx=p.x-m.x, dy=p.y-m.y, dth=wrap(p.th-m.th);
      sxx += p.w*dx*dx; sxy += p.w*dx*dy; syy += p.w*dy*dy; sth += p.w*dth*dth;
    }
    return [sxx, sxy, syy, sth];
  }

  function ekfPredict(dt){
    const v = robot.v, w = robot.w, th = ekf.th;
    ekf.x += Math.cos(th) * v * dt;
    ekf.y += Math.sin(th) * v * dt;
    ekf.th = wrap(ekf.th + w * dt);
    const F = [
      [1, 0, -Math.sin(th) * v * dt],
      [0, 1,  Math.cos(th) * v * dt],
      [0, 0, 1]
    ];
    const Q = [[0.015,0,0],[0,0.015,0],[0,0,0.008]];
    ekf.P = m3.add(m3.mul(m3.mul(F, ekf.P), m3.T(F)), Q);
  }
  function ekfUpdate(z, R){
    const S  = m3.add(ekf.P, R);              // H = I, so S = P + R
    const K  = m3.mul(ekf.P, m3.inv(S));
    lastK = K;
    const y  = [ z.x - ekf.x, z.y - ekf.y, wrap(z.th - ekf.th) ];
    ekf.x  += K[0][0]*y[0] + K[0][1]*y[1] + K[0][2]*y[2];
    ekf.y  += K[1][0]*y[0] + K[1][1]*y[1] + K[1][2]*y[2];
    ekf.th  = wrap(ekf.th + K[2][0]*y[0] + K[2][1]*y[1] + K[2][2]*y[2]);
    ekf.P  = m3.mul(m3.sub(I3, K), ekf.P);
  }

  function drawParticles(){
    for(let i=0; i<NP; i++){
      pPos[i*3+0] = particles[i].x;
      pPos[i*3+1] = 0.04;
      pPos[i*3+2] = particles[i].y;
    }
    pGeo.attributes.position.needsUpdate = true;
  }

  function drawEllipse(){
    const a = ekf.P[0][0], b = ekf.P[0][1], c = ekf.P[1][1];
    const tr = a + c, det = a*c - b*b;
    const disc = Math.max(0, tr*tr/4 - det);
    const lam1 = tr/2 + Math.sqrt(disc);
    const lam2 = tr/2 - Math.sqrt(disc);
    const ang  = Math.atan2(2*b, a - c) / 2;
    const s1 = 2.0 * Math.sqrt(Math.max(1e-4, lam1));
    const s2 = 2.0 * Math.sqrt(Math.max(1e-4, lam2));
    for(let i=0; i<=ELL_N; i++){
      const t = (i/ELL_N) * Math.PI * 2;
      const ex = Math.cos(t)*s1, ey = Math.sin(t)*s2;
      const rx = ex*Math.cos(ang) - ey*Math.sin(ang);
      const ry = ex*Math.sin(ang) + ey*Math.cos(ang);
      ellPos[i*3+0] = ekf.x + rx;
      ellPos[i*3+1] = 0.07;
      ellPos[i*3+2] = ekf.y + ry;
    }
    ellGeo.attributes.position.needsUpdate = true;
    ekfMark.position.set(ekf.x, 0.07, ekf.y);
  }

  // ---- bootstrap
  makeWorld();

  const hud = container.__hud;
  const math = container.querySelector?.('.slam-math');

  const stop = rafLoop((dt) => {
    dt = Math.min(0.05, dt);
    driveWaypoint(dt);
    const beams = lidarScan();
    drawBeams(beams);

    pfPredict(dt);
    if(step % 2 === 0) pfWeight(beams);      // throttle the expensive step
    pfResampleIfNeeded();
    drawParticles();

    const mean = pfMean();
    integrateScan(mean.x, mean.y, mean.th, beams, MAX_R);
    if(step % 3 === 0) redrawMap();

    ekfPredict(dt);
    const [sxx, sxy, syy, sth] = pfCov(mean);
    const R = [
      [Math.max(0.01, sxx), sxy,                  0],
      [sxy,                 Math.max(0.01, syy),  0],
      [0,                   0,                    Math.max(0.005, sth)]
    ];
    ekfUpdate(mean, R);
    drawEllipse();

    body.position.set(robot.x, 0.09, robot.y);
    body.rotation.y = -robot.th;
    nose.position.set(robot.x + Math.cos(robot.th)*0.3, 0.19, robot.y + Math.sin(robot.th)*0.3);
    nose.rotation.y = -robot.th;

    step++;
    if(hud && step % 4 === 0){
      const sig = Math.sqrt(ekf.P[0][0] + ekf.P[1][1]).toFixed(3);
      const err = Math.hypot(ekf.x - robot.x, ekf.y - robot.y).toFixed(3);
      hud.innerHTML = `${BEAMS} beams · ${NP} particles · σ<sub>xy</sub> ${sig} m · err ${err} m · resample ${resamples}`;
    }
    if(math && step % 6 === 0){
      const fmt = v => v.toFixed(3);
      const sx = Math.sqrt(ekf.P[0][0]), sy = Math.sqrt(ekf.P[1][1]), st_ = Math.sqrt(ekf.P[2][2]);
      const Kn = Math.sqrt(lastK[0][0]*lastK[0][0] + lastK[1][1]*lastK[1][1]);
      math.querySelector('[data-p]').textContent =
        `σx ${fmt(sx)}  σy ${fmt(sy)}  σθ ${fmt(st_)}`;
      math.querySelector('[data-k]').textContent =
        `‖K‖ ${fmt(Kn)}   Nₑff ${fmt(1/particles.reduce((a,p)=>a+p.w*p.w, 0))}`;
    }

    renderer.render(scene, camera);
  });

  resizeObserver(container, (w, h) => {
    renderer.setSize(w, h, false);
    camera = ortho();
    camera.position.set(10, 12, 10); camera.lookAt(0, 0, 0);
  });

  return {
    destroy(){ stop(); renderer.dispose(); renderer.domElement.remove(); },
    randomize(){ makeWorld(); },
    reset(){ resetMap(); resetBelief(); }
  };
};
