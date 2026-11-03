// 1. Регистрация Service Worker для поддержки PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker успешно зарегистрирован!', reg.scope))
            .catch(err => console.error('Ошибка регистрации Service Worker:', err));
    });
}

// 2. Функция для динамической загрузки и фильтрации книг через Fetch API
async function loadBooks() {
    const author = document.getElementById('authorInput')?.value || '';
    const year = document.getElementById('yearInput')?.value || '';

    let url = '/api/books';
    const params = new URLSearchParams();
    if (author) params.append('author', author);
    if (year) params.append('year', year);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    try {
        const response = await fetch(url);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        document.getElementById('booksList').innerHTML = '<li>Режим офлайн. Не удалось загрузить свежие данные.</li>';
    }
}

function renderBooks(books) {
    const list = document.getElementById('booksList');
    if (!list) return;
    list.innerHTML = '';

    if (books.length === 0) {
        list.innerHTML = '<li>Книги не найдены (пустой массив)</li>';
        return;
    }

    books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${book.title}</strong> — ${book.author} (${book.year} г.)`;
        list.appendChild(li);
    });
}

function clearFilters() {
    if(document.getElementById('authorInput')) document.getElementById('authorInput').value = '';
    if(document.getElementById('yearInput')) document.getElementById('yearInput').value = '';
    loadBooks();
}

// Первоначальная загрузка книг при открытии главной страницы
if (document.getElementById('booksList')) {
    document.addEventListener('DOMContentLoaded', loadBooks);
}
