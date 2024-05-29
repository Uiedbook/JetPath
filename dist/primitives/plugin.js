export class JetPlugin {
    name;
    version;
    executor;
    constructor({ name, version, executor, }) {
        this.name = name;
        this.version = version;
        this.executor = executor;
    }
    _setup(init) {
        return this.executor(init);
    }
}
