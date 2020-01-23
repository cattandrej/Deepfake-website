import * as THREE from '/js/three.module.js';

import { OrbitControls } from '/js/OrbitControls.js';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);

var controls;

camera.position.z = 7.5;
var defaultCameraPosition = 7.5;
var focusPosition = camera.position.z - 1;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#212121");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// CONTROLS
controls = new OrbitControls(camera, renderer.domElement);  
//controls.enablePan = false;
controls.autoRotate = true;

controls.enableRotate = false;
controls.minAzimuthAngle = -.1;
controls.maxAzimuthAngle = .1;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var mouseOld = new THREE.Vector2();

var meshes = [];
class pos {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
;
var posList = [];

var currentMesh = -1;
var focus = false;

var color = {
    'selected': 0xff0000,
    'deselected': 0xFFCC00
}

//
// VIDEO AREA GENERATION
//
for (var i = 0; i < 20; i++) {
    var geometry = new THREE.BoxGeometry(1.6, .9, .01);
    var material = new THREE.MeshLambertMaterial({ color: color.deselected });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set((Math.random() - .5) * 8, (Math.random() - .5) * 5, (Math.random() - .5) * 10);
    mesh.rotation.set(0, 0, 0);

    meshes.push(mesh);

    var temp = new pos;

    temp.x = mesh.position.x;
    temp.y = mesh.position.y;
    temp.z = mesh.position.z;

    posList.push(temp);
}

//
// ADDING GENERATED VIDEO AREAS TO VIEWPORT
// 
for (var i = 0; i < meshes.length; i++) {
    scene.add(meshes[i]);
}

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 0, 15);
scene.add(light);


//
// ANIMATION LOOP
//
var render = function () {
    //console.log(controls.getPolarAngle());
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    controls.autoRotateSpeed = (mouse.x - mouseOld.x) * 10;

    mouseOld.x = mouse.x;
    controls.update();
}

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);

    var nearestCameraDistance = 99999;
    var nearestCameraObj = -1;
    var id = -1;

    for (var i = 0; i < intersects.length; i++) {
        var x = camera.position.x;
        var y = camera.position.y;
        var z = camera.position.z;
        var currentDistance = Math.sqrt((intersects[i].object.position.x - x) * (intersects[i].object.position.x - x) +
            (intersects[i].object.position.y - y) * (intersects[i].object.position.y - y) +
            (intersects[i].object.position.z - z) * (intersects[i].object.position.z - z));

        if (currentDistance < (nearestCameraDistance)) {
            nearestCameraObj = i;
            nearestCameraDistance = currentDistance;
        }
    }

    if (intersects.length > 0) {
        id = intersects[nearestCameraObj].object.id;
        currentMesh = id;

        for (var i = 0; i < meshes.length; i++) {

            if (meshes[i].id != id) {
                meshes[i].material.color.set(color.deselected);
                this.tl = new TimelineMax(.1);
                this.tl.to(meshes[i].scale, .5, { x: 1.00, y: 1.00, ease: Expo.easeOut })
            }
        }

        //var randomColor = (Math.random()*0xFFFFFF<<0);
        intersects[nearestCameraObj].object.material.color.set(color.selected);
        this.tl = new TimelineMax(.1);
        this.tl.to(intersects[nearestCameraObj].object.scale, .5, { x: 1.25, y: 1.25, ease: Expo.easeOut })

    } else {
        if (!focus) {
            currentMesh = -1;
            for (var i = 0; i < meshes.length; i++) {
                meshes[i].material.color.set(color.deselected);
                this.tl = new TimelineMax(.1);
                this.tl.to(meshes[i].scale, .5, { x: 1, y: 1, ease: Expo.easeOut })
            }
        } else {
            currentMesh = -1;
            for (var i = 0; i < meshes.length; i++) {
                meshes[i].material.color.set(color.deselected);
            }
        }
    }
}

function onMouseClick(event) {

    focusPosition = camera.position.z - 1;
    console.log(currentMesh);

    if (currentMesh != -1) {
        for (var i = 0; i < meshes.length; i++) {
            if (meshes[i].id == currentMesh) {
                //meshes[i].position.x = 0;
                //meshes[i].position.y = 0;
                //meshes[i].position.z = focusPosition;

                focus = true;
                this.tl = new TimelineMax(.1);
                this.tl.to(meshes[i].position, .125, { x: 0, y: 0, z: focusPosition, ease: Expo.easeOut })
            } else {

                    this.tl = new TimelineMax(.1);
                    this.tl.to(meshes[i].position, .125, { x: posList[i].x, y: posList[i].y, z: posList[i].z, ease: Expo.easeOut })

            }
        }
    } else {
        console.log("Click on nothing");
        for (var i = 0; i < meshes.length; i++) {
            focus = false;
            //meshes[i].position.x = posList[i].x;
            //meshes[i].position.y = posList[i].y;
            //meshes[i].position.z = posList[i].z;


                this.tl = new TimelineMax(.1);
                this.tl.to(meshes[i].position, .125, { x: posList[i].x, y: posList[i].y, z: posList[i].z, ease: Expo.easeOut })


        }
        currentMesh = -1;
    }
}

render();

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onMouseClick);