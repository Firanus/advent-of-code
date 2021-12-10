/*
  Rabbit problem from: https://www.youtube.com/watch?app=desktop&v=XEt09iK8IXs

  I've already thought about it a bit, but it's 8:20, lets see how we do.

  n = 3
  _ _ _
  check mid spot twice and you'll find the rabbit, either because it started there
  or because it was forced to go there on turn 2

  n = 4
  _ _ _ _
  check second spot, guarantees rabbit isn't in spots 1.
  Remaining options:
  
  _ r _ _ - Was in spot 1 or 3 and then jumped to spot 2 after you checked it.
  _ _ r _ - Was in spot 4 and jumped to spot 3
  _ _ _ r - Was in spot 3 and jumped to spot 4

  If you check spot 3, you catch it for middle case. If it's not there,
  remaining spots it could be are:
  r _ _ _
  _ _ r _

  Check 3 again, catch it, only leftover spot:
  _ r _ _

  So, route is to check spot 2, spot 3 twice and then spot 2 again.

  2 3 3 2

  n = 5
  _ _ _ _ _

  What happens if I check the 2nd spot once? What options are open?

  Can't be in 1. Only way to get there is if it jumped from 2.
  _ r _ _ _ - Was in 1 or 3 and moved to 2 after check
  _ _ r _ _ - Was in 4 and jumped to 3
  _ _ _ r _ - Was in 3 or 5 and jumped
  _ _ _ _ r - Was in 4 and jumped

  If I check spot 3
  r _ _ _ _ - Was in 2
  _ _ r _ _ - Was in 2 or 4
  _ _ _ r _ - Was on 5
  _ _ _ _ r - Was on 4

  If I check spot 4
  _ r _ _ _ - Was in 1
  _ _ _ r _ - Was in 5

  Check 4 again
  r _ _ _ _
  _ _ r _ _

  Check 3
  _ r _ _ _

  Check 2

  Path is 2 3 4 4 3 2

  n = 6

  Check 2
  _ r _ _ _ _
  _ _ r _ _ _
  _ _ _ r _ _
  _ _ _ _ r _
  _ _ _ _ _ r

  Check 3
  r _ _ _ _ _
  _ _ r _ _ _
  _ _ _ r _ _
  _ _ _ _ r _
  _ _ _ _ _ r

  Check 4
  _ r _ _ _ _
  _ _ _ r _ _
  _ _ _ _ r _
  _ _ _ _ _ r

  Check 5
  r _ _ _ _ _
  _ _ r _ _ _
  _ _ _ _ r _

  23455432
  _ r _ r _ _
  r _ r _ _ _
  _ r _ _ _ _
  done

  Cool, so sequence is always from 2 to n - 1 and back.
  Worst case scenario 2 (n - 2 steps)

  So for 100 its 196 guesses.

  It is now 8:45 So 25 minutes from starting in this window. No code written, but
  there isn't really any code to write, this is all reasoning. 
*/