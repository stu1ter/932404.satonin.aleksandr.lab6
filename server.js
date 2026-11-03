const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const books = [
    { id: 1, title: 'Война и мир', author: 'Лев Толстой', year: 1869 },
    { id: 2, title: 'Анна Каренина', author: 'Лев Толстой', year: 1877 },
    { id: 3, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: 1866 },
    { id: 4, title: 'Идиот', author: 'Фёдор Достоевский', year: 1869 },
    { id: 5, title: 'Капитанская дочка', author: 'Александр Пушкин', year: 1836 },
    { id: 6, title: 'Евгений Онегин', author: 'Александр Пушкин', year: 1833 },
    { id: 7, title: 'Руслан и Людмила', author: 'Александр Пушкин', year: 1820 },
    { id: 8, title: 'Братья Карамазовы', author: 'Фёдор Достоевский', year: 1880 },
    { id: 9, title: 'Мертвые души', author: 'Николай Гоголь', year: 1842 },
    { id: 10, title: 'Ревизор', author: 'Николай Гоголь', year: 1836 },
    { id: 11, title: 'Отцы и дети', author: 'Иван Тургенев', year: 1862 },
    { id: 12, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', year: 1940 },
    { id: 13, title: 'Собачье сердце', author: 'Михаил Булгаков', year: 1925 }
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/api/books', (req, res) => {
    const { author, year } = req.query;
    let filteredBooks = books;

    if (author) {
        const cleanAuthor = author.trim().toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.author.toLowerCase().includes(cleanAuthor)
        );
    }

    if (year) {
        const cleanYear = parseInt(year.toString().trim());
        if (!isNaN(cleanYear)) {
            filteredBooks = filteredBooks.filter(book => book.year === cleanYear);
        }
    }

    res.json(filteredBooks);
});

app.listen(PORT, () => {
    console.log(`Сервер успешно обновлен и запущен: http://localhost:${PORT}`);
});
