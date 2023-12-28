const { Servient, Helpers } = require("@node-wot/core");
const { HttpClientFactory } = require("@node-wot/binding-http");
const mqtt = require('mqtt');


const core_1 = require("@node-wot/core");
const binding_coap_1 = require("@node-wot/binding-coap");
const binding_mqtt_1 = require("@node-wot/binding-mqtt");

// create Servient add CoAP binding with port configuration
const servient = new core_1.Servient();
servient.addServer(new binding_coap_1.CoapServer(5686));
servient.addServer(new binding_mqtt_1.MqttBrokerServer({ uri: "mqtt://test.mosquitto.org" }));
core_1.Helpers.setStaticAddress("plugfest.thingweb.io"); 

let minuteCounter = 0;
let hourCounter = 0;
async function timeCount(clock) {
    for (minuteCounter = 0; minuteCounter < 59; minuteCounter++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep
        clock.emitPropertyChange("time");
    }
    console.info({
        hour: hourCounter,
        minute: minuteCounter,
    });
    hourCounter++;
    if (hourCounter === 24) {
        hourCounter = 0;
    }
}

//..


servient.start().then(async (WoT) => {
    let coffeeMade = false;
    console.log("Servient started");

    servient.addClientFactory(new HttpClientFactory());
    const wotHelper = new Helpers(servient);
    const coffeeMachineTD = await wotHelper.fetch("http://plugfest.thingweb.io:8083/smart-coffee-machine");
    const spotifyTD = await wotHelper.fetch("http://localhost:4444/spotifyplayer");

    console.log(`Coffee Machine TD: ${coffeeMachineTD.id}`);
    console.log(`spotify TD: ${spotifyTD.id}`);

    const coffeeMachine = await WoT.consume(coffeeMachineTD);
    const spotify = await WoT.consume(spotifyTD);
    console.log("Consumed things");

    const coffeeMachineResourcesOutput = await coffeeMachine.readProperty("allAvailableResources");
    const coffeeMachineResources = await coffeeMachineResourcesOutput.value();
    console.log("Coffee Machine resources:", JSON.stringify(coffeeMachineResources));

// Producing Smart Clock
const smartClockDescription = {
    title: "Smart Clock",
    description: "a smart clock that runs 60 times faster than real time, where 1 hour happens in 1 minute.",
    support: "https://github.com/eclipse-thingweb/node-wot/",
    "@context": "https://www.w3.org/2022/wot/td/v1.1",
    properties: {
        time: {
            readOnly: true,
            observable: true,
            type: "object",
            properties: {
                minute: {
                    type: "integer",
                    minimum: 0,
                    maximum: 59,
                },
                hour: {
                    type: "integer",
                    minimum: 0,
                    maximum: 23,
                },
            },
        },
    },
};

const smartClock = await WoT.produce(smartClockDescription);

console.log("Produced " + smartClock.getThingDescription().title);

smartClock.setPropertyReadHandler("time", async () => {
    return {
        hour: hourCounter,
        minute: minuteCounter,
    };
});

timeCount(smartClock);

setInterval(async () => {
    timeCount(smartClock);
    smartClock.emitPropertyChange("time");
}, 61000);

smartClock.expose().then(() => {
    console.info(smartClock.getThingDescription().title + " ready");
});

        //...
        // Producing PresenceSensor
    const presenceSensorDescription = {
        title: "PresenceSensor",
        description: "Thing that can detect the presence of a human nearby",
        support: "https://github.com/eclipse-thingweb/node-wot/",
        "@context": "https://www.w3.org/2022/wot/td/v1.1",
        events: {
            presenceDetected: {
                title: "Presence Detected",
                description: "An event that is emitted when a person is detected in the room. It is mocked and emitted every 5 seconds",
                data: {
                    type: "number",
                    title: "Distance",
                    minimum: 55,
                    maximum: 1200,
                },
            },
        },
    };

    const presenceSensor = await WoT.produce(presenceSensorDescription);

    console.log("Produced Presence Sensor");

    presenceSensor.expose().then(() => {
        console.info("Presence Sensor ready");


setInterval(async () => {
    // Read the time property from the clock Thing
    await timeCount(smartClock);

    // Emulate presence detection event
    const distance = Math.random() * (1200 - 55) + 55;
    presenceSensor.emitEvent("presenceDetected", distance);
    console.info("Emitted presence with distance", distance);

    // Check if the hour is more than 2s
    if (hourCounter >= 2 && !coffeeMade) {
        console.log("Time to make coffee");
        console.log("Coffee made");
        spotify.invokeAction("play-pause");
        coffeeMade = true;
    }
}, 5000);


    });
});
    
    
        