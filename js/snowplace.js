var phi = 1.618033988749894848;
var pi = 3.14159265359;

// Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer( { antialias: true } );

  renderer.setClearColor( 0xaaddff, 1 );

// Append the canvas element created by the renderer to document body element.
document.body.appendChild( renderer.domElement );

//Create a three.js scene
var scene = new THREE.Scene();

//Create a three.js camera
var camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.01, 10000 );
scene.add(camera);

//Apply VR headset positional data to camera.
var controls = new THREE.VRControls( camera );

//Apply VR stereo rendering to renderer
var effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

scene.fog = new THREE.FogExp2( 0xaaddff, .1);

var everything = new THREE.Object3D();

//sky
var plane2Geometry = new THREE.PlaneGeometry( 100, 100, 100, 100 );
var plane2Material = new THREE.MeshLambertMaterial( {color: 0xcccccc, side: THREE.DoubleSide, wireframe:false} );
var plane2 = new THREE.Mesh( plane2Geometry, plane2Material );
plane2.rotation.x = pi/2;
plane2.position.y = 12;
everything.add( plane2 );

for (var i = 0; i < plane2.geometry.vertices.length; i++){
  plane2.geometry.vertices[i].z = 1*Math.sin(plane2.geometry.vertices[i].y/3) + Math.sin(plane2.geometry.vertices[i].x/2.6) + 1.1*Math.cos(plane2.geometry.vertices[i].y/3.8) + 2.1*Math.cos(plane2.geometry.vertices[i].x/3);
};

//snowground
var planeGeometry = new THREE.PlaneGeometry( 100, 100, 50, 50 );
var planeMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe:false} );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = -pi/2;
everything.add( plane );

for (var i = 0; i < plane.geometry.vertices.length; i++){
  plane.geometry.vertices[i].z = 1.5 - 0.5*Math.sin(plane.geometry.vertices[i].y/2) - 0.3*Math.sin(plane.geometry.vertices[i].x/3) - 0.2*Math.cos(plane.geometry.vertices[i].y/4) - 0.7*Math.cos(plane.geometry.vertices[i].x/5);
};

var eatSnowDistance = 3;

//flatground
var plane3Geometry = new THREE.PlaneGeometry( 100, 100, 50, 50 );
var plane3Material = new THREE.MeshLambertMaterial( {color: 0x662200, side: THREE.DoubleSide, wireframe:false} );
var plane3 = new THREE.Mesh( plane3Geometry, plane3Material );
plane3.rotation.x = -pi/2;
everything.add( plane3 );

  var snowFloor = 0;

//make particles
  var particles = new THREE.Geometry();
  var partCount = 2000;

  for (var p = 0; p<partCount; p++){
    var part = new THREE.Vector3(
          24*Math.random() - 12,
          10*Math.random() + snowFloor,
          24*Math.random() - 12
      );
    part.velocity = new THREE.Vector3(
      Math.random()/100,
      -Math.random()*0.02,
      Math.random()*.009);
    particles.vertices.push(part);
  }

  var partMat = new THREE.PointCloudMaterial({size:0.05});
  // var partMat = new THREE.PointCloudMaterial({
  //     color: 0xffffff,
  //     size: 1.5*c,
  //     map: THREE.ImageUtils.loadTexture("media/starflake.png"),
  //     blending: THREE.AdditiveBlending,
  //     transparent: true
  //     });
  var particleSystem = new THREE.PointCloud(particles, partMat);

  particleSystem.sortParticles = true;
  particleSystem.frustumCulled = false;
  everything.add(particleSystem);

//lights    
var light = new THREE.PointLight( 0xffffff, 1, 200);
light.position.set( -10,25,-2);
light.castShadow = true;
everything.add( light );

var tree = [];
var treeTimer = [];
var treeVector = [];
var treeHeight = [];
var treeSpeed = 0.05;
var treeNumber = 30;
for (var i = 0; i < treeNumber; i++){
  treeTimer[i] = 0;
  treeVector[i] = new THREE.Vector2();
  var treeWidth = Math.random() + 1;
  treeHeight[i] = Math.random()*5 + 3;
  tree[i] = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, treeWidth, treeHeight[i]),
    new THREE.MeshLambertMaterial({color: 0x00bb00})
    );
  tree[i].position.x = Math.random()*100 - 50;
  tree[i].position.z = Math.random()*100 - 50;
  tree[i].position.y = treeHeight[i]/2;
  everything.add(tree[i]);
}

var pine = [];
var pineNumber = 2;
var branch = [];
for (var i = 0; i < pineNumber; i++){
  var branchNumber = Math.random()*10 + 10;
  pine[i] = new THREE.Object3D();
  branch[i] = [];
  for (var j = 0; j < branchNumber; j++){
    branch[i][j] = new THREE.Mesh(
      new THREE.TetrahedronGeometry(),
      new THREE.MeshLambertMaterial({color:0x00ee00})
    );
    branch[i][j].geometry.vertices[0].z = 2;
    branch[i][j].position.y = j/branchNumber * 10;
    branch[i][j].scale.set(branchNumber/(j+5) + 1, branchNumber/(j+5) + 1, branchNumber/(j+5) + 1);
    branch[i][j].rotation.y = j*phi*pi;
    pine[i].add(branch[i][j]);
  }
  pine[i].scale.set(0.5,0.5,  0.5);
  pine[i].position.x = Math.random()*50 - 25;
  pine[i].position.z = Math.random()*50 - 25;
  everything.add(pine[i]);
}

scene.add(everything);

  var sled = new THREE.Object3D();

  // var sledCenter = new THREE.Mesh(
  //  new THREE.TetrahedronGeometry(),
  //  new THREE.MeshLambertMaterial({color: 0xffff00})
  //  );
  // sledCenter.scale.set(0.1,0.1,0.1);
  // sled.add(sledCenter);

  var sledFront = new THREE.Mesh(
    new THREE.TetrahedronGeometry(),
    new THREE.MeshLambertMaterial({color: 0x550000})
    );
  sledFront.position.z = 0.5;
  sledFront.scale.set(0.1,0.1,0.1);
  sled.add(sledFront);

  var slat = new THREE.Mesh(
    new THREE.BoxGeometry(0.5,0.05,1),
    new THREE.MeshLambertMaterial({color: 0x330000})
    );
  sled.add(slat);

  scene.add(sled);

  // var headProjection = new THREE.Mesh(
  //  new THREE.IcosahedronGeometry(),
  //  new THREE.MeshLambertMaterial({color: 0x0000ff})
  // );
  // headProjection.scale.set(0.1,0.1,0.1);
  // scene.add(headProjection);

  var pos = new THREE.Vector2;
  var moveVector = new THREE.Vector2;
  var crouchHeight = 1.2;
  var crouchToggleHeight = 0.5;
  var sledDistance = 0.8;
  var speed = 0.2;
  var sledToggle = 0;
  var sledToggleDistance = 0.4;

  var t = 0;
/*
Request animation frame loop function
*/
function animate() {
  pos.set(camera.position.x, camera.position.z);
  // headProjection.position.x = pos.x;
  // headProjection.position.z = pos.y;

  sled.rotation.y = Math.atan2(pos.x,pos.y);

  if ((pos.distanceTo(sled.position) < sledToggleDistance) && (camera.position.y < crouchToggleHeight)){
    sledToggle = 1;
  }

  if ((sledToggle == 1) && (pos.distanceTo(sled.position) < sledDistance) && (camera.position.y < crouchHeight) ){
    slat.material.color.set(0xff0000);
    moveVector.set(-pos.x, -pos.y);
    moveVector.multiplyScalar(speed);
    everything.position.x += moveVector.x;
    everything.position.z += moveVector.y;
  } else {
    sledToggle = 0;
    slat.material.color.set(0x330000);
  };

  //animate snow particles
  for (var p = 0; p<partCount; p++) {
    // check if we need to reset particles
    if (particles.vertices[p].y < snowFloor) {
      particles.vertices[p].set(
        24*Math.random() - 12 - everything.position.x,
        snowFloor + 10,
        24*Math.random() - 12 - everything.position.z);
      particles.vertices[p].velocity.y = -Math.random()/40 + 0.0001;
    }
    
    particles.vertices[p].y += particles.vertices[p].velocity.y;
    particles.vertices[p].z += particles.vertices[p].velocity.z;
    particles.vertices[p].x += particles.vertices[p].velocity.x;
  }

  for (var i = 0; i < plane.geometry.vertices.length; i++){
    var vertexPos = new THREE.Vector2();
    vertexPos.set(plane.geometry.vertices[i].x + everything.position.x, -plane.geometry.vertices[i].y + everything.position.z);
    if (vertexPos.distanceTo(pos) < eatSnowDistance){
      plane.geometry.vertices[i].z = -5;
      plane.geometry.verticesNeedUpdate = true;
    }
  };

  for (var i = 0; i < tree.length; i++){//make trees jump away from you
    var treePos = new THREE.Vector2();
    treePos.set(tree[i].position.x + everything.position.x, tree[i].position.z + everything.position.z);
    if (treePos.distanceTo(pos) < 4 && treeTimer[i] <= 0){//is it time to jump?
      treeTimer[i] = 2;
      if (treePos.x*pos.y > pos.x*treePos.y){
        var treeSign = 1;
      }else{
        var treeSign = -1;
      }
      treeVector[i].set(treePos.y * treeSign, -treePos.x * treeSign);//here is where to jump!
    }
    if (treeTimer[i] > -0.04){
      tree[i].position.x += treeVector[i].x*treeSpeed;
      tree[i].position.z += treeVector[i].y*treeSpeed;
      tree[i].position.y = 5 + treeHeight[i]/2 + -5*(treeTimer[i]-1)*(treeTimer[i]-1);//height is a parabola
      treeTimer[i] -= 0.04;
    }
  }

  for (var i = 0; i < pine.length; i++){//make ugly trees jump away from you
    var treePos = new THREE.Vector2();
    treePos.set(pine[i].position.x + everything.position.x, pine[i].position.z + everything.position.z);
    if (treePos.distanceTo(pos) < 4){
      pine[i].position.x += treePos.x/50;
      pine[i].position.z += treePos.y/50;
    }
  }

  //Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the VREffect.
  effect.render( scene, camera );
  requestAnimationFrame( animate );
}

animate();	// Kick off animation loop



/***************** TODO: Generate Your VR Scene Above *****************/



/*
Listen for click event to enter full-screen mode.
We listen for single click because that works best for mobile for now
*/
document.body.addEventListener( 'click', function(){
  effect.setFullScreen( true );
})

/*
Listen for keyboard events
*/
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.resetSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true) //fullscreen
  }
};
window.addEventListener("keydown", onkey, true);

/*
Handle window resizes
*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );


/*
Efficient Optomizationatron Listo

make cone trees actually cones

*/
