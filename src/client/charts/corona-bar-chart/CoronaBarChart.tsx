import React, { useRef, useEffect } from 'react'
import { select, scaleBand, scaleLinear, max } from 'd3'
import useResizeObserver from '../../hooks/useResizeObserver'
import { CoronaCase } from '../../model/corona-case'

interface Props {
  data: CoronaCase[]
  currentMonth: string
}

const CoronaBarChart: React.FC<Props> = ({ data, currentMonth }) => {
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef as any)

  useEffect(() => {
    const svg = select('svg')

    if (dimensions === undefined) return

    // sorting the data
    data.sort((a, b) => b.casePerDay - a.casePerDay)

    const yScale = (scaleBand()
      .domain(data.map((c) => c.index))
      .range([0, dimensions.height])
      .paddingInner(0.1)
      .paddingOuter(0.1) as unknown) as any

    const xScale = scaleLinear()
      .domain([0, max(data as Iterable<any>, (c) => c.casePerDay)])
      .range([0, dimensions.width])

    // join the bars to data
    const bars = svg.selectAll('.bar').data(data)

    // plot the bars
    bars
      .attr('fill', (data: CoronaCase) => data.color)
      .attr('y', (data: CoronaCase) => yScale(data.index))
      .attr('class', 'bar')
      .attr('height', yScale.bandwidth)
      .attr('width', (data: CoronaCase) => xScale(data.casePerDay))
      .attr('x', 0)

    // enter the bars to DOM
    bars
      .enter()
      .append('rect')
      .attr('y', (data: CoronaCase) => yScale(data.index))
      .attr('fill', (data: CoronaCase) => data.color)
      .attr('class', 'bar')
      .attr('height', yScale.bandwidth)
      .transition()
      .duration(200)
      .attr('width', (data: CoronaCase) => xScale(data.casePerDay))
      .attr('x', 0)

    // join labels to data
    const labels = svg.selectAll('.label').data(data)

    // plot the labels
    labels
      .attr(
        'y',
        (data: CoronaCase) =>
          (yScale(data.index) || 0) + yScale.bandwidth() / 2 + 5
      )
      .text((data: CoronaCase) => ` ${data.country} (${data.casePerDay} cases)`)
      .attr('class', 'label')
      .attr('x', 10)
      .transition()
      .duration(200)

    // enter labels to DOM
    labels
      .enter()
      .append('text')
      .attr(
        'y',
        (data: CoronaCase) =>
          (yScale(data.index) || 0) + yScale.bandwidth() / 2 + 5
      )
      .text((data: CoronaCase) => ` ${data.country} (${data.casePerDay} cases)`)
      .attr('class', 'label')
      .attr('x', 10)
      .transition()
      .duration(200)
    // plot current month
    svg
      .select('.currentMonth')
      .attr('x', dimensions.width - 150)
      .attr('y', dimensions.height)
      .text(currentMonth)
      .style('fill', 'black')
      .style('font-size', '28px')
  }, [currentMonth, data, dimensions])

  return (
    <div ref={wrapperRef as any}>
      <svg>
        <text className="currentMonth"></text>
      </svg>
    </div>
  )
}

export default CoronaBarChart
