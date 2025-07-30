import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Debug from "./debug";

export default class Scene {
  private static readonly COLORS = {
    BACKGROUND: 0xffffff,
    OFFICE: "#9a9a9a",
    FLOOR: "#aaaaaa",
    FAN: "#ff0000"
  } as const;

  private static readonly DIMENSIONS = {
    OFFICE: { width: 1, height: 1, depth: 1, segments: 2 },
    FLOOR: { width: 4, height: 4, depth: 0.2 },
    FAN: { width: 0.8, height: 0.8 }
  } as const;

  private static readonly POSITIONS = {
    FLOOR: { x: 0, y: -0.6, z: 0 },
    FAN: { x: 0, y: 0.5, z: 2 },
    CAMERA: { x: -2, y: 0.8, z: 3 }
  } as const;

  private static readonly ANIMATION = {
    FAN_DURATION_SMALL: 0.5,
    FAN_DURATION_LARGE: 0.7,
    INITIAL_TILT: -0.9,
    SWING_AMPLITUDE: 0.1,
    TILT_AMPLITUDE_SMALL: 0.7,
    TILT_AMPLITUDE_LARGE: 1.7,
    HEIGHT_AMPLITUDE: 0.15,
    EASE_FACTOR: 0.6,
    OFFICE_SHAKE: {
      MIN_ROTATION: 0,
      MAX_ROTATION: -0.008 * Math.PI,
      FREQUENCY: 6.0,
      AMPLITUDE: 0.02 * Math.PI,
      SHAKE_DURATION: 0.4,
      INTERVAL_DURATION: 1.0
    }
  } as const;

  private static readonly CAMERA_CONFIG = {
    FOV: 75,
    NEAR: 0.1,
    FAR: 100,
    MAX_PIXEL_RATIO: 2
  } as const;

  private static readonly SENSOR_CONFIG = {
    MAX_POSSIBLE_MAGNITUDE: Math.sqrt(3),
    MIN_MAGNITUDE_THRESHOLD: 1.0,
    SHAKE_THRESHOLD: 2.0
  } as const;

  private static readonly FLOOR_ROTATION = -0.5 * Math.PI;
  private static readonly FAN_OFFSET_Y = 0.2;

  private canvas!: HTMLCanvasElement;
  private scene!: THREE.Scene;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private controls: OrbitControls | undefined;
  private fan: THREE.Mesh | undefined;
  private office: THREE.Mesh | undefined;
  private debug: Debug | undefined;
  private animationId: number | null = null;
  private isShaking: boolean = false;
  private isFanning: boolean = false;
  private fanStartTime: number = 0;
  private fanDuration: number = Scene.ANIMATION.FAN_DURATION_SMALL;
  private fanTiltAmplitude: number = 0;
  private clock: THREE.Clock = new THREE.Clock();

  constructor() {
    this.initializeCanvas();
    this.initializeScene();
    this.setupScene();
    this.animate();
  }

  private initializeCanvas() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) {
      console.warn("Canvas element not found, SceneScript will not initialize");
      throw new Error("Canvas element not found");
    }
    this.canvas = canvas;
  }

  private initializeScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(Scene.COLORS.BACKGROUND);
  }

  private setupScene() {
    this.setupOffice();
    this.setupFloor();
    this.setupFan();

    this.setupCamera();
    this.setupControls();
    this.setupRenderer();
    this.setupEventListeners();

    this.setupDebug();
  }

  private setupOffice() {
    const { width, height, depth, segments } = Scene.DIMENSIONS.OFFICE;
    const officeGeometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      segments,
      segments,
      segments
    );
    officeGeometry.translate(0, 0, width / 2);
    const officeMaterial = new THREE.MeshBasicMaterial({
      color: Scene.COLORS.OFFICE
    });

    this.office = new THREE.Mesh(officeGeometry, officeMaterial);
    this.office.position.z = -width / 2;
    this.scene.add(this.office);
  }

  private setupFloor() {
    const { width, height, depth } = Scene.DIMENSIONS.FLOOR;
    const floorGeometry = new THREE.BoxGeometry(width, height, depth);
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: Scene.COLORS.FLOOR,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Scene.FLOOR_ROTATION;
    floor.position.set(
      Scene.POSITIONS.FLOOR.x,
      Scene.POSITIONS.FLOOR.y,
      Scene.POSITIONS.FLOOR.z
    );
    this.scene.add(floor);
  }

  private setupFan() {
    const { width, height } = Scene.DIMENSIONS.FAN;
    const fanGeometry = new THREE.PlaneGeometry(width, height);
    fanGeometry.translate(0, Scene.FAN_OFFSET_Y, 0);

    const fanMaterial = new THREE.MeshBasicMaterial({
      color: Scene.COLORS.FAN,
      side: THREE.DoubleSide
    });

    this.fan = new THREE.Mesh(fanGeometry, fanMaterial);
    this.fan.position.set(
      Scene.POSITIONS.FAN.x,
      Scene.POSITIONS.FAN.y,
      Scene.POSITIONS.FAN.z
    );
    this.scene.add(this.fan);
  }

  private setupCamera() {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.camera = new THREE.PerspectiveCamera(
      Scene.CAMERA_CONFIG.FOV,
      sizes.width / sizes.height,
      Scene.CAMERA_CONFIG.NEAR,
      Scene.CAMERA_CONFIG.FAR
    );
    this.camera.position.set(
      Scene.POSITIONS.CAMERA.x,
      Scene.POSITIONS.CAMERA.y,
      Scene.POSITIONS.CAMERA.z
    );
    this.scene.add(this.camera);
  }

  private setupControls() {
    if (!this.camera) return;
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  private setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, Scene.CAMERA_CONFIG.MAX_PIXEL_RATIO)
    );
  }

  private setupEventListeners() {
    this.setupResizeHandler();
  }

  private setupResizeHandler() {
    window.addEventListener("resize", () => {
      const newSizes = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      if (!this.camera || !this.renderer) return;

      this.camera.aspect = newSizes.width / newSizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(newSizes.width, newSizes.height);
      this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, Scene.CAMERA_CONFIG.MAX_PIXEL_RATIO)
      );
    });
  }

  private animate() {
    const tick = () => {
      const elapsedTime = this.clock.getElapsedTime();

      if (!this.camera || !this.controls || !this.renderer) return;

      this.updateFanAnimation(elapsedTime);
      this.updateOfficeShake(elapsedTime);

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.animationId = window.requestAnimationFrame(tick);
    };

    tick();
  }

  private updateFanAnimation(elapsedTime: number) {
    if (!this.fan) return;

    if (this.isFanning) {
      const animationTime = elapsedTime - this.fanStartTime;
      const progress = Math.min(animationTime / this.fanDuration, 1.0);

      const easeInOut =
        Scene.ANIMATION.EASE_FACTOR * (1 - Math.cos(Math.PI * progress));
      const sinProgress = Math.sin(progress * Math.PI);

      this.fan.rotation.z =
        sinProgress * Scene.ANIMATION.SWING_AMPLITUDE * easeInOut;
      this.fan.rotation.x =
        Scene.ANIMATION.INITIAL_TILT -
        sinProgress * this.fanTiltAmplitude * easeInOut;
      this.fan.position.y =
        -sinProgress * Scene.ANIMATION.HEIGHT_AMPLITUDE * easeInOut;

      if (progress >= 1.0) {
        this.resetFanToInitialPosition();
      }
    } else {
      this.resetFanToInitialPosition();
    }
  }

  private updateOfficeShake(elapsedTime: number) {
    if (!this.office) return;

    const {
      MIN_ROTATION,
      MAX_ROTATION,
      FREQUENCY,
      AMPLITUDE,
      SHAKE_DURATION,
      INTERVAL_DURATION
    } = Scene.ANIMATION.OFFICE_SHAKE;

    const totalCycleDuration = SHAKE_DURATION + INTERVAL_DURATION;
    const cycleTime = elapsedTime % totalCycleDuration;
    const isShaking = cycleTime < SHAKE_DURATION;

    if (isShaking) {
      const shakeProgress = cycleTime / SHAKE_DURATION;
      const oscillation = Math.sin(cycleTime * FREQUENCY * 2 * Math.PI);

      const intensityFactor = Math.sin(shakeProgress * Math.PI);

      this.office.rotation.x = oscillation * AMPLITUDE * intensityFactor;
    } else {
      this.office.rotation.x = 0;
    }

    this.office.rotation.x = Math.max(
      MAX_ROTATION,
      Math.min(MIN_ROTATION, this.office.rotation.x)
    );
  }

  private resetFanToInitialPosition() {
    if (!this.fan) return;

    this.isFanning = false;
    this.fan.rotation.z = 0;
    this.fan.rotation.x = Scene.ANIMATION.INITIAL_TILT;
    this.fan.position.y = 0;
  }

  private setupDebug() {
    if (this.camera && this.fan && this.office) {
      this.debug = new Debug(
        this.scene,
        this.camera,
        this.fan,
        this.office,
        this
      );
    }
  }

  public updateFanPosition(x: number, y: number, z: number) {
    if (!this.fan) return;

    const isShakingX = Math.abs(x) >= Scene.SENSOR_CONFIG.SHAKE_THRESHOLD;
    const isShakingY = Math.abs(y) >= Scene.SENSOR_CONFIG.SHAKE_THRESHOLD;
    const isShakingZ = Math.abs(z) >= Scene.SENSOR_CONFIG.SHAKE_THRESHOLD;

    // いずれかの方向で閾値を超えていれば振られていると判定
    const prevIsShaking = this.isShaking;
    this.isShaking = isShakingX || isShakingY || isShakingZ;

    // 振動開始時にうちわアニメーションを開始
    if (this.isShaking && !prevIsShaking) {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const isLargeSwing =
        magnitude > Scene.SENSOR_CONFIG.SHAKE_THRESHOLD * 1.3;
      this.startFanning(isLargeSwing);
    }

    console.log("Is Shaking:", this.isShaking);
  }

  public startFanning(isLargeSwing: boolean) {
    if (!this.isFanning) {
      this.fanTiltAmplitude = isLargeSwing
        ? Scene.ANIMATION.TILT_AMPLITUDE_LARGE
        : Scene.ANIMATION.TILT_AMPLITUDE_SMALL;
      this.fanDuration = isLargeSwing
        ? Scene.ANIMATION.FAN_DURATION_LARGE
        : Scene.ANIMATION.FAN_DURATION_SMALL;
      this.isFanning = true;
      this.fanStartTime = this.clock.getElapsedTime();
    }
  }

  public getIsShaking(): boolean {
    return this.isShaking;
  }

  public dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.debug?.destroy();
  }
}
