import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { Categories } from "../../Config.json";

export default class LoaderManager {
  constructor(sceneManager) {
    this.game = sceneManager.game;
    this.scene = sceneManager.scene;
    this.sceneManager = sceneManager;
  }
  loadItemById(type, name, onLoad = null) {
    //Load Sock Model
    console.log("type", type, "-__-", name);
    let loadingOpts = {
      path: `./models/${type}/`,
      name: `${name}.gltf`,
    };

    let assetsManager = new BABYLON.AssetsManager(this.scene);
    let itemTask = assetsManager.addMeshTask(
      "itemTask",
      "",
      loadingOpts.path,
      loadingOpts.name
    );
    itemTask.onSuccess = (task) => {
      let itemMesh = task.loadedMeshes.find((mesh) => mesh.name === "__root__");
      this.sceneManager.charcterProps[type] = itemMesh;
      this.sceneManager.charcterProps[type].myId = name;
      if (name !== "base") {
        this.sceneManager.charcterProps[type].price =
          Categories[type][name].price;

        this.sceneManager.charcterProps[type].itemName =
          Categories[type][name].name;
      }

      for (let j = 0; j < task.loadedMeshes.length; j++) {
        let mesh = task.loadedMeshes[j];
        if (mesh.getTotalVertices() > 0) {
          //if it's mesh
          this.sceneManager.mirror.renderList.push(mesh);
          // this.sceneManager.shadowGenerator
          //   .getShadowMap()
          //   .renderList.push(mesh);
          // this.sceneManager.shadowGenerator.addShadowCaster(mesh, true);
        }
      }
      if (type === "pet") {
        const { opt } = Categories[type][name];

        itemMesh.position = new BABYLON.Vector3(opt.x, opt.y, 0);
        itemMesh.scaling = new BABYLON.Vector3(opt.scale, opt.scale, opt.scale);
      } else {
        itemMesh.scaling = new BABYLON.Vector3(5, 5, 5);
      }
      if (name === "baloon") itemMesh.position.x = -7;

      onLoad({
        data: this.sceneManager.getCharcterSummary(),
        totalPrice: this.sceneManager.getTotatlPrice(),
      });
    };

    assetsManager.onProgress = (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) => {
      this.game.engine.loadingUIText =
        "loading Assets " +
        remainingCount +
        " out of " +
        totalCount +
        " items still need to be loaded.";
    };

    assetsManager.onFinish = (tasks) => {
      // console.log("disable Loading bar");
    };
    // Start loading
    assetsManager.useDefaultLoadingScreen = false;
    assetsManager.load();
  }
}
