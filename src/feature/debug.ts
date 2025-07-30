import GUI from "lil-gui";
import * as THREE from "three";

export default class Debug {
  private gui!: GUI;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private fan: THREE.Mesh;
  private office: THREE.Mesh;
  private sceneInstance: any;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    fan: THREE.Mesh,
    office: THREE.Mesh,
    sceneInstance: any
  ) {
    this.scene = scene;
    this.camera = camera;
    this.fan = fan;
    this.office = office;
    this.sceneInstance = sceneInstance;

    this.setupGUI();
    this.setupKeyboardControls();
  }

  private setupGUI() {
    this.gui = new GUI({
      width: 300,
      title: "Scene Objects",
      closeFolders: true
    });
    this.gui.close();

    this.setupCameraControls();
    this.setupOfficeControls();
    this.setupFanControls();
  }

  private setupKeyboardControls() {
    window.addEventListener("keydown", (event) => {
      if (this.gui && event.key === "h") {
        this.gui.show(this.gui._hidden);
      }
    });
  }

  private setupCameraControls() {
    const cameraTweaks = this.gui.addFolder("Camera");
    cameraTweaks
      .add(this.camera.position, "x")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("X");
    cameraTweaks
      .add(this.camera.position, "y")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Y");
    cameraTweaks
      .add(this.camera.position, "z")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Z");
  }

  private setupOfficeControls() {
    const officeTweaks = this.gui.addFolder("Office");
    officeTweaks
      .add(this.office.position, "x")
      .min(-3)
      .max(3)
      .step(0.01)
      .name("x");
    officeTweaks
      .add(this.office.position, "y")
      .min(-3)
      .max(3)
      .step(0.01)
      .name("y");
    officeTweaks
      .add(this.office.position, "z")
      .min(-3)
      .max(3)
      .step(0.01)
      .name("z");
    officeTweaks.add(this.office, "visible");
  }

  private setupFanControls() {
    const fanTweaks = this.gui.addFolder("Fan");
    fanTweaks.add(this.fan, "visible");
    fanTweaks
      .add(this.fan.rotation, "x")
      .min(-Math.PI / 4)
      .max(Math.PI / 4)
      .step(0.01)
      .name("Fan Rotation (X)");
  }

  public toggle() {
    if (this.gui) {
      this.gui.show(this.gui._hidden);
    }
  }

  public show() {
    if (this.gui) {
      this.gui.show();
    }
  }

  public hide() {
    if (this.gui) {
      this.gui.hide();
    }
  }

  public destroy() {
    this.gui?.destroy();
  }
}
