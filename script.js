let boxManga = document.querySelector('.box-manga')
let btnLeft = document.querySelector('.btn-left')
let btnRight = document.querySelector('.btn-right')
let paginationNum = document.querySelector(".pagination-num")
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1
let maxPages = 20
let manga = []
function fetchManga() {
    fetch('./manga.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Помилка завантаження JSON")
            }
            return response.json()
        })
        .then(data => {
            manga = Object.values(data).slice(0, maxPages)
            renderManga()
            newPagination()
            newPaginationNumbers()
        })
        .catch(error => {
            console.error("Помилка:", error)
            boxManga.innerHTML = `<h1>Не вдалося завантажити мангу</h1>`
        })
}

function renderManga() {
    boxManga.innerHTML = ''

    if (manga.length === 0) {
        boxManga.innerHTML = `<h1>Немає манги для відображення</h1>`
        return
    }

    let imgSrc = manga[currentPage - 1]
    let img = document.createElement('img')
    img.classList.add('manga-image')
    img.src = imgSrc
    img.alt = "Manga Image"
    boxManga.appendChild(img)
}

function newPagination() {
    btnLeft.style.display = currentPage > 1 ? 'block' : 'none'
    btnRight.style.display = currentPage < maxPages ? 'block' : 'none'

    localStorage.setItem('currentPage', currentPage)
}

function newPaginationNumbers() {
    paginationNum.innerHTML = ''

    let pagesToShow = Math.min(20, maxPages)
    let startPage = Math.max(currentPage - 2, 1)
    let endPage = Math.min(startPage + 4, pagesToShow)

    for (let i = startPage; i <= endPage; i++) {
        let pageNumber = document.createElement('button')
        pageNumber.classList.add("btn-pagination")
        pageNumber.textContent = i
        pageNumber.classList.add('pagination-button')

        if (i === currentPage) {
            pageNumber.style.fontWeight = 'bold'
            pageNumber.style.color = '#32cd32'
        }

        pageNumber.addEventListener('click', function () {
            currentPage = i
            renderManga()
            newPagination()
            newPaginationNumbers()
        })

        paginationNum.appendChild(pageNumber)

        if (i !== endPage) {
            let separator = document.createElement('span')
            separator.textContent = ' | '
            paginationNum.appendChild(separator)
        }
    }
}

btnRight.addEventListener('click', function () {
    if (currentPage < maxPages) {
        currentPage++
        renderManga()
        newPagination()
        newPaginationNumbers()
    }
})

btnLeft.addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--
        renderManga()
        newPagination()
        newPaginationNumbers()
    }
})

fetchManga()