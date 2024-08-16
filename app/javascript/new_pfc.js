document.addEventListener('turbo:load', () => {
  const togglePercentageFields = () => {
    document.querySelectorAll('input[name="pfc[item_ids][]"]').forEach(checkbox => {
      const itemId = checkbox.value;
      const percentageField = document.getElementById(`percentage_${itemId}`);
      percentageField.style.display = 'inline-block'; // 表示する
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

// Turbo Frame が更新されたときにチェックボックスのリスナーを再設定
document.addEventListener('turbo:frame-load', () => {
  console.log('Turbo frame load event fired');
  const checkboxes = document.querySelectorAll('input[name="pfc[item_ids][]"]');
  
  // チェックボックスの状態に応じて％フィールドを調整
  togglePercentageFields();

  // チェックボックスの状態が変更されたときに％フィールドを調整
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      togglePercentageFields();
    });
  });
});
