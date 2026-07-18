import React, { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5venn from '@amcharts/amcharts5/venn'

type chartProps = {
  currentData: Array<{ key: string; percentage: number }>
  data: Array<{ key: string; percentage: number }>
}

const PersonaChart = ({ currentData, data }: chartProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      let root = am5.Root.new(chartRef.current)

      root.setThemes([am5themes_Animated.new(root)])

      // Create wrapper container
      let container = root.container.children.push(
        am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(100),
          layout: root.verticalLayout
        })
      )

      // Create venn series
      let series = container.children.push(
        am5venn.Venn.new(root, {
          categoryField: 'name',
          valueField: 'value',
          intersectionsField: 'sets',
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: 40,
          paddingRight: 40
        })
      )

      // Set data from the provided `data` prop
      const chartCurrentData =
        currentData && Array.isArray(currentData)
          ? currentData.map((slice, index) => ({
              name: slice.key,
              value: parseFloat(slice.percentage.toFixed(2)),
              sets: index === 1 ? [currentData[0].key] : undefined
            }))
          : []

      const chartData =
        data && Array.isArray(data)
          ? data.map((slice, index) => ({
              name: slice.key,
              value: parseFloat(slice.percentage.toFixed(2)),
              sets: index === 1 ? [data[0].key] : undefined
            }))
          : []

      series.data.setAll([
        { name: 'A', value: 100 },
        { name: 'B', value: 100 },

        { name: 'X', value: 2, sets: ['A'] },

        { name: 'Z', value: 2, sets: ['B'] }
      ])

      // Set custom slice colors based on category
      series.slices.template.set('fill', am5.color(0x14ae5c))

      series.slices.template.set('tooltipText', '{category}: {value}')

      // Set up hover appearance
      series.hoverGraphics.setAll({
        strokeDasharray: [3, 3],
        stroke: am5.color(0xffffff)
        // strokeWidth: 2
      })

      // Add legend
      let legend = container.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      )
      legend.data.setAll(series.dataItems)

      return () => {
        root.dispose()
      }
    }
  }, [data])

  return (
    <div
      id='chartdiv'
      ref={chartRef}
      style={{ width: '50%', height: '300px' }}
    />
  )
}

export default PersonaChart
