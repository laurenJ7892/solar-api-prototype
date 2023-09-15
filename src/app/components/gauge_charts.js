import { useState } from 'react';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import { Chart } from "react-google-charts";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';


export default function GaugeCharts({solarPotential, render, visPanel}) {
  let yearTotalSavings, currentSavings;
  // Flag with John re uncertainity with calculations here.
  if (solarPotential) {
    yearTotalSavings =  Math.round(solarPotential.maxArrayPanelsCount * solarPotential.maxSunshineHoursPerYear * solarPotential.panelCapacityWatts / 1000)
    currentSavings = Math.round(visPanel * solarPotential.maxSunshineHoursPerYear * solarPotential.panelCapacityWatts /1000 )
  }

    return (
      <>
        { solarPotential && render ?
        <div className='flex grid grid-rows-2 w-100 h-100 pt-2'>
          <div className="flex grid grid-rows-3 w-11/12 mx-auto font-sans text-black">
            <h2 className='flex items-center text-xl text-center'>
              Panels count
            </h2>
            <div className='flex items-center justify-between w-11/12'>
              <SolarPowerIcon color='primary' fontSize='medium' />
              {visPanel}/{solarPotential.maxArrayPanelsCount}
            </div>
            <Chart
              chartType="BarChart"
              data={[['Panels', 'Progress'], [visPanel, Math.round(visPanel/solarPotential.maxArrayPanelsCount*100)]]}
              width="100%"
              height="50px"
              options={{
                legend: { position: "none"}, 
                hAxis: {
                  minValue: 0,
                  title: '%',
                  ticks: [20, 40, 60, 80, 100]
                },
                bar: { groupWidth: "95%" },
                chartArea: {
                  width: "90%"
                }
              }}
            />
          </div>
          <div className="flex grid grid-rows-3 w-11/12 mx-auto font-sans text-black mt-5">
            <h2 className='flex items-center text-xl text-center'>
              Yearly savings (kw/h)
            </h2>
            <div className='flex items-center justify-between w-11/12'>
              <EnergySavingsLeafIcon color='success' fontSize='medium' />
              {currentSavings} / {yearTotalSavings}
            </div>
            <Chart
              chartType="BarChart"
              data={[['Savings', 'Progress'], [currentSavings, Math.round(currentSavings/yearTotalSavings*100)]]}
              width="100%"
              height="50px"
              options={{
                legend: { position: "none"},
                colors: ['green'],
                hAxis: {
                  minValue: 0,
                  title: '%',
                  ticks: [20, 40, 60, 80, 100]
                },
                bar: { groupWidth: "95%" },
                chartArea: {
                  width: "90%"
                }
              }}
            />
          </div>
        </div>
        : '' }
      </>
    )
}
