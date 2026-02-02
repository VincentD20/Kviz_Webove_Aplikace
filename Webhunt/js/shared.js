// js/shared.js - Sdílená logika pro progress, skóre a localStorage

const TOTAL_MISSIONS = 6;
const STORAGE_KEY = 'webhunt_progress';

// Načte progress z localStorage nebo vytvoří nový
function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    completed: [],  // pole ID dokončených misí (1-6)
    score: 0
  };
}

// Uloží progress do localStorage
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Aktualizuje progress bar a skóre na stránce (pokud existují elementy)
function updateUI() {
  const progress = loadProgress();
  
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const scoreEl = document.getElementById('score');
  
  if (progressFill && progressText && scoreEl) {
    const percent = (progress.completed.length / TOTAL_MISSIONS) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${progress.completed.length} / ${TOTAL_MISSIONS}`;
    scoreEl.textContent = progress.score;
  }

  // Na home stránce označí karty jako completed
  if (document.querySelector('.mission-card')) {
    document.querySelectorAll('.mission-card').forEach(card => {
      const missionId = parseInt(card.dataset.id);
      if (progress.completed.includes(missionId)) {
        card.classList.add('completed');
        card.querySelector('.start-btn').textContent = 'Zobrazit';
      }
    });
  }
}

// Označí misi jako dokončenou – volá se z jednotlivých mission stránek po správné odpovědi
function completeMission(missionId, points) {
  const progress = loadProgress();
  
  if (!progress.completed.includes(missionId)) {
    progress.completed.push(missionId);
    progress.score += points;
    saveProgress(progress);
    updateUI();
    
    alert(`Správně! Mise ${missionId} dokončena. +${points} bodů 🔥`);
    
    // Pokud je vše hotovo → přesměruj na victory
    if (progress.completed.length === TOTAL_MISSIONS) {
      setTimeout(() => {
        window.location.href = 'victory.html';
      }, 1500);
    }
  }
}

// Reset celé hry (použije se na victory stránce)
function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'index.html';
}

// Spustí aktualizaci UI při načtení každé stránky
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});