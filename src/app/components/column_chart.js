import { Chart } from "react-google-charts";

export default function ColumnChart({mapData, render}) {
    let chartData = [['%', 'kwh/kw']]
    if (mapData) {
      mapData.forEach((element, index) => {
       chartData.push([(index + 1)*9.09, element])
      });
    }

    return (
      <>
      { mapData && render && chartData.length > 1 ?
        <div className="flex grid grid-rows-4 gap-0 h-8/12 w-100 font-sans text-black">
          <h2 className='flex items-center text-l text-left w-11/12 mx-auto'>
            Sunniness over roof area
          </h2>
          <h6 className='flex items-center text-m text-left w-11/12 mx-auto'>kWh/kW</h6>
          <Chart
            chartType="ColumnChart"
            data={chartData}
            width="100%"
            height="200px"
            options={{
              legend: { position: "none"}, 
              hAxis: {
                minValue: 0,
                title: '%',
                ticks: [20, 40, 60, 80, 100]
              }
            }}
          />
        </div>
        : ''
      }
      </>
    )
}
