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

    if space.isRoom && !piece.inColumnOf(space: space) {
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

    // Space cannot stay in same x position as it started
    if piece.occupyingSpace.xPosition == space.xPosition {
      return false
    }

    if piece.inColumnOf(space: space) && !piece.isInFinalColumn {
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

  func inColumnOf(space: GameSpace) -> Bool {
    return occupyingSpace.yPosition > 0 && occupyingSpace.xPosition == space.xPosition
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

struct GameboardAnalysisStructure {
  let currentState: String
  let previousStates: [String]
  let score: Int
}

func sortGameboardStates(a: GameboardAnalysisStructure, b:GameboardAnalysisStructure) -> Bool {
  return a.score < b.score
}

var heap = Heap(sort: sortGameboardStates)
heap.insert(GameboardAnalysisStructure(currentState: initialInput, previousStates: [], score: 0))

var endReached = false
var seenStates: Set = [initialInput]

while(!endReached) {
  guard let heapStruct = heap.remove() else {
    print("No board to check! Error!")
    break
  }

  print("Analysing")
  print(heapStruct.currentState)

  let gameboard = GameBoard(from: heapStruct.currentState)
  
  guard !gameboard.isGameComplete else {
    endReached = true
    print(heapStruct.previousStates)
    print(gameboard)
    print(heapStruct.score)
    break
  }

  let validMoves = gameboard.validMoveForAllPieces()

  for move in validMoves {
    let newString = update(gameboardString: gameboard.description, move: move)
    if (seenStates.contains(newString)) {
      continue
    }

    var previousStates = heapStruct.previousStates
    previousStates.append(gameboard.description)

    let newStruct = GameboardAnalysisStructure(currentState: newString, previousStates: previousStates, score: heapStruct.score + move.scoreIncrease)
    heap.insert(newStruct)
    seenStates.insert(newString)
  }
  print(heap.count)
  print(seenStates.count)
}

// let testInput = """
// #############
// #...C.B...BA#
// ###B#.#.#C###
//   #D#.#.#A#
//   #D#B#A#C#
//   #C#D#D#A#
//   #########
// """

// let gameboard = GameBoard(from: testInput)
// let validMoves = gameboard.validMoveForAllPieces()

// for move in validMoves {
//   print(move)
//   print(update(gameboardString: gameboard.description, move: move))
// }
// for move in validMoves {
//   let newGameboard = GameBoard(from: initialInput)
//   newGameboard.makeMove(move)
//   print(newGameboard)
// }

//
//  Heap.swift
//  Written for the Swift Algorithm Club by Kevin Randrup and Matthijs Hollemans
//
public struct Heap<T> {
  
  /** The array that stores the heap's nodes. */
  var nodes = [T]()
  
  /**
   * Determines how to compare two nodes in the heap.
   * Use '>' for a max-heap or '<' for a min-heap,
   * or provide a comparing method if the heap is made
   * of custom elements, for example tuples.
   */
  private var orderCriteria: (T, T) -> Bool
  
  /**
   * Creates an empty heap.
   * The sort function determines whether this is a min-heap or max-heap.
   * For comparable data types, > makes a max-heap, < makes a min-heap.
   */
  public init(sort: @escaping (T, T) -> Bool) {
    self.orderCriteria = sort
  }
  
  /**
   * Creates a heap from an array. The order of the array does not matter;
   * the elements are inserted into the heap in the order determined by the
   * sort function. For comparable data types, '>' makes a max-heap,
   * '<' makes a min-heap.
   */
  public init(array: [T], sort: @escaping (T, T) -> Bool) {
    self.orderCriteria = sort
    configureHeap(from: array)
  }
  
  /**
   * Configures the max-heap or min-heap from an array, in a bottom-up manner.
   * Performance: This runs pretty much in O(n).
   */
  private mutating func configureHeap(from array: [T]) {
    nodes = array
    for i in stride(from: (nodes.count/2-1), through: 0, by: -1) {
      shiftDown(i)
    }
  }
  
  public var isEmpty: Bool {
    return nodes.isEmpty
  }
  
  public var count: Int {
    return nodes.count
  }
  
  /**
   * Returns the index of the parent of the element at index i.
   * The element at index 0 is the root of the tree and has no parent.
   */
  @inline(__always) internal func parentIndex(ofIndex i: Int) -> Int {
    return (i - 1) / 2
  }
  
  /**
   * Returns the index of the left child of the element at index i.
   * Note that this index can be greater than the heap size, in which case
   * there is no left child.
   */
  @inline(__always) internal func leftChildIndex(ofIndex i: Int) -> Int {
    return 2*i + 1
  }
  
  /**
   * Returns the index of the right child of the element at index i.
   * Note that this index can be greater than the heap size, in which case
   * there is no right child.
   */
  @inline(__always) internal func rightChildIndex(ofIndex i: Int) -> Int {
    return 2*i + 2
  }
  
  /**
   * Returns the maximum value in the heap (for a max-heap) or the minimum
   * value (for a min-heap).
   */
  public func peek() -> T? {
    return nodes.first
  }
  
  /**
   * Adds a new value to the heap. This reorders the heap so that the max-heap
   * or min-heap property still holds. Performance: O(log n).
   */
  public mutating func insert(_ value: T) {
    nodes.append(value)
    shiftUp(nodes.count - 1)
  }
  
  /**
   * Adds a sequence of values to the heap. This reorders the heap so that
   * the max-heap or min-heap property still holds. Performance: O(log n).
   */
  public mutating func insert<S: Sequence>(_ sequence: S) where S.Iterator.Element == T {
    for value in sequence {
      insert(value)
    }
  }
  
  /**
   * Allows you to change an element. This reorders the heap so that
   * the max-heap or min-heap property still holds.
   */
  public mutating func replace(index i: Int, value: T) {
    guard i < nodes.count else { return }
    
    remove(at: i)
    insert(value)
  }
  
  /**
   * Removes the root node from the heap. For a max-heap, this is the maximum
   * value; for a min-heap it is the minimum value. Performance: O(log n).
   */
  @discardableResult public mutating func remove() -> T? {
    guard !nodes.isEmpty else { return nil }
    
    if nodes.count == 1 {
      return nodes.removeLast()
    } else {
      // Use the last node to replace the first one, then fix the heap by
      // shifting this new first node into its proper position.
      let value = nodes[0]
      nodes[0] = nodes.removeLast()
      shiftDown(0)
      return value
    }
  }
  
  /**
   * Removes an arbitrary node from the heap. Performance: O(log n).
   * Note that you need to know the node's index.
   */
  @discardableResult public mutating func remove(at index: Int) -> T? {
    guard index < nodes.count else { return nil }
    
    let size = nodes.count - 1
    if index != size {
      nodes.swapAt(index, size)
      shiftDown(from: index, until: size)
      shiftUp(index)
    }
    return nodes.removeLast()
  }
  
  /**
   * Takes a child node and looks at its parents; if a parent is not larger
   * (max-heap) or not smaller (min-heap) than the child, we exchange them.
   */
  internal mutating func shiftUp(_ index: Int) {
    var childIndex = index
    let child = nodes[childIndex]
    var parentIndex = self.parentIndex(ofIndex: childIndex)
    
    while childIndex > 0 && orderCriteria(child, nodes[parentIndex]) {
      nodes[childIndex] = nodes[parentIndex]
      childIndex = parentIndex
      parentIndex = self.parentIndex(ofIndex: childIndex)
    }
    
    nodes[childIndex] = child
  }
  
  /**
   * Looks at a parent node and makes sure it is still larger (max-heap) or
   * smaller (min-heap) than its childeren.
   */
  internal mutating func shiftDown(from index: Int, until endIndex: Int) {
    let leftChildIndex = self.leftChildIndex(ofIndex: index)
    let rightChildIndex = leftChildIndex + 1
    
    // Figure out which comes first if we order them by the sort function:
    // the parent, the left child, or the right child. If the parent comes
    // first, we're done. If not, that element is out-of-place and we make
    // it "float down" the tree until the heap property is restored.
    var first = index
    if leftChildIndex < endIndex && orderCriteria(nodes[leftChildIndex], nodes[first]) {
      first = leftChildIndex
    }
    if rightChildIndex < endIndex && orderCriteria(nodes[rightChildIndex], nodes[first]) {
      first = rightChildIndex
    }
    if first == index { return }
    
    nodes.swapAt(index, first)
    shiftDown(from: first, until: endIndex)
  }
  
  internal mutating func shiftDown(_ index: Int) {
    shiftDown(from: index, until: nodes.count)
  }
  
}

extension Heap where T: Equatable {
  
  /** Get the index of a node in the heap. Performance: O(n). */
  public func index(of node: T) -> Int? {
    return nodes.firstIndex(where: { $0 == node })
  }
  
  /** Removes the first occurrence of a node from the heap. Performance: O(n). */
  @discardableResult public mutating func remove(node: T) -> T? {
    if let index = index(of: node) {
      return remove(at: index)
    }
    return nil
  }
  
}