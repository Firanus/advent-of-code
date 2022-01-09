# 2017 - Day 7

[https://adventofcode.com/2017/day/7](https://adventofcode.com/2017/day/7)

This problem was all about tree traversal, so I whipped out TypeScript to get to the bottom of it.

Thought for a little while about experimenting with data viz on the tree itself, but dropped the idea when I realised that (a) it would take more time to visualise the tree than to solve the problem by a looooooong way, and (b) at this size of tree, visualization ultimately wouldn't be that useful, particularly when part 1 (finding the root), is so easy to find algorithmically.

To solve both parts, run the following from the project root:

```sh
node 2017/07-recursive-circus/index.js
```

## GraphViz

I've just been looking into GraphViz, a tool for visualizing graphs, and it looks like a great deal of fun.

As a simple starting point, I've written a bit of code to turn the inputs of this problem into Graphviz charts. To run the graph-generation code, just run:

```sh
node 2017/07-recursive-circus/graphs.ts
```

This will generate a `.dot` file. Have a look in it to see how a GraphViz file is set up.

GraphViz files can then be turned into images. To do so, you'll need to install `dot`. Do so with the command:

```sh
brew install graphviz
```

And then create an image of your graph with the command (in this case, run from the project root)

```sh
dot -Tsvg -o2017/07-recursive-circus/graph.svg ./2017/07-recursive-circus/inputGraph.dot
```

For more information on GraphViz, have a look at the following resources:

- [Main GraphViz size](https://graphviz.org/)
- [Article introducing basic functionality](https://naildrivin5.com/blog/2016/12/08/learn-graphviz-and-up-your-diagramming-game.html)
