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

const runPulseCycle = (
  modules: ModuleMap
): { low: number; high: number; lowPulsesToRx: number } => {
  const pulsesToSend: [string, boolean, string][] = [
    ["broadcaster", false, "button"],
  ];
  const pulsesSent = { low: 0, high: 0, lowPulsesToRx: 0 };

  while (pulsesToSend.length) {
    const [pulseTarget, isHigh, source] = pulsesToSend.shift() as [
      string,
      boolean,
      string
    ];
    isHigh ? pulsesSent.high++ : pulsesSent.low++;
    const module = modules[pulseTarget];

    if (!isHigh && module.id === "rx") {
      pulsesSent.lowPulsesToRx++;
    }

    if (module.type === "Output") {
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

    // Visualising the graph with graphviz, I realise that my input is 4 separate
    // graphs. So the key here is going to be LCM of the pulse cycles of each.
    // We're going to try dividing the graph into it's 4 consitutent parts and going
    // from there.

    const subModuleMaps: ModuleMap[] = [];

    const initialPoints = modules["broadcaster"].outputs;
    for (let i = 0; i < initialPoints.length; i++) {
      const initialModule = initialPoints[i];
      let modulesToProcess = [initialModule];
      const subMap: ModuleMap = {};

      while (modulesToProcess) {
        const moduleToProcess = modulesToProcess.shift();
        if (!moduleToProcess) break;

        const module = modules[moduleToProcess];
        subMap[moduleToProcess] = module;

        module.outputs.forEach((output) => {
          if (!subMap[output]) {
            modulesToProcess.push(output);
          }
        });
      }

      const allKeys = Object.keys(subMap);
      Object.keys(subMap).forEach((key) => {
        const module = JSON.parse(JSON.stringify(subMap[key])) as Module;
        module.inputs = module.inputs.filter((input) =>
          allKeys.includes(input)
        );
        module.outputs = module.outputs.filter((output) =>
          allKeys.includes(output)
        );
        if (module.type === "Conjunction") {
          const conjunction = module as ConjunctionModule;
          conjunction.inputStates = Object.keys(conjunction.inputStates).reduce(
            (acc, inputKey) => {
              if (allKeys.includes(inputKey)) {
                acc[inputKey] = conjunction.inputStates[inputKey];
              }
              return acc;
            },
            {} as { [key: string]: boolean }
          );
        }
        subMap[key] = module;
      });

      subMap["broadcaster"] = {
        type: "Broadcaster",
        id: "broadcaster",
        inputs: [],
        outputs: [initialModule],
      };
      subModuleMaps.push(subMap);
    }

    const pulsesToRx = subModuleMaps.map((subMap) => {
      let pulseCycle = 0;
      let rxReceivedLowPulse = false;

      while (!rxReceivedLowPulse) {
        pulseCycle += 1;
        const pulsesSent = runPulseCycle(subMap);
        if (pulsesSent.lowPulsesToRx === 1) {
          rxReceivedLowPulse = true;
        }
      }

      return pulseCycle;
    });

    console.log(
      "Part 2 Solution -",
      pulsesToRx.reduce((acc, curr) => acc * curr, 1)
    );

    // Generate graphviz file for full graph

    // const processedElements = Object.keys(modules).map((key) => {
    //   return `${key} -> ${modules[key].outputs.join(", ")}`;
    // });

    // const stream = fs.createWriteStream(
    //   path.resolve(__dirname, "./graphs/inputGraph.dot")
    // );
    // stream.once("open", function (fd) {
    //   stream.write("digraph input {\n");
    //   processedElements.forEach((x) => stream.write(`  ${x}\n`));
    //   stream.write("}\n");
    //   stream.end();
    // });

    // Generate graphviz files for sub-graphs

    // for (let i = 0; i < subModuleMaps.length; i++) {
    //   const subMap = subModuleMaps[i];
    //   const processedElements = Object.keys(subMap)
    //     .map((key) => {
    //       const outputs = subMap[key].outputs;
    //       return outputs.length ? `${key} -> ${outputs.join(", ")}` : undefined;
    //     })
    //     .filter(Boolean);

    //   const stream = fs.createWriteStream(
    //     path.resolve(__dirname, `./graphs/inputGraph${i}.dot`)
    //   );
    //   stream.once("open", function (fd) {
    //     stream.write("digraph input {\n");
    //     processedElements.forEach((x) => stream.write(`  ${x}\n`));
    //     stream.write("}\n");
    //     stream.end();
    //   });
    // }
  }
);
