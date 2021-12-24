#!/usr/bin/swift 

import Foundation 

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  GameBoard class
  ------------------------------------------------------------------------------------------------------------------------------------
*/

class GameBoard {
  var score = 0

  var spaces = [String : GameSpace]()
  var columns = [Int : [GameSpace]]()
  let pieces: [GamePiece]

  var isGameComplete: Bool {
    return pieces.allSatisfy { $0.isInFinalColumn }
  }

  init (from boardInput: String) {
    spaces[key(1,0)] = GameSpace(x: 1, y: 0)
    spaces[key(2,0)] = GameSpace(x: 2, y: 0)
    spaces[key(3,0)] = GameSpace(x: 3, y: 0)
    spaces[key(4,0)] = GameSpace(x: 4, y: 0)
    spaces[key(5,0)] = GameSpace(x: 5, y: 0)
    spaces[key(6,0)] = GameSpace(x: 6, y: 0)
    spaces[key(7,0)] = GameSpace(x: 7, y: 0)
    spaces[key(8,0)] = GameSpace(x: 8, y: 0)
    spaces[key(9,0)] = GameSpace(x: 9, y: 0)
    spaces[key(10,0)] = GameSpace(x: 10, y: 0)
    spaces[key(11,0)] = GameSpace(x: 11, y: 0)
    spaces[key(3,1)] = GameSpace(x: 3, y: 1)
    spaces[key(3,2)] = GameSpace(x: 3, y: 2)
    spaces[key(3,3)] = GameSpace(x: 3, y: 3)
    spaces[key(3,4)] = GameSpace(x: 3, y: 4)
    spaces[key(5,1)] = GameSpace(x: 5, y: 1)
    spaces[key(5,2)] = GameSpace(x: 5, y: 2)
    spaces[key(5,3)] = GameSpace(x: 5, y: 3)
    spaces[key(5,4)] = GameSpace(x: 5, y: 4)
    spaces[key(7,1)] = GameSpace(x: 7, y: 1)
    spaces[key(7,2)] = GameSpace(x: 7, y: 2)
    spaces[key(7,3)] = GameSpace(x: 7, y: 3)
    spaces[key(7,4)] = GameSpace(x: 7, y: 4)
    spaces[key(9,1)] = GameSpace(x: 9, y: 1)
    spaces[key(9,2)] = GameSpace(x: 9, y: 2)
    spaces[key(9,3)] = GameSpace(x: 9, y: 3)
    spaces[key(9,4)] = GameSpace(x: 9, y: 4)

    spaces[key(1,0)]!.set(surroundingSpaces: [spaces[key(2,0)]!])
    spaces[key(2,0)]!.set(surroundingSpaces: [spaces[key(1,0)]!, spaces[key(3,0)]!])
    spaces[key(3,0)]!.set(surroundingSpaces: [spaces[key(2,0)]!, spaces[key(4,0)]!, spaces[key(3,1)]!])
    spaces[key(4,0)]!.set(surroundingSpaces: [spaces[key(3,0)]!, spaces[key(5,0)]!])
    spaces[key(5,0)]!.set(surroundingSpaces: [spaces[key(4,0)]!, spaces[key(6,0)]!, spaces[key(5,1)]!])
    spaces[key(6,0)]!.set(surroundingSpaces: [spaces[key(5,0)]!, spaces[key(7,0)]!])
    spaces[key(7,0)]!.set(surroundingSpaces: [spaces[key(6,0)]!, spaces[key(8,0)]!, spaces[key(7,1)]!])
    spaces[key(8,0)]!.set(surroundingSpaces: [spaces[key(7,0)]!, spaces[key(9,0)]!])
    spaces[key(9,0)]!.set(surroundingSpaces: [spaces[key(8,0)]!, spaces[key(10,0)]!, spaces[key(9,1)]!])
    spaces[key(10,0)]!.set(surroundingSpaces: [spaces[key(9,0)]!, spaces[key(11,0)]!])
    spaces[key(11,0)]!.set(surroundingSpaces: [spaces[key(10,0)]!])

    spaces[key(3,1)]!.set(surroundingSpaces: [spaces[key(3,0)]!, spaces[key(3,2)]!])
    spaces[key(3,2)]!.set(surroundingSpaces: [spaces[key(3,1)]!, spaces[key(3,3)]!])
    spaces[key(3,3)]!.set(surroundingSpaces: [spaces[key(3,2)]!, spaces[key(3,4)]!])
    spaces[key(3,4)]!.set(surroundingSpaces: [spaces[key(3,3)]!])

    spaces[key(5,1)]!.set(surroundingSpaces: [spaces[key(5,0)]!, spaces[key(5,2)]!])
    spaces[key(5,2)]!.set(surroundingSpaces: [spaces[key(5,1)]!, spaces[key(5,3)]!])
    spaces[key(5,3)]!.set(surroundingSpaces: [spaces[key(5,2)]!, spaces[key(5,4)]!])
    spaces[key(5,4)]!.set(surroundingSpaces: [spaces[key(5,3)]!])

    spaces[key(7,1)]!.set(surroundingSpaces: [spaces[key(7,0)]!, spaces[key(7,2)]!])
    spaces[key(7,2)]!.set(surroundingSpaces: [spaces[key(7,1)]!, spaces[key(7,3)]!])
    spaces[key(7,3)]!.set(surroundingSpaces: [spaces[key(7,2)]!, spaces[key(7,4)]!])
    spaces[key(7,4)]!.set(surroundingSpaces: [spaces[key(7,3)]!])
    
    spaces[key(9,1)]!.set(surroundingSpaces: [spaces[key(9,0)]!, spaces[key(9,2)]!])
    spaces[key(9,2)]!.set(surroundingSpaces: [spaces[key(9,1)]!, spaces[key(9,3)]!])
    spaces[key(9,3)]!.set(surroundingSpaces: [spaces[key(9,2)]!, spaces[key(9,4)]!])
    spaces[key(9,4)]!.set(surroundingSpaces: [spaces[key(9,3)]!])

    columns[3] = [
      spaces[key(3,1)]!,
      spaces[key(3,2)]!,
      spaces[key(3,3)]!,
      spaces[key(3,4)]!,
    ]
    columns[5] = [
      spaces[key(5,1)]!,
      spaces[key(5,2)]!,
      spaces[key(5,3)]!,
      spaces[key(5,4)]!,
    ]
    columns[7] = [
      spaces[key(7,1)]!,
      spaces[key(7,2)]!,
      spaces[key(7,3)]!,
      spaces[key(7,4)]!,
    ]
    columns[9] = [
      spaces[key(9,1)]!,
      spaces[key(9,2)]!,
      spaces[key(9,3)]!,
      spaces[key(9,4)]!,
    ]

    var startingPieces: [GamePiece] = []
    
    let rows = boardInput.components(separatedBy: "\n")
    for (rowIndex, row) in rows.enumerated() {
      for (colIndex, value) in row.enumerated() {
        if (value == "A" || value == "B" || value == "C" || value == "D") {
          startingPieces.append(GamePiece(type: typeForString(String(value)), initialSpace: spaces[key(colIndex, rowIndex - 1)]!))
        }
      }
    }

    pieces = startingPieces

    for piece in pieces {
      piece.occupyingSpace.occupy(with: piece)
    }
  }

  func can(space: GameSpace, beEnteredByPiece piece: GamePiece) -> Bool {
    guard space.occupier == nil else {
      return false
    }

    if space.isRoom {
      if !doesOnlyContainValidElements(column: space.xPosition) {
        return false
      }

      return space.xPosition == piece.finalColumn
    }

    return true
  }

  func can(space: GameSpace, beStoppedInByPiece piece: GamePiece) -> Bool {
    if (space.yPosition == 0 && (space.xPosition == 3 || space.xPosition == 5 || space.xPosition == 7 || space.xPosition == 9)) {
      return false
    }

    if piece.occupyingSpace.isHallway && space.isHallway {
      return false
    }

    if space.isRoom {
      let columnIndex = space.xPosition
      let rowIndex = space.yPosition

      // Can only stop in bottom space of column
      if (rowIndex != 4 && spaces[key(columnIndex, rowIndex + 1)]!.occupier == nil) {
        return false
      }
    }

    return true
  }

  func doesOnlyContainValidElements(column index: Int) -> Bool {
    let column = columns[index]!

    for space in column {
      guard let confirmedOccupier = space.occupier else {
        continue
      }

      if !confirmedOccupier.isInFinalColumn {
        return false
      }
    }

    return true
  }

  func validMoves(forPiece piece: GamePiece) -> [ValidMove] {
    var finalSpaces: [ValidMove] = []
    var spacesToExplore = Array(piece.occupyingSpace.surroundingSpaces.map { ($0, piece.energyPerMove) })
    var visitedSpaces = [key(piece.occupyingSpace)]

    while spacesToExplore.count > 0 {
      let spaceScoreTuple = spacesToExplore.removeFirst()
      let space = spaceScoreTuple.0
      let scoreToReachSpace = spaceScoreTuple.1
      
      visitedSpaces.append(key(space))
      guard can(space: space, beEnteredByPiece: piece) else {
        continue
      }

      let newSpacesToExplore = space.surroundingSpaces.filter { surroundSpace in !visitedSpaces.contains(where:{ $0 == key(surroundSpace) }) }
      spacesToExplore.append(contentsOf:  newSpacesToExplore.map { ($0, scoreToReachSpace + piece.energyPerMove)})

      if can(space: space, beStoppedInByPiece: piece) {
        finalSpaces.append(
          ValidMove(
            startingCoordinates: (piece.occupyingSpace.xPosition, piece.occupyingSpace.yPosition),
            endingCoordinates: (space.xPosition, space.yPosition),
            pieceType: piece.type,
            scoreIncrease: scoreToReachSpace
          )
        )
      } 
    }

    return finalSpaces
  }

  func validMoveForAllPieces() -> [ValidMove] {
    var moves: [ValidMove] = []
    for piece in pieces {
      moves.append(contentsOf: validMoves(forPiece: piece))
    }
    return moves
  }

  // func visualiseMove() -> String {

  // }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Valid Move Struct
  ------------------------------------------------------------------------------------------------------------------------------------
*/

struct ValidMove {
  let startingCoordinates: (Int, Int)
  let endingCoordinates: (Int, Int)
  let pieceType: PieceType
  let scoreIncrease: Int
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Utils
  ------------------------------------------------------------------------------------------------------------------------------------
*/

private func key(_ x: Int, _ y: Int) -> String {
  return "\(x):\(y)"
}

private func key(_ space: GameSpace) -> String {
  return "\(space.xPosition):\(space.yPosition)"
}

private func typeForString(_ str: String) -> PieceType {
  if str == "A" {
    return .amber
  }
  
  if str == "B" {
    return .bronze
  }

  if str == "C" {
    return .copper
  }

  if str == "D" {
    return .desert
  }

  return .desert
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  GameSpace class
  ------------------------------------------------------------------------------------------------------------------------------------
*/

class GameSpace {
  let xPosition: Int
  let yPosition: Int

  var occupier: GamePiece?
  var surroundingSpaces: [GameSpace] = []
  
  var isHallway: Bool {
    return yPosition == 0
  }
  var isRoom: Bool {
    return yPosition > 0
  }

  init(x: Int, y: Int) {
    xPosition = x
    yPosition = y
  }

  func occupy(with gamePiece: GamePiece) {
    occupier = gamePiece
  }

  func clearOccupant() {
    occupier = nil
  }

  func set(surroundingSpaces: [GameSpace]) {
    self.surroundingSpaces = surroundingSpaces
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  GamePiece class
  ------------------------------------------------------------------------------------------------------------------------------------
*/

enum PieceType {
  case amber, bronze, copper, desert
}

class GamePiece {
  let type: PieceType
  var occupyingSpace: GameSpace

  var energyPerMove: Int {
    switch type {
      case .amber:
        return 1
      case .bronze:
        return 10
      case .copper:
        return 100
      case .desert:
        return 1000
    }
  }

  var isInFinalColumn: Bool {
    return occupyingSpace.yPosition > 0 && occupyingSpace.xPosition == finalColumn
  }

  var finalColumn: Int {
    switch type {
      case .amber:
        return 3
      case .bronze:
        return 5
      case .copper:
        return 7
      case .desert:
        return 9
    }
  }

  init(type: PieceType, initialSpace: GameSpace) {
    self.type = type
    self.occupyingSpace = initialSpace
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  GameBoard and GameSpace classes - Printing extension
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension GameBoard: CustomStringConvertible {
  var description: String {
    return """
    #############
    #\(spaces[key(1,0)]!.description)\(spaces[key(2,0)]!.description)\(spaces[key(3,0)]!.description)\(spaces[key(4,0)]!.description)\(spaces[key(5,0)]!.description)\(spaces[key(6,0)]!.description)\(spaces[key(7,0)]!.description)\(spaces[key(8,0)]!.description)\(spaces[key(9,0)]!.description)\(spaces[key(10,0)]!.description)\(spaces[key(11,0)]!.description)#
    ###\(spaces[key(3,1)]!.description)#\(spaces[key(5,1)]!.description)#\(spaces[key(7,1)]!.description)#\(spaces[key(9,1)]!.description)###
      #\(spaces[key(3,2)]!.description)#\(spaces[key(5,2)]!.description)#\(spaces[key(7,2)]!.description)#\(spaces[key(9,2)]!.description)#
      #\(spaces[key(3,3)]!.description)#\(spaces[key(5,3)]!.description)#\(spaces[key(7,3)]!.description)#\(spaces[key(9,3)]!.description)#
      #\(spaces[key(3,4)]!.description)#\(spaces[key(5,4)]!.description)#\(spaces[key(7,4)]!.description)#\(spaces[key(9,4)]!.description)#
      #########
    """
  }
}

extension GameSpace: CustomStringConvertible {
  var description: String {
    guard let confirmedOccupier = occupier else {
      return "."
    }

    return characterFor(type: confirmedOccupier.type)
  }
}

func characterFor(type: PieceType) -> String {
  switch (type) {
      case .amber:
        return "A"
      case .bronze:
        return "B"
      case .copper:
        return "C"
      case .desert:
        return "D"
    }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Executing Code
  ------------------------------------------------------------------------------------------------------------------------------------
*/

func update(gameboardString: String, move: ValidMove) -> String {
  var returnString = ""
  let rows  = gameboardString.components(separatedBy: "\n")
  for (rowIndex, row) in rows.enumerated() {
    for (colIndex, value) in row.enumerated() {
      if(rowIndex == (move.startingCoordinates.1 + 1) && colIndex == move.startingCoordinates.0) {
        returnString += "."
        continue
      }
      
      if(rowIndex == (move.endingCoordinates.1 + 1) && colIndex == move.endingCoordinates.0) {
        returnString += characterFor(type: move.pieceType)
        continue
      }

      returnString += String(value)
    }
    returnString += "\n"
  }

  return returnString
}

let initialInput = """
#############
#...........#
###B#A#B#C###
  #D#C#B#A#
  #D#B#A#C#
  #C#D#D#A#
  #########
"""

let gameboard = GameBoard(from: initialInput)
let validMoves = gameboard.validMoveForAllPieces()

for move in validMoves {
  print(move)
  print(update(gameboardString: gameboard.description, move: move))
}
// for move in validMoves {
//   let newGameboard = GameBoard(from: initialInput)
//   newGameboard.makeMove(move)
//   print(newGameboard)
// }