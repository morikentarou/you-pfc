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
        setupCheckboxListeners(); // チェックボックスのリスナーを再設定
        updateGraph(); // 検索結果に基づいてグラフを更新
      })
      .catch(error => console.error('Error:', error));
    });
  }

  // チェックボックスのリスナーを設定する関数
  const setupCheckboxListeners = () => {
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', updateGraph);
    });
  };

  // グラフを更新する関数
  const updateGraph = () => {
    console.log('updateGraph called');
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

    console.log('Checked items:', checkedItems);

    const graphContainer = document.getElementById('pfc-graph');
    if (checkedItems.length === 0) {
      graphContainer.innerHTML = '<p>選択された食材がありません。</p>';
      return;
    }

    const totalProtein = checkedItems.reduce((sum, item) => sum + (item.protein * item.percentage / 100), 0);
    const totalSugar = checkedItems.reduce((sum, item) => sum + (item.sugar * item.percentage / 100), 0);
    const totalOil = checkedItems.reduce((sum, item) => sum + (item.oil * item.percentage / 100), 0);
    const totalCalories = (totalProtein * 4) + (totalSugar * 4) + (totalOil * 9);

    console.log('Total values:', { totalProtein, totalSugar, totalOil, totalCalories });

    const data = {
      labels: ['タンパク質', '糖質', '脂質'],
      datasets: [{
        data: [
          totalProtein * 4,  // タンパク質のカロリー
          totalSugar * 4,    // 糖質のカロリー
          totalOil * 9       // 脂質のカロリー
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4
      }]
    };
    

    let canvas = graphContainer.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      graphContainer.innerHTML = ''; // コンテナの内容をクリア
      graphContainer.appendChild(canvas); // 新しい canvas を追加
    }

    // サイズを設定
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    console.log(`Viewport Size - Width: ${viewportWidth}, Height: ${viewportHeight}`);
    canvas.style.width = `${viewportWidth * 0.4}px`; // ビューポート幅の40%
    canvas.style.height = `${viewportHeight * 0.3}px`; // ビューポート高さの30%
    canvas.width = canvas.offsetWidth; // Canvas の幅を設定
    canvas.height = canvas.offsetHeight; // Canvas の高さを設定
    const ctx = canvas.getContext('2d');

    if (window.pfcChart) {
      window.pfcChart.destroy(); // 既存のグラフを破棄
    }

    // グラフを描画
    console.log('Drawing chart');
    window.pfcChart = new Chart(ctx, {
      type: 'doughnut', // ドーナツグラフ
      data: data,
      options: {
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
              size: 25
            },
            offset: 10
          }
        }
      },
      plugins: [customCenterTextPlugin, ChartDataLabels] // カスタムプラグインとデータラベルプラグイン
    });
  };

  // ページ読み込み時にチェックボックスのリスナーを設定
  setupCheckboxListeners();
});

