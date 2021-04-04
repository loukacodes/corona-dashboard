import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3'
import React, { useEffect, useRef } from 'react'
import lightenColor from '../../helpers/lightenColor'
import useResizeObserver from '../../hooks/useResizeObserver'
import { CoronaCase } from '../../model/corona-case'

interface Props {
  data: CoronaCase[]
  currentMonth: string
}

const baseBarColor = '#1c3d56'
const textColor = '#e5ffdeff'

const CoronaBarChart: React.FC<Props> = ({ data, currentMonth }) => {
  const svgRef = useRef('')
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef as any)

  const updatedData = Array.from(data)
    .map((d, i) => {
      return {
        ...d,
        color: lightenColor(baseBarColor, i * 10),
      }
    })
    .sort((a, b) => b.casePerDay - a.casePerDay)

  useEffect(() => {
    const svg = select(svgRef.current) as any
    if (dimensions === undefined) return

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(updatedData.map((d) => d.index))
      .range([0, dimensions.height])

    const xScale = scaleLinear()
      .domain([0, max(updatedData as Iterable<any>, (c) => c.casePerDay)])
      .range([0, dimensions.width])

    // plot the axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${dimensions.height})`)
      .attr('class', 'xAxis')

    svg.selectAll('.xAxis').transition().duration(100).call(axisBottom(xScale))

    // plot the bars
    const bars = svg.selectAll('.bar')
    bars
      .data(updatedData, (d: CoronaCase) => d.country)
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
    bars.exit().remove()

    // plot the labels
    const labels = svg.selectAll('.label')
    labels
      .data(updatedData, (d: CoronaCase) => d.country)
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
      .style('fill', textColor)
      .attr('x', 10)
      .transition()
      .duration(200)
      .attr(
        'y',
        (d: CoronaCase) => (yScale(d.index) || 0) + yScale.bandwidth() / 2 + 5
      )
    labels.exit().remove()

    // plot current month
    svg
      .select('.currentMonth')
      .attr('x', dimensions.width - 200)
      .attr('y', dimensions.height)
      .text(currentMonth)
      .style('fill', textColor)
      .style('font-size', '28px')
  }, [currentMonth, updatedData, dimensions])

  return (
    <div ref={wrapperRef as any}>
      <svg ref={svgRef as any}>
        <text className="currentMonth"></text>
      </svg>
    </div>
  )
}

export default CoronaBarChart
