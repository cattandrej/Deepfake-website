var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var meshes = [];

//
// VIDEO AREA GENERATION
//
for (var i = 0; i < 20; i++) {
    var geometry = new THREE.BoxGeometry(1.6, .9, .01);
    var material = new THREE.MeshLambertMaterial( { color: 0xFFCC00 } );
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set((Math.random() -.5) * 8, (Math.random() -.5) * 5, (Math.random() -.5) * 10);
    mesh.rotation.set(0,0,0);

    meshes.push(mesh);
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

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);

    var nearestCameraDistance = 99999;
    var nearestCameraObj = -1;

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
        console.log("camDist: " + currentDistance + ", nearest: " + nearestCameraDistance);
    }

    if (intersects.length > 0) {
        var randomColor = (Math.random()*0xFFFFFF<<0);
        intersects[nearestCameraObj].object.material.color.set(randomColor);
        this.tl = new TimelineMax(.1);
        this.tl.to(intersects[nearestCameraObj].object.scale, .5, { x: 1.25, y: 1.25, ease: Expo.easeOut } )   
    }
}

render();

window.addEventListener( "mousemove", onMouseMove);