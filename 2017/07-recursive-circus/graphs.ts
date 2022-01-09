import path from "path";
import fs from "fs";

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const rawTreeElements = data.split("\n");
  const graphElements = rawTreeElements.filter((x) => x.includes("->"));

  const processedElements = graphElements.map((x) => {
    const [firstSection, ...remainingSections] = x.split(" -> ");
    const [name, ...rest] = firstSection.split(" ");
    return `${name} -> ${remainingSections.join(" -> ")}`;
  });

  const stream = fs.createWriteStream(
    path.resolve(__dirname, "./inputGraph.dot")
  );
  stream.once("open", function (fd) {
    stream.write("digraph testInput {\n");
    stream.write("\n");
    processedElements.forEach((x) => stream.write(`  ${x}\n`));
    stream.write("\n}\n");
    stream.end();
  });
});
