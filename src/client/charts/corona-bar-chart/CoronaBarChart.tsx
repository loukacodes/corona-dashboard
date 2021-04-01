import React, { useRef, useEffect } from 'react'
import { select, scaleBand, scaleLinear, max } from 'd3'
import useResizeObserver from '../../hooks/useResizeObserver'
import { CoronaCase } from '../../model/corona-case'

function CoronaBarChart({ data }: { data: CoronaCase[] }) {
  const svgRef = useRef('')
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef as any)

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current) as any
    if (dimensions === undefined) return

    // sorting the data
    data.sort((a, b) => b.casePerDay - a.casePerDay)

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((c) => c.index)) // [0,1,2,3,4,5]
      .range([0, dimensions.height + 200]) // [0, 200]

    const xScale = scaleLinear()
      .domain([0, max(data as Iterable<any>, c => c.casePerDay)]) // [0, 65 (example)]
      .range([0, dimensions.width]) // [0, 400 (example)]

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data, (entry: CoronaCase) => entry.country)
      .join((enter: any) =>
        enter.append('rect').attr('y', (entry: CoronaCase) => yScale(entry.index))
      )
      .attr('fill', (entry: CoronaCase) => entry.color)
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .transition()
      .duration(200)
      .attr('width', (entry: CoronaCase) => xScale(entry.casePerDay))
      .attr('y', (entry: CoronaCase) => yScale(entry.index))

    // draw the labels
    svg
      .selectAll('.label')
      .data(data, (entry: CoronaCase) => entry.country)
      .join((enter: any) =>
        enter
          .append('text')
          .attr(
            'y',
            (entry: CoronaCase) => (yScale(entry.index) || 0) + yScale.bandwidth() / 2 + 5
          )
      )
      .text((entry: CoronaCase) => ` ${entry.country} (${entry.casePerDay} cases)`)
      .attr('class', 'label')
      .attr('x', 10)
      .transition()
      .duration(200)
      .attr(
        'y',
        (entry: CoronaCase) => (yScale(entry.index) || 0) + yScale.bandwidth() / 2 + 5
      )
  }, [data, dimensions])

  return (
    <div ref={wrapperRef as any} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef as any}></svg>
    </div>
  )
}

export default CoronaBarChart
