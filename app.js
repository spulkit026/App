/**
 * Fetches static opportunities.json and renders cards.
 * Simple search/filter by tags; deadline colour‑coding is handled in CSS.
 */
document.addEventListener('DOMContentLoaded', () => {
  fetch('opportunities.json')
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById('opportunities');
      data.forEach(opp => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-sm-6';
        const deadline = new Date(opp.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        const badgeClass = daysLeft <= 7 ? 'bg-danger' :
                          daysLeft <= 30 ? 'bg-warning text-dark' : 'bg-success';

        card.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${opp.title}</h5>
              <p class="card-text small text-muted">${opp.org}</p>
              <p class="card-text">
                <strong>Deadline:</strong> ${opp.deadline}
                <span class="badge ${badgeClass} ms-2">${daysLeft > 0 ? daysLeft + 'd' : 'EXPIRED'}</span>
              </p>
              <a href="${opp.link}" class="btn btn-primary w-100" target="_blank" rel="noopener">Read more</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Failed to load opportunities', err);
      document.getElementById('opportunities').innerHTML = '<p class="text-danger">Could not load opportunities data.</p>';
    });

  // Simple live search filter (matches any tag or title)
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('#opportunities .card');
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
      const org = card.querySelector('.card-text small')?.innerText.toLowerCase() || '';
      const badge = card.querySelector('.badge')?.innerText.toLowerCase() || '';
      card.style.display = (title.includes(term) || org.includes(term) || badge.includes(term)) ? '' : 'none';
    });
  });
});