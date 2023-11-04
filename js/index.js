// Initialize the scene when everything has loaded
window.addEventListener('load', function () {
    // Define variables
    let camera, scene, renderer, controls;

    // Create a scene
    scene = new THREE.Scene();

    // Create a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    const gui = new dat.GUI();
    const cameraFolder = gui.addFolder('Camera');
    // Create a renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); // Set the background color to white
    document.body.appendChild(renderer.domElement);

    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    // Create first-person controls
    /* controls = new THREE.FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 0.1;
    controls.lookSpeed = 0.0005; */
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    // Add a grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Handle window resize
    window.addEventListener('resize', function () {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
    // Define GUI camera properties
    const positionX = cameraFolder.add(camera.position, 'x', -10, 10).name('Camera X Position');
    const positionY = cameraFolder.add(camera.position, 'y', -10, 10).name('Camera Y Position');
    const positionZ = cameraFolder.add(camera.position, 'z', -10, 10).name('Camera Z Position');
    const rotationX = cameraFolder.add(camera.rotation, 'x', -Math.PI / 2, Math.PI / 2).name('Camera X Rotation');
    const rotationY = cameraFolder.add(camera.rotation, 'y', -Math.PI, Math.PI).name('Camera Y Rotation');
    const rotationZ = cameraFolder.add(camera.rotation, 'z', -Math.PI / 2, Math.PI / 2).name('Camera Z Rotation');

    // Listen for changes and update the GUI
    positionX.onChange(function (value) {
        camera.position.x = value;
        camera.updateMatrixWorld();
        controls.update(1);
    });
    positionY.onChange(function (value) {
        camera.position.y = value;
        camera.updateMatrixWorld();
        controls.update(1);
    });
    positionZ.onChange(function (value) {
        camera.position.z = value;
        camera.updateMatrixWorld();
        controls.update(1);
    });
    rotationX.onChange(function (value) {
        camera.rotation.x = value;
        camera.updateMatrixWorld();
        controls.update(1);
    });
    rotationY.onChange(function (value) {
        camera.rotation.y = value;
        camera.updateMatrixWorld();
        controls.update(1);
    });
    rotationZ.onChange(function (value) {
        camera.rotation.z = value;
        camera.updateMatrixWorld();
        controls.update(1);
    });
    const loader = new THREE.GLTFLoader(); // Create a GLTFLoader instance
    let loadedModel; // Variable to hold the loaded 3D model
    // Load the GLTF model
    loader.load('assets/scene.glb', (gltf) => {
        loadedModel = gltf.scene; // Get the loaded 3D model
        scene.add(loadedModel); // Add it to the scene


        // Position, scale, or manipulate the loaded model as needed
        loadedModel.position.set(0, 0, 0);
        loadedModel.scale.set(1, 1, 1);
        loadedModel.rotation.y = Math.PI / 1;


    });

    // Render the scene
    function animate() {
        requestAnimationFrame(animate);
        //controls.update(1);
        renderer.render(scene, camera);
    }

    animate();
    let stage = 0;
    window.addEventListener('mousedown', () => {
        console.log(stage)
        if (stage == 0) {
            gsap.to(camera.position, {
                z: 14,
                duration: 1.5
            });
            stage++;
        } else if (stage == 1) {
            gsap.to(camera.position, {
                y: 0,
                z: 5,
                duration: 1.5
            });
            stage++;
        } else if (stage == 2) {
            gsap.to(camera.position, {
                y: 5,
                duration: 1.5
            });
            stage--;
        }

    });
    var initialScroll = 0
    // Function to handle scrolling events (both mouse and touch events)
    const handleScroll = (deltaY) => {
        if (deltaY < 0) {
            initialScroll++;
            console.log("scrolling up " + initialScroll);
            gsap.to(camera.position, {
                y: 14,
                z: 5,
                duration: 1.5
            });

        } else {
            // Scrolling down
            initialScroll--;
            console.log("scrolling down" + initialScroll);
            gsap.to(camera.position, {
                y: 0,
                z: 5,
                duration: 1.5
            });
        }
    };

    // Listen for the "wheel" event to detect mouse wheel scrolling
    document.addEventListener('wheel', (event) => handleScroll(event.deltaY), false);

    // Listen for the "touchmove" event to detect touch scrolling on mobile devices
    let touchStartY = 0;
    document.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener('touchmove', (event) => {
        const deltaY = touchStartY - event.touches[0].clientY;
        handleScroll(deltaY);
        touchStartY = event.touches[0].clientY;
    });

});
