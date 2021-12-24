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
  let pieces: [GamePiece]

  init () {
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

    pieces = [
      GamePiece(type: .bronze, initialSpace: spaces[key(3, 1)]!),
      GamePiece(type: .amber, initialSpace: spaces[key(5, 1)]!),
      GamePiece(type: .bronze, initialSpace: spaces[key(7, 1)]!),
      GamePiece(type: .copper, initialSpace: spaces[key(9, 1)]!),

      GamePiece(type: .desert, initialSpace: spaces[key(3, 2)]!),
      GamePiece(type: .copper, initialSpace: spaces[key(5, 2)]!),
      GamePiece(type: .bronze, initialSpace: spaces[key(7, 2)]!),
      GamePiece(type: .amber, initialSpace: spaces[key(9, 2)]!),
      
      GamePiece(type: .desert, initialSpace: spaces[key(3, 3)]!),
      GamePiece(type: .bronze, initialSpace: spaces[key(5, 3)]!),
      GamePiece(type: .amber, initialSpace: spaces[key(7, 3)]!),
      GamePiece(type: .copper, initialSpace: spaces[key(9, 3)]!),
      
      GamePiece(type: .copper, initialSpace: spaces[key(3, 4)]!),
      GamePiece(type: .desert, initialSpace: spaces[key(5, 4)]!),
      GamePiece(type: .desert, initialSpace: spaces[key(7, 4)]!),
      GamePiece(type: .amber, initialSpace: spaces[key(9, 4)]!),
    ]

    for piece in pieces {
      piece.occupyingSpace.occupy(with: piece)
    }
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Utils
  ------------------------------------------------------------------------------------------------------------------------------------
*/

private func key(_ x: Int, _ y: Int) -> String {
  return "\(x):\(y)"
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  GameSpace class
  ------------------------------------------------------------------------------------------------------------------------------------
*/

class GameSpace {
  let xPosition: Int
  let yPosition: Int

  let canBeStoppedIn: Bool

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

    if (y == 0 && (x == 3 || x == 5 || x == 7 || x == 9)) {
      canBeStoppedIn = false;
    } else {
      canBeStoppedIn = true;
    }
  }

  func occupy(with gamePiece: GamePiece) {
    occupier = gamePiece
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

    switch (confirmedOccupier.type) {
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
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Executing Code
  ------------------------------------------------------------------------------------------------------------------------------------
*/

let gameboard = GameBoard()
print(gameboard)