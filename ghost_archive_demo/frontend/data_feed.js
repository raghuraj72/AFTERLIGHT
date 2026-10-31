// Data streaming worker
export class SensorStreamWorker {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.active = false;
    }
    start() {
        this.active = true;
        console.log("Worker initialized on " + this.endpoint);
    }
    stop() {
        this.active = false;
    }
}
