# 2022 - Day 6

[https://adventofcode.com/2022/day/6](https://adventofcode.com/2022/day/6)

Pretty straightforward use of a hash map here. I think this might technically
be the first problem where cleverness is encouraged, as the most naive comparative
solution would require ~428,000 comparisons. Having said that, a laptop could
probably still handle that, so maybe not. Anyway, the hash map made this O(n) trivially.

To solve both parts 1 and 2, run the following from the project root:

```sh
node 2022/06-tuning-trouble/index.js
```
