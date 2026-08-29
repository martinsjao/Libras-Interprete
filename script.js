// Menu Mobile
document.querySelector('.menu-mobile').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Calendar
let currentDate = new Date();
let selectedDate = null;
let bookedDates = new Set();

// Simular algumas datas já agendadas
bookedDates.add('2024-12-10');
bookedDates.add('2024-12-15');
bookedDates.add('2024-12-20');

function renderCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    
    document.getElementById('currentMonth').textContent = 
        `${new Date(year, month).toLocaleString('pt-BR', { month: 'long' })} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const tbody = document.getElementById('calendarBody');
    tbody.innerHTML = '';
    
    let dateCount = 1;
    let row = document.createElement('tr');
    
    // Dias vazios no início
    for (let i = 0; i < firstDay; i++) {
        const td = document.createElement('td');
        td.className = 'empty';
        td.textContent = '';
        row.appendChild(td);
    }
    
    // Dias do mês
    for (let i = firstDay; i < 7; i++) {
        const td = document.createElement('td');
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateCount).padStart(2, '0')}`;
        
        td.textContent = dateCount;
        td.dataset.date = currentDateStr;
        
        // Verificar se é hoje
        const today = new Date();
        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === dateCount) {
            td.style.fontWeight = 'bold';
        }
        
        // Verificar se está agendado
        if (bookedDates.has(currentDateStr)) {
            td.className = 'unavailable';
        } else {
            td.className = 'available';
            td.addEventListener('click', function() {
                selectDate(this);
            });
        }
        
        row.appendChild(td);
        dateCount++;
    }
    
    tbody.appendChild(row);
    
    // Próximas semanas
    while (dateCount <= daysInMonth) {
        row = document.createElement('tr');
        for (let i = 0; i < 7 && dateCount <= daysInMonth; i++) {
            const td = document.createElement('td');
            const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateCount).padStart(2, '0')}`;
            
            td.textContent = dateCount;
            td.dataset.date = currentDateStr;
            
            if (bookedDates.has(currentDateStr)) {
                td.className = 'unavailable';
            } else {
                td.className = 'available';
                td.addEventListener('click', function() {
                    selectDate(this);
                });
            }
            
            row.appendChild(td);
            dateCount++;
        }
        tbody.appendChild(row);
    }
}

function selectDate(element) {
    // Remover seleção anterior
    document.querySelectorAll('.calendar td.selected').forEach(td => {
        td.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedDate = element.dataset.date;
    
    // Formatar data para exibir
    const dateParts = selectedDate.split('-');
    const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    document.getElementById('selectedDate').value = 
        dateObj.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Navegação do calendário
document.getElementById('prevMonth').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('nextMonth').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Inicializar calendário
renderCalendar(currentDate);

// Form de Agendamento
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!selectedDate) {
        alert('Por favor, selecione uma data no calendário.');
        return;
    }
    
    const serviceType = document.getElementById('serviceType').value;
    const timeSlot = document.getElementById('timeSlot').value;
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const observations = document.getElementById('observations').value;
    
    // Aqui você faria o envio para o servidor
    // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
    
    const formData = {
        serviceType,
        date: selectedDate,
        timeSlot,
        clientName,
        clientEmail,
        clientPhone,
        observations
    };
    
    console.log('Dados do agendamento:', formData);
    
    // Simular envio
    alert(`✅ Agendamento confirmado para ${clientName}!\n\nData: ${document.getElementById('selectedDate').value}\nHorário: ${timeSlot}\nServiço: ${serviceType}`);
    
    // Adicionar ao calendário como agendado
    bookedDates.add(selectedDate);
    renderCalendar(currentDate);
    
    // Limpar formulário
    this.reset();
    document.getElementById('selectedDate').value = '';
    selectedDate = null;
});

// Form de Contato
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    this.reset();
});

// Scroll suave para os links do menu
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Fechar menu mobile
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Botão "Agendar Agora" da hero
document.querySelector('.hero .btn-primary').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#schedule').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});