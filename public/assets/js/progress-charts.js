/* eslint-disable no-undef */
document.querySelectorAll('.feature-list-wrapper').forEach(progressListElement => {

	// Find and generate all relevant data
	const percentageOverride = progressListElement.querySelector('canvas.percentage-chart').dataset.percentageoverride;
	const allFeatureNodes = progressListElement.querySelectorAll('.feature');
	const allDoneFeatureNodes = progressListElement.querySelectorAll('.feature .done');

	// Use percentage override data attribute if present, else calculate
	const progressPercentage = Math.round(percentageOverride) || Math.round(Math.min((allDoneFeatureNodes.length / allFeatureNodes.length) * 100, 100));
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

	const isInBrightCard = !!progressListElement.closest('.right.sect');

	new Chart(progressListElement.querySelector('canvas'), {
		type: 'doughnut',
		data: {
			labels: ['Done', 'Todo'],
			datasets: [
				{
					data,
					backgroundColor: isInBrightCard ? ['white', 'rgba(195, 178, 227, 0.5)'] : ['#9D6FF3', '#31365A']
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
