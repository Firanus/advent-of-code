# 2017 - Day 7

[https://adventofcode.com/2017/day/7](https://adventofcode.com/2017/day/7)

This problem was all about tree traversal, so I whipped out TypeScript to get to the bottom of it.

Thought for a little while about experimenting with data viz on the tree itself, but dropped the idea when I realised that (a) it would take more time to visualise the tree than to solve the problem by a looooooong way, and (b) at this size of tree, visualization ultimately wouldn't be that useful, particularly when part 1 (finding the root), is so easy to find algorithmically.

To solve both parts, run the following from the project root:

```sh
node 2017/07-recursive-circus/index.js
```

## Follow Up Task

I've just been looking into GraphViz, a tool for visualizing graphs, and it looks perfect. A really simple thing to play with, with intuitive rules that could be incredibly useful for problems with trees, graphs and the like. Would looooove to get these graphs visualised in GraphViz, and use that as a jumping off point for other visualizations.

Resources:

- [Main GraphViz size](https://graphviz.org/)
- [Article introducing basic functionality](https://naildrivin5.com/blog/2016/12/08/learn-graphviz-and-up-your-diagramming-game.html)
