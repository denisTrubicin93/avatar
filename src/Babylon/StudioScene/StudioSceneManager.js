import * as BABYLON from "babylonjs";
import "babylonjs-inspector";
import "babylonjs-loaders";
import LoaderManager from "./LoaderManager";
import { Categories } from "../../Config.json";

export default class StudioSceneManager {
  constructor(game) {
    this.game = game;
    //Main Props
    this.scene = null;
    this.studioGui = null;
    this.mainCamera = null;
    this.pipline = null;

    //
    this.charcterProps = {};
    //initObj
    Object.keys(Categories).forEach((key) => {
      this.charcterProps[key] = null;
    });

    this.hdrTexturePath =
      "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/DDS/Runyon_Canyon_A_2k_cube_specular.dds";
    this.skyboxPath =
      "https://assets.babylonjs.com/environments/environmentSpecular.env";
  }

  //#region  MainSceneProperties
  CreateScene() {
    //Create Bts Scene
    //Create Scene
    this.scene = new BABYLON.Scene(this.game.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);
    this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
    this.scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
    this.scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;
    this.scene.imageProcessingConfiguration.contrast = 2.5;
    this.scene.imageProcessingConfiguration.vignetteEnabled = true;

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          this.onPointerDown(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          this.onPointerUp(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.onPointerMove(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
          break;
        case BABYLON.PointerEventTypes.POINTERWHEEL:
          this.MouseWheelHandler();
          break;
        default:
          break;
      }
    });

    //Installation
    this.createCamera();
    this.setUpEnvironMent();

    //Create LoadManager instance
    this.loaderManager = new LoaderManager(this);
    this.loaderManager.loadItemById("base", "base"); //start load base Charcter

    // this.scene.debugLayer.show();

    return this.scene;
  }
  createCamera() {
    this.mainCamera = new BABYLON.ArcRotateCamera(
      "ArcCamera",
      4.69,
      1.42,
      55,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    this.mainCamera.attachControl(this.game.canvas, true);

    this.mainCamera.lowerRadiusLimit = 20;
    this.mainCamera.upperRadiusLimit = 85;

    this.mainCamera.lowerBetaLimit = 0.85;
    this.mainCamera.upperBetaLimit = 1.5;

    this.mainCamera.minZ = 0.2;
    this.mainCamera.target = new BABYLON.Vector3(3, 4, 0.7);

    this.mainCamera.wheelPrecision = 10;
    this.mainCamera.useBouncingBehavior = true;
  }
  setUpEnvironMent() {
    let hemiLight = new BABYLON.HemisphericLight(
      "HemiLight",
      new BABYLON.Vector3(0, -1, -0),
      this.scene
    );
    hemiLight.intensity = 1;

    let dirLight = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0),
      this.scene
    );
    dirLight.position = new BABYLON.Vector3(3, 9, 3);

    this.alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
    this.alphaMaterial.alpha = 0;

    // ShadowGenerator
    this.shadowGenerator = new BABYLON.ShadowGenerator(512, dirLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.filteringQuality =
      BABYLON.ShadowGenerator.QUALITY_HIGH;
    dirLight.intensity = 1;
    dirLight.shadowMinZ = 0;
    dirLight.shadowMaxZ = 500;

    let skybox = BABYLON.CubeTexture.CreateFromPrefilteredData(
      this.skyboxPath,
      this.scene
    );
    skybox.gammaSpace = true;

    let skyboxMaterial = new BABYLON.StandardMaterial("sky7Box", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      this.skyboxPath,
      this.scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    let ground = BABYLON.Mesh.CreateGround("ground1", 35, 35, 150, this.scene);
    ground.position.y -= 4;
    ground.receiveShadows = true;

    // Create and tweak the background material.
    var backgroundMaterial = new BABYLON.BackgroundMaterial(
      "backgroundMaterial",
      this.scene
    );
    backgroundMaterial.diffuseTexture = new BABYLON.Texture(
      "./Textuers/scene/backgroundGround.png",
      this.scene
    );
    backgroundMaterial.diffuseTexture.hasAlpha = true;
    backgroundMaterial.opacityFresnel = false;
    backgroundMaterial.shadowLevel = 0.85;
    backgroundMaterial.alpha = 0.4;

    //Create CubicTexture
    // let skyboxCubecTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    //     // this.skyboxPath,
    //         "./environment/empty_warehouse2.env",
    //         this.scene
    //         );
    //     skyboxCubecTexture.gammaSpace = true;
    //     skyboxCubecTexture.level = .8;
    // this.scene.environmentTexture=skyboxCubecTexture;

    //Mirror
    this.mirror = new BABYLON.MirrorTexture("mirror", 512, this.scene);
    // this.mirror.mirrorPlane = new BABYLON.Plane(0, -1, -.5, 0);
    this.mirror.mirrorPlane = new BABYLON.Plane(0, -0.8, -0, -1);

    this.mirror.adaptiveBlurKernel = 32;
    // this.Groundmirror.mirrorPlane = new BABYLON.Plane(0, -.69, -0, -1);
    backgroundMaterial.reflectionTexture = this.mirror;
    backgroundMaterial.reflectionFresnel = true;
    backgroundMaterial.reflectionStandardFresnelWeight = 0.9;
    backgroundMaterial.reflectionTexture.level = 0.8;
    ground.material = backgroundMaterial;

    // var box2 = BABYLON.MeshBuilder.CreateBox(
    //   "box",
    //   {
    //     width: BoxWidth,
    //     depth: BoxLength,
    //     height: 10,
    //   },
    //   this.scene
    // );
    // let mat = new BABYLON.PBRMaterial("DD",this.scene);
    // box2.material = mat;
    // mat.albedoColor = new BABYLON.Color3(103/255,103/255,103/255)
    // box2.position = new BABYLON.Vector3(0, 5, 1);
    // box2.visibility = 0.2;

    // this.scene.registerBeforeRender(() => {
    // });

    // //Create RenderPipline
    // this.RenderPipline = new BABYLON.DefaultRenderingPipeline("default", // The name of the pipeline
    // true, // Do you want HDR textures ?
    // this.scene, // The scene instance
    // [this.mainCamera] // The list of cameras to be attached to
    // );

    // this.RenderPipline.samples = s4;
    // this.RenderPipline.bloomEnabled=true;
    // // this.RenderPipline.glowLayer.intensity=3.5;
    // // this.RenderPipline.glowLayer.blurKernelSize=180;

    // this.RenderPipline.MineglowLayer =new BABYLON.GlowLayer("glowww", this.scene, {
    //     mainTextureFixedSize: 512,
    //     blurKernelSize: 190
    //     }
    // );
    // this.RenderPipline.MineglowLayer.intensity = 2.70;

    //#region fff
    // var alpha = 0;
    // this.scene.registerBeforeRender(() => {
    // });
    //#endregion

    // var skyBack = new BABYLON.Layer("skyBack", "./Textuers/scene/skyBack_edit.png", this.scene,true, new BABYLON.Color4(1,1,1,1));
  }
  //#endregion

  //region SceneActions
  handleLoadItemPerId(type, name, onLoad) {
    const isExsits = this.charcterProps[type];
    if (isExsits) {
      this.charcterProps[type].dispose();
      this.charcterProps[type] = null;
    }
    if (!name) {
      onLoad({
        data: this.getCharcterSummary(),
        totalPrice: this.getTotatlPrice(),
      });
      return;
    }
    this.loaderManager.loadItemById(type, name, onLoad);
  }
  getCharcterSummary() {
    return Object.entries(this.charcterProps)
      .filter(([key, value]) => {
        return key !== "base";
      })
      .map(([key, value]) => {
        if (value) {
          return { category: key, item: value.itemName, price: value.price };
        } else {
          return { category: key, item: "No Item Selected", price: 0 };
        }
      });
  }
  getTotatlPrice() {
    return Object.values(this.charcterProps).reduce((sum, ele) => {
      if (ele && ele.myId !== "base") return sum + ele.price;
      else return sum;
    }, 0);
  }
  handleChangeCatColor(catType, hexColor) {
    const isExsits = this.charcterProps[catType];
    if (isExsits) {
      if (!this.charcterProps[catType].getChildMeshes(true)[0].defualtColor) {
        this.charcterProps[catType].getChildMeshes(
          true
        )[0].defualtColor = this.charcterProps[catType]
          .getChildMeshes(true)[0]
          .material.albedoColor.toHexString();
      }
      if (hexColor)
        this.charcterProps[catType].getChildMeshes(
          true
        )[0].material.albedoColor = new BABYLON.Color3.FromHexString(hexColor);
      else {
        this.charcterProps[catType].getChildMeshes(
          true
        )[0].material.albedoColor = new BABYLON.Color3.FromHexString(
          this.charcterProps[catType].getChildMeshes(true)[0].defualtColor
        );
      }
    }
  }
  loadAllCharcterData(items, onFinish) {
    let index = 0;
    const onItemLoad = (result) => {
      index++;
      if (index === loadedItems.length) onFinish(result);
    };

    let loadedItems = items.filter((catObj) => catObj.item);
    loadedItems.forEach((catObj) => {
      this.loaderManager.loadItemById(catObj.category, catObj.item, onItemLoad);
    });

  }
  clearCharcterData(){
    Object.keys(Categories).forEach((key) => {
      if(this.charcterProps[key]) this.charcterProps[key].dispose();
      this.charcterProps[key] = null;
    });
  }

  //#endregion

  //#region UserInput (Mouse)
  onPointerDown(ev) {}
  onPointerUp(ev) {}
  onPointerMove(ev) {}
  MouseWheelHandler(ev) {}
  //#endregion
}
