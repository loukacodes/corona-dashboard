import {
  area,
  axisBottom,
  axisLeft,
  curveBasis,
  Line,
  line,
  max,
  scaleLinear,
} from 'd3'
import { scaleOrdinal, scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { legendColor, legendSize } from 'd3-svg-legend'
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

    svg
      .selectAll('.xAxis')
      .transition()
      .duration(300)
      .call(axisBottom(xScale).ticks(7))

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

    const plotLine = (
      className: string,
      type: 'Confirmed' | 'Deaths' | 'Recovered',
      lineValue: Line<[number, number]>,
      color: string
    ) => {
      const pathToPlot = svg
        .selectAll(`.${className}`)
        .data([data], (d: SingleCountryData) => d[type])

      pathToPlot
        .enter()
        .append('path')
        .attr('class', className)
        .merge(pathToPlot)
        .transition()
        .duration(300)
        .attr('d', lineValue)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 3)
    }

    plotLine('confirmedLine', 'Confirmed', confirmedLine, confirmedCasesColor)
    plotLine('deathLine', 'Deaths', deathLine, deathCasesColor)
    plotLine('recoveredLine', 'Recovered', recoveredLine, recoveredCasesColor)

    const plotArea = (
      className: string,
      type: 'Confirmed' | 'Deaths' | 'Recovered',
      color: string
    ) => {
      const areaToFill = svg
        .selectAll(`.${className}`)
        .data([data], (d: SingleCountryData) => d[type])

        const areaScale = area()
          .x((data: any) => xScale(new Date(data.Date)))
          .y0(dimensions.height)
          .y1((data: any) => yScale(data[type]))

      areaToFill
        .enter()
        .append('path')
        .attr('class', className)
        .merge(areaToFill)
        .transition()
        .duration(300)
        .attr('d', areaScale)
        .attr('fill', color)
        .attr('stroke-width', 0)
        .attr('opacity', 0.3)
    }

    plotArea('confirmedArea', 'Confirmed', confirmedCasesColor)
    plotArea('deathArea', 'Deaths', deathCasesColor)
    plotArea('recoveredArea', 'Recovered', recoveredCasesColor)

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
    // style legend texts
    legendGroup
      .selectAll('text')
      .attr('fill', '#e5ffdeff')
      .attr('font-weight', 300)
    // style legend lines
    legendGroup
      .selectAll('line')
      .attr('stroke-width', 5)
      .attr('stroke-linecap', 'round')
  }, [data, dimensions])

  return (
    <div ref={wrapperRef as any} className={styles.root}>
      <svg ref={svgRef as any}></svg>
    </div>
  )
}

export default LineChart
