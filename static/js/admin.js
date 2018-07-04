function getConfig (usages) {
	const labels = usages.map(u => u.date);
	const data = usages.map(u => u.requestsCount);
	return {
		type: "line",
		data: {
			labels: labels,
			datasets: [{
				label: "OMDB API requests count",
				backgroundColor: "rgba(255, 255, 255, 0.5)",
				borderColor: "rgb(0, 0, 0)",
				fill: false,
				data: data,
			}]
		},
		options: {
			title: {
				text: ""
			},
			scales: {
				xAxes: [{
					type: "time",
					time: {
						format: "YYYY-MM-DD",
						tooltipFormat: "ll"
					},
					scaleLabel: {
						display: true,
						labelString: "Date"
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Value"
					}
				}]
			},
		}
	};
}
