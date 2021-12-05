#!/usr/bin/swift 

import Foundation 
class Grid {
  var grid: [[Int]]

  init() {
    let rows = [Int](repeating: 0, count: 1000)
    grid = Array(repeating: rows, count: 1000)
  }

  var doubleLinePoints: Int {
    var result = 0

    for y in 0..<grid.count {
      for x in 0..<grid[0].count {
        if grid[y][x] >= 2 {
          result += 1
        }
      }
    }

    return result
  }

  func mark(line: Line) {
    if (line.isHorizontal) {
      let y = line.start.y
      let x1 = line.start.x
      let x2 = line.end.x
      let xStart = min(x1, x2)
      let xEnd = max(x1, x2)

      for x in xStart...xEnd {
        grid[y][x] += 1
      }
    } else if (line.isVertical) {
      let y1 = line.start.y
      let y2 = line.end.y
      let x = line.start.x
      let yStart = min(y1, y2)
      let yEnd = max(y1, y2)

      for y in yStart...yEnd {
        grid[y][x] += 1
      } 
    } else if (line.isFortyFiveDegrees) {
      // Comment this out for Part 1
      let xStart = min(line.start.x, line.end.x)  
      let xEnd = max(line.start.x, line.end.x)  
      let gradientModifier = line.isPositiveGradient ? 1 : -1
      let yStart = line.isPositiveGradient ? min(line.start.y, line.end.y) : max(line.start.y, line.end.y)
      let length = xEnd - xStart

      for pos in 0...length {
        grid[yStart + (pos * gradientModifier)][xStart + pos] += 1
      }
    }
  }
}

func getInput() throws -> String {
  let currentDirectoryURL = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
  let scriptUrl = URL(fileURLWithPath: CommandLine.arguments[0], relativeTo: currentDirectoryURL)
  let inputUrl = URL(fileURLWithPath: "input.txt", relativeTo: scriptUrl)

  let fileContents = try String(contentsOf: inputUrl, encoding: .utf8)
  return fileContents
}

struct Point {
  let x: Int
  let y: Int
}

struct Line {
  let start: Point
  let end: Point

  var isHorizontal: Bool {
    return start.y == end.y
  }

  var isVertical: Bool {
    return start.x == end.x
  }

  var isFortyFiveDegrees: Bool {
    return start.x != end.x && start.y != end.y && abs(start.x - end.x) == abs(start.y - end.y)
  }

  var isPositiveGradient: Bool {
    return end.x - start.x == end.y - start.y
  }
}

func getLines(from input: String) -> [Line] {
  var lines: [Line] = []

  let inputComponents = input.components(separatedBy: "\n")
  for singleInput in inputComponents {
    let pointStrings = singleInput.components(separatedBy: " -> ")
    let startCoords = pointStrings[0].components(separatedBy: ",").map { Int($0)! }
    let start = Point(x: startCoords[0], y: startCoords[1])
    let endCoords = pointStrings[1].components(separatedBy: ",").map { Int($0)! }
    let end = Point(x: endCoords[0], y: endCoords[1])
    lines.append(Line(start: start, end: end))
  }

  return lines
}


let input = try getInput()
let lines = getLines(from: input)
let grid = Grid()

for line in lines {
  grid.mark(line: line)
}

print(grid.doubleLinePoints)
