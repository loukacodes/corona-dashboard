import React, { useRef, useEffect } from 'react'
import { select, scaleBand, scaleLinear, max } from 'd3'
import useResizeObserver from '../../hooks/useResizeObserver'
import { CoronaCase } from '../../model/corona-case'

interface Props {
  data: CoronaCase[]
  currentMonth: string
}

const CoronaBarChart: React.FC<Props> = ({ data, currentMonth }) => {
  const svgRef = useRef('')
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef as any)

  useEffect(() => {
    const svg = select(svgRef.current) as any
    if (dimensions === undefined) return

    // sorting the data
    data.sort((a, b) => b.casePerDay - a.casePerDay)

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((d) => d.index))
      .range([0, dimensions.height])

    const xScale = scaleLinear()
      .domain([0, max(data as Iterable<any>, (c) => c.casePerDay)])
      .range([0, dimensions.width])

    // plot the bars
    svg
      .selectAll('.bar')
      .data(data, (d: CoronaCase) => d.country)
      .join((enter: any) =>
        enter.append('rect').attr('y', (d: CoronaCase) => yScale(d.index))
      )
      .attr('fill', (d: CoronaCase) => d.color)
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', yScale.bandwidth)
      .transition()
      .duration(200)
      .attr('width', (d: CoronaCase) => xScale(d.casePerDay))
      .attr('y', (d: CoronaCase) => yScale(d.index))

    // plot the labels
    svg
      .selectAll('.label')
      .data(data, (d: CoronaCase) => d.country)
      .join((enter: any) =>
        enter
          .append('text')
          .attr(
            'y',
            (d: CoronaCase) =>
              (yScale(d.index) || 0) + yScale.bandwidth() / 2 + 5
          )
      )
      .text((d: CoronaCase) => ` ${d.country} (${d.casePerDay} cases)`)
      .attr('class', 'label')
      .style('fill', 'white')
      .attr('x', 10)
      .transition()
      .duration(200)
      .attr(
        'y',
        (d: CoronaCase) => (yScale(d.index) || 0) + yScale.bandwidth() / 2 + 5
      )

    // plot current month
    svg
      .select('.currentMonth')
      .attr('x', dimensions.width - 200)
      .attr('y', dimensions.height)
      .text(currentMonth)
      .style('fill', 'black')
      .style('font-size', '28px')

  }, [currentMonth, data, dimensions])

  return (
    <div ref={wrapperRef as any}>
      <svg ref={svgRef as any}>
        <text className="currentMonth"></text>
      </svg>
    </div>
  )
}

export default CoronaBarChart
