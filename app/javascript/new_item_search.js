import "@hotwired/turbo-rails";
import "controllers";
import "chart.js";
import "chartjs-plugin-datalabels";

document.addEventListener('turbo:load', function() {
  console.log("Turbo load event fired");

  // ビューポートのサイズを取得する関数
  const getViewportSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // カスタムプラグインの定義
  const customCenterTextPlugin = {
    id: 'customCenterText',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      const totalCalories = chart.data.datasets[0].data.reduce((a, b) => a + b, 0); // カロリー値を計算
      const text = `${Math.floor(totalCalories)} kcal`;
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
  };

  // グラフ描画の処理
  const drawGraphs = () => {
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

      if (!kcalElement || !proteinElement || !sugarElement || !oilElement) {
        console.error('One or more elements are missing from the DOM.');
        return;
      }

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

      const { width: viewportWidth, height: viewportHeight } = getViewportSize();
      canvas.style.width = `${viewportWidth * 0.4}px`; // ビューポート幅の40%
      canvas.style.height = `${viewportHeight * 0.3}px`; // ビューポート高さの30%
      canvas.width = canvas.offsetWidth; // Canvas の幅を設定
      canvas.height = canvas.offsetHeight; // Canvas の高さを設定

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
              const label = context.chart.data.labels[context.dataIndex];
              return `${percentage}%\n${label}`;
            },
            color: '#fff',
            backgroundColor: '#000',
            borderRadius: 3,
            font: {
              weight: 'bold',
              size: 12
            },
            offset: 10
          }
        }
      };

      // グラフを描画
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
        plugins: [customCenterTextPlugin, ChartDataLabels]
      });
    });
  };

  drawGraphs();

  // 検索機能の処理
  const searchForm = document.getElementById('item-search-form');
  const searchKeyword = document.getElementById('item-search-keyword');

  if (searchForm && searchKeyword) {
    searchKeyword.addEventListener('input', () => {
      const keyword = searchKeyword.value;
      fetch(`${searchForm.action}?keyword=${encodeURIComponent(keyword)}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.text())
      .then(html => {
        const results = document.getElementById('search-results');
        results.innerHTML = html;

        // 検索結果に含まれるグラフを再描画
        drawGraphs();
      })
      .catch(error => console.error('Error:', error));
    });
  }
});

