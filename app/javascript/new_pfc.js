document.addEventListener('turbo:load', () => {
  const searchForm = document.getElementById('item-search-form');
  const searchKeyword = document.getElementById('item-search-keyword');

  // チェックボックスの変化に応じて％フィールドの表示/非表示を制御
  const togglePercentageFields = () => {
    document.querySelectorAll('input[name="pfc[item_ids][]"]').forEach(checkbox => {
      const itemId = checkbox.value;
      const percentageField = document.getElementById(`percentage_${itemId}`);
      
      if (checkbox.checked) {
        percentageField.style.display = 'inline-block'; // 表示する
      } else {
        percentageField.style.display = 'none'; // 非表示にする
      }
    });
  };

  // ページ読み込み時にチェックボックスの状態に応じて％フィールドを調整
  togglePercentageFields();

  // チェックボックスの状態が変更されたときに％フィールドを調整
  document.addEventListener('change', event => {
    if (event.target.matches('input[name="pfc[item_ids][]"]')) {
      togglePercentageFields();
    }
  });

  if (searchForm && searchKeyword) {
    searchKeyword.addEventListener('input', () => {
      const keyword = searchKeyword.value;
      const currentPercentages = getAdjustmentPercentages();

      fetch(`${searchForm.action}?keyword=${encodeURIComponent(keyword)}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.text())
      .then(html => {
        const results = document.getElementById('search-results');
        if (results) {
          results.innerHTML = html;

          // 保存したデータを再適用
          setAdjustmentPercentages(currentPercentages);

          // 検索結果のチェックボックスの状態に応じて％フィールドを調整
          togglePercentageFields();
        }
      })
      .catch(error => console.error('Error:', error));
    });
  }
});


