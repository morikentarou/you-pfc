document.addEventListener('turbo:load', () => {
  const showPercentageFields = () => {
    document.querySelectorAll('input[name="pfc[item_ids][]"]').forEach(checkbox => {
      const itemId = checkbox.value;
      const percentageField = document.getElementById(`percentage_${itemId}`);
      if (percentageField) {
        percentageField.style.display = 'inline-block'; // 常に表示する
      }
    });
  };

  // ページ読み込み時に常に％フィールドを表示
  showPercentageFields();

  // チェックボックスの状態が変更されたときに常に％フィールドを表示
  document.addEventListener('change', event => {
    if (event.target.matches('input[name="pfc[item_ids][]"]')) {
      showPercentageFields();
    }
  });
});

// Turbo Frame が更新されたときにチェックボックスのリスナーを再設定
document.addEventListener('turbo:frame-load', () => {
  console.log('Turbo frame load event fired');
  const showPercentageFields = () => {
    document.querySelectorAll('input[name="pfc[item_ids][]"]').forEach(checkbox => {
      const itemId = checkbox.value;
      const percentageField = document.getElementById(`percentage_${itemId}`);
      if (percentageField) {
        percentageField.style.display = 'inline-block'; // 常に表示する
      }
    });
  };

  showPercentageFields();
});

