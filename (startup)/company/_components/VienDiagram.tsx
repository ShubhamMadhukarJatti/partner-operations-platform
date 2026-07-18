'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
// @ts-ignore
import * as venn from 'venn.js'

const VennDiagram = ({ sets }: { sets: any }) => {
  const vennRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!vennRef.current) return

    const chart = venn.VennDiagram().width(236).height(118)
    const div = d3.select(vennRef.current)

    div.datum(sets).call(chart)

    // Remove labels from inside the circles
    div.selectAll('.label').remove()

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'venntooltip')
      .style('position', 'absolute')
      .style('text-align', 'center')
      .style('min-width', '128px')
      .style('max-width', '300px')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', '#fff')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', '0')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.2)')

    div
      .selectAll('path')
      .style('stroke-opacity', 0)
      .style('stroke', '#fff')
      .style('strokeWidth', 3)
      .style('fill', (d: any, i: number) => (i === 0 ? '#DCFDE7' : '#DBE9FE'))
      .style('fill-opacity', 1)

    div
      .selectAll('g')
      // @ts-ignore
      .on('mouseover', function (event, d) {
        // @ts-ignore
        venn.sortAreas(div, d)

        tooltip.transition().duration(200).style('opacity', 1)
        // @ts-ignore
        tooltip.html(d.label)

        d3.select(this)
          .transition('tooltip')
          .duration(400)
          .select('path')
          // @ts-ignore
          .style('fill-opacity', d.sets.length === 1 ? 0.8 : 0.8)
          .style('stroke-opacity', 1)
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      // @ts-ignore
      .on('mouseout', function (event, d) {
        tooltip.transition().duration(200).style('opacity', 0)

        d3.select(this)
          .transition('tooltip')
          .duration(400)
          .select('path')
          // @ts-ignore
          .style('fill-opacity', d.sets.length === 1 ? 1 : 0)
          .style('stroke-opacity', 0)
      })

    // Cleanup on component unmount
    return () => {
      tooltip.remove()
    }
  }, [])

  return (
    <div className='flex h-[118px] items-center justify-center '>
      <div ref={vennRef}></div>
      <style jsx>{`
        .venntooltip {
          position: absolute;
          text-align: center;
          min-width: 128px;
          max-width: 236px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default VennDiagram
