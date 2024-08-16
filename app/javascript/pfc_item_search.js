document.addEventListener('turbo:load', function() {
  console.log("Turbo load event fired");

  document.querySelectorAll('.item-pfc-percentage-graph').forEach(graph => {
    const canvas = graph.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const itemId = canvas.id.split('_').pop(); // IDからアイテムIDを取得

    const kcalElement = document.getElementById(`item-kcal_${itemId}`);
    const proteinElement = document.getElementById(`item-protein_${itemId}`);
    const sugarElement = document.getElementById(`item-sugar_${itemId}`);
    const oilElement = document.getElementById(`item-oil_${itemId}`);

    if (!kcalElement) console.error(`Element with ID item-kcal_${itemId} is missing`);
    if (!proteinElement) console.error(`Element with ID item-protein_${itemId} is missing`);
    if (!sugarElement) console.error(`Element with ID item-sugar_${itemId} is missing`);
    if (!oilElement) console.error(`Element with ID item-oil_${itemId} is missing`);

    if (!kcalElement || !proteinElement || !sugarElement || !oilElement) return;

    const kcal = parseFloat(kcalElement.textContent);
    const protein = parseFloat(proteinElement.textContent);
    const sugar = parseFloat(sugarElement.textContent);
    const oil = parseFloat(oilElement.textContent);

    // グラフのデータ
    const data = {
      labels: ['タンパク質', '糖質', '脂質'],
      datasets: [{
        data: [protein * 4, sugar * 4, oil * 9], // カロリー換算
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };

    // グラフのオプション
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false // 凡例を非表示にする
        },
        datalabels: {
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
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
        }
      }
    };

    // グラフを描画
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
      plugins: [ChartDataLabels, {
        id: 'customText',
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;
          const text = `${Math.floor(kcal)} kcal`; // カロリー値を設定
          const fontSize = 20;
          const fontWeight = 'bold';
          const color = '#000';

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
  });
});


