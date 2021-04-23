/* eslint-disable no-undef */
document.querySelectorAll('.feature-list-wrapper').forEach(progressListElement => {

	// Find and generate all relevant data
	const allFeatureNodes = progressListElement.querySelectorAll('.feature');
	const allDoneFeatureNodes = progressListElement.querySelectorAll('.feature .done');

	const progressPercentage = Math.round(Math.min((allDoneFeatureNodes.length / allFeatureNodes.length) * 100, 100));
	const remainingPercentage = 100 - progressPercentage;

	// Set inner paragraph
	progressListElement.querySelectorAll('.percentage-label').forEach(p => {
		p.innerText = progressPercentage.toString().padStart(2, '0') + '%';
	});

	// Create chart
	const data = [progressPercentage, remainingPercentage];
	Chart.defaults.plugins.legend = {
		display: false
	};
	Chart.defaults.plugins.tooltip = {
		enabled: false
	};

	new Chart(progressListElement.querySelector('canvas'), {
		type: 'doughnut',
		data: {
			labels: ['Done', 'Todo'],
			datasets: [
				{
					data,
					backgroundColor: ['#9D6FF3', '#4C5174']
				}
			]
		},
		options: {
			elements: {
				arc: {
					borderWidth: 0
				}
			},
			cutout: '70%'
		}
	});
});
