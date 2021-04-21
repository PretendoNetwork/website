/* eslint-disable no-undef */
function loadAllCharts() {
	document.querySelectorAll('.feature-list-wrapper').forEach(wrapper => {
		// Find and generate all relevant data
		const allFeatureNodes = wrapper.querySelectorAll('.feature');
		const allDoneFeatureNodes = wrapper.querySelectorAll('.feature .done');
		
		const progressPercentage = Math.round(Math.min((allDoneFeatureNodes.length / allFeatureNodes.length) * 100, 100));
		const remainingPercentage = 100 - progressPercentage;

		// Set inner paragraph
		wrapper.querySelectorAll('.percentage-label').forEach(p => {
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

		const isInBrightCard = !!wrapper.closest('.right.sect');

		new Chart(wrapper.querySelector('canvas'), {
			type: 'doughnut',
			data: {
				labels: ['Done', 'Todo'],
				datasets: [
					{
						data,
						backgroundColor: isInBrightCard ? ['white', 'rgba(195, 178, 227, 0.5)'] : ['#9D6FF3', '#4C5174']
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
}
loadAllCharts();