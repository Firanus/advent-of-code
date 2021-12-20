#!/usr/bin/swift 

import Foundation 

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Scanner class
  ------------------------------------------------------------------------------------------------------------------------------------
*/


// In a Scanner, we assume the scanner is at (0,0,0) and that we don't know its orientation
class Scanner {
  let identifier: Int
  var beacons: [Beacon]
  var scannerPositions: [(Int, Int, Int)]
  var origin: (Int, Int, Int)
  var orientation: (Int, Int, Int)

  init(fromString string: String) {
    let strings = string.components(separatedBy: "\n");

    identifier = Int(strings[0].components(separatedBy: " ")[2])!

    beacons = strings[1...].map({ (coorString: String) -> Beacon in
      let coordinates = coorString.components(separatedBy: ",").map { Int($0)! }
      return Beacon(x: coordinates[0], y: coordinates[1], z: coordinates[2])
    })

    origin = (0,0,0)
    scannerPositions = [(0,0,0)]
    orientation = (0,0,0)
  }

  func changeOrigin(to origin: (Int,Int,Int)) {
    let oldOrigin = self.origin
    self.origin = origin
    let move = (origin.0 - oldOrigin.0, origin.1 - oldOrigin.1, origin.2 - oldOrigin.2)
    scannerPositions = scannerPositions.map { ($0.0 - move.0, $0.1 - move.1, $0.2 - move.2) }
    beacons = beacons.map { Beacon(coordinates: $0.coordinates, relativeTo: move) }  
  }

  func resetAndRotateScanner(to newOrientation: (Int, Int, Int)) {
    changeOrigin(to: (0,0,0))
    scannerPositions = scannerPositions.map { rotate(coordinates: $0, from: orientation, to: newOrientation) }
    beacons = beacons.map { Beacon(coordinates: $0.coordinates, from: orientation, to: newOrientation)}
    orientation = newOrientation
  }

  func merge(scanner: Scanner) {
    var overlapBeacon: Beacon? = nil
    var overlapOrientation: (Int,Int,Int)? = nil
    let startBeacons = beacons

    for startBeacon in startBeacons {
      changeOrigin(to: startBeacon.coordinates)

      let currentBeacons = beacons
      (overlapBeacon, overlapOrientation) = scanner.beaconWhichOverlapsWith(with: currentBeacons)
      if (overlapBeacon != nil && overlapOrientation != nil) {
        break
      }
    }
    
    guard overlapBeacon != nil, overlapOrientation != nil else {
      print("No overlap between scanner \(identifier) and scanner \(scanner.identifier)")
      return
    }

    scanner.resetAndRotateScanner(to: overlapOrientation!)
    scanner.changeOrigin(to: overlapBeacon!.coordinates)

    for scannerBeacon in scanner.beacons {
      if (!beacons.contains(scannerBeacon)) {
        beacons.append(scannerBeacon)
      }
    }

    scannerPositions.append(contentsOf: scanner.scannerPositions)
    print("Successfully merged scanner \(scanner.identifier) into scanner \(identifier)")
  }

  func beaconWhichOverlapsWith(with externalBeacons: [Beacon]) -> (Beacon?, (Int,Int,Int)?) {
    for orientation in validOrientations {
      resetAndRotateScanner(to: orientation)

      let startingBeacons = beacons

      for startingBeacon in startingBeacons {
        changeOrigin(to: startingBeacon.coordinates)
        
        let movedBeacons = beacons

        var overlapCount = 0
        for movedBeacon in movedBeacons {
          if externalBeacons.contains(movedBeacon) {
            overlapCount += 1
          }
        }

        if (overlapCount >= 12) {
          return (startingBeacon, orientation)
        }
      }
    }
    return (nil,nil)
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Valid Orientations - Described as 90 degree rotations about (x,y,z)
  ------------------------------------------------------------------------------------------------------------------------------------
*/

let validOrientations = [
  (0,0,0),
  (0,0,1),
  (0,0,2),
  (0,0,3),
  (1,0,0),
  (1,0,1),
  (1,0,2),
  (1,0,3),
  (0,1,0),
  (0,1,1),
  (0,1,2),
  (0,1,3),
  (3,0,0),
  (3,0,1),
  (3,0,2),
  (3,0,3),
  (0,3,0),
  (0,3,1),
  (0,3,2),
  (0,3,3),
  (0,2,0),
  (0,2,1),
  (0,2,2),
  (0,2,3),
]

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Beacon class
  ------------------------------------------------------------------------------------------------------------------------------------
*/

struct Beacon {
  let coordinates: (Int, Int, Int)

  init(x: Int, y: Int, z: Int) {
    coordinates = (x,y,z)
  }

  init(coordinates:(Int, Int, Int), relativeTo newOrigin: (Int,Int,Int)) {
    let a = coordinates.0 - newOrigin.0
    let b = coordinates.1 - newOrigin.1
    let c = coordinates.2 - newOrigin.2

    self.coordinates = (a,b,c)
  }

  init(coordinates:(Int, Int, Int), from initialOrientation: (Int,Int,Int), to endOrientation: (Int,Int,Int)) {
    self.coordinates = rotate(coordinates: coordinates, from: initialOrientation, to: endOrientation)
  }
}

func rotate(coordinates:(Int, Int, Int), from initialOrientation: (Int,Int,Int), to endOrientation: (Int,Int,Int)) -> (Int,Int,Int) {
    let a = coordinates.0
    let b = coordinates.1
    let c = coordinates.2

    var finalCoords = (a,b,c)

    // We undo the previous rotation before applying a new one
    for _ in 0..<initialOrientation.2 {
      finalCoords = (finalCoords.1, -finalCoords.0, finalCoords.2)
    }
    for _ in 0..<initialOrientation.1 {
      finalCoords = (finalCoords.2, finalCoords.1, -finalCoords.0)
    }
    for _ in 0..<initialOrientation.0 {
      finalCoords = (finalCoords.0, -finalCoords.2, finalCoords.1)
    }


    for _ in 0..<endOrientation.0 {
      finalCoords = (finalCoords.0, finalCoords.2, -finalCoords.1)
    }
    for _ in 0..<endOrientation.1 {
      finalCoords = (-finalCoords.2, finalCoords.1, finalCoords.0)
    }
    for _ in 0..<endOrientation.2 {
      finalCoords = (-finalCoords.1, finalCoords.0, finalCoords.2)
    }

    return finalCoords
  }

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Equatable extension
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension Beacon: Equatable {
  static func ==(_ lhs: Beacon, _ rhs: Beacon) -> Bool {
    return lhs.coordinates.0 == rhs.coordinates.0 && lhs.coordinates.1 == rhs.coordinates.1  && lhs.coordinates.2 == rhs.coordinates.2 
  }
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Printing extensions
  ------------------------------------------------------------------------------------------------------------------------------------
*/

extension Beacon: CustomStringConvertible {
  var description: String {
    return "(\(coordinates.0),\(coordinates.1),\(coordinates.2))"
  }
}

extension Scanner: CustomStringConvertible {
  var description: String {
    return """
      ID:\(identifier)
      Origin: (\(origin.0),\(origin.1),\(origin.2))
      Orientation: (\(orientation.0),\(orientation.1),\(orientation.2))
      Scanner Positions: \(scannerPositions.map { "(\($0.0),\($0.1),\($0.2))" })
      Beacons: \(beacons.sorted(by: { $0.coordinates.0 < $1.coordinates.0 }).map{ $0.description })
    """
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
  let inputUrl = URL(fileURLWithPath: "./testInput.txt", relativeTo: scriptUrl)

  let fileContents = try String(contentsOf: inputUrl, encoding: .utf8)
  return fileContents
}

func getScanners(from input: String) -> [Scanner] {
  return input.components(separatedBy: "\n\n").map { Scanner(fromString: $0 )}
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------
  Executing Code
  ------------------------------------------------------------------------------------------------------------------------------------
*/

let input = try getInput()
var scanners = getScanners(from: input)

// Manual-ass way that I can do because I now have
// knowledge on how the inputs combine
// let zeroth = scanners[0]
// zeroth.merge(scanner: scanners[25])
// zeroth.resetAndRotateScanner(to: (0,0,0))

// let sixth = scanners[6]
// sixth.merge(scanner: scanners[20])
// sixth.resetAndRotateScanner(to: (0,0,0))

// let last = scanners[27]
// last.merge(scanner: scanners[10])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[19])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[26])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[4])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[12])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[13])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[21])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[22])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[3])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[5])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[11])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[14])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[15])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[1])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[7])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[8])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[9])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[16])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[17])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[18])
// last.resetAndRotateScanner(to: (0,0,0))
// last.merge(scanner: scanners[24])
// last.resetAndRotateScanner(to: (0,0,0))
// zeroth.merge(scanner: last)
// zeroth.resetAndRotateScanner(to: (0,0,0))
// zeroth.merge(scanner: scanners[2])
// zeroth.resetAndRotateScanner(to: (0,0,0))
// zeroth.merge(scanner: scanners[23])
// zeroth.resetAndRotateScanner(to: (0,0,0))
// zeroth.merge(scanner: sixth)
// zeroth.resetAndRotateScanner(to: (0,0,0))

// print(zeroth)
// print("Part 1 Answer: \(zeroth.beacons.count)")


// Running everyone against the others
// This takes 2 hours and counting.
// Guaranteed to work I suspect, but looooooong
var untriedScanners: [Scanner] = []
var triedScanners: [Scanner] = scanners

repeat {
  untriedScanners = triedScanners
  triedScanners = []

  for newScanner in untriedScanners {
    var hadSuccess = false
    for triedScanner in triedScanners {
      let mergedScannerCount = triedScanner.scannerPositions.count
      triedScanner.merge(scanner: newScanner)

      if (mergedScannerCount < triedScanner.scannerPositions.count) {
        hadSuccess = true
      }
      triedScanner.resetAndRotateScanner(to: (0,0,0))
      newScanner.resetAndRotateScanner(to: (0,0,0))
    }

    if (hadSuccess == false) {
      triedScanners.append(newScanner)
    }
  }
} while triedScanners.count > 1

print(triedScanners[0])
print("Part 1 Answer: \(triedScanners[0].beacons.count)")


// Starting from 27
// This fails with only 2 remaining, 6 and 20
// Also takes over an hour to run. :(
//
// let baseScanner = scanners.last!
// scanners = Array(scanners.dropLast())

// while(scanners.count > 0) {
//   let scanner = scanners.first!
//   scanners = Array(scanners.dropFirst())

//   let mergedScannerCount = baseScanner.scannerPositions.count
//   baseScanner.merge(scanner: scanner)

//   if mergedScannerCount == baseScanner.scannerPositions.count {
//     scanner.resetAndRotateScanner(to: (0,0,0))
//     scanners.append(scanner)
//   } else {
//     baseScanner.resetAndRotateScanner(to: (0,0,0))
//   }
// }

// print(triedScanners.first!)
// print("Part 1 Answer: \(triedScanners.first!.beacons.count)")

// print(scanners[25].beacons.count)
// scanners[0].merge(scanner: scanners[25])
// print(scanners[0])

// scanners[6].merge(scanner: scanners[20])
// print(scanners[6])