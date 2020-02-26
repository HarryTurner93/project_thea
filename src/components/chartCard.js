import React from 'react';
import Chart from 'react-apexcharts'

class ChartCard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			options: {
				chart: {
					id: props.title,
					type: 'line'
				},
				xaxis: {
					categories: [
						'01/02', '02/02', '03/02', '04/02', '05/02', '06/02', '07/02', '08/02', '09/02',
						'10/02', '11/02', '12/02', '13/02', '14/02', '15/02', '16/02', '17/02', '18/02',
						'19/02', '20/02', '21/02', '22/02', '23/02', '24/02', '25/02']
				},
				stroke: {
					curve: 'smooth',
					width: 1
				},
				tooltip: {
					marker: { show: false }
				}
			},
			series: [{
				name: 'series-1',
				data: [
					59, 60, 62, 62, 65, 60, 59, 61, 62, 58,
					59, 60, 62, 62, 65, 60, 59, 61, 62, 58,
					60, 65, 62, 95, 59, 60, 61]
			}]
		}
	}

	render() {
		return (
			<Chart options={this.state.options} series={this.state.series} type="line" width={500} height={320} />
			)
	}
}

export default ChartCard;