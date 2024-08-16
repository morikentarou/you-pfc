import "@hotwired/turbo-rails"
import "controllers"
import "chart.js"
import "chartjs-plugin-datalabels"

document.addEventListener('turbo:load', () => {
  // グラフを表示するための div
  const graphContainer = document.getElementById('pfc-graph');

  if (!graphContainer) {
    console.error('Graph container not found');
    return;
  }

  // チェックボックスの変更イベントを監視
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateGraph);
  });

  function updateGraph() {
    const checkedItems = Array.from(document.querySelectorAll('.item-checkbox:checked')).map(checkbox => {
      const itemId = checkbox.dataset.itemId;
      return {
        id: itemId,
        kcal: parseFloat(document.getElementById(`item-kcal_${itemId}`).textContent),
        protein: parseFloat(document.getElementById(`item-protein_${itemId}`).textContent),
        sugar: parseFloat(document.getElementById(`item-sugar_${itemId}`).textContent),
        oil: parseFloat(document.getElementById(`item-oil_${itemId}`).textContent),
        percentage: parseFloat(document.getElementById(`percentage_${itemId}`).value || 100)
      };
    });

    if (checkedItems.length === 0) {
      graphContainer.innerHTML = '<p>選択された食材がありません。</p>';
      return;
    }

    const totalProtein = checkedItems.reduce((sum, item) => sum + (item.protein * item.percentage / 100), 0);
    const totalSugar = checkedItems.reduce((sum, item) => sum + (item.sugar * item.percentage / 100), 0);
    const totalOil = checkedItems.reduce((sum, item) => sum + (item.oil * item.percentage / 100), 0);
    const totalCalories = totalProtein * 4 + totalSugar * 4 + totalOil * 9;

    const data = {
      labels: ['タンパク質', '糖質', '脂質'],
      datasets: [{
        data: [totalProtein * 4, totalSugar * 4, totalOil * 9], // カロリー換算
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4
      }]
    };

    // canvas 要素を取得
    let canvas = graphContainer.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      graphContainer.innerHTML = ''; // コンテナの内容をクリア
      graphContainer.appendChild(canvas); // 新しい canvas を追加
    }

    // サイズを設定
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    canvas.style.width = `${viewportWidth * 0.4}px`; // ビューポート幅の40%
    canvas.style.height = `${viewportHeight * 0.3}px`; // ビューポート高さの30%
    canvas.width = canvas.offsetWidth; // Canvas の幅を設定
    canvas.height = canvas.offsetHeight; // Canvas の高さを設定
    const ctx = canvas.getContext('2d');

    if (window.pfcChart) {
      window.pfcChart.destroy();
    }

    // カスタムプラグインの定義
    const customCenterTextPlugin = {
      id: 'customCenterText',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
        const text = `${Math.floor(totalCalories)} kcal`; // カロリー値を設定
        const fontSize = 40;
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
    };

    // グラフを描画
    window.pfcChart = new Chart(ctx, {
      type: 'doughnut', // ドーナツグラフ
      data: data,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (context.parsed !== null) {
                  label += ': ' + context.raw + 'g';
                }
                return label;
              }
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          datalabels: {
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              const label = context.chart.data.labels[context.dataIndex];
              return `${percentage}%\n${label}`;
            },
            color: '#fff',
            backgroundColor: '#000',
            borderRadius: 3,
            font: {
              weight: 'bold',
              size: 25
            },
            offset: 10
          }
        }
      },
      plugins: [customCenterTextPlugin, ChartDataLabels]
    });
  }
});





