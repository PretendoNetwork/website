/* eslint-disable no-undef */
function loadAllCharts() {
	document.querySelectorAll('.feature-list-wrapper').forEach(wrapper => {
		// Find and generate all relevant data
		const allFeatureNodes = wrapper.querySelectorAll('.feature');
		const allDoneFeatureNodes = wrapper.querySelectorAll('.feature [checked]');
		
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
		new Chart(wrapper.querySelector('canvas'), {
			type: 'doughnut',
			data: {
				labels: ['Done', 'Todo'],
				datasets: [
					{
						data,
						backgroundColor: ['white', 'transparent']
					}
				]
			}
		});
	});
}
loadAllCharts();