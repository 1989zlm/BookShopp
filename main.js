let bookList = [],
    basketList = [];
//toggle manu
const toggleModal = () => {
    const basketModal = document.querySelector('.basket_modal');
    basketModal.classList.toggle('active');
};
const getBooks = () => {
    fetch("./products.json")
        .then((res) => res.json())
        .then((books) => (bookList = books))
        .catch((err) => console.log(err));
};
getBooks();
// dinamik yıldız oluşturuduk
const createBookStars = (starRate) => {
    let starRateHtml = "";
    for (let i = 1; i <= 5; i++) {
        if (Math.round(starRate) >= i) {
            starRateHtml += `<i class="bi bi-star-fill active"></i>`;
        } else {
            starRateHtml += `<i class="bi bi-star-fill"></i>`;
        }
    }
    return starRateHtml;
};

//html oluşturduk ve bunun içersine kitapları gönderdik
const createBookItemsHtml = () => {
    const bookListEl = document.querySelector('.book_list');
    let bookListHtml = "";

    bookList.forEach((book, index) => {
        bookListHtml += `
        <div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
                <div class="row book_card">
                    <div class="col-6">
                        <img 
                        src="${book.imgSource}"
                        alt="" 
                        class="img-fluid shadow" 
                        weidth="258px"
                        height="400px" />

                    </div>
                    <div class="col-6 d-flex flex-column justify-content-center gap-4">
                        <div class="book_detail">
                            <span class="fos gray fs-5">${book.author} </span> <br>
                            <span class="fs-4 fw-bold">${book.name} </span> <br>
                            <span class="book_star-rate">
                                ${createBookStars(book.starRate)}
                                <span class="gray">1938 reviews</span>
                            </span>
                        </div>
                        <p class="book_description fos gray">
                            ${book.description}
                        </p>
                        <div>
                            <span class="black fw-bold fs-4 me-2">${book.price}tl</span>
                            <span class="fs-4 fw-bold old_price">${book.oldPrice
                ? `<span class="fs-4 fw-bold old_price">${book.oldPrice}tl</span>`
                : ''
            }</span>
                        </div>
                        <button class="btn_purple" onClick='addBookToBasket(${book.id})' >Sepete ekle</button>
                    </div>
                </div>
            </div>
        `;
    });
    bookListEl.innerHTML = bookListHtml;
}

const BOOK_TYPES = {
    ALL: "Tümü",
    NOVEL: "Roman",
    CHILDREN: "Çocuk",
    HISTORY: "Tarih",
    FINANCE: "Finans",
    SCIENCE: "Bilim",
    SELFIMPROVEMENT: "Kişisel Gelişim",
};
const createBookTypesHtml = () => {
    const filterEle = document.querySelector('.filter');
    let filterHtml = '';
    // filter turlerini tutacak dizi,'ALL' türüyle başlatılmıştır.
    let filterTypes = ['ALL'];
    bookList.forEach((book) => {
        // eğer filter türleri dizisinde bu tür bulunmuyorsa ekleme işlemi yapar.
        if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
            filterTypes.push(book.type);
        }
    });
    filterTypes.forEach((type, index) => {
        //console.log(type);
        filterHtml += `<li onClick="filterBooks(this)" data-types="${type}" class="${index == 0 ? "active" : null
            }">${BOOK_TYPES[type] || type}</li>`;
    });

    filterEle.innerHTML = filterHtml;
};
const filterBooks = (filterEl) => {
    // console.log(filterEl);
    document.querySelector(".filter .active").classList.remove("active");
    filterEl.classList.add("active");
    let bookType = filterEl.dataset.types;
    //console.log(bookType);
    getBooks();
    if (bookType != 'ALL') {
        //console.log(bookType);
        bookList = bookList.filter((book) => book.type == bookType);
    }
    createBookItemsHtml();


};
const listBasketItems = () => {
    const basketListEl = document.querySelector(".basket_list");
    const basketCountEl = document.querySelector(".basket_count");
    console.log(basketList);
    const totalQuantity = basketList.reduce(
        (total, item) => total + item.quantity,
        0
    );
    basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
    const totalPriceEl = document.querySelector('.total_price');
    console.log(totalPriceEl);
    let basketListHtml = "";
    let totalPrice = 0;
    basketList.forEach((item) => {
        console.log(item);
        totalPrice += item.product.price * item.quantity;
        basketListHtml += `
        <li class="basket_item">
        <img 
        src="${item.product.imgSource}" 
        alt="" 
        width="100" 
        height="100" />
        <div class="basket_item-info">
            <h3 class="book_name">${item.product.name}</h3>
            <span class="book_price">${item.product.price}tl</span> <br>
            <span class="book_remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
        </div>
        <div class="book_count">
            <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
            <span class="mx-2">${item.quantity}</span>
            <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
        </div>
    </li>
        `;
    });
    basketListEl.innerHTML = basketListHtml
        ? basketListHtml
        : ` <li class="basket_item"> Sepet boş. Lütfen ürün ekleyiniz.</li>`;
    totalPriceEl.innerHTML = totalPrice > 0 ? 'Total:' + totalPrice + 'tl' : null;
}
// sepete ürün ekleme
const addBookToBasket = (bookId) => {
    //console.log("id:", bookId);
    let findedBook = bookList.find((book) => book.id == bookId);
    //    console.log(findedBook);
    if (findedBook) {
        //sepetteki ürünün zaten var olup olmadığını kontrol ettik
        const basketAlreadyIndex = basketList.findIndex(
            (basket) => basket.product.id == bookId
        );
        //eğer sepet boşsa vye eklenen kitap sepette yoksa
        if (basketAlreadyIndex == -1) {
            let addItem = { quantity: 1, product: findedBook };
            basketList.push(addItem);
        } else {
            // sepette zaten varolan bir kitap ekleniyorsa, miktarını artır
            basketList[basketAlreadyIndex].quantity += 1;
            //console.log(basketList);
        }
    }
    const btnCheck = document.querySelector('.btnCheck');
    //console.log(btnCheck);
    btnCheck.style.display = 'block';
    //seper içeriğini güncelle ve görüntüle
    listBasketItems();
};

// sepetten ürünü kaldırır
const removeItemBasket = (bookId) => {
    const findedIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId
    );
    // eğer kitap sepet içinde buunyorsa
    if (findedIndex != -1) {
        //sepet listesinden kitabı çıkar
        //splice belirli sayıda eleman silmek için kullandık
        basketList.splice(findedIndex, 1);
    };
    const btnCheck = document.querySelector('.btnCheck');
    //console.log(btnCheck);
    btnCheck.style.display = 'none';
    //sepet içeriğini günceller
    listBasketItems();
};

//sepetteki ürünün miktarını azaltma
const decreaseItemToBasket = (bookId) => {
    const findedIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId
    );
    //eğe kitap sepet içinde bulunuyorsa
    if (findedIndex != -1) {
        //eğerki kitabın miktarı 1den büyükse
        if (basketList[findedIndex].quantity != 1) {
            basketList[findedIndex].quantity -= 1;
        } else removeItemBasket(bookId)
        listBasketItems()

    }

}
// sepetteki miktarı arttırır
const increaseItemToBasket = (bookId) => {
    // console.log(bookId);
    const findedIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId
    );
    //eğer kitap sepet içinde bulunuyorsa
    if (findedIndex != -1) {
        //kitabın miktarını bir artır
        basketList[findedIndex].quantity += 1;
    }

    // sepetin içeriğini güncelledik
    listBasketItems();
};

// datanın gelmesini bekledik (product json dosyasından cevap gelmesini bekledik)
setTimeout(() => {
    createBookItemsHtml();
    createBookTypesHtml();
}, 100);


