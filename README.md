# Advent of Code

My solutions to [Advent of Code](https://adventofcode.com/), as well as other interesting problems.

This repository originally consisted of solutions to just the problems of Advent of Code 2021. I've since generalised it a bit to serve as a repo for all the Advent of Code problems I decide to tackle. I doubt I'll complete them all, but who knows, I might. Til then, we'll use this.

In general, the philosophy of this repo is that each problem is self-contained. This is there to let me play with a bunch of languages, and run them independentally. At the moment, the languages are JS and Swift, though we may well introduce others.

For the problems themselves, our approach is very much "just get something that works", rather than go for absolutely optimal time. Having said that, when I'm not doing this under the hammer of "a problem a day, every day", I might well experiment with looking for more optimal solutions.

So far, years I've tackled:

- [2017](https://adventofcode.com/2017) - In progress
- [2019](https://adventofcode.com/2019) - In progress
- [2021](https://adventofcode.com/2021) - **Complete**

## Follow-up Tasks

The following is a reference to follow up tasks I've made notes on in other places that would be fun to tackle. More information is provided in the READMEs of the day in question.

- None at this point

## Helpful Bits of Code

There are a number of helpful algorithms and approaches to problems which get used multiple times. This is me calling them out to make them easy to find later.

### Trees and Tree Traversal

These problems are all about trees, and traversing them.

- **2017 Day 7** - The problem is essentially constructing a tree from your input and then finding various properties of it.
- **2021 Day 18** - Snailfish. This is a problem about decoding a series of brackets containing pairs of numbers, which have random rules for expansion. One way of viewing the problem is that the brackets just represent a BST. You can then build the structure and analyse it accordingly. Note that while a tree is a valid way to go about this, avoiding trees entirely also works.

### Pathfinding - e.g. Djikstra's Algorithm

These problems involve pathfinding and their associated algorithms in some way. Examples include Djikstra's or A\*.

- **2019 Day 6** - A simple pathfinding problem. You construct a grid from a list of connections, and then traverse over it twice with an elementary Djikstra's.
- **2021 Day 15** - Chiton. A pure pathfinding problem. You're given a grid of numbers ("risk levels") and asked to find a path which minimises total risk. Classic use case for Djikstra.
- **2021 Day 23** - This problem introduces a game and asks you to find the most efficient solution. I ended up having to write a full simulation of the game, and then run the game states through Djikstra's to find the shortest "path" from start to finish.

- **2021 Day 11** - Not strictly a pathfinding problem, but interesting nonetheless, because it requires you to navigate a set path on a hexagonal grid.

### Memoization and Compression

These problems rely on you storing information in the problem in a more optimal way than the problem text initially suggests, usually to get around the fact that you're dealing with data that expands exponentially.

- **2021 Day 6** - Lanternfish. The fish can only have one of 8 ages and spawn new fishes when they hit the highest age. You need to store the ages in a map.
- **2021 Day 14** - Extended Polymerization. This problem is about storing information about a rapidly expanding polymer. Trickier, as the order of the letters in the string matters, but actually not so bad, as all you're really concerned about is pair counts. Solved by storing a map of both the individual counts of items, and the pairs of items.
- **2021 Day 21** - Dirac Dice. This problem introduces many many game states in the second part. Finding an efficient way to store them is the key to a quick solution.

### Intcode Computer

In **2019**, there are a number of problems that involve slowly building up a VM day-by-day. They are:

- **Day 2** - We get the VM started by introducing a basic VM that can handle addition and multiplication.
- **Day 5** - We extend our VM to handle parameter modes, comparisons operations, jump operations, input and output. Phew!
- **Day 7** - We extend our VM to be able to block execution til it's received an input, and then string a few computers together. Fun.
- **Day 9** - Added a new parameter more, "relative mode" to the VM, with a few more tweaks.

### Miscellaneous Algorithms

- **Permutations: 2019 Day 7** - As part of this problem, we had to calculate all permutations of items in a list. Used that as an opportunity to introduce Heap's algorithm.
