"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transmissionTypes = exports.bodyTypes = exports.fuelTypes = exports.statuses = void 0;
/** End Interfaces **/
/** Start Constants **/
exports.statuses = {
    active: "ACTIVE",
    block: "BLOCK",
};
exports.fuelTypes = ["gasoline", "diesel", "electric", "hybrid", "gas"];
exports.bodyTypes = [
    "Sedan",
    "Hatchback",
    "SUV",
    "Coupe",
    "Convertible",
    "Minivan",
    "Pickup",
    "Station Wagon",
    "Crossover",
];
exports.transmissionTypes = [
    "Automatic",
    "Manual",
    "CVT",
    "Semi-Automatic",
    "Dual-Clutch",
    "Tiptronic",
    "Sportmatic",
    "AMT",
    "DCT",
    "eCVT",
];
/** End Constants **/
