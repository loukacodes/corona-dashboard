import {
  axisBottom,
  axisLeft,
  curveMonotoneX,

  line,
  max,


  scaleLinear
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

  // Add X axis --> it is a date format
  useEffect(() => {
    if (!dimensions) return

    const svg = select(svgRef.current) as any

    const xScale = scaleTime()
      .domain([new Date(data[0].Date), new Date(data[data.length - 1].Date)])
      .range([0, dimensions.width])

    // Add Y axis
    const yScale = scaleLinear()
      .domain([0, max(data as Iterable<any>, (d) => d.Confirmed)])
      .range([dimensions.height, 0])

    svg.append('g').call(axisLeft(yScale))

    const confirmedLine = line()
      .x((d: any) => xScale(new Date(d.Date)))
      .y((d: any) => yScale(d.Confirmed))
      .curve(curveMonotoneX)

    const deathLine = line()
      .x((d: any) => xScale(new Date(d.Date)))
      .y((d: any) => yScale(d.Deaths))
      .curve(curveMonotoneX)

    const recoveredLine = line()
      .x((d: any) => xScale(new Date(d.Date)))
      .y((d: any) => yScale(d.Recovered))
      .curve(curveMonotoneX)

    // 3. Call the x axis in a group tag
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + dimensions.height + ')')
      .call(axisBottom(xScale)) // Create an axis component with axisBottom

    // 4. Call the y axis in a group tag
    svg.append('g').attr('class', 'y axis').call(axisLeft(yScale)) // Create an axis component with axisLeft

    // 9. Append the path, bind the data, and call the line generator
    svg
      .append('path')
      .datum(data) // 10. Binds data to the line
      .attr('class', 'line') // Assign a class for styling
      .attr('d', confirmedLine) // 11. Calls the line generator
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', 3)

    // 12. Appends a circle for each data-point
    // svg
    //   .selectAll('.dot')
    //   .data(data)
    //   .enter()
    //   .append('circle') // Uses the enter().append() method
    //   .attr('class', 'dot') // Assign a class for styling
    //   .attr('cx', (d: any, i: any) => xScale(new Date(d.Date)))
    //   .attr('cy', (d: SingleCountryData) => yScale(d.Confirmed))
    //   .attr('r', 2)

    // death path
    svg
      .append('path')
      .datum(data) // 10. Binds data to the line
      .attr('class', 'line-death') // Assign a class for styling
      .attr('d', deathLine) // 11. Calls the line generator
      .style('fill', 'none')
      .style('stroke', 'red')
      .style('stroke-width', 3)

    // recovered path
    svg
      .append('path')
      .datum(data) // 10. Binds data to the line
      .attr('class', 'line-death') // Assign a class for styling
      .attr('d', recoveredLine) // 11. Calls the line generator
      .style('fill', 'none')
      .style('stroke', 'green')
      .style('stroke-width', 3)
  }, [data, dimensions])

  return (
    <div ref={wrapperRef as any}>
      <svg ref={svgRef as any}></svg>
    </div>
  )
}

export default LineChart
