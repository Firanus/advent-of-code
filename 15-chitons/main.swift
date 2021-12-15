#!/usr/bin/swift 

import Foundation 

// This is a pathfinding problem. Looking up Djikstra's
// algorithm for the first time in a long time.

// Grid only has values. To solve the problem, we'll treat
// this as a directed graph where the weights of the edges
// are the value of the destination point.

// However, for modelling purposes, it's fine to stick to values.
class PathfindingGrid {
  let grid: [[Node]]
  let startNode: Node
  let endNode: Node
  
  init(initialGrid: [[Int]], startNodeCoordinates: (row: Int, col: Int), endNodeCoordinates: (row: Int, col: Int)) {
    var grid: [[Node]] = []
    for (rowIndex, row) in initialGrid.enumerated() {
      var nodeRow: [Node] = []
      for (colIndex, value) in row.enumerated() {
        let node = Node(value: value, coordinates: (row: rowIndex, col: colIndex))
        nodeRow.append(node)
      }
      grid.append(nodeRow)
    }

    for (rowIndex, row) in grid.enumerated() {
      for (colIndex, value) in row.enumerated() {
        var surroundingNodes: [Node] = []
        let above = rowIndex > 0 ? grid[rowIndex - 1][colIndex] : nil
        let below = rowIndex < grid.count - 1 ? grid[rowIndex + 1][colIndex] : nil
        let left = colIndex > 0 ? grid[rowIndex][colIndex - 1] : nil
        let right = colIndex < row.count - 1 ? grid[rowIndex][colIndex + 1] : nil

        surroundingNodes.append(contentsOf: [above, below, left, right].compactMap { $0 })
        value.surroundingNodes = surroundingNodes
      }
    }

    self.grid = grid
    self.startNode = grid[startNodeCoordinates.row][startNodeCoordinates.col]
    self.endNode = grid[endNodeCoordinates.row][endNodeCoordinates.col]
  }

  func sortNodesDecreasingByTentativeDistance(a: Node, b:Node) -> Bool {
    return a.tentativeDistance < b.tentativeDistance
  }

  func findPath() {
    var nodesToSearch = Heap(sort: sortNodesDecreasingByTentativeDistance)

    self.startNode.updatePath(tentativeDistance: 0, pathToNode: [])
    nodesToSearch.insert(startNode);

    while self.endNode.visited == false {
      guard let currentNode = nodesToSearch.remove() else {
        print("No current node! Error!")
        return
      }

      guard currentNode.visited == false else {
        continue
      }
      print("Visiting node \(currentNode.identifier)")

      for nearbyNode in currentNode.surroundingNodes {
        guard nearbyNode.visited == false else {
          continue
        }

        if nearbyNode.tentativeDistance > currentNode.tentativeDistance + nearbyNode.value {
          nearbyNode.updatePath(
            tentativeDistance: currentNode.tentativeDistance + nearbyNode.value, 
            pathToNode: currentNode.pathToNode
          )
          nodesToSearch.insert(nearbyNode)
        }
      }
      currentNode.markVisited()
    }
  }

  func visualise() {
    var resultString = ""
    let pathToEnd = endNode.pathToNode
    for row in grid {
      for node in row {
        if (pathToEnd.contains(node)) {
          resultString += "X"
        } else {
          resultString += "."
        }
      }
      resultString += "\n"
    }

    print(resultString)
  }
}

class Node: CustomStringConvertible, Equatable {
  var visited: Bool = false
  var tentativeDistance: Int = Int.max
  var pathToNode: [Node] = [];

  let identifier: String;
  let value: Int
  var surroundingNodes: [Node] = []

  var description: String {
    return """
      Node \(identifier):
        value \(value), 
        visited: \(visited), 
        tentativeDistance: \(self.tentativeDistance != Int.max ? String(self.tentativeDistance) : "undefined"), 
        pathToNode values: \(pathToNode.map { $0.identifier })
    """
  }

  init(value: Int, coordinates: (row: Int, col: Int)) {
    self.value = value
    self.identifier = "R\(coordinates.row)C\(coordinates.col)"
  }

  func set(surroundingNodes: [Node]) {
    self.surroundingNodes = surroundingNodes
  }

  func markVisited() {
    self.visited = true;
  }

  func updatePath(tentativeDistance: Int, pathToNode: [Node]) {
    self.tentativeDistance = tentativeDistance
    var pathWithThisNode = pathToNode
    pathWithThisNode.append(self)
    self.pathToNode = pathWithThisNode
  }

  static func == (lhs: Node, rhs: Node) -> Bool {
      return lhs.identifier == rhs.identifier
  }
}

func getInput() throws -> String {
  let currentDirectoryURL = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
  let scriptUrl = URL(fileURLWithPath: CommandLine.arguments[0], relativeTo: currentDirectoryURL)
  let inputUrl = URL(fileURLWithPath: "./input.txt", relativeTo: scriptUrl)

  let fileContents = try String(contentsOf: inputUrl, encoding: .utf8)
  return fileContents
}

func getInitialGrid(from input: String) -> [[Int]] {
  var grid: [[Int]] = []
  let rows = input.components(separatedBy: "\n")
  for rowString in rows {
    let numbers = rowString.map { $0.wholeNumberValue! }
    grid.append(numbers)
  }
  return grid
}

func prepareGridForPartTwo(using initialGrid: [[Int]]) -> [[Int]] {
  var grid: [[Int]] = []
  let initialHeight = initialGrid.count
  let initialWidth = initialGrid[0].count
  let height = initialHeight * 5
  let width = initialWidth * 5

  for rowIndex in 0..<height {
    var row: [Int] = []
    for colIndex in 0..<width {
      let rowIndexOnOriginalGrid = rowIndex % initialHeight
      let colIndexOnOriginalGrid = colIndex % initialHeight
      let verticalIterationCount = (rowIndex - rowIndexOnOriginalGrid) / initialHeight
      let horizontalIterationCount = (colIndex - colIndexOnOriginalGrid) / initialWidth
      let amountToIncreaseValuesBy = verticalIterationCount + horizontalIterationCount

      row.append((initialGrid[rowIndexOnOriginalGrid][colIndexOnOriginalGrid] - 1 + amountToIncreaseValuesBy) % 9 + 1)
    }
    grid.append(row)
  }

  return grid
}

let input = try getInput()
let initialGrid = getInitialGrid(from: input)

// Part 2 Processing
let part2Grid = prepareGridForPartTwo(using: initialGrid)

let pathfindingGrid = PathfindingGrid(
  initialGrid: part2Grid, 
  startNodeCoordinates: (row: 0, col: 0), 
  endNodeCoordinates: (row: part2Grid.count - 1, col: part2Grid[part2Grid.count - 1].count - 1)
)
pathfindingGrid.findPath()
// pathfindingGrid.visualise()
print(pathfindingGrid.endNode.tentativeDistance)

// -------------------------------------------------------------------------------------------------

// Heap Definition stolen from
// https://github.com/raywenderlich/swift-algorithm-club/blob/master/Heap/Heap.swift

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