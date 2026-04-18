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
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  // simple 2-link CCD on j2..j5 in XY plane for pleasing motion
  // For hero we just use a heuristic: aim the base, tilt the arm to reach.
  const L1 = 1.4, L2 = 1.1, L3 = 0.7;

  function solveAngles(dx, dy){
    // base yaw towards target x,z
    const yaw = Math.atan2(dx.x, dx.z);
    // planar distance r in the yaw plane
    const r = Math.sqrt(dx.x*dx.x + dx.z*dx.z);
    const h = dx.y - 0.44; // from j2 origin
    const d = Math.min(Math.sqrt(r*r + h*h), L1 + L2 + L3 - 0.1);
    // two-link IK using L1+L3 combined
    const La = L1;
    const Lb = L2 + L3;
    const cos2 = Math.max(-1, Math.min(1, (d*d - La*La - Lb*Lb)/(2*La*Lb)));
    const a2 = Math.acos(cos2);
    const a1 = Math.atan2(h, r) - Math.atan2(Lb*Math.sin(a2), La + Lb*Math.cos(a2));
    return { yaw, a1, a2 };
  }

  let smoothed = { yaw: 0, a1: 0, a2: 0 };

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

    const ang = solveAngles(target.position, target.position);
    smoothed.yaw += (ang.yaw - smoothed.yaw)*0.1;
    smoothed.a1 += (ang.a1 - smoothed.a1)*0.1;
    smoothed.a2 += (ang.a2 - smoothed.a2)*0.1;

    j1.rotation.y = smoothed.yaw;
    // j2 is shoulder pitch
    j2.rotation.x = -smoothed.a1;
    j3.rotation.x = -smoothed.a2;
    j4.rotation.x = smoothed.a1*0.3;
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

    // attitude from lateral acceleration (banked turns)
    const bankZ = -state.vel.x * 0.18;
    const bankX = state.vel.z * 0.18;
    state.att.z += (bankZ - state.att.z)*0.1;
    state.att.x += (bankX - state.att.x)*0.1;
    state.att.y += (Math.atan2(state.vel.x, state.vel.z) - state.att.y)*0.05;

    quad.position.copy(state.pos);
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
// Isometric manipulator on table with IK to draggable target
// ==================================================
SIMS.manip = function(container){
  const scene = new THREE.Scene();
  const rect = container.getBoundingClientRect();
  const renderer = makeRenderer(container);
  renderer.setSize(rect.width, rect.height, false);

  // isometric ortho camera
  const cam = () => {
    const r = container.getBoundingClientRect();
    const aspect = r.width/r.height;
    const sz = 6;
    return new THREE.OrthographicCamera(-sz*aspect/2, sz*aspect/2, sz/2, -sz/2, -50, 50);
  };
  let camera = cam();
  camera.position.set(8, 8, 8);
  camera.lookAt(0, 1, 0);

  standardLights(scene);

  // table
  const table = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.2, 2.8),
    new THREE.MeshStandardMaterial({ color: C.bg2 })
  );
  top.position.y = 1.0; top.castShadow = true; top.receiveShadow = true;
  table.add(top);
  const topRim = new THREE.Mesh(
    new THREE.BoxGeometry(4.2+0.06, 0.02, 2.8+0.06),
    new THREE.MeshBasicMaterial({ color: C.ink })
  );
  topRim.position.y = 1.12; table.add(topRim);

  [[-2,1,-1.2], [2,1,-1.2], [-2,1,1.2], [2,1,1.2]].forEach(([x,y,z])=>{
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 1.0, 0.14),
      new THREE.MeshStandardMaterial({ color: C.ink })
    );
    leg.position.set(x, y-0.5, z); leg.castShadow = true;
    table.add(leg);
  });
  scene.add(table);

  // ground (shadow catcher)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: C.bg, roughness: 1 })
  );
  ground.rotation.x = -Math.PI/2; ground.receiveShadow = true;
  scene.add(ground);

  // grid on table surface
  const gh = new THREE.GridHelper(4, 8, C.hair, C.hair);
  gh.position.y = 1.101; scene.add(gh);
  gh.scale.z = 2.8/4;

  // ============================================================
  // Arm: rotating base (j0) + shoulder pitch (j1) + elbow pitch (j2) + wrist pitch (j3) + gripper
  //
  // Convention: base axis = Y. In j1 local frame, arm "forward" is +Z and "up" is +Y.
  // Planar 2R IK solved in (r, h) where r is radial distance in XZ from base, h is height
  // above shoulder pivot. Wrist is commanded to keep end-effector pointing straight down.
  // ============================================================
  const base = new THREE.Group();
  const BASE_POS = new THREE.Vector3(-1.4, 1.1, 0);
  base.position.copy(BASE_POS);
  scene.add(base);

  const mat = (c)=> new THREE.MeshStandardMaterial({ color: c, roughness:0.6, metalness:0.1});
  function bx(w,h,d,m){ const g=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m); g.castShadow=true; g.receiveShadow=true; return g;}
  function cy(r,h,m){ const g=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20), m); g.castShadow=true; return g;}

  // base plate
  const basePuck = cy(0.22, 0.14, mat(C.forest)); basePuck.position.y = 0.07; base.add(basePuck);

  // j0 yaw pivot (rotates around Y)
  const j0 = new THREE.Group(); base.add(j0); j0.position.y = 0.14;
  const j0m = cy(0.14, 0.18, mat(C.yellow)); j0m.position.y = 0.09; j0.add(j0m);

  // j1 shoulder pitch (rotates around X) -- upper arm extends forward along +Z when angle positive
  const SHOULDER_H = 0.18;
  const j1 = new THREE.Group(); j0.add(j1); j1.position.y = SHOULDER_H;
  // Upper arm = link from j1 forward to j2, length L1. Draw along +Z in j1's local frame.
  const L1 = 0.8;
  const upper = bx(0.12, 0.12, L1, mat(C.ink)); upper.position.z = L1/2; j1.add(upper);

  // j2 elbow (rotates around X), located at end of upper arm
  const j2 = new THREE.Group(); j1.add(j2); j2.position.z = L1;
  const j2m = cy(0.1, 0.14, mat(C.yellow)); j2m.rotation.z = Math.PI/2; j2.add(j2m);
  // forearm length L2
  const L2 = 0.65;
  const fore = bx(0.1, 0.1, L2, mat(C.ink)); fore.position.z = L2/2; j2.add(fore);

  // j3 wrist (rotates around X), at end of forearm
  const j3 = new THREE.Group(); j2.add(j3); j3.position.z = L2;
  const j3m = cy(0.08, 0.1, mat(C.yellow)); j3m.rotation.z = Math.PI/2; j3.add(j3m);
  // gripper palm (pointing along +Z in wrist frame, offset = L3)
  const L3 = 0.22;
  const palm = bx(0.14, 0.14, L3, mat(C.ink)); palm.position.z = L3/2; j3.add(palm);
  // two fingers that open along X
  const FINGER_LEN = 0.14;
  const fingerMat = mat(C.red);
  const g1 = bx(0.04, 0.12, FINGER_LEN, fingerMat); g1.position.set(0.08, 0, L3 + FINGER_LEN/2); j3.add(g1);
  const g2 = bx(0.04, 0.12, FINGER_LEN, fingerMat); g2.position.set(-0.08, 0, L3 + FINGER_LEN/2); j3.add(g2);

  // end-effector reference point (tip center between fingers)
  const EE_OFFSET_Z = L3 + FINGER_LEN;
  const eeMarker = new THREE.Object3D();
  eeMarker.position.z = EE_OFFSET_Z;
  j3.add(eeMarker);

  // target cube
  const CUBE_H = 0.22;
  const TABLE_TOP_Y = 1.1 + 0.1; // table top face y
  const target = new THREE.Mesh(
    new THREE.BoxGeometry(CUBE_H, CUBE_H, CUBE_H),
    mat(C.yellow)
  );
  target.castShadow = true;
  target.position.set(0.6, TABLE_TOP_Y + CUBE_H/2, 0.4);
  scene.add(target);
  const bullseye = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.09, 24),
    new THREE.MeshBasicMaterial({ color: C.ink, side: THREE.DoubleSide })
  );
  bullseye.rotation.x = -Math.PI/2;
  bullseye.position.y = CUBE_H/2 + 0.002;
  target.add(bullseye);

  // drop zone (where we place the cube when holding)
  const dropZone = new THREE.Mesh(
    new THREE.RingGeometry(0.16, 0.2, 32),
    new THREE.MeshBasicMaterial({ color: C.forest, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
  );
  dropZone.rotation.x = -Math.PI/2;
  dropZone.position.set(-0.4, TABLE_TOP_Y + 0.002, -0.7);
  scene.add(dropZone);

  // static clutter
  function clutter(pos, col, sh){
    const geo = sh==="sphere" ? new THREE.SphereGeometry(0.11, 16, 16) :
                sh==="cyl" ? new THREE.CylinderGeometry(0.09, 0.09, 0.2, 16) :
                new THREE.BoxGeometry(0.18,0.18,0.18);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col }));
    m.position.copy(pos); m.castShadow = true; scene.add(m);
  }
  clutter(new THREE.Vector3(1.6, TABLE_TOP_Y + 0.1, -0.3), C.moss, "sphere");
  clutter(new THREE.Vector3(0.2, TABLE_TOP_Y + 0.1, -0.8), C.forest, "cyl");

  // ============================================================
  // IK: given a desired end-effector world position, solve j0 yaw
  // and 2R angles (j1, j2) such that the tip reaches it with wrist
  // pointing straight down.
  //
  // In j0's local frame (after yaw), j1 is at height SHOULDER_H above the base,
  // and the arm extends in the r-h plane where r = sqrt(x^2 + z^2) from base.
  // With wrist pointing down, j3 origin = target + (0, EE_OFFSET_Z, 0).
  // So we solve 2R IK to put j3 origin at (r_wrist, h_wrist).
  // ============================================================
  const angles = { j0: 0, j1: 0, j2: 0, j3: 0 };
  const target_angles = { j0: 0, j1: 0.3, j2: -0.6, j3: 0 };

  function solveIK(worldTarget){
    // transform to base-local frame
    const t = worldTarget.clone().sub(BASE_POS);
    // yaw so arm faces target in XZ
    const yaw = Math.atan2(t.x, t.z);
    // wrist-pointing-down offset: wrist origin should be directly above tip by EE_OFFSET_Z
    const wristX = t.x;
    const wristY = t.y + EE_OFFSET_Z; // tip points -Y (down), so wrist is above
    const wristZ = t.z;
    // radial & height in j1's local frame (j1 origin is at y=SHOULDER_H+BASE_PUCK_TOP above base)
    const BASE_TOP = 0.14; // basePuck height
    const r = Math.hypot(wristX, wristZ);
    const h = wristY - (BASE_TOP + SHOULDER_H);
    // distance from j1 to wrist
    let d = Math.hypot(r, h);
    const reach = L1 + L2 - 0.01;
    const reachable = d <= reach;
    if(d > reach) d = reach;
    // law of cosines: elbow angle (interior)
    const cosElbow = Math.max(-1, Math.min(1, (L1*L1 + L2*L2 - d*d) / (2*L1*L2)));
    const elbow = Math.acos(cosElbow); // interior angle at elbow
    // we want elbow-up => j2 angle is negative (bending back)
    const j2Angle = -(Math.PI - elbow); // bend inward
    // shoulder angle: alpha = atan2(h, r) points from j1 to wrist; beta is triangle interior at shoulder
    const alpha = Math.atan2(h, r);
    const cosBeta = Math.max(-1, Math.min(1, (L1*L1 + d*d - L2*L2) / (2*L1*d)));
    const beta = Math.acos(cosBeta);
    // The arm's neutral (j1=0) is along +Z (horizontal forward). To reach angle `alpha` above horizontal
    // with elbow up, shoulder pitch j1 = alpha + beta. But because we're rotating around X,
    // a positive j1 rotation tips the arm DOWN (since +Z rotates toward -Y under +X rotation).
    // So use j1 = -(alpha + beta) to tip up.
    const j1Angle = -(alpha + beta);
    // wrist must total to -PI/2 (pointing down = along -Y in world = -Y in shoulder frame after arm bends)
    // Sum of pitches after j3 = j1 + j2 + j3. We want j1+j2+j3 = -PI/2.
    const j3Angle = -Math.PI/2 - j1Angle - j2Angle;
    return { j0: yaw, j1: j1Angle, j2: j2Angle, j3: j3Angle, reachable };
  }

  // ============================================================
  // Pick-and-place state machine
  //   IDLE        — arm rests above home
  //   APPROACH    — move EE above cube (pre-grasp height)
  //   DESCEND     — lower onto cube
  //   GRASP       — close fingers, attach cube to gripper
  //   LIFT        — raise cube up
  //   MOVE        — carry toward drop zone (pre-place height)
  //   PLACE       — lower cube to drop zone
  //   RELEASE     — open fingers, detach cube
  //   RETREAT     — lift and return home
  // ============================================================
  const STATE = {
    IDLE: "idle", APPROACH: "approach", DESCEND: "descend",
    GRASP: "grasp", LIFT: "lift", MOVE: "move",
    PLACE: "place", RELEASE: "release", RETREAT: "retreat",
  };
  const fsm = {
    state: STATE.APPROACH,
    timer: 0,
    holding: false,
  };
  const HOME = new THREE.Vector3(BASE_POS.x + 0.0, TABLE_TOP_Y + 0.7, BASE_POS.z + 0.7);
  const PRE_GRASP_DZ = 0.28; // height above cube top to hover
  const gripperOpen = { v: 0.08 };
  const gripperOpenTarget = { v: 0.08 };
  // effective EE world position used by IK
  const eeCmd = new THREE.Vector3().copy(HOME);

  function fsmStep(dt){
    fsm.timer += dt;
    const cubeTop = target.position.clone();
    cubeTop.y = TABLE_TOP_Y + CUBE_H + 0.002; // just above cube top
    const preGrasp = cubeTop.clone(); preGrasp.y += PRE_GRASP_DZ;
    const grasp = cubeTop.clone(); grasp.y = TABLE_TOP_Y + CUBE_H*0.55; // around cube middle
    const dropTop = dropZone.position.clone(); dropTop.y = TABLE_TOP_Y + CUBE_H*0.55;
    const preDrop = dropTop.clone(); preDrop.y += PRE_GRASP_DZ;

    let cmd = eeCmd.clone();
    let nearEnough = (t, tol=0.04)=> eeCmd.distanceTo(t) < tol;

    switch(fsm.state){
      case STATE.IDLE:
        cmd = HOME;
        if(fsm.timer > 0.5){ fsm.state = STATE.APPROACH; fsm.timer = 0;}
        break;
      case STATE.APPROACH:
        cmd = preGrasp; gripperOpenTarget.v = 0.09;
        if(nearEnough(preGrasp, 0.03)){ fsm.state = STATE.DESCEND; fsm.timer = 0;}
        break;
      case STATE.DESCEND:
        cmd = grasp; gripperOpenTarget.v = 0.09;
        if(nearEnough(grasp, 0.03)){ fsm.state = STATE.GRASP; fsm.timer = 0;}
        break;
      case STATE.GRASP:
        cmd = grasp;
        gripperOpenTarget.v = 0.04; // close
        if(fsm.timer > 0.35){ fsm.holding = true; fsm.state = STATE.LIFT; fsm.timer = 0;}
        break;
      case STATE.LIFT:
        cmd = preGrasp; gripperOpenTarget.v = 0.04;
        if(nearEnough(preGrasp, 0.04)){ fsm.state = STATE.MOVE; fsm.timer = 0;}
        break;
      case STATE.MOVE:
        cmd = preDrop; gripperOpenTarget.v = 0.04;
        if(nearEnough(preDrop, 0.04)){ fsm.state = STATE.PLACE; fsm.timer = 0;}
        break;
      case STATE.PLACE:
        cmd = dropTop; gripperOpenTarget.v = 0.04;
        if(nearEnough(dropTop, 0.03)){ fsm.state = STATE.RELEASE; fsm.timer = 0;}
        break;
      case STATE.RELEASE:
        cmd = dropTop; gripperOpenTarget.v = 0.09;
        if(fsm.timer > 0.3){
          fsm.holding = false;
          // detach cube into world at drop zone
          target.position.set(dropZone.position.x, TABLE_TOP_Y + CUBE_H/2, dropZone.position.z);
          // choose a new random drop zone for next cycle
          const dx = (Math.random()-0.5)*1.8;
          const dz = (Math.random()-0.5)*1.6;
          dropZone.position.set(dx, TABLE_TOP_Y + 0.002, dz);
          fsm.state = STATE.RETREAT; fsm.timer = 0;
        }
        break;
      case STATE.RETREAT:
        cmd = preDrop; gripperOpenTarget.v = 0.09;
        if(nearEnough(preDrop, 0.05)){ fsm.state = STATE.APPROACH; fsm.timer = 0;}
        break;
    }
    // smooth EE command
    eeCmd.lerp(cmd, Math.min(1, dt * 5.0));
    // smooth gripper
    gripperOpen.v += (gripperOpenTarget.v - gripperOpen.v) * Math.min(1, dt * 8.0);
  }

  // If user is dragging the target, pause the FSM and track directly
  let userHolding = false;
  function setToApproachOnRelease(){
    // When user drops the cube, restart the cycle cleanly
    fsm.holding = false;
    fsm.state = STATE.APPROACH;
    fsm.timer = 0;
  }

  // Drag target (ONLY when user clicks it — never auto-moves)
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let dragging = false;
  function updatePointer(e){
    const r = container.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left)/r.width)*2 - 1;
    pointer.y = -(((e.clientY - r.top)/r.height)*2 - 1);
  }
  container.addEventListener("pointerdown", (e)=>{
    updatePointer(e);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(target, true);
    if(hit.length){
      dragging = true;
      // if the arm was holding the cube, let user take it
      fsm.holding = false;
    }
  });
  container.addEventListener("pointermove", (e)=>{
    if(!dragging) return;
    updatePointer(e);
    raycaster.setFromCamera(pointer, camera);
    const p = new THREE.Vector3();
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0), -(TABLE_TOP_Y + CUBE_H/2)), p);
    if(p){
      target.position.x = Math.max(-1.85, Math.min(1.85, p.x));
      target.position.z = Math.max(-1.22, Math.min(1.22, p.z));
      target.position.y = TABLE_TOP_Y + CUBE_H/2;
    }
  });
  container.addEventListener("pointerup", ()=>{
    if(dragging){ dragging = false; setToApproachOnRelease(); }
  });
  container.addEventListener("pointerleave", ()=>{
    if(dragging){ dragging = false; setToApproachOnRelease(); }
  });

  const stop = rafLoop((dt, t)=>{
    if(!dragging) fsmStep(dt);

    // If arm is holding, cube follows end-effector
    // We'll set after IK below.

    // Solve IK for current ee command
    const ik = solveIK(eeCmd);
    // smooth angles
    const k = Math.min(1, dt * 6.0);
    angles.j0 += (ik.j0 - angles.j0) * k;
    angles.j1 += (ik.j1 - angles.j1) * k;
    angles.j2 += (ik.j2 - angles.j2) * k;
    angles.j3 += (ik.j3 - angles.j3) * k;

    j0.rotation.y = angles.j0;
    j1.rotation.x = angles.j1;
    j2.rotation.x = angles.j2;
    j3.rotation.x = angles.j3;

    // gripper open
    g1.position.x = gripperOpen.v;
    g2.position.x = -gripperOpen.v;

    // If holding, snap cube to tip
    if(fsm.holding){
      const tip = new THREE.Vector3();
      eeMarker.getWorldPosition(tip);
      target.position.copy(tip);
      target.position.y -= CUBE_H/2 * 0.0 - 0.0; // keep at tip
      // orient cube upright
      target.rotation.set(0, angles.j0, 0);
    } else {
      // not holding — cube is sitting on the table
      target.position.y = TABLE_TOP_Y + CUBE_H/2;
      target.rotation.set(0, 0, 0);
    }

    if(container.__hud){
      const tip = new THREE.Vector3(); eeMarker.getWorldPosition(tip);
      const d = tip.distanceTo(target.position);
      container.__hud.textContent = `${fsm.state} · ee Δ ${d.toFixed(2)}m · yaw ${(angles.j0*57.3).toFixed(0)}°${ik.reachable ? "" : " · OOR"}`;
    }
    renderer.render(scene, camera);
  });

  resizeObserver(container, (w,h)=>{
    renderer.setSize(w,h,false);
    const aspect = w/h;
    const sz = 6;
    camera.left = -sz*aspect/2; camera.right = sz*aspect/2;
    camera.top = sz/2; camera.bottom = -sz/2;
    camera.updateProjectionMatrix();
  });

  return { destroy(){ stop(); renderer.dispose(); renderer.domElement.remove(); } };
};
