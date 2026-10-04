const API_URL = "https://inai-col1.fishrungames.com/ads";


// ========================================
// GET — получение списка объявлений
// ========================================

async function loadAds() {

    const adsList = document.getElementById("adsList");

    adsList.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border" role="status"></div>

            <p class="mt-2">
                Загрузка объявлений...
            </p>
        </div>
    `;

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Ошибка загрузки объявлений");
        }

        const data = await response.json();

        displayAds(data.items);

    } catch (error) {

        console.error(error);

        adsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Не удалось загрузить объявления.
                </div>
            </div>
        `;
    }
}


// ========================================
// Отображение объявлений
// ========================================

function displayAds(ads) {

    const adsList = document.getElementById("adsList");

    adsList.innerHTML = "";


    if (!ads || ads.length === 0) {

        adsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-secondary text-center">
                    Пока нет объявлений.
                </div>
            </div>
        `;

        return;
    }


    ads.forEach(ad => {

        // -------------------------------
        // Формируем изображение
        // -------------------------------

        let imageHTML;

        if (ad.image_url) {

            const imageUrl = ad.image_url.startsWith("http")
                ? ad.image_url
                : "https://inai-col1.fishrungames.com" + ad.image_url;


            imageHTML = `
                <img
                    src="${imageUrl}"
                    class="card-img-top"
                    alt="${ad.title}"
                    style="height: 230px; object-fit: cover;"
                >
            `;

        } else {

            imageHTML = `
                <div
                    class="bg-secondary-subtle d-flex align-items-center justify-content-center"
                    style="height: 230px;"
                >
                    <span class="fs-1">
                        📷
                    </span>
                </div>
            `;
        }


        // -------------------------------
        // Создаём карточку
        // -------------------------------

        const card = document.createElement("div");

        card.className = "col-12 col-md-6 col-lg-4";


        card.innerHTML = `
            <div class="card h-100 shadow-sm">

                ${imageHTML}

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title">
                        ${ad.title}
                    </h5>

                    <p class="card-text text-secondary">
                        ${ad.description}
                    </p>

                    <div class="mt-auto">

                        <h5 class="fw-bold">
                            ${Number(ad.price).toLocaleString("ru-RU")} сом
                        </h5>

                    </div>

                </div>

            </div>
        `;


        adsList.appendChild(card);

    });
}


// ========================================
// POST — добавление объявления
// ========================================

document
    .getElementById("adForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const title =
            document.getElementById("title").value;

        const description =
            document.getElementById("description").value;

        const price =
            document.getElementById("price").value;

        const image =
            document.getElementById("image").files[0];


        // Проверяем фотографию

        if (!image) {

            showMessage(
                "Пожалуйста, выберите фотографию.",
                "danger"
            );

            return;
        }


        // Создаём FormData

        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("image", image);


        // Кнопка

        const submitButton =
            document.getElementById("submitButton");

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm">
            </span>
            Публикация...
        `;


        try {

            // POST запрос

            const response = await fetch(API_URL, {

                method: "POST",

                body: formData

            });


            if (!response.ok) {

                throw new Error(
                    "Ошибка при отправке объявления"
                );
            }


            // Получаем новое объявление

            const newAd = await response.json();

            console.log("Новое объявление:", newAd);


            // Показываем сообщение

            showMessage(
                "Объявление успешно опубликовано!",
                "success"
            );


            // Очищаем форму

            document
                .getElementById("adForm")
                .reset();


            // Обновляем список

            loadAds();


        } catch (error) {

            console.error(error);

            showMessage(
                "Не удалось опубликовать объявление.",
                "danger"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Опубликовать";
        }

    });


// ========================================
// Сообщение пользователю
// ========================================

function showMessage(text, type) {

    const message =
        document.getElementById("message");

    message.innerHTML = `
        <div class="alert alert-${type}">
            ${text}
        </div>
    `;


    // Убираем сообщение через 4 секунды

    setTimeout(() => {

        message.innerHTML = "";

    }, 4000);
}


// ========================================
// Кнопка "Обновить"
// ========================================

document
    .getElementById("refreshButton")
    .addEventListener("click", loadAds);


// ========================================
// Загружаем объявления при открытии сайта
// ========================================

loadAds();

