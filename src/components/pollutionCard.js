import React from 'react';
import Chart from 'react-apexcharts'

class PollutionCard extends React.Component {

    render() {

        // Deconstruct props.
        const { information, source_site, api, y_axis_label } = this.props;

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#EEEEEE", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Data: Air Quality</h4></div>
                    <div style={{display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'left'}}>
                        <div style={{paddingTop: '10px', paddingBottom: '10px', display: 'flex', justifyContent: 'left'}}>
                            <p>{information}</p>
                        </div>
                        <div style={{paddingBottom: '10px', display: 'flex', justifyContent: 'left'}}>
                            <p>Source: <a href={source_site} target="_blank" rel='noopener noreferrer'>{source_site}</a></p>
                        </div>
                        <div style={{width: '100%'}}>
                            <PollutionChart
                                api={api}
                                y_axis_label={y_axis_label}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class PollutionChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			options: {
				chart: {
					id: props.title,
					type: 'line'
				},
				xaxis: {
					categories: [],
					labels: { show: false }
				},
				yaxis: {
					title: {
						text: props.y_axis_label,
						style: {
							fontSize: '14px'
						}
					}
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
				data: []
			}]
		}
	}

	componentDidMount() {
		fetch(this.props.api)
			.then(res => res.json())
			.then(
				(result) => {
					let data = [];
					let categories = [];
					let datasetid = "";
					result.records.forEach((item, index) => {
						const value = item.fields.pm10;
						const c_both = item.fields.date.split('+')[0];
						const c_date = c_both.split('T')[0];
						const c_time = c_both.split('T')[1];
						const category = c_date + " " + c_time;
						data.unshift(value);
						categories.unshift(category);
						datasetid = item.datasetid;
					});

					// Update the state.
					this.setState({
						options: {
							xaxis: {
								categories: categories
							}
						},
						series: [{
							name: datasetid,
							data: data
						}]
					});

				},
				(error) => {

				}
			)
	}

	render() {
		return (
			<Chart options={this.state.options} series={this.state.series} type="line" width='100%' height={320} />
			)
	}
}

export default PollutionCard;