export class Input {
	static setCamera(camera) {
		Input.camera = camera;
	}

	static setCanvas(canvas) {
		if(Input.canvas) {
			Input.updateInputListeners(canvas, false);
		}

		Input.updateInputListeners(canvas, true);
		Input.canvas = canvas;
	}

	static updateInputListeners(canvas, add) {
		if(!canvas) {
			return;
		}

		let method = add ? canvas.addEventListener : canvas.removeEventListener;
		method('mousemove', Input.onMouseMove);
		method('mouseup', Input.onMouseUpDown);
		method('mousedown', Input.onMouseUpDown);
	}

	static onMouseMove(event) {
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		Input.mouse.x = ( (event.pageX - Input.canvas.offsetLeft) / Input.canvas.offsetWidth ) * 2 - 1;
		Input.mouse.y = - ( (event.pageY - Input.canvas.offsetTop) / Input.canvas.offsetHeight ) * 2 + 1;

		Input.worldMouse.set(Input.mouse.x, Input.mouse.y, 0.5);
		Input.worldMouse.unproject(Input.camera);
		let dir = Input.worldMouse.sub( Input.camera.position ).normalize();
		let distance = -Input.camera.position.z / dir.z;
		Input.worldMouse = Input.camera.position.clone().add( dir.multiplyScalar( distance ) );
	}

	static onMouseUpDown(event) {
		event.preventDefault();
		Input.mouse.down = event.type === 'mousedown';
		Input.mouse.up = !Input.mouse.down;
	}
}
Input.mouse = new THREE.Vector2();
Input.worldMouse = new THREE.Vector3();
