import './style.css'
// var song = new Audio("../song.mp3");
import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// Import samples
import song from './song.mp3';
import importBass from './bbass.mp3';
import importKick from './kick.mp3';
import importSnare from './snare.mp3';
import importCymbals from './cymbals.mp3';
import importSynth from './synth.mp3';


(function() {
  'use strict';
  var scene = new THREE.Scene()
  // Debug
  var gui = new dat.GUI()
  // Loader
  var textureLoader = new THREE.TextureLoader()
  // Canvas
  var canvas = document.querySelector('canvas.webgl')

  // Get samples
  var bassSample = new Audio(importBass);
  var kickSample = new Audio(importKick);
  var snareSample = new Audio(importSnare);
  var cymbalSample = new Audio(importCymbals);
  var synthSample = new Audio(importSynth);
  var sampleLibrary = [bassSample, kickSample, snareSample, cymbalSample, synthSample]
  // data objects for each sound sample
  var bassSampleCloud = {}
  var kickSampleCloud = {}
  var snareSampleCloud = {}
  var cymbalSampleCloud = {}
  var synthSampleCloud = {}

  // Add active class to change button color
  $('.playBtn').click(function(e) {
    e.target.classList.toggle("active")
  })

  // Start engines first to ensure samples are in sync
  $('#startMusic').click(function() {
    play()
    for (var i = 0; i < sampleLibrary.length; i++) {
      sampleLibrary[i].play()
      sampleLibrary[i].muted = true
    }
  });

  // Mute/Unute function
  function playPause(theSample, theElement) {
    if (theElement.classList.contains('active')) {
      theSample.muted = false
    } else if (theElement.classList.contains('active') === false) {
      theSample.muted = true
    }
  }
  // Activate samples on click
  $('#playKick').click(function() {
    playPause(kickSample, playKick)
  });

  $('#playSnare').click(function() {
    playPause(snareSample, playSnare)
  });

  $('#playBass').click(function() {
    playPause(bassSample, playBass)
  });

  $('#playCymbal').click(function() {
    playPause(cymbalSample, playCymbal)
  });

  $('#playSynth').click(function() {
    playPause(synthSample, playSynth)
  });

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //      Objects
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  // Snare Objects--------------------------------------------------
  function createBall() {
    var geometry = new THREE.CircleBufferGeometry(6, 64, 64);
    var material = new THREE.MeshBasicMaterial({
      color: 0x999999
    });

    var ball = new THREE.Mesh(geometry, material);
    return ball
  }
  var smallSphereGroup = new THREE.Group();
  // create the first ball
  var protoSphere = createBall()
  // clone protoball 40 times
  for (var i = 0; i < 40; i++) {
    var sphere = protoSphere.clone();

    // Add the speheres to the group
    smallSphereGroup.add(sphere);
  }
  scene.add(smallSphereGroup)

  // Synth objects ----------------------------------------------------------
  function createSynthBalls() {
    var synthGeometry = new THREE.CircleBufferGeometry(1, 64, 64);
    var synthMaterial = new THREE.MeshBasicMaterial({
      color: 0x1ec3f7,
      reflectivity: 0,
      transparent: false,
      opacity: .8
    });

    var synthball = new THREE.Mesh(synthGeometry, synthMaterial);
    return synthball
  }
  var synthGroup = new THREE.Group();
  var protoSynth = createSynthBalls()

  for (var i = 0; i < 10; i++) {
    var synthClones = protoSynth.clone();
    synthGroup.add(synthClones);
  }
  scene.add(synthGroup)

  // Create Cymbal Objects ------------------------------------------------------
  function createCymbalObjects() {
    var cymbalGeometry = new THREE.CircleBufferGeometry(6, 64);
    var cymbalMaterial = new THREE.MeshBasicMaterial({
      color: 0xd9d9d9,
      reflectivity: .5
    });

    var cymbalObject = new THREE.Mesh(cymbalGeometry, cymbalMaterial);
    return cymbalObject
  }

  var cymbalGroup = new THREE.Group();
  var protoCymbal = createCymbalObjects()

  for (var i = 0; i < 8; i++) {
    var cymbalClones = protoCymbal.clone();
    cymbalGroup.add(cymbalClones);
  }

  scene.add(cymbalGroup)

  // Kick Ball -----------------------------------------------------
  var bigBall = new THREE.Mesh(
    new THREE.SphereBufferGeometry(25, 64, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xff70ac,
      roughness: 0.6,
      reflectivity: 0.2,
      clearcoat: 0,
      metalness: .1,
      wireframe: true
    })
  );
  bigBall.position.set(0, 0, 0)
  scene.add(bigBall)
  // Cage/Bass object ----------------------------------------------------
  var cageGeometry = new THREE.CylinderGeometry(350, 250, 180, 40, 20);
  var cageMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6904ce,
    side: THREE.DoubleSide,
    wireframe: true
  });

  var cage = new THREE.Mesh(cageGeometry, cageMaterial);
  cage.position.set(0, 0, 0);
  scene.add(cage);

  // Lights :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var ambientLight = new THREE.AmbientLight(0x606060, .5);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xc9ad64, 0, 0, 2);
  pointLight.position.set(50, 500, -300);
  scene.add(pointLight);

  // Gui Controls
  var setPointLight = gui.addFolder('Point Light Settings')
  setPointLight.add(pointLight.position, 'x').min(-1000).max(1000).step(0.01)
  setPointLight.add(pointLight.position, 'z').min(-1000).max(1000).step(0.01)
  setPointLight.add(pointLight.position, 'y').min(-1000).max(1000).step(0.01)
  setPointLight.add(pointLight, 'intensity').min(0).max(10).step(0.01)

  var pointLight2 = new THREE.PointLight(0x30a9c90, 0, 0, 2);
  pointLight2.position.set(50, -500, 300);
  scene.add(pointLight2);

  var setPointLight2 = gui.addFolder('Point Light 2 Settings')
  setPointLight2.add(pointLight2.position, 'x').min(-1000).max(1000).step(0.001)
  setPointLight2.add(pointLight2.position, 'z').min(-1000).max(1000).step(0.01)
  setPointLight2.add(pointLight2.position, 'y').min(-1000).max(1000).step(0.01)
  setPointLight2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

  var cymbalLight = new THREE.SpotLight(0xf425ff, 0, 0, Math.PI / 30);
  scene.add(cymbalLight);


  // Camera ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  var aspectRatio = window.innerWidth / window.innerHeight;
  var cameraWidth = 150;
  var cameraHeight = cameraWidth / aspectRatio;

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(scene.position);
  scene.add(camera);
  camera.position.set(0, -8, 0);
  camera.lookAt(0, 0, 0);

  // Controls
  var controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  //  Renderer ------------------------------------------------------------ //
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;
  renderer.setAnimationLoop(() => {
    cage.rotation.y += 0.003;
    bigBall.rotation.y -= 0.007;
    renderer.render(scene, camera);
  });

  var sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  function play() {

    var context = new AudioContext();

    function connectSource(insertSong, cloudAnalyser) {
      var src = context.createMediaElementSource(insertSong);
      var analyser = context.createAnalyser();
      src.connect(analyser);
      analyser.minDecibels = -85;
      analyser.maxDecibels = -10;
      analyser.smoothingTimevarant = .9
      analyser.connect(context.destination);
      analyser.fftSize = 512;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      // set arrays for indidual objects
      cloudAnalyser.analyser = analyser
      cloudAnalyser.dataArray = dataArray
    }

    connectSource(bassSample, bassSampleCloud)
    connectSource(kickSample, kickSampleCloud)
    connectSource(snareSample, snareSampleCloud)
    connectSource(cymbalSample, cymbalSampleCloud)
    connectSource(synthSample, synthSampleCloud)

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //                             Render And Animate
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    function render() {

      function compileData(theCloud, theData) {
        theCloud.analyser.getByteFrequencyData(theData)
        var getMaxByte = max(theData)
        var getMinByte = max(theData)
        var avgFreq = avg(theData)
        var lowerHalfArray = theData.slice(0, (theData.length / 4) - 1);
        var upperHalfArray = theData.slice((theData.length / 2) - 1, theData.length - 1);
        var lowerMax = max(lowerHalfArray) / 100
        var lowerMin = min(lowerHalfArray)
        var upperMax = max(theData)

        theCloud.lowerHalfArray = lowerHalfArray
        theCloud.upperHalfArray = upperHalfArray
        theCloud.lowerMax = lowerMax
        theCloud.upperMax = upperMax
        theCloud.max = getMaxByte
        theCloud.min = getMinByte
        theCloud.avg = avgFreq
      }
      // console.log(camera.position);
      compileData(bassSampleCloud, bassSampleCloud.dataArray);
      compileData(kickSampleCloud, kickSampleCloud.dataArray);
      compileData(snareSampleCloud, snareSampleCloud.dataArray);
      compileData(cymbalSampleCloud, cymbalSampleCloud.dataArray);
      compileData(synthSampleCloud, synthSampleCloud.dataArray);

      // Lights ---------------------------------------------------------------
      cymbalLight.position.set(cymbalSampleCloud.avg * 10, cymbalSampleCloud.avg * 10, cymbalSampleCloud.max);
      cymbalLight.intensity = cymbalSampleCloud.max / 110
      pointLight.intensity = kickSampleCloud.max / 110
      pointLight2.intensity = kickSampleCloud.max / 110
      // Kick Ball Animation  ---------------------------------------------------------
      // using a variable to keep scale at least 1
      var ballx = 1 + kickSampleCloud.lowerMax
      bigBall.scale.set(ballx, ballx, ballx)

      // Bass Animation  ---------------------------------------------------------
      var moveCageY = 1 + bassSampleCloud.avg / 5
      var moveCageZ = 1 + bassSampleCloud.avg / 4
      cage.scale.set(1, moveCageY, moveCageZ)

      // Synth -----------------------------------------------------

      for (var i = 0; i < synthGroup.children.length; i++) {
        synthGroup.children[i].position.y = i * synthSampleCloud.avg / .5
        synthGroup.children[i].position.z = i * synthSampleCloud.avg / .5
        synthGroup.children[i].position.x = i * synthSampleCloud.avg / .5
        synthGroup.children[i].rotation.x = i * synthSampleCloud.max / 40

        synthGroup.children[i].scale.set(synthSampleCloud.avg, synthSampleCloud.avg, synthSampleCloud.avg)
      }
      synthGroup.rotation.x = synthSampleCloud.avg


      // Small Spheres-----------------------------------------------
      for (var i = 0; i < 20; i++) {
        smallSphereGroup.children[i].position.x = snareSampleCloud.dataArray[getRandomNum(63)]
        smallSphereGroup.children[i].position.y = snareSampleCloud.dataArray[getRandomNum(63)]
        smallSphereGroup.children[i].position.z = snareSampleCloud.dataArray[getRandomNum(63)]
      }
      for (var i = 0; i < 20; i++) {
        smallSphereGroup.children[i].position.x -= snareSampleCloud.dataArray[getRandomNum(63)]
        smallSphereGroup.children[i].position.y -= snareSampleCloud.dataArray[getRandomNum(63)]
        smallSphereGroup.children[i].position.z -= snareSampleCloud.dataArray[getRandomNum(63)]
      }

      // Cymbals -----------------------------------------------
      for (var i = 0; i < cymbalGroup.children.length; i++) {
        cymbalGroup.children[i].position.y = cymbalSampleCloud.avg
        cymbalGroup.children[i].position.x = 10 + i * -2 / cymbalSampleCloud.avg
        cymbalGroup.children[i].scale.set(cymbalSampleCloud.avg / 10, cymbalSampleCloud.avg / 10, cymbalSampleCloud
          .avg / 10)
      }

      requestAnimationFrame(render)
    }


    // Get random number function
    function getRandomNum(max) {
      return Math.floor(Math.random() * max);
    }

    function max(arr) {
      return arr.reduce(function(a, b) {
        return Math.max(a, b);
      })
    }

    function min(arr) {
      return arr.reduce(function(a, b) {
        return Math.min(a, b);
      })
    }

    function avg(arr) {
      var total = arr.reduce(function(sum, b) {
        return sum + b;
      });
      return (total / arr.length);
    }

    render()
    // Play Function Ends
  }
}());
