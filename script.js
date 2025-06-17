document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  // Formlar arası geçiş
  if (showRegister && showLogin && loginForm && registerForm) {
    showRegister.addEventListener('click', () => {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', () => {
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  }

  // Kayıt işlemi
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('registerConfirmPassword').value;

      if (!name || !email || !password || !confirmPassword) {
        alert('Lütfen tüm alanları doldurun.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor.');
        return;
      }

      if (localStorage.getItem(email)) {
        alert('Bu e-posta zaten kayıtlı.');
        return;
      }

      const user = { name, email, password };
      localStorage.setItem(email, JSON.stringify(user));

      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      registerForm.reset();
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  }

  // Giriş işlemi
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        alert('Lütfen e-posta ve şifreyi girin.');
        return;
      }

      const userData = localStorage.getItem(email);

      if (!userData) {
        alert('Bu e-posta ile kayıt bulunamadı.');
        return;
      }

      const user = JSON.parse(userData);

      if (user.password !== password) {
        alert('Şifre yanlış.');
        return;
      }

      alert(`Hoşgeldiniz, ${user.name}!`);
      loginForm.reset();

      // Giriş başarılıysa başka sayfaya yönlendirme
      window.location.href = 'index.html';
    });
  }
});

// Anket Yükleme ve Analiz İşlemleri
document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const surveyInfoForm = document.getElementById('surveyInfoForm');
  const viewButtons = document.querySelectorAll('.view-btn');
  const surveysGrid = document.querySelector('.surveys-grid');
  const analysisPanel = document.querySelector('.analysis-panel');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Dosya sürükle-bırak işlemleri
  if (dropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
      dropZone.classList.add('highlight');
    }

    function unhighlight(e) {
      dropZone.classList.remove('highlight');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    }
  }

  // Dosya seçme işlemi
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      handleFiles(this.files);
    });
  }

  function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.xlsx')) {
        document.querySelector('.survey-info-form').style.display = 'block';
        // Dosya işleme kodları buraya gelecek
      } else {
        alert('Lütfen geçerli bir CSV veya Excel dosyası yükleyin.');
      }
    }
  }

  // Anket bilgileri formu
  if (surveyInfoForm) {
    surveyInfoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const surveyName = document.getElementById('surveyName').value;
      const surveyType = document.getElementById('surveyType').value;
      const surveyDescription = document.getElementById('surveyDescription').value;

      // Yeni anket kartı oluştur
      const surveyCard = createSurveyCard(surveyName, surveyType, surveyDescription);
      surveysGrid.appendChild(surveyCard);

      // Formu sıfırla ve gizle
      surveyInfoForm.reset();
      document.querySelector('.survey-info-form').style.display = 'none';
    });
  }

  function createSurveyCard(name, type, description) {
    const card = document.createElement('div');
    card.className = 'survey-card';
    card.innerHTML = `
      <div class="card-header">
        <h4>${name}</h4>
        <span class="survey-type">${type}</span>
      </div>
      <div class="card-body">
        <div class="survey-stats">
          <div class="stat">
            <i class="fas fa-users"></i>
            <span>0 Katılımcı</span>
          </div>
          <div class="stat">
            <i class="fas fa-calendar"></i>
            <span>${new Date().toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        <p class="survey-description">${description}</p>
      </div>
      <div class="card-footer">
        <button class="action-btn analyze" onclick="showAnalysis('${name}')">
          <i class="fas fa-chart-bar"></i>
          Analiz Et
        </button>
        <button class="action-btn download" onclick="downloadReport('${name}')">
          <i class="fas fa-download"></i>
          Rapor İndir
        </button>
      </div>
    `;
    return card;
  }

  // Görünüm değiştirme
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      if (this.dataset.view === 'list') {
        surveysGrid.style.gridTemplateColumns = '1fr';
      } else {
        surveysGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
      }
    });
  });

  // Analiz paneli sekmeleri
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
});

// Analiz panelini göster
function showAnalysis(surveyName) {
  const analysisPanel = document.querySelector('.analysis-panel');
  analysisPanel.style.display = 'block';
  
  // Örnek analiz verileri
  updateAnalysisData(surveyName);
}

// Analiz verilerini güncelle
function updateAnalysisData(surveyName) {
  const summaryCards = document.querySelector('.summary-cards');
  summaryCards.innerHTML = `
    <div class="summary-card">
      <i class="fas fa-users"></i>
      <h4>Toplam Katılımcı</h4>
      <p>150</p>
    </div>
    <div class="summary-card">
      <i class="fas fa-star"></i>
      <h4>Ortalama Puan</h4>
      <p>4.2/5</p>
    </div>
    <div class="summary-card">
      <i class="fas fa-check-circle"></i>
      <h4>Tamamlanma Oranı</h4>
      <p>%95</p>
    </div>
  `;
}

// Rapor indirme
function downloadReport(surveyName) {
  const reportData = {
    surveyName: surveyName,
    date: new Date().toLocaleDateString('tr-TR'),
    totalParticipants: 150,
    averageSatisfaction: 4.2,
    completionRate: 95,
    detailedResults: {
      "Çok Memnun": 45,
      "Memnun": 35,
      "Orta": 15,
      "Memnun Değil": 5
    }
  };
  
  const jsonString = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${surveyName}_rapor.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Analiz panelini kapat
document.querySelector('.close-btn')?.addEventListener('click', function() {
  document.querySelector('.analysis-panel').style.display = 'none';
});
