#!/usr/bin/swift 

import Foundation 
class FishCounter {
  var ages: [Int]

  var fishSum: Int {
    return ages.reduce(0, +)
  }

  init(initialAges: [Int]) {
    ages = [Int](repeating: 0, count: 9)

    for age in initialAges {
      ages[age] += 1 
    }
  }

  func incrementTimeOneDay() {
    let copyOfAges = ages
    let spawningFish = ages[0]

    for (index, count) in copyOfAges.enumerated() {
      if index > 0 {
        ages[index - 1] = count
      }
    }
    ages[8] = 0
    ages[6] += spawningFish
    ages[8] += spawningFish
  }
}

func getInput() throws -> String {
  let currentDirectoryURL = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
  let scriptUrl = URL(fileURLWithPath: CommandLine.arguments[0], relativeTo: currentDirectoryURL)
  let inputUrl = URL(fileURLWithPath: "input.txt", relativeTo: scriptUrl)

  let fileContents = try String(contentsOf: inputUrl, encoding: .utf8)
  return fileContents
}

func getInitialFishAges(from input: String) -> [Int] {
  return input.components(separatedBy: ",").map { Int($0)! }
}


let input = try getInput()
let initialAges = getInitialFishAges(from: input)
let counter = FishCounter(initialAges: initialAges)

// Set limit to 80 for Part 1
for _ in 0..<256 {
  counter.incrementTimeOneDay()
}

print(counter.fishSum)
