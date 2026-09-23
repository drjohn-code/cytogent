/* Cytogent — signature hero object.
   A cell-like form built from thousands of tiny metallic flakes, back-lit warm.
   Hand-written WebGL2: one instanced draw call, ~9k flakes, no library.
   Falls back silently to the static poster when WebGL is unavailable. */
(function () {
  'use strict';

  var VERT = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 aQuad;',
    'in vec3 aBase;',
    'in vec3 aScatter;',
    'in vec3 aAxis;',
    'in vec4 aMeta;',            // x size, y phase, z colour index, w spin speed
    'in vec2 aTint;',            // x brightness, y sparkle
    'uniform mat4 uProj;',
    'uniform mat4 uView;',
    'uniform float uTime;',
    'uniform float uDisperse;',
    'uniform float uBreathe;',
    'out vec3 vCol;',
    'out float vGlow;',
    'out vec2 vUv;',
    'vec3 pal(float i){',
    '  if(i<1.0) return vec3(0.976,0.894,0.729);',   // champagne
    '  if(i<2.0) return vec3(0.902,0.733,0.400);',   // pale gold
    '  if(i<3.0) return vec3(0.741,0.478,0.196);',   // bronze
    '  return vec3(0.851,0.835,0.788);',             // silver
    '}',
    'mat3 rot(vec3 a, float ang){',
    '  float c=cos(ang), s=sin(ang), t=1.0-c;',
    '  return mat3(t*a.x*a.x+c, t*a.x*a.y+s*a.z, t*a.x*a.z-s*a.y,',
    '              t*a.x*a.y-s*a.z, t*a.y*a.y+c, t*a.y*a.z+s*a.x,',
    '              t*a.x*a.z+s*a.y, t*a.y*a.z-s*a.x, t*a.z*a.z+c);',
    '}',
    'void main(){',
    '  vUv = aQuad;',
    '  float d = uDisperse;',
    '  vec3 home = aBase * uBreathe;',
    '  vec3 pos = mix(home, aScatter, d*d);',
    // whole-object slow turn
    '  float ya = uTime*0.055;',
    '  float ca=cos(ya), sa=sin(ya);',
    '  pos = vec3(pos.x*ca + pos.z*sa, pos.y, -pos.x*sa + pos.z*ca);',
    // per-flake orientation
    '  mat3 R = rot(normalize(aAxis), aMeta.y + uTime*aMeta.w);',
    '  vec3 N = R * vec3(0.0,0.0,1.0);',
    '  float size = aMeta.x * (1.0 + d*0.35);',
    '  vec3 local = R * vec3(aQuad*vec2(size, size*0.52), 0.0);',
    '  vec4 mv = uView * vec4(pos + local, 1.0);',
    '  gl_Position = uProj * mv;',
    // lighting: warm key from behind-upper-left, cool fill from front
    '  vec3 V = normalize(-(uView * vec4(pos,1.0)).xyz);',
    '  vec3 L = normalize(vec3(-0.55, 0.72, -0.62));',
    '  vec3 Nv = normalize(mat3(uView) * N);',
    '  float lam = max(dot(Nv, L), 0.0);',
    '  vec3 H = normalize(L + V);',
    '  float spec = pow(max(dot(Nv, H), 0.0), 34.0);',
    '  float rim = pow(1.0 - abs(dot(Nv, V)), 2.4);',
    '  vec3 base = pal(aMeta.z);',
    '  float lum = (0.09 + lam*0.46 + spec*2.6*aTint.y + rim*0.42) * aTint.x;',
    '  vCol = base * lum;',
    '  vGlow = (0.30 + spec*1.15*aTint.y) * (1.0 - d*0.72);',
    '}'
  ].join('\n');

  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vCol;',
    'in float vGlow;',
    'in vec2 vUv;',
    'out vec4 o;',
    'void main(){',
    '  float r = dot(vUv, vUv);',
    '  if(r > 1.0) discard;',
    '  float a = smoothstep(1.0, 0.18, r);',
    '  o = vec4(vCol * a * vGlow * 3.0, a * vGlow);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; }
    return s;
  }

  // deterministic RNG so the object is identical on every load and in the poster
  function rng(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5; var r = t;
      r = Math.imul(r ^ (r >>> 15), r | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }

  function viewMatrix(tiltX, tiltY, dist) {
    var cx = Math.cos(tiltX), sx = Math.sin(tiltX);
    var cy = Math.cos(tiltY), sy = Math.sin(tiltY);
    // R = Rx * Ry, then translate by -dist on z
    var m = new Float32Array(16);
    m[0] = cy;        m[1] = sx * sy;   m[2] = -cx * sy;  m[3] = 0;
    m[4] = 0;         m[5] = cx;        m[6] = sx;        m[7] = 0;
    m[8] = sy;        m[9] = -sx * cy;  m[10] = cx * cy;  m[11] = 0;
    m[12] = 0;        m[13] = 0;        m[14] = -dist;    m[15] = 1;
    return m;
  }

  window.CytogentHero = function (canvas, opts) {
    opts = opts || {};
    var gl = null;
    try { gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' }); } catch (e) { gl = null; }
    if (!gl) { return null; }

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { return null; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { return null; }
    gl.useProgram(prog);

    var narrow = Math.min(window.innerWidth, window.innerHeight) < 720;
    var N = opts.count || (narrow ? 4600 : 9000);
    var r = rng(20260922);

    var base = new Float32Array(N * 3), scat = new Float32Array(N * 3);
    var axis = new Float32Array(N * 3), meta = new Float32Array(N * 4), tint = new Float32Array(N * 2);

    for (var i = 0; i < N; i++) {
      var u = r(), v = r(), w = r();
      // uniform direction on the sphere
      var z = 1 - 2 * u, rr = Math.sqrt(Math.max(0, 1 - z * z)), th = 2 * Math.PI * v;
      var dx = rr * Math.cos(th), dy = rr * Math.sin(th), dz = z;
      var rad, size, col, bright, spark, ox = 0, oy = 0;
      if (w < 0.50) {                       // membrane: a thin, bright shell
        rad = 0.975 + (r() - 0.5) * 0.055;
        size = 0.0090 + r() * 0.0110;
        col = r() < 0.52 ? 0 : (r() < 0.72 ? 1 : 3);
        bright = 1.06 + r() * 0.30;
        spark = 0.85 + r() * 0.75;
      } else if (w < 0.68) {                // nucleus: a dense, warm inner body
        rad = 0.30 * Math.cbrt(r());
        size = 0.0072 + r() * 0.0092;
        col = r() < 0.46 ? 1 : 2;
        bright = 0.92 + r() * 0.42;
        spark = 0.7 + r() * 0.8;
        ox = 0.12; oy = 0.07;
      } else {                              // cytoplasm: quiet organelle-scale drift
        rad = 0.36 + Math.pow(r(), 0.72) * 0.54;
        size = 0.0055 + r() * 0.0105;
        col = r() < 0.46 ? 2 : (r() < 0.74 ? 1 : 0);
        bright = 0.30 + r() * 0.34;
        spark = 0.25 + r() * 0.6;
      }
      base[i * 3] = dx * rad + ox; base[i * 3 + 1] = dy * rad + oy; base[i * 3 + 2] = dz * rad;

      // where the flake goes when the object loosens on scroll
      var spread = 1.5 + r() * 2.4;
      scat[i * 3] = dx * rad * spread + (r() - 0.5) * 0.7;
      scat[i * 3 + 1] = dy * rad * spread - 0.5 - r() * 1.3;
      scat[i * 3 + 2] = dz * rad * spread + (r() - 0.5) * 0.7;

      var ax = r() * 2 - 1, ay = r() * 2 - 1, az = r() * 2 - 1;
      var len = Math.hypot(ax, ay, az) || 1;
      axis[i * 3] = ax / len; axis[i * 3 + 1] = ay / len; axis[i * 3 + 2] = az / len;

      meta[i * 4] = size;
      meta[i * 4 + 1] = r() * Math.PI * 2;
      meta[i * 4 + 2] = col;
      meta[i * 4 + 3] = 0.10 + r() * 0.34;
      tint[i * 2] = bright; tint[i * 2 + 1] = spark;
    }

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    function buf(data, loc, size, divisor) {
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      var l = gl.getAttribLocation(prog, loc);
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
      if (divisor) { gl.vertexAttribDivisor(l, 1); }
    }
    buf(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), 'aQuad', 2, 0);
    buf(base, 'aBase', 3, 1);
    buf(scat, 'aScatter', 3, 1);
    buf(axis, 'aAxis', 3, 1);
    buf(meta, 'aMeta', 4, 1);
    buf(tint, 'aTint', 2, 1);

    var uProj = gl.getUniformLocation(prog, 'uProj');
    var uView = gl.getUniformLocation(prog, 'uView');
    var uTime = gl.getUniformLocation(prog, 'uTime');
    var uDisp = gl.getUniformLocation(prog, 'uDisperse');
    var uBre = gl.getUniformLocation(prog, 'uBreathe');

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var W = 0, H = 0, dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width * dpr));
      var h = Math.max(1, Math.round(rect.height * dpr));
      if (w === W && h === H) { return; }
      W = w; H = h; canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, W, H);
      gl.uniformMatrix4fv(uProj, false, perspective(0.60, W / H, 0.1, 40));
    }

    var mx = 0, my = 0, tmx = 0, tmy = 0, disperse = 0, tdisp = 0;
    var running = false, visible = true, t0 = performance.now(), raf = 0;

    function frame(now) {
      raf = 0;
      var t = (now - t0) / 1000;
      resize();
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
      disperse += (tdisp - disperse) * 0.12;
      gl.uniformMatrix4fv(uView, false, viewMatrix(-0.11 + my * 0.045, mx * 0.05, 4.30));
      gl.uniform1f(uTime, t);
      gl.uniform1f(uDisp, disperse);
      gl.uniform1f(uBre, 1 + Math.sin(t * 0.34) * 0.018);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, N);
      if (running && visible) { raf = requestAnimationFrame(frame); }
    }

    function start() { if (!running) { running = true; t0 = performance.now() - 2400; if (!raf) { raf = requestAnimationFrame(frame); } } }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    resize();
    // one frame immediately, so the canvas is never blank before it is revealed
    frame(performance.now());

    return {
      start: start,
      stop: stop,
      setVisible: function (v) { visible = v; if (v && running && !raf) { raf = requestAnimationFrame(frame); } },
      setDisperse: function (d) { tdisp = Math.max(0, Math.min(1, d)); },
      setPointer: function (x, y) { tmx = x; tmy = y; },
      redraw: function () { frame(performance.now()); },
      count: N
    };
  };
})();
