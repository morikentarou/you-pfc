import "@hotwired/turbo-rails"
import "controllers"
import "chart.js"
import "chartjs-plugin-datalabels"

document.addEventListener("turbo:load", function() {
  console.log("Turbo load event fired");

  const goalKcalField = document.getElementById("goal_kcal");
  const pfctypeSelect = document.getElementById("pfctype_id");
  const goalProteinField = document.getElementById("goal_protein");
  const goalSugarField = document.getElementById("goal_sugar");
  const goalOilField = document.getElementById("goal_oil");
  const macrosChartCanvas = document.getElementById("macrosChart");

  if (goalKcalField && pfctypeSelect && goalProteinField && goalSugarField && goalOilField && macrosChartCanvas) {

    let macrosChart;

    function updateChart(protein, sugar, oil, canvasId, kcal) {
      const data = [
        protein * 4, // タンパク質
        sugar * 4, // 糖質
        oil * 9 // 脂質
      ];
      const labels = ["タンパク質", "糖質", "脂質"];
      const canvas = document.getElementById(canvasId);

      if (!canvas) {
        console.error(`Canvas with id ${canvasId} not found`);
        return;
      }

      if (macrosChart) {
        macrosChart.data.datasets[0].data = data;
        macrosChart.options.plugins.customText.text = `${Math.floor(kcal)} kcal`;
        macrosChart.update();
      } else {
        macrosChart = new Chart(canvas, {
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
                  const total = context.chart.data.datasets[0].data.reduce((acc, dataValue) => acc + dataValue, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                },
                color: '#fff',
                backgroundColor: '#000',
                borderRadius: 3,
                font: {
                  weight: 'bold',
                  size: 12
                }
              },
              customText: {
                text: `${Math.floor(kcal)} kcal`,
                color: '#000',
                font: {
                  size: 20,
                  weight: 'bold'
                }
              }
            }
          },
          plugins: [ChartDataLabels, {
            id: 'customText',
            beforeDraw: (chart) => {
              const ctx = chart.ctx;
              const width = chart.width;
              const height = chart.height;
              const text = chart.options.plugins.customText.text;
              const fontSize = chart.options.plugins.customText.font.size || 20;
              const fontWeight = chart.options.plugins.customText.font.weight || 'bold';
              const color = chart.options.plugins.customText.color || '#000';

              ctx.save();
              ctx.font = `${fontWeight} ${fontSize}px Arial`;
              ctx.fillStyle = color;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(text, width / 2, height / 2);
              ctx.restore();
            }
          }]
        });
      }
    }

    function calculateMacros() {
      const kcal = parseInt(goalKcalField.value);
      if (isNaN(kcal)) return;

      // 各マクロ栄養素の割合
      let proteinPercentage = 0;
      let sugarPercentage = 0;
      let oilPercentage = 0;

      const selectedCategory = parseInt(pfctypeSelect.value);

      if (selectedCategory === 2) { // ローファット
        proteinPercentage = 0.4;
        sugarPercentage = 0.5;
        oilPercentage = 0.1;
      } else if (selectedCategory === 3) { // ケトジェニック
        proteinPercentage = 0.4;
        sugarPercentage = 0.1;
        oilPercentage = 0.5;
      } else { // その他
        goalProteinField.value = '';
        goalSugarField.value = '';
        goalOilField.value = '';
        updateChart(0, 0, 0, macrosChartCanvas.id, 0);
        return;
      }

      // 各マクロ栄養素のカロリー
      const proteinGram = Math.floor(kcal * proteinPercentage / 4);
      const sugarGram = Math.floor(kcal * sugarPercentage / 4);
      const oilGram = Math.floor(kcal * oilPercentage / 9);

      goalProteinField.value = proteinGram;
      goalSugarField.value = sugarGram;
      goalOilField.value = oilGram;

      updateChart(proteinGram, sugarGram, oilGram, macrosChartCanvas.id, kcal);
    }

    goalKcalField.addEventListener("input", calculateMacros);
    pfctypeSelect.addEventListener("change", calculateMacros);

    // グラフを各ゴールアイテムに描画する
    document.querySelectorAll('.goal-item-graph canvas').forEach(canvas => {
      const goalId = canvas.id.split('-')[1];
      const goalData = JSON.parse(document.getElementById(`goal-data-${goalId}`).textContent);
      updateChart(goalData.goal_protein, goalData.goal_sugar, goalData.goal_oil, canvas.id, goalData.goal_kcal);
    });
  } else {
    console.error("One or more elements are missing from the DOM.");
  }
});
