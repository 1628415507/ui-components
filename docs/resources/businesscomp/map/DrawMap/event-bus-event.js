export class EventBusEvent extends Event {
    constructor(eventName, parameters, runtimeContext) {
        super('custom');

        this.eventName = eventName;
        this.parameters = parameters;
        this.runtimeContext = runtimeContext;
    }
    getEventName() {
        return this.eventName;
    }

    getParameters() {
        return this.parameters;
    }

    getRuntimeContext() {
        return this.runtimeContext;
    }
}
