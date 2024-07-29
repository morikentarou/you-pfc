import "@hotwired/turbo-rails"
import "controllers"
import "chart.js";
import "chartjs-plugin-datalabels";

document.addEventListener("turbo:load", function() {
  console.log("Turbo page loaded");

  const goalElements = document.querySelectorAll(".goal-item");

  goalElements.forEach((goalElement) => {
    const goalId = goalElement.dataset.goalId;
    const macrosChartCanvas = document.getElementById(`macrosChart-${goalId}`);
    const goalDataElement = document.getElementById(`goal-data-${goalId}`);
    
    if (!macrosChartCanvas || !goalDataElement) {
      console.error("One or more elements are missing from the DOM.");
      return;
    }

    const goalData = JSON.parse(goalDataElement.textContent);
    const { goal_protein, goal_sugar, goal_oil } = goalData;

    const data = [
      goal_protein * 4, // タンパク質
      goal_sugar * 4, // 糖質
      goal_oil * 9 // 脂質
    ];
    const labels = ["タンパク質", "糖質", "脂質"];

    new Chart(macrosChartCanvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: {
            formatter: (value, context) => {
              let total = 0;
              context.chart.data.datasets[0].data.forEach((dataValue) => {
                total += dataValue;
              });
              let percentage = Math.floor((value / total) * 100) + "%";
              return percentage;
            },
            color: '#fff',
            backgroundColor: '#000',
            borderRadius: 3,
            font: {
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  });
});