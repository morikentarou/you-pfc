document.addEventListener('turbo:load', () => {
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
});