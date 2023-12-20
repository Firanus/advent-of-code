import path from "path";
import fs from "fs";

type PartType = "x" | "m" | "a" | "s";
type Comparison = "<" | ">";

interface WorkflowStep {
  condition?: Condition;
  result: string;
}

type Condition = {
  partType: PartType;
  comparison: Comparison;
  comparator: number;
};

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface PartNumberRange {
  xMin: number;
  xMax: number;
  mMin: number;
  mMax: number;
  aMin: number;
  aMax: number;
  sMin: number;
  sMax: number;
}

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [rawWorkflows, rawParts] = data.split("\n\n");
    const workflows = rawWorkflows
      .split("\n")
      .reduce<{ [name: string]: WorkflowStep[] }>((acc, wf) => {
        const [workflowName, rest] = wf.split("{");
        const steps: WorkflowStep[] = rest
          .split(",")
          .map((step, index, arr) => {
            if (index === arr.length - 1) {
              return { result: step.replace("}", "") };
            }
            const [rawCondition, result] = step.split(":");
            if (rawCondition.includes("<")) {
              const [partType, comparator] = rawCondition.split("<");
              return {
                condition: {
                  partType: partType as PartType,
                  comparison: "<",
                  comparator: parseInt(comparator, 10),
                },
                result,
              };
            } else {
              const [partType, comparator] = rawCondition.split(">");
              return {
                condition: {
                  partType: partType as PartType,
                  comparison: ">",
                  comparator: parseInt(comparator, 10),
                },
                result,
              };
            }
          });
        return { ...acc, [workflowName]: steps };
      }, {});

    const parts: Part[] = rawParts.split("\n").map((part) => {
      const [x, m, a, s] = part
        .slice(1, part.length - 1)
        .split(",")
        .map((x) => parseInt(x.slice(2), 10));
      return { x, m, a, s };
    });

    const rejectedParts: Part[] = [];
    const acceptedParts: Part[] = [];

    parts.forEach((part) => {
      let currentWorkflow = "in";
      outer: while (currentWorkflow !== "R" && currentWorkflow !== "A") {
        const currentWorkflowSteps = workflows[currentWorkflow];
        for (let i = 0; i < currentWorkflowSteps.length; i++) {
          const step = currentWorkflowSteps[i];
          if (!step) throw new Error("No step found. This shouldn't happen");

          if (!step.condition) {
            currentWorkflow = step.result;
            continue outer;
          }
          const { partType, comparison, comparator } = step.condition;
          switch (comparison) {
            case "<":
              if (part[partType] < comparator) {
                currentWorkflow = step.result;
                continue outer;
              }
              break;
            case ">":
              if (part[partType] > comparator) {
                currentWorkflow = step.result;
                continue outer;
              }
              break;
          }
        }
      }

      if (currentWorkflow === "R") {
        rejectedParts.push(part);
      } else {
        acceptedParts.push(part);
      }
    });

    const part1Result = acceptedParts.reduce(
      (acc, curr) => acc + curr.x + curr.m + curr.a + curr.s,
      0
    );

    let initialRange: PartNumberRange = {
      xMin: 1,
      xMax: 4000,
      mMin: 1,
      mMax: 4000,
      aMin: 1,
      aMax: 4000,
      sMin: 1,
      sMax: 4000,
    };
    const acceptedRanges: PartNumberRange[] = [];

    const processRange = (range: PartNumberRange, workflowName: string) => {
      const workflowSteps = workflows[workflowName];
      const newRange = { ...range };

      for (let i = 0; i < workflowSteps.length; i++) {
        const step = workflowSteps[i];

        if (!step.condition) {
          const foundResult = step.result;

          if (foundResult === "A") {
            acceptedRanges.push({ ...newRange });
          } else if (foundResult !== "R") {
            processRange({ ...newRange }, foundResult);
          }
          break;
        }

        const passingRange = { ...newRange };
        const { partType, comparison, comparator } = step.condition;
        switch (comparison) {
          case "<":
            switch (partType) {
              case "x":
                passingRange.xMax = Math.min(passingRange.xMax, comparator - 1);
                newRange.xMin = Math.max(newRange.xMin, comparator);
                break;
              case "m":
                passingRange.mMax = Math.min(passingRange.mMax, comparator - 1);
                newRange.mMin = Math.max(newRange.mMin, comparator);
                break;
              case "a":
                passingRange.aMax = Math.min(passingRange.aMax, comparator - 1);
                newRange.aMin = Math.max(newRange.aMin, comparator);
                break;
              case "s":
                passingRange.sMax = Math.min(passingRange.sMax, comparator - 1);
                newRange.sMin = Math.max(newRange.sMin, comparator);
                break;
            }
            break;
          case ">":
            switch (partType) {
              case "x":
                passingRange.xMin = Math.max(passingRange.xMin, comparator + 1);
                newRange.xMax = Math.min(newRange.xMax, comparator);
                break;
              case "m":
                passingRange.mMin = Math.max(passingRange.mMin, comparator + 1);
                newRange.mMax = Math.min(newRange.mMax, comparator);
                break;
              case "a":
                passingRange.aMin = Math.max(passingRange.aMin, comparator + 1);
                newRange.aMax = Math.min(newRange.aMax, comparator);
                break;
              case "s":
                passingRange.sMin = Math.max(passingRange.sMin, comparator + 1);
                newRange.sMax = Math.min(newRange.sMax, comparator);
                break;
            }
        }

        const foundResult = step.result;

        if (foundResult === "A") {
          acceptedRanges.push({ ...passingRange });
        } else if (foundResult !== "R") {
          processRange({ ...passingRange }, foundResult);
        }
      }
    };

    processRange(initialRange, "in");

    const part2Result = acceptedRanges.reduce(
      (acc, curr) =>
        acc +
        (curr.xMax - curr.xMin + 1) *
          (curr.mMax - curr.mMin + 1) *
          (curr.aMax - curr.aMin + 1) *
          (curr.sMax - curr.sMin + 1),
      0
    );

    console.log("Part 1 Solution -", part1Result);
    console.log("Part 2 Solution -", part2Result);
  }
);
