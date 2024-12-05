# 2024 - Day 5

[https://adventofcode.com/2024/day/5](https://adventofcode.com/2024/day/5)

Interesting one this! You get rules for how an array should be ordered. You
use them to find the invalid items in Part 1. Easy. But in part 2 you have to
fix the arrays. Luckily, it turns out that every item in every array has a rule
for every other item, so you can literally find the ones that need to appear
after and just sort by "how many numbers need to appear after this one" to get
your ordering. It honestly feels like I cheesed it, which is kind of funny. :P

Then again, it is Day 5, and I did it. Huzzah!

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2024/05-print-queue
```
