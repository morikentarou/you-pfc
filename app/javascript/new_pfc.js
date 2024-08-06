document.addEventListener('DOMContentLoaded', () => {
  // 「追加」ボタンのクリックイベントを設定
  document.querySelectorAll('.add-item-button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      // クリックされたボタンからデータを取得
      const itemId = button.getAttribute('data-item-id');
      const itemName = button.getAttribute('data-item-name');
      
      // 「選択中食材一覧」エリアにアイテムを追加
      const selectedItemsList = document.querySelector('.pfc-item-select-index ul');
      if (selectedItemsList) {
        const existingItem = selectedItemsList.querySelector(`[data-item-id="${itemId}"]`);
        if (!existingItem) {
          const listItem = document.createElement('li');
          listItem.textContent = itemName;
          listItem.setAttribute('data-item-id', itemId);
          
          // 取り消しボタンを追加
          const removeButton = document.createElement('button');
          removeButton.textContent = '取り消し';
          removeButton.classList.add('remove-item-button');
          removeButton.setAttribute('data-item-id', itemId);
          listItem.appendChild(removeButton);
          
          selectedItemsList.appendChild(listItem);
        }
      } else {
        // リストが存在しない場合は作成する
        const newList = document.createElement('ul');
        const listItem = document.createElement('li');
        listItem.textContent = itemName;
        listItem.setAttribute('data-item-id', itemId);
        
        // 取り消しボタンを追加
        const removeButton = document.createElement('button');
        removeButton.textContent = '取り消し';
        removeButton.classList.add('remove-item-button');
        removeButton.setAttribute('data-item-id', itemId);
        listItem.appendChild(removeButton);
        
        newList.appendChild(listItem);
        
        const container = document.querySelector('.pfc-item-select-index');
        if (container) {
          container.appendChild(newList);
        }
      }
    });
  });

  // 「取り消し」ボタンのクリックイベントを設定
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-button')) {
      const itemId = event.target.getAttribute('data-item-id');
      
      // 「選択中食材一覧」からアイテムを削除
      const selectedItemsList = document.querySelector('.pfc-item-select-index ul');
      if (selectedItemsList) {
        const itemToRemove = selectedItemsList.querySelector(`[data-item-id="${itemId}"]`);
        if (itemToRemove) {
          selectedItemsList.removeChild(itemToRemove);
        }
      }
    }
  });
});
