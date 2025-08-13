document.querySelectorAll('.watchlist-btn').forEach(btn => {
  btn.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    
    try {
      const response = await fetch('/watchlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: btn.dataset.movieId,
          title: btn.dataset.title,
          posterPath: btn.dataset.poster
        })
      });
      
      if (response.ok) {
        btn.textContent = '✓ Added!';
        btn.style.background = '#27ae60';
      }
    } catch (error) {
      btn.textContent = 'Failed!';
      btn.style.background = '#7f8c8d';
    }
  });
});