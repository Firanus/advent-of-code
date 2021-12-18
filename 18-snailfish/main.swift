#!/usr/bin/swift 

import Foundation 

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  TreeNode class
  ------------------------------------------------------------------------------------------------------------------------------------
*/

class TreeNode {
  var value: Int? = nil
  var left: TreeNode? = nil
  var right: TreeNode? = nil
  var parent: TreeNode? = nil

  var depth: Int {
    guard parent != nil else {
      return 0
    }

    return 1 + parent!.depth
  }

  var magnitude: Int {
    if let definedValue = value {
      return definedValue
    }

    return 3 * (left?.magnitude ?? 0) + 2 * (right?.magnitude ?? 0)
  }

  init(fromStringInput stringInput: String, parent: TreeNode? = nil) {
    self.parent = parent
    guard !stringInput.isNumber else {
      self.value = Int(stringInput)!
      return
    }

    let splitIndex = getCommaIndexSplittingItems(in: stringInput)
    let left = stringInput[stringInput.index(after: stringInput.startIndex)..<splitIndex]
    let right = stringInput[stringInput.index(after: splitIndex)..<stringInput.index(before: stringInput.endIndex)]

    self.left = TreeNode(fromStringInput: String(left), parent: self)
    self.right = TreeNode(fromStringInput: String(right), parent: self)
  }

  init(value: Int, parent: TreeNode? = nil) {
    self.value = value
    self.parent = parent
  }

  init(left: TreeNode, right: TreeNode) {
    self.left = left
    left.parent = self
    self.right = right
    right.parent = self

    reduce()
  }

  func reduce() {
    var nodeToExplodeCandidate = self.childOfNodeToExplode?.parent
    var nodeToSplitCandidate = self.nodeToSplit

    while (nodeToExplodeCandidate != nil || nodeToSplitCandidate != nil) {
      if let nodeToExplode = nodeToExplodeCandidate {
        nodeToExplode.explode()
      } else if let nodeToSplit = nodeToSplitCandidate {
        nodeToSplit.split()
      }

      nodeToExplodeCandidate = self.childOfNodeToExplode?.parent
      nodeToSplitCandidate = self.nodeToSplit
    }
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  TreeNode class - Explosion Methods
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension TreeNode {
  var childOfNodeToExplode: TreeNode? {
    if depth > 4, value != nil {
      return self 
    }

    var nodeToReturn: TreeNode? = nil
    if let definedLeft = left {
      nodeToReturn = definedLeft.childOfNodeToExplode
    }

    if nodeToReturn == nil, let definedRight = right {
      nodeToReturn = definedRight.childOfNodeToExplode
    }

    return nodeToReturn
  }

  var rightMostNode: TreeNode? {
    if value != nil {
      return self
    }

    var nodeToReturn: TreeNode? = nil
    if let definedRight = right {
      nodeToReturn = definedRight.rightMostNode
    }

    if nodeToReturn == nil, let definedLeft = left {
      nodeToReturn = definedLeft.rightMostNode
    }

    return nodeToReturn
  }

  var leftMostNode: TreeNode? {
    if value != nil {
      return self
    }

    var nodeToReturn: TreeNode? = nil

    if let definedLeft = left {
      nodeToReturn = definedLeft.leftMostNode
    }

    if nodeToReturn == nil,let definedRight = right {
      nodeToReturn = definedRight.leftMostNode
    }

    return nodeToReturn
  }

  var nextLeftNode: TreeNode? {
    if (parent == nil) { return nil }

    var nodeToReturn: TreeNode? = nil
    if let parentLeft = parent?.left, parentLeft !== self {
      nodeToReturn = parentLeft.rightMostNode
    }

    return nodeToReturn ?? parent?.nextLeftNode
  }

  var nextRightNode: TreeNode? {
    if (parent == nil) { return nil }

    var nodeToReturn: TreeNode? = nil
    if let parentRight = parent?.right, parentRight !== self {
      nodeToReturn = parentRight.leftMostNode
    }

    return nodeToReturn ?? parent?.nextRightNode
  }

  func explode() {
    if let leftValue = left?.value, let leftNodeToIncrement = nextLeftNode {
      leftNodeToIncrement.value = leftNodeToIncrement.value! + leftValue
    }

    if let rightValue = right?.value, let rightNodeToIncrement = nextRightNode {
      rightNodeToIncrement.value = rightNodeToIncrement.value! + rightValue
    }

    self.value = 0
    self.left = nil
    self.right = nil
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  TreeNode class - Split Methods
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension TreeNode {
  var nodeToSplit: TreeNode? {
    if let definedValue = value {
      if definedValue >= 10 {
        return self
      } else {
        return nil
      }
    }

    var nodeToReturn: TreeNode? = nil
    if let definedLeft = left {
      nodeToReturn = definedLeft.nodeToSplit
    }

    if nodeToReturn == nil, let definedRight = right {
      nodeToReturn = definedRight.nodeToSplit
    }

    return nodeToReturn
  }
  func split() {
    if let definedValue = value {
      let newLeft = TreeNode(value: Int(floor(Double(definedValue) / 2.0)), parent: self)
      let newRight = TreeNode(value: Int(ceil(Double(definedValue) / 2.0)), parent: self)

      self.value = nil
      self.left = newLeft
      self.right = newRight
    }

  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  TreeNode class - Static Methods
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension TreeNode {
  static func add(_ left: TreeNode, _ right: TreeNode) -> TreeNode {
    return TreeNode(left: left, right: right)
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  TreeNode class - Printing extension
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension TreeNode: CustomStringConvertible {
  var description: String {
    if value != nil, left != nil, right != nil {
      return "Weird ass shit is going on!"
    }
    if let definedValue = value {
      return "\(definedValue)"
    }

    return "[\(left!.description),\(right!.description)]"
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  String Parsing Utility Functions
  ------------------------------------------------------------------------------------------------------------------------------------
*/

func getCommaIndexSplittingItems(in input: String) -> String.Index {
  // First and last characters are always opening and closing square brackets
  let stringToIterate = input[input.index(after: input.startIndex)..<input.index(before:input.endIndex)]

  var arrayDepth = 0
  for index in stringToIterate.indices {
    let character = stringToIterate[index]
    
    if character == "[" {
      arrayDepth += 1
    } else if character == "]" {
      arrayDepth -= 1
    } else if character == "," && arrayDepth == 0 {
      return index
    }
  }

  print("Error, we should never have got this far!")
  return stringToIterate.startIndex
}

extension String  {
  var isNumber: Bool {
      return !isEmpty && rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) == nil
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Input Parsing Functions
  ------------------------------------------------------------------------------------------------------------------------------------
*/
func getInput() throws -> String {
  let currentDirectoryURL = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
  let scriptUrl = URL(fileURLWithPath: CommandLine.arguments[0], relativeTo: currentDirectoryURL)
  let inputUrl = URL(fileURLWithPath: "./input.txt", relativeTo: scriptUrl)

  let fileContents = try String(contentsOf: inputUrl, encoding: .utf8)
  return fileContents
}

func getInitialSnailfishNumbers(from input: String) -> [String] {
  let numbersAsStrings = input.components(separatedBy: "\n")
  return numbersAsStrings
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Executing Code
  ------------------------------------------------------------------------------------------------------------------------------------
*/

let input = try getInput()
let initialSnailfishNumbers = getInitialSnailfishNumbers(from: input)
let treeNodes = initialSnailfishNumbers.map { TreeNode(fromStringInput: $0 )}

var nodeAfterAllSums = treeNodes[0]
for node in treeNodes[1...] {
  nodeAfterAllSums = TreeNode.add(nodeAfterAllSums, node)
}
print("Part 1 Answer:", nodeAfterAllSums.magnitude)

var part2Max = -1
for i in 0..<treeNodes.count {
  for j in i..<treeNodes.count {
    if (i == j) { continue }
    let sum1 = TreeNode.add(
      TreeNode(fromStringInput: initialSnailfishNumbers[i]),
      TreeNode(fromStringInput: initialSnailfishNumbers[j])
    ).magnitude
    let sum2 = TreeNode.add(
      TreeNode(fromStringInput: initialSnailfishNumbers[j]),
      TreeNode(fromStringInput: initialSnailfishNumbers[i])
    ).magnitude
    part2Max = max(max(sum1, sum2), part2Max)
  }
}
print("Part 2 Answer:", part2Max)