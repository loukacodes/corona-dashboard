import {
  axisBottom,
  axisLeft,
  curveBasis,
  line,
  max,
  scaleLinear,
} from 'd3'
import { scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import React, { useEffect, useRef } from 'react'
import useResizeObserver from '../../hooks/useResizeObserver'
import { SingleCountryData } from './corona-country'

interface LineChartProps {
  data: SingleCountryData[]
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  
  const svgRef = useRef('')
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef as any)

  useEffect(() => {
    if (!dimensions) return

    const svg = select(svgRef.current) as any

    const xScale = scaleTime()
      .domain([new Date(data[0].Date), new Date(data[data.length - 1].Date)])
      .range([0, dimensions.width])

    const yScale = scaleLinear()
      .domain([0, max(data as Iterable<any>, (d) => d.Confirmed)])
      .range([dimensions.height, 0])

    const confirmedLine = line()
      .x((d: any) => xScale(new Date(d.Date)))
      .y((d: any) => yScale(d.Confirmed))
      .curve(curveBasis)

    const deathLine = line()
      .x((d: any) => xScale(new Date(d.Date)))
      .y((d: any) => yScale(d.Deaths))
      .curve(curveBasis)

    const recoveredLine = line()
      .x((d: any) => xScale(new Date(d.Date)))
      .y((d: any) => yScale(d.Recovered))
      .curve(curveBasis)

    // plot the axes
    svg
      .append('g')
      .attr('transform', 'translate(0,' + dimensions.height + ')')
      .attr('class', 'xAxis')

    svg.selectAll('.xAxis').transition().duration(100).call(axisBottom(xScale).ticks(7))

    svg.append('g').attr('class', 'yAxis')
    svg.selectAll('.yAxis').transition().duration(100).call(axisLeft(yScale)) // Create an axis component with axisLeft

    const confirmedPaths = svg.selectAll('.confirmedLine').data([data], (d: SingleCountryData) => d.Confirmed)

    confirmedPaths
      .enter()
      .append('path')
      .attr('class', 'confirmedLine')
      .merge(confirmedPaths)
      .transition()
      .duration(300)
      .attr('d', confirmedLine)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 3)

    const deathPaths = svg.selectAll('.deathLine').data([data], (d: SingleCountryData) => d.Deaths)

    deathPaths
      .enter()
      .append('path')
      .attr('class', 'deathLine')
      .merge(deathPaths)
      .transition()
      .duration(300)
      .attr('d', deathLine)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 3)


    const recoveredPaths = svg.selectAll('.recoveredLine').data([data], (d: SingleCountryData) => d.Recovered)

    recoveredPaths
      .enter()
      .append('path')
      .attr('class', 'recoveredLine')
      .merge(recoveredPaths)
      .transition()
      .duration(300)
      .attr('d', recoveredLine)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 3)

  }, [data, dimensions])

  return (
    <div ref={wrapperRef as any} id='lineChart'>
      <svg ref={svgRef as any}></svg>
    </div>
  )
}

export default LineChart
