#!/usr/bin/swift 

import Foundation 
class Bingo {
  var boardId: Int
  var board: [[Int]]
  var markedElements: [[Bool]]
  var lastMarkedNumber: Int = -1
  var width: Int {
    if (board.count == 0) {
      return 0
    }
    return board[0].count
  }
  var height: Int {
    return board.count
  }

  var isWon: Bool {
    for row in markedElements {
      if (row.allSatisfy { $0 == true} ) {
        return true
      }
    }

    for colIndex in 0..<width {
      let col = getMarkedElementsColumn(colIndex)
      if (col.allSatisfy { $0 == true} ) {
        return true
      }
    }

    return false
  }

  var score: Int {
    if (!isWon) {
      return 0
    }

    var sum = 0;
    for (rowIndex, row) in board.enumerated() {
      for (colIndex, val) in row.enumerated() {
        if (markedElements[rowIndex][colIndex] == false) {
          sum += val
        }
      }
    }

    return sum * lastMarkedNumber
  }

  init(initialBoard: [[Int]], boardId: Int) {
    self.boardId = boardId
    board = initialBoard
    let initHeight = initialBoard.count
    let initWidth = initialBoard.count == 0 ? 0 : initialBoard[0].count
    let rows = [Bool](repeating: false, count: initWidth)
    markedElements = Array(repeating: rows, count: initHeight)
  }

  func mark(number: Int) {
    lastMarkedNumber = number

    for (rowIndex, row) in board.enumerated() {
      for (colIndex, val) in row.enumerated() {
        if (val == number) {
          markedElements[rowIndex][colIndex] = true
        }
      }
    }
  }

  private func getMarkedElementsColumn(_ colIndex: Int) -> [Bool] {
    var col: [Bool] = []
    for rowIndex in 0..<height {
      col.append(markedElements[rowIndex][colIndex])
    }

    return col
  }
}

func getInput() throws -> String {
  let currentDirectoryURL = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
  let scriptUrl = URL(fileURLWithPath: CommandLine.arguments[0], relativeTo: currentDirectoryURL)
  let inputUrl = URL(fileURLWithPath: "input.txt", relativeTo: scriptUrl)

  let fileContents = try String(contentsOf: inputUrl, encoding: .utf8)
  return fileContents
}

func getDrawNumbers(from input: String) -> [Int] {
  let inputComponents = input.components(separatedBy: "\n\n")
  let numberStrings = inputComponents[0].components(separatedBy: ",")
  let numbers = numberStrings.map { Int($0)! }
  
  return numbers
}

func getBoards(from input: String) -> [Bingo] {
  var boards: [Bingo] = []
  let boardInputs = input.components(separatedBy: "\n\n").dropFirst()
  for (index, boardInput) in boardInputs.enumerated() {
    let rowStrings = boardInput.components(separatedBy: "\n")
    var rows: [[Int]] = []
    for rowString in rowStrings {
      let numbers = rowString.components(separatedBy: .whitespaces).filter { $0 != "" }.map { Int($0)! }
      rows.append(numbers)
    }
    let board = Bingo(initialBoard: rows, boardId: index)
    boards.append(board)
  }

  return boards
}

let input = try getInput()
let drawNumbers = getDrawNumbers(from: input)
let boards = getBoards(from: input)

// for board in boards {
//   board.mark(number: 49)
// }

// Part 1
// outerLoop: for drawNumber in drawNumbers {
//   print("Number \(drawNumber) marked.")
//   for board in boards {
//     board.mark(number: drawNumber)
//     if (board.isWon) {
//       print("Board \(board.boardId) won. Final score: \(board.score)")
//       break outerLoop
//     }
//   }
// }

// Part 2
var unfinishedBoards = boards
outerLoop: for drawNumber in drawNumbers {
  if unfinishedBoards.count > 0 {
    print("Number \(drawNumber) marked.")
    // Have to reverse the array or the indexing goes haywire
    for (boardIndex, board) in unfinishedBoards.enumerated().reversed() {
      board.mark(number: drawNumber)
      if (board.isWon) {
        if unfinishedBoards.count == 1 {
          print("Final board completed. Score: \(board.score)")
        }
        unfinishedBoards.remove(at: boardIndex)
        print("Board \(board.boardId) completed. Boards remaining: \(unfinishedBoards.count)")
      }
    }
  }
}
