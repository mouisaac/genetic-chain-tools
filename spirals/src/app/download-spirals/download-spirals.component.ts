// @ts-nocheck
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from '../_services/spinner.service';
import * as gcc from './gif-capture-canvas';
import { TokenService } from '../_services/token.service';

// default spiral (an r7)
let tokenData = {
  hash: "0x80527bf6e71b6bfdc8c58ee14374941a4fe841bcb1230efc27bff1716144d95f",
  projectId: 1,
  tokenId: 1933
};

let tokenState = { "t": "0", "speed": "5" };

// for controling gcc
let capturing = false,
  // for stopping canvas drawing loop
  removeCanvas = false;

const a7 = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"],
  a5 = ["#f2e313", "#f2b705", "#a64f03", "#592202", "#0d0000"],
  b5 = ["#c70011", "#db2e10", "#f06113", "#ff8201", "#ffaf21"],
  c5 = ["#e84549", "#f39623", "#fac54c", "#8fbe6c", "#3faa8b"],
  d5 = ["#0121fa", "#3971e0", "#4b96f5", "#57a6e0", "#70d4f5"],
  e5 = ["#d11bf7", "#8218d6", "#5e26ed", "#1a18d6", "#1b53f7"],
  f5 = ["#f2f2f2", "#b5b5b5", "#808080", "#4f4f4f", "#121212"],
  g5 = ["#102601", "#1e3415", "#1e4800", "#315a00", "#427204"],
  h5 = ["#9800AE", "#D910B4", "#FFEA05", "#FCC201", "#FF9500"],
  _i5 = ["#0477bf", "#049dd9", "#05c7f2", "#f2c641", "#F2b441"],
  j5 = ["#11538C", "#115D8C", "#F0F1F2", "#05DBF2", "#0396A6"],
  k5 = ["#032859", "#03738C", "#038C8C", "#F29966", "#F22D1B"],
  l5 = ["#BF304A", "#03A6A6", "#F2CB57", "#734F43", "#F26444"],
  m5 = ["#78BFA5", "#F2E3B3", "#F29B30", "#F26A1B", "#593D2D"],
  n5 = ["#D92B6B", "#410759", "#238C82", "#F29E38", "#F25C05"],
  o5 = ["#BF365A", "#D96299", "#F2CEA2", "#F2811D", "#8C6E5D"],
  p5 = ["#F26699", "#F21D81", "#BF216B", "#F2B6D2", "#F2F2F2"],
  q5 = ["#3FBFB2", "#27F27F", "#81A649", "#D9CE32", "#402004"],
  r5 = ["#1D0C59", "#A8A0D9", "#171640", "#5A588C", "#CFCEF2"],
  s5 = ["#aaaaaa", "#bbbbbb", "#cccccc", "#dddddd", "#eeeeee"],
  a3 = ["#90AFC5", "#336B87", "#2A3132"],
  b3 = ["#693D3D", "#BA5536", "#A43820"],
  c3 = ["#68829E", "#AEBD38", "#598234"],
  d3 = ["#2E4600", "#486B00", "#A2C523"],
  e3 = ["#375E97", "#FB6542", "#FFBB00"],
  f3 = ["#86AC41", "#34675C", "#7DA3A1"],
  g3 = ["#F4CC70", "#DE7A22", "#20948B"],
  h3 = ["#8D230F", "#9B4F0F", "#C99E10"],
  // i3 has alraedy been declared so have to change it to _i3
  _i3 = ["#75B1A9", "#D9B44A", "#4F6457"],
  j3 = ["#EB8A44", "#F9DC24", "#4B7447"],
  k3 = ["#6E6702", "#C05805", "#DB9501"],
  l3 = ["#4D85BD", "#7CAA2D", "#F5E356"],
  m3 = ["#F5BE41", "#31A9B8", "#CF3721"],
  n3 = ["#D0E1F9", "#4D648D", "#283655"],
  o3 = ["#274773", "#bc3e3e", "#dec11e"],
  p3 = ["#018558", "#bde902", "#fef031"],
  q3 = ["#038C8C", "#032859", "#F22D1B"],
  r3 = ["#F2F2F2", "#9D9D9D", "#0D0D0D"],
  s3 = ["#003B00", "#008F11", "#00FF41"],
  t3 = ["#0c0e0c", "#d8323c", "#eaebea"],
  pallet7s = [a7],
  pallet5s = [a5, b5, c5, d5, e5, f5, g5, h5, j5, k5, l5, m5, n5, o5, p5, q5, r5, s5],
  pallet3s = [a3, b3, c3, d3, e3, f3, g3, h3, _i3, j3, k3, l3, m3, n3, o3, p3, q3, r3, s3, t3],




const u64 = (a: any) => BigInt.asUintN(64, a),
  rotl = (a, b) => u64((a << b) | (a >> (64n - b))),
  xoshiro256strstr = (a) => () => {
    const b = u64(9n * rotl(u64(5n * a[1]), 7n));
    let c = u64(a[1] << 17n);
    return (a[2] ^= a[0]), (a[3] ^= a[1]), (a[1] ^= a[2]), (a[0] ^= a[3]), (a[2] ^= c), (a[3] = rotl(a[3], 45n)), b;
  },
  randomDecimal = (a) => () => {
    const b = a();
    return Number(b % 9007199254740991n) / 9007199254740991;
  },
  randomNumber = (c) => (d, a) => d + (a - d) * c(),
  randomInt = (c) => (d, a) => Math.floor(c(d, a + 1)),
  mkRandom = (a) => {
    const b = Array(4)
      .fill()
      .map((a, b) => 16 * b + 2)
      .map((b) => u64(`0x${a.slice(b, b + 16)}`)),
      c = xoshiro256strstr(b),
      d = randomDecimal(c),
      e = randomNumber(d),
      f = randomInt(e);
    return [d, e, f];
  },
  shuffle = (a, b) => {
    var c = Math.floor;
    for (let d, e, f = a.length; f;) (e = c(b() * f--)), (d = a[f]), (a[f] = a[e]), (a[e] = d);
    return a;
  },
  repeat = (a, b) => Array.from({ length: b }).map(() => a),
  selectRandom = (a, b) => a[Math.floor(b() * a.length)],
  selectRandomDist = (b, c) => {
    const a = Object.keys(b).reduce((c, a) => c.concat(repeat(a, 100 * b[a])), []);
    return selectRandom(shuffle(a, c), c);
  },
  toHex = (a) => a.toString(16).padStart(2, "0"),
  fromHex = (a) => parseInt(a, 16),
  complement = (a) => {
    const c = a.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (c) {
      const a = toHex(255 - fromHex(c[1])),
        d = toHex(255 - fromHex(c[2])),
        e = toHex(255 - fromHex(c[3]));
      return `#${a}${d}${e}`;
    }
  },
  getPallet = (a, b) => {
    switch (a) {
      case 7:
        return selectRandom(pallet7s, b);
      case 5:
        return selectRandom(pallet5s, b);
      case 3:
        return selectRandom(pallet3s, b);
      case 1:
        const c = () => toHex(Math.floor(256 * b())),
          d = c(),
          e = c(),
          f = c();
        return [`#${d}${e}${f}`];
    }
  },
  getLineWidth = (a, b) => (7 === a || 5 === a || 3 === a ? b(1, 5) : 1 === a ? b(1, 3) : void 0),
  getBackground = (a, b) => {
    if (1 < a.length) {
      const c = b(1, 15).toString(16);
      return `#${repeat(c, 6).join("")}`;
    }
    return complement(a[0]);
  },
  archimedean = (a, b) => b * a,
  hyperbolic = (a, b) => b / a,
  fermat = (a, b) => b * Math.sqrt(a),
  lituus = (a, b) => b / Math.sqrt(a),
  algoSetups = {
    archimedean: { algo: archimedean, theta: { start: [1, 500], max: [50, 100] }, length: 0.01 },
    hyperbolic: { algo: hyperbolic, theta: { start: [15, 1400], max: [50, 100] }, length: 48.5 },
    fermat: { algo: fermat, theta: { start: [1, 400], max: [50, 100] }, length: 0.15 },
    lituus: { algo: lituus, theta: { start: [25, 1400], max: [50, 100] }, length: 6.5 },
  },
  algoDist = { archimedean: 0.4, hyperbolic: 0.3, fermat: 0.2, lituus: 0.1 },
  palletDist = { 7: 0.01, 5: 0.22, 3: 0.33, 1: 0.44 },
  hashToTraits = (a) => {
    const [b, c, d] = mkRandom(a),
      e = selectRandomDist(algoDist, b),
      f = algoSetups[e],
      g = d(...f.theta.start),
      h = d(...f.theta.max),
      i = f.length * c(1, 1.1),
      j = 360 + d(1, 36),
      k = parseInt(selectRandomDist(palletDist, b)),
      l = getPallet(k, b),
      m = { bgColor: getBackground(l, d), lineColors: l, lineWidth: getLineWidth(k, c) };
    return { algoKey: e, setup: f, thetaStart: g, thetaMax: h, length: i, steps: j, palletNum: k, pallet: l, options: m };
  },
  elemFromTemplate = (a) => {
    const b = document.createElement("template");
    return (b.innerHTML = a.trim()), b.content.firstChild;
  },
  createCanvas = (a, b, c) => {
    return elemFromTemplate(`<canvas id="${a}" width="${b}" height="${c}">`);
  },
  kFitCover = 0,
  kFitAll = 1,
  getPixelFactor = (a, b) => (a === kFitCover ? (b.width > b.height ? b.width / 2 : b.height / 2) : b.width > b.height ? b.height / 2 : b.width / 2),
  toRads = (a) => (a * Math.PI) / 360,
  drawSpiral = (a, b, c) => {
    const d = a.getContext("2d"),
      e = a.width / 2,
      f = a.height / 2,
      g = { x: e, y: f },
      h = getPixelFactor(kFitCover, a);
    (d.lineWidth = (c.lineWidth / 250) * h), (d.lineCap = "round");
    const i = (a) => g.x + a * h,
      j = (a) => g.y + a * h,
      k = ([a, b]) => [i(a), j(b)];
    d.clearRect(0, 0, a.width, a.height), d.rect(0, 0, a.width, a.height), (d.fillStyle = c.bgColor), d.fill();
    const l = (a) => {
      const b = c.lineColors.length;
      return c.lineColors[a % b];
    };
    b.forEach((a, c) => {
      0 == c || (d.beginPath(), (d.strokeStyle = l(c)), d.moveTo(...k(b[c - 1])), d.lineTo(...k(a)), d.stroke());
    });
    // start capturing for GIF
    if (capturing) {
      gcc.capture(a);
    }
  },
  generateSpiral = (a) => (b, c, d) => {
    return Array.from(Array(d).keys(), (d) => {
      const e = d * toRads(b),
        f = a(e, c),
        g = f * Math.cos(e),
        h = f * Math.sin(e);
      return [g, h];
    });
  },
  doSpiral = (a, b, c) => {
    const { seed: d, algoKey: e, setup: f, thetaStart: g, thetaMax: h, length: i, steps: j, palletNum: k, pallet: l, options: m } = hashToTraits(b);
    (a.render = () => {
      let b = parseFloat(c.t) || 0;
      const d = g + ((1 + Math.cos(b)) * h) / 2,
        e = generateSpiral(f.algo)(d, i, j);
      drawSpiral(a, e, m);
    }),
      (a.update = (a) => {
        let b = parseFloat(c.t) || 0;
        const d = 1e-4 * ((c.speed - 5) / 5) * a;
        (b = (b + 1e-4 * a + d) % (2 * Math.PI)), (c.t = b.toFixed(5));
      }),
      (a.loop = (b) => {
        if (removeCanvas) {
          return;
        }
        a.render(), (a.loopId = requestAnimationFrame(a.loop));
        const d = b - (c.ts || 0);
        (c.ts = b), 0 != c.speed && a.update(d);
      }),
      (a.loopId = requestAnimationFrame(a.loop));
  },
  setupCanvas = () => {
    const a = document.querySelector("#canvas-container"),
      b = createCanvas("art-canvas");
    // style has to be done inline to apply instantly (center the canvas inside canvas-container)
    b.style.cssText = "padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;";
    return a.appendChild(b), sizeCanvas(), b;
  },
  sizeCanvas = (w = 0, h = 0) => {
    var a = Math.floor;
    const b = w || (window.innerWidth / 1.5).toFixed(2),
      c = h || (window.innerHeight / 1.5).toFixed(2),
      d = window.devicePixelRatio,
      e = document.querySelector("#art-canvas");
    (e.width = a(b * d)), (e.height = a(c * d)), (e.style.width = b + "px"), (e.style.height = c + "px");
  },
  run = (a, b) => {
    const c = setupCanvas();
    removeCanvas = false;
    doSpiral(c, a.hash, b);
  };




@Component({
  selector: 'app-download-spirals',
  templateUrl: './download-spirals.component.html',
  styleUrls: ['./download-spirals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadSpiralsComponent implements OnInit, AfterViewInit {

  constructor(
    public spinner: SpinnerService,
    public tokenService: TokenService,
    public ref: ChangeDetectorRef,
  ) { }

  resizeForm: { [key: string]: string } = {
    width: 0,
    height: 0
  };

  searchForm: { [key: string]: string } = {
    tokenID: '1933',
  };

  optionsForm: { [key: string]: string } = {
    durationSec: '3',
    scale: '0.5',
    quality: '10',
    capturingFps: '20',
  };

  gccOptions = {
    scale: 0.5,
    durationSec: 3,
    //keyCode: 67, // 'C'
    capturingFps: 20,
    appFps: 30,
    isAppendingImgElement: true,
    quality: 10,
    downloadFileName: "spiral",
    //triggerButton: null
    //isSmoothingEnabled: true
  }

  spiralSpeed = 5;

  onSpiralSpeedChange(value: number | null){
    this.spiralSpeed = value;
    if (value) tokenState.speed = value.toString();
  }

  startButtonText = "START";
  startButtonDisable = null;

  // START -> CAPTURING -> EXPORTING -> START
  updateStartButtonText(duration: number) {
    this.startButtonText = "CAPTURING..."
    this.startButtonDisable = true;
    this.ref.markForCheck();

    window.setTimeout(() => {
      this.startButtonText = "EXPORTING...";
      capturing = false;
      this.ref.markForCheck();
      // move it to next cycle in order to have the text updated
      window.setTimeout(() => {
        this.exportGIF(this.ref);
      }, 50);

    }, duration * 1000);
  }

  exportGIF(ref: ChangeDetectorRef) {
    gcc.end();
    this.startButtonText = "START";
    this.startButtonDisable = null;
    ref.markForCheck();
  }

  resetResizeForm() {
    this.resizeForm = {
      width: (window.innerWidth / 1.5).toFixed(2),
      height: (window.innerHeight / 1.5).toFixed(2)
    };
    this.ref.markForCheck();
  }

  ngOnInit(): void {
    //this.gccOptions.triggerButton = document.getElementById('download-button');

    this.resetResizeForm();
    // set options (default values are shown below)
    gcc.setOptions(this.gccOptions);

    document.getElementById('start-button').addEventListener('click', () => {
      this.updateStartButtonText(parseFloat(this.gccOptions.durationSec));
      if (!capturing) {
        capturing = true;
      }
    })

    /*
    document.querySelector('#download-button').addEventListener('click', () => {
      console.log('download');
      //document.dispatchEvent(new KeyboardEvent('keypress', { 'key': 'C' }));
    });
    */

    // download as wepm
    /*
    function startRecording() {
        const canvasElt = document.querySelector('#art-canvas');
  
        //console.log(canvasElt instanceof HTMLCanvasElement)
        const chunks = []; // here we will store our recorded media chunks (Blobs)
        const stream = canvasElt.captureStream(); // grab our canvas MediaStream
        // default MediaRecorder
        const rec = new MediaRecorder(stream); // init the recorder
        // every time the recorder has new data, we will store it in our array
        rec.ondataavailable = e => chunks.push(e.data);
        // only when the recorder stops, we construct a complete Blob from all the chunks
        rec.onstop = e => exportVid(new Blob(chunks, { type: 'image/gif' }));
        rec.start();
        setTimeout(() => rec.stop(), 3000); // stop recording in 3s
    }
  
    function exportVid(blob) {
        let vid = document.createElement('video');
        vid.src = URL.createObjectURL(blob);
        vid.controls = true;
        document.body.appendChild(vid);
        let a = document.createElement('a');
        a.download = 'spiral.gif';
        a.href = vid.src;
        a.textContent = 'download the gif';
        document.body.appendChild(a);
    }
  
    let downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', () => {
  
        startRecording();
    })
    */


  }

  spiralMetadataForm = {
    algo: "hyperbolic",
    pallete: "rainbow7",
    bg: "#444444"
  }

  updateTokenData(id: number) {
    /*
    // for testing
    tokenData.tokenId = 100;
    tokenData.hash = '0xde57d3cf22f47d879777ba0d313c98415b23603e48097062ba4c577bd8a6fa19';
    tokenState = {"t":"0","speed":"10"};
    this.spiralMetadataForm = {
      algo: "fermat",
      pallete: "#256a16",
      bg: "#da95e9"
    }
    this.resetResizeForm();
    return;
    */

    this.tokenService.getMetadata(id).subscribe((data) => {
      //console.log(data);
      const metadata = JSON.parse(data);
      //console.log(metadata);
      tokenData.tokenId = id;
      tokenData.hash = metadata.tokenHash;
      tokenState = metadata.state;
      let attrs = metadata.attributes;
      let algo = "", pallete = "", bg = "";
      for (var attr of attrs) {
        switch (attr.trait_type) {
          case 'Algorithm':
            algo = attr.value;
            break;
          case 'Pallete':
            pallete = attr.value;
            break;
          case 'Background':
            bg = attr.value;
            break;
        }
      }
      this.spiralMetadataForm = {
        algo, pallete, bg
      };
      this.resetResizeForm();
      this.updateCanvas();
    }, err => {
      console.log(err);
    })
  }

  updateCanvas() {
    removeCanvas = true;
    let canvasContainer = document.getElementById('canvas-container');
    //canvasContainer.removeChild(canvas);
    canvasContainer.textContent = '';
    run(tokenData, tokenState);
  }

  // for displaying error message on the form field
  searchFail = false;


  resizeSpiral = (w: number = 0, h: number = 0) => {
    var a = Math.floor;
    const b = w || (window.innerWidth / 1.5).toFixed(2),
      c = h || (window.innerHeight / 1.5).toFixed(2),
      d = window.devicePixelRatio,
      e = document.querySelector("#art-canvas");
    (e.width = a(b * d)), (e.height = a(c * d)), (e.style.width = b + "px"), (e.style.height = c + "px");
  }

  // constraint constants
  minCanvasWidth = 1;
  minCanvasHeight = 1;
  maxCanvasWidth = 4096;
  maxCanvasHeight = 4096;

  minTokenID = 1;
  maxTokenID = 6305;

  minDuration = 0.1;
  maxDuration = 60;

  minScale = 0.1;
  maxScale = 2;

  minFPS = 10;
  maxFPS = 30;

  minQuality = 1;
  maxQuality = 20;

  // logics for all the form submissions
  onSubmit(type: string) {
    //this.spinner.show();
    switch (type) {
      case 'resize':
        let { width, height } = this.resizeForm;
        let w = parseFloat(width), h = parseFloat(height);

        if (w < this.minCanvasWidth) w = this.minCanvasWidth;
        if (w > this.maxCanvasWidth) w = this.maxCanvasWidth;
        if (h < this.minCanvasHeight) w = this.minCanvasHeight;
        if (h > this.maxCanvasHeight) w = this.maxCanvasHeight;

        sizeCanvas(w, h);
        //this.spinner.hide();
        this.ref.markForCheck();
        break;
      case 'search':
        try {
          let tokenID = parseInt(this.searchForm.tokenID);
          if (tokenID < this.minTokenID) tokenID = this.minTokenID;
          if (tokenID > this.maxTokenID) tokenID = this.maxTokenID;
          this.updateTokenData(tokenID);
          this.searchFail = false;
          //this.spinner.hide();
        }
        catch (err) {
          console.log(err);
          this.searchFail = true;
          //this.spinner.hide();
          return;
        }
        break;
      case 'options':
        let { durationSec, scale, capturingFps, quality } = this.optionsForm;
        // impose constraints
        if (durationSec < this.minDuration) durationSec = this.minDuration;
        if (durationSec > this.maxDuration) durationSec = this.maxDuration;
        if (scale < this.minScale) scale = this.minScale;
        if (scale > this.maxScale) scale = this.maxScale;
        if (capturingFps < this.minFPS) capturingFps = this.minFPS;
        if (capturingFps > this.maxFPS) capturingFps = this.maxFPS;
        if (quality < this.minQuality) quality = this.minQuality;
        if (quality > this.maxQuality) quality = this.maxQuality;
        Object.assign(this.optionsForm, { durationSec, scale, capturingFps, quality });
        // apply new options
        Object.assign(this.gccOptions, this.optionsForm);
        gcc.setOptions(this.gccOptions);
        break;
      default:
        //this.spinner.hide();
        break;
    }
  }

  ngAfterViewInit() {
    run(tokenData, tokenState);
    window.onresize = () => {
      this.resetResizeForm();
      sizeCanvas();
    };
  }



}
