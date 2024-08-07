document.addEventListener('turbo:load', () => {
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
      })
      .catch(error => console.error('Error:', error));
    });
  }
});