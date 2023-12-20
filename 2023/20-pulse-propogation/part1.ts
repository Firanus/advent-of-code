import path from "path";
import fs from "fs";

type ModuleType = "FlipFlop" | "Conjunction" | "Broadcaster" | "Output";
type ModuleMap = { [key: string]: Module };

interface Module {
  type: ModuleType;
  id: string;
  inputs: string[];
  outputs: string[];
}

interface FlipFlopModule extends Module {
  type: "FlipFlop";
  state: boolean;
}

interface ConjunctionModule extends Module {
  type: "Conjunction";
  inputStates: { [key: string]: boolean };
}

const getModuleMapKey = (map: ModuleMap) =>
  Object.keys(map)
    .map((key) => {
      if (map[key].type === "Broadcaster") return key;
      if (map[key].type === "FlipFlop") {
        const flipFlop = map[key] as FlipFlopModule;
        return `${key}-${flipFlop.state}`;
      }
      if (map[key].type === "Conjunction") {
        const conjunction = map[key] as ConjunctionModule;
        return `${key}-${Object.keys(conjunction.inputStates)
          .map((inputKey) => `${inputKey}:${conjunction.inputStates[inputKey]}`)
          .join("-")}`;
      }

      return `${key}-${map[key].type}`;
    })
    .join(";");

const runPulseCycle = (modules: ModuleMap): { low: number; high: number } => {
  const pulsesToSend: [string, boolean, string][] = [
    ["broadcaster", false, "button"],
  ];
  const pulsesSent = { low: 0, high: 0 };

  while (pulsesToSend.length) {
    const [pulseTarget, isHigh, source] = pulsesToSend.shift() as [
      string,
      boolean,
      string
    ];
    isHigh ? pulsesSent.high++ : pulsesSent.low++;

    const module = modules[pulseTarget];

    if (module.type === "Output" && !isHigh) {
      continue;
    }

    if (module.type === "FlipFlop") {
      const flipFlop = module as FlipFlopModule;
      if (isHigh) continue;

      flipFlop.state = !flipFlop.state;
      flipFlop.outputs.forEach((output) => {
        pulsesToSend.push([output, flipFlop.state, flipFlop.id]);
      });
      continue;
    }

    if (module.type === "Conjunction") {
      const conjunction = module as ConjunctionModule;
      conjunction.inputStates[source] = isHigh;

      const shouldSendHigh = !Object.values(conjunction.inputStates).every(
        (state) => state === true
      );

      conjunction.outputs.forEach((output) => {
        pulsesToSend.push([output, shouldSendHigh, conjunction.id]);
      });
      continue;
    }

    const broadcaster = module as Module;
    broadcaster.outputs.forEach((output) => {
      pulsesToSend.push([output, isHigh, broadcaster.id]);
    });
  }

  return pulsesSent;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const modules: ModuleMap = data.split("\n").reduce((acc, moduleStr) => {
      const [typeInfo, outputs] = moduleStr.split(" -> ");
      if (typeInfo === "broadcaster") {
        acc["broadcaster"] = {
          type: "Broadcaster",
          id: "broadcaster",
          inputs: [],
          outputs: outputs.split(", "),
        };
        return acc;
      }

      const typeKey = typeInfo.slice(0, 1);
      const id = typeInfo.slice(1);
      if (typeKey === "%") {
        const flipFlop: FlipFlopModule = {
          type: "FlipFlop",
          id,
          inputs: [],
          outputs: outputs.split(", "),
          state: false,
        };
        acc[id] = flipFlop;
      } else if (typeKey === "&") {
        const conjunction: ConjunctionModule = {
          type: "Conjunction",
          id,
          inputs: [],
          outputs: outputs.split(", "),
          inputStates: {},
        };
        acc[id] = conjunction;
      }
      return acc;
    }, {} as ModuleMap);

    Object.keys(modules).forEach((moduleId) => {
      const module = modules[moduleId];
      module.outputs.forEach((output) => {
        const outputModule = modules[output];
        if (!outputModule) {
          modules[output] = {
            type: "Output",
            id: output,
            inputs: [moduleId],
            outputs: [],
          };
          return;
        }
        modules[output].inputs.push(moduleId);

        if (modules[output].type === "Conjunction") {
          const outputModule = modules[output] as ConjunctionModule;
          outputModule.inputStates[moduleId] = false;
        }
      });
    });

    const seenStates = [getModuleMapKey(modules)];
    const pulsesSentCounts: { low: number; high: number }[] = [];
    const BUTTON_PRESS_COUNT = 1000;
    const allPulsesSent = { low: 0, high: 0 };

    for (let i = 0; i < BUTTON_PRESS_COUNT; i++) {
      const pulsesSent = runPulseCycle(modules);
      pulsesSentCounts.push(pulsesSent);

      const newModuleMapKey = getModuleMapKey(modules);
      if (seenStates.includes(newModuleMapKey)) {
        const indexOfPreviousVisit = seenStates.indexOf(newModuleMapKey);
        const cycleLength = seenStates.length - indexOfPreviousVisit;
        console.log(
          "Cycle found at button press",
          i + 1,
          "of length",
          cycleLength
        );

        const remainingPresses = BUTTON_PRESS_COUNT - (i + 1);

        const remainingCycles = Math.floor(remainingPresses / cycleLength);
        const remainingPressesInCycle = remainingPresses % cycleLength;

        // Record pulses to date
        for (let j = 0; j < pulsesSentCounts.length; j++) {
          allPulsesSent.low += pulsesSentCounts[j].low;
          allPulsesSent.high += pulsesSentCounts[j].high;
        }

        // Record pulses in remaining cycles
        for (let j = indexOfPreviousVisit; j < seenStates.length; j++) {
          allPulsesSent.low += pulsesSentCounts[j].low * remainingCycles;
          allPulsesSent.high += pulsesSentCounts[j].high * remainingCycles;
        }

        // Record pulses in final cycle
        for (
          let j = indexOfPreviousVisit;
          j < indexOfPreviousVisit + remainingPressesInCycle;
          j++
        ) {
          allPulsesSent.low += pulsesSentCounts[j].low;
          allPulsesSent.high += pulsesSentCounts[j].high;
        }

        break;
      }

      seenStates.push(getModuleMapKey(modules));
    }

    if (allPulsesSent.low === 0 && allPulsesSent.high === 0) {
      for (let i = 0; i < pulsesSentCounts.length; i++) {
        allPulsesSent.low += pulsesSentCounts[i].low;
        allPulsesSent.high += pulsesSentCounts[i].high;
      }
    }
    const part1Result = allPulsesSent.low * allPulsesSent.high;
    console.log("Part 1 Solution -", part1Result);
  }
);
