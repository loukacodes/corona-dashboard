import { axisBottom, axisLeft, curveBasis, line, max, scaleLinear } from 'd3'
import { scaleOrdinal, scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { legendColor } from 'd3-svg-legend'
import React, { useEffect, useRef } from 'react'
import useResizeObserver from '../../hooks/useResizeObserver'
import { SingleCountryData } from './corona-country'
import styles from './LineChart.module.scss'

interface LineChartProps {
  data: SingleCountryData[]
}

export const confirmedCasesColor = '#3A7CA5'
export const deathCasesColor = '#DF2935'
export const recoveredCasesColor = '#018E42'

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const svgRef = useRef('')
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef as any)

  useEffect(() => {
    if (!dimensions || !data) return

    const svg = select(svgRef.current) as any
    // prevent duplicate re-rendering
    svg.selectAll('g').remove()

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
      .attr('transform', `translate(0, ${dimensions.height})`)
      .attr('class', 'xAxis')

    svg.selectAll('.xAxis').transition().duration(300).call(axisBottom(xScale).ticks(7))

    svg.append('g').attr('class', 'yAxis')

    // shorten y axis value
    svg
      .selectAll('.yAxis')
      .transition()
      .duration(300)
      .call(
        axisLeft(yScale).tickFormat((d: any) => {
          if (d / 1000000 >= 1) {
            d = d / 1000000 + 'M'
          } else if (d / 1000 >= 1) {
            d = d / 1000 + 'K'
          } 
          return d
        })
      )

    const confirmedPaths = svg
      .selectAll('.confirmedLine')
      .data([data], (d: SingleCountryData) => d.Confirmed)

    confirmedPaths
      .enter()
      .append('path')
      .attr('class', 'confirmedLine')
      .merge(confirmedPaths)
      .transition()
      .duration(300)
      .attr('d', confirmedLine)
      .attr('fill', 'none')
      .attr('stroke', confirmedCasesColor)
      .attr('stroke-width', 3)

    const deathPaths = svg
      .selectAll('.deathLine')
      .data([data], (d: SingleCountryData) => d.Deaths)

    deathPaths
      .enter()
      .append('path')
      .attr('class', 'deathLine')
      .merge(deathPaths)
      .transition()
      .duration(300)
      .attr('d', deathLine)
      .attr('fill', 'none')
      .attr('stroke', deathCasesColor)
      .attr('stroke-width', 3)

    const recoveredPaths = svg
      .selectAll('.recoveredLine')
      .data([data], (d: SingleCountryData) => d.Recovered)

    recoveredPaths
      .enter()
      .append('path')
      .attr('class', 'recoveredLine')
      .merge(recoveredPaths)
      .transition()
      .duration(300)
      .attr('d', recoveredLine)
      .attr('fill', 'none')
      .attr('stroke', recoveredCasesColor)
      .attr('stroke-width', 3)

    const color = scaleOrdinal([
      confirmedCasesColor,
      deathCasesColor,
      recoveredCasesColor,
    ])

    // set color domain
    color.domain(['confirmed', 'death', 'recovered'])
    // set legends
    const legendGroup = svg.append('g').attr('transform', `translate(20, 20)`)
    const legend = legendColor().shape('line').scale(color)
    legendGroup.call(legend)
    legendGroup
      .selectAll('text')
      .attr('fill', '#e5ffdeff')
      .attr('font-weight', 300)
  }, [data, dimensions])

  return (
    <div ref={wrapperRef as any} className={styles.root}>
      <svg ref={svgRef as any}></svg>
    </div>
  )
}

export default LineChart
