import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import * as dat from "https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.module.js";
import Stats from "https://mrdoob.github.io/stats.js/build/stats.module.js";

basicsGeometriesJS();

function basicsGeometriesJS() {
  const canvas = {
    el: document.querySelector(".geometrie-3d"),
    width: window.innerWidth,
    height: window.innerHeight,
  };

  render3d({
    canvas: canvas.el,
    width: canvas.width,
    height: canvas.height,
    model: renderModel(),
    camera: renderCamera(),
    wireframe: true,
  });

  function renderCamera() {
    const ratio = canvas.width / canvas.height;
    const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);

    camera.position.set(1, 1, 6);
    camera.lookAt(renderModel().model.position);

    return camera;
  }

  function renderModel() {
    const geometry = new THREE.TorusGeometry(3, 0.6, 10, 35);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.MeshBasicMaterial({ color: 0x352935 });
    const model = new THREE.Mesh(geometry, material);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.39;
    line.material.transparent = true;

    const geometry2 = new THREE.OctahedronGeometry(1.3, 0);
    const wireframe2 = new THREE.WireframeGeometry(geometry2);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x352935 });
    const model2 = new THREE.Mesh(geometry2, material2);
    const line2 = new THREE.LineSegments(wireframe2);
    line2.material.depthTest = false;
    line2.material.opacity = 0.75;
    line2.material.transparent = true;

    return { model, model2, line, line2 };
  }

  function render3d(config) {
    const camera = config.camera;
    const model = config.model;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGL1Renderer({ canvas: config.canvas });
    const controls = new OrbitControls(camera, config.canvas);
    const stats = new Stats();

    if (config.wireframe) {
      scene.add(model.line);
      scene.add(model.line2);
    }
    scene.add(model.model);
    scene.add(model.model2);
    scene.add(camera);

    renderer.setSize(config.width, config.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);

    initStats();
    gui();
    resize();
    animate();

    function resize() {
      window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.width, canvas.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.render(scene, camera);
      });
    }

    function animate() {
      setTimeout(function () {
        const speed = 0.015;

        model.model.rotation.x += speed;
        model.model.rotation.y += -speed;
        model.line.rotation.x += speed;
        model.line.rotation.y += -speed;

        model.model2.rotation.x += speed;
        model.model2.rotation.y += speed;
        model.line2.rotation.x += speed;
        model.line2.rotation.y += speed;

        controls.enableDamping = true;
        controls.update();

        renderer.render(scene, camera);
        stats.update();

        requestAnimationFrame(animate);
      }, 50);
    }

    function gui() {
      const gui = new dat.GUI();
      const options = {
        color: 0x352935,
        isVisible: true,
        wireframe: true,
        opacityWireframe: 0.39,
      };

      gui
        .addColor(options, "color")
        .name("Color:")
        .onChange(function () {
          model.model.material.color.setHex(options.color);
          model.model2.material.color.setHex(options.color);
        });
      gui
        .add(options, "wireframe")
        .name("Wireframe:")
        .onChange(function (bol) {
          if (config.wireframe) {
            model.line.visible = bol;
            model.line2.visible = bol;
          }
        });
      gui
        .add(options, "opacityWireframe")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Wireframe | Opacity:")
        .onChange(function (num) {
          if (config.wireframe) {
            console.log(num);
            model.line.material.opacity = num;
            model.line2.material.opacity = num;
          }
        });
      gui
        .add(options, "isVisible")
        .name("Remove color:")
        .onChange(function (bol) {
          model.model.visible = bol;
          model.model2.visible = bol;
        });
    }

    function initStats() {
      for (let i = 0; i < 2; i++) {
        stats.showPanel(i);
        stats.dom.classList.add("stats");
        document.body.appendChild(stats.dom);
      }
    }
  }
}
