import path from "path";
import fs from "fs";

interface Map {
  sourceType: string;
  destinationType: string;
  ranges: Range[];
}

interface Range {
  sourceStartIndex: number;
  destinationStartIndex: number;
  range: number;
}

interface SourceRange {
  sourceType: string;
  startIndex: number;
  range: number;
}

const getNextSourceNumber = (map: Map, sourceNumber: number) => {
  for (let i = 0; i < map.ranges.length; i++) {
    const range = map.ranges[i];
    if (
      sourceNumber >= range.sourceStartIndex && 
      sourceNumber < range.sourceStartIndex + range.range
    ) {
      const diff = sourceNumber - range.sourceStartIndex;
      const destinationNumber = range.destinationStartIndex + diff;
      return destinationNumber;
    }
  }

  return sourceNumber;
}

const getNextSourceRanges = (map: Map, sourceRange: SourceRange): SourceRange[] => {
  let resultRanges: SourceRange[] = [];
  let coveredRangeSections: {start: number, end: number}[] = []
  const {startIndex: initialValue, range: sourceRangeLength} = sourceRange;
  const finalRangeValue = initialValue + sourceRangeLength

  for (let i = 0; i < map.ranges.length; i++) {
    const {
      sourceStartIndex: mapRangeStartValue,
      range: mappingRange,
    } = map.ranges[i];
    const mapRangeFinalValue = mapRangeStartValue + mappingRange

    const overlapsStartOfMapRange = 
      initialValue < mapRangeStartValue && 
      finalRangeValue > mapRangeStartValue;
    const overlapsEndOfMapRange = 
      initialValue < mapRangeFinalValue && 
      finalRangeValue > mapRangeFinalValue;

    if (overlapsStartOfMapRange && overlapsEndOfMapRange) {
      // entire map range will be transformed
      resultRanges.push({ 
        sourceType: map.destinationType, 
        startIndex: getNextSourceNumber(map, mapRangeStartValue),
        range: mappingRange,
      })
      coveredRangeSections.push({start: mapRangeStartValue, end: mapRangeFinalValue})
    } else if (overlapsStartOfMapRange) {
      // beginning of map range will be transformed
      resultRanges.push({ 
        sourceType: map.destinationType, 
        startIndex: getNextSourceNumber(map, mapRangeStartValue),
        range: finalRangeValue - mapRangeStartValue,
      })
      coveredRangeSections.push({start: mapRangeStartValue, end: finalRangeValue})
    } else if (overlapsEndOfMapRange) {
      // end of map range will be transformed
      resultRanges.push({ 
        sourceType: map.destinationType, 
        startIndex: getNextSourceNumber(map, initialValue),
        range: mapRangeFinalValue - initialValue,
      })
      coveredRangeSections.push({start: initialValue, end: mapRangeFinalValue})
    }
  }

  // At this point, we've handled all points covered by a range in the map. 
  // Now we need to handle points not covered.
  coveredRangeSections.sort((a, b) => a.start - b.start)

  if (coveredRangeSections.length === 0) {
    resultRanges.push({
      sourceType: map.destinationType, 
      startIndex: getNextSourceNumber(map, initialValue),
      range: sourceRangeLength,
    })
  }

  const firstCoveredRangeSection = coveredRangeSections[0] ?? undefined;
  if (firstCoveredRangeSection && firstCoveredRangeSection.start > initialValue) {
    resultRanges.push({
      sourceType: map.destinationType, 
      startIndex: getNextSourceNumber(map, initialValue),
      range: firstCoveredRangeSection.start - initialValue,
    })
  }

  for (let i = 0; i < coveredRangeSections.length - 1; i++) {
    const endOfLastRange = coveredRangeSections[i].end;
    const startOfNextRange = coveredRangeSections[i + 1].start;
    if (endOfLastRange !== startOfNextRange) {
      resultRanges.push({
        sourceType: map.destinationType, 
        startIndex: getNextSourceNumber(map, endOfLastRange),
        range: startOfNextRange - endOfLastRange,
      })
    }
  }

  const lastCoveredRangeSection = coveredRangeSections[coveredRangeSections.length - 1] ?? undefined;
  if (lastCoveredRangeSection && lastCoveredRangeSection.end > finalRangeValue) {
    resultRanges.push({
      sourceType: map.destinationType, 
      startIndex: getNextSourceNumber(map, lastCoveredRangeSection.end),
      range: finalRangeValue - lastCoveredRangeSection.end,
    })
  }

  return resultRanges;
}

// Janky test code!
//
// const testMap: Map = {
//   sourceType: 'test1',
//   destinationType: 'dest1',
//   ranges: [
//     { sourceStartIndex: 95, destinationStartIndex: 995, range: 7 },
//     { sourceStartIndex: 104, destinationStartIndex: 2004, range: 3 },
//     { sourceStartIndex: 107, destinationStartIndex: 3007, range: 30 },
//   ]
// }
// const testRange: SourceRange = { sourceType: 'test1', startIndex: 100, range: 10};
// console.log(getNextSourceRanges(testMap, testRange))

const chunk = (arr: number[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split('\r\n\r\n');
    const seedsPart1 = rows[0].slice(7).split(' ').map((val) => parseInt(val, 10))
    const maps: Map[] = rows.slice(1).map((mapString) => {
      const [labelString, ...rangeStrings] = mapString.split('\r\n');

      const [sourceType, destinationTypeStr] = labelString.split('-to-');
      const destinationType = destinationTypeStr.slice(0, destinationTypeStr.length - 5);
      
      const ranges: Range[] = rangeStrings.map((rangeStr) => {
        const [destinationStartIndex, sourceStartIndex, range] = rangeStr
          .split(' ')
          .map((num) => parseInt(num, 10));
        return { destinationStartIndex, sourceStartIndex, range };
      });

      return {
        sourceType,
        destinationType,
        ranges,
      }
    });

    // Part 1
    const locationNumbers = seedsPart1.map((seed) => {
      let currentType = 'seed';
      let currentSourceNumber = seed;
      while (currentType !== 'location') {
        const relevantMap = maps.find((map) => map.sourceType === currentType);
        
        if (!relevantMap) throw new Error('Could not find map. This should never happen');

        currentType = relevantMap.destinationType;
        currentSourceNumber = getNextSourceNumber(relevantMap, currentSourceNumber);
      }
      return currentSourceNumber;
    })

    console.log(
      "Part 1 Solution -",
      locationNumbers.reduce((acc, curr) => Math.min(acc, curr), Number.MAX_SAFE_INTEGER)
    );

    const seedRanges: SourceRange[] = chunk(seedsPart1, 2)
      .map(([startIndex, range]) => ({sourceType: 'seed', startIndex, range}));
    
    // Part 2
    let currentType = 'seed';
    let currentRanges = seedRanges;
    while (currentType !== 'location') {
      const relevantMap = maps.find((map) => map.sourceType === currentType);

      if (!relevantMap) throw new Error('Could not find map. This should never happen');
      
      currentType = relevantMap.destinationType;
      currentRanges = currentRanges.flatMap((r) => getNextSourceRanges(relevantMap, r))
    }
    
    console.log(
      "Part 2 Solution -",
      currentRanges.reduce((acc, curr) => Math.min(acc, curr.startIndex), Number.MAX_SAFE_INTEGER)
    );
  }
);
