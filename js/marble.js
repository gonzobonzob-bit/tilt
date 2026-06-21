const Marble = {
    mesh: null,
    impostor: null,
    radius: 0.5,
    tiltForce: 12,
    maxSpeed: 15,

    create(scene, position) {
        if (this.mesh) this.mesh.dispose();

        this.mesh = BABYLON.MeshBuilder.CreateSphere('marble', { diameter: this.radius * 2, segments: 24 }, scene);
        this.mesh.position = position.clone();

        const mat = new BABYLON.StandardMaterial('marbleMat', scene);
        mat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.9);
        mat.specularColor = new BABYLON.Color3(0.8, 0.8, 1.0);
        mat.specularPower = 64;
        const fresnelParams = new BABYLON.FresnelParameters();
        fresnelParams.bias = 0.1;
        fresnelParams.power = 2;
        fresnelParams.leftColor = new BABYLON.Color3(1, 1, 1);
        fresnelParams.rightColor = new BABYLON.Color3(0.2, 0.5, 0.9);
        mat.reflectionFresnelParameters = fresnelParams;
        this.mesh.material = mat;

        this.impostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1, friction: 0.6, restitution: 0.3 },
            scene
        );

        return this.mesh;
    },

    applyTilt(tiltX, tiltZ) {
        if (!this.impostor) return;

        const vel = this.impostor.getLinearVelocity();
        const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

        if (speed < this.maxSpeed || (tiltX * vel.x + tiltZ * vel.z) < 0) {
            const force = new BABYLON.Vector3(
                tiltX * this.tiltForce,
                0,
                -tiltZ * this.tiltForce
            );
            this.impostor.applyForce(force, this.mesh.getAbsolutePosition());
        }
    },

    getPosition() {
        return this.mesh ? this.mesh.position : BABYLON.Vector3.Zero();
    },

    reset(position) {
        if (!this.mesh || !this.impostor) return;
        this.mesh.position = position.clone();
        this.impostor.setLinearVelocity(BABYLON.Vector3.Zero());
        this.impostor.setAngularVelocity(BABYLON.Vector3.Zero());
    },

    isFallen(hazardY) {
        return this.mesh && this.mesh.position.y < hazardY;
    },

    dispose() {
        if (this.mesh) {
            this.mesh.dispose();
            this.mesh = null;
            this.impostor = null;
        }
    }
};
