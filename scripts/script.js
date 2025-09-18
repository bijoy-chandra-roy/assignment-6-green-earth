const loadAndDisplayCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then((res) => res.json())
        .then((json) => {
            const categories = json.categories;

            document.querySelector(".categories-title").addEventListener("click", () => {
                document.querySelectorAll(".categories li").forEach(li => {
                    li.classList.remove("active");
                });
                loadAndDisplayPlants();
            });

            const categoryContainer = document.getElementById("categories-container");
            categoryContainer.innerHTML = "";

            for (const category of categories) {
                const temp = document.createElement("li");
                temp.className = "category clickable-text"
                temp.innerHTML = `${category.category_name}`;

                temp.addEventListener("click", () => {
                    document.querySelectorAll(".categories li").forEach(li => {
                        li.classList.remove("active");
                    });
                    temp.classList.add("active");
                    loadAndDisplayPlants(category.id);
                });

                categoryContainer.appendChild(temp);
            }
        });
};

const loadAndDisplayPlants = (id) => {

    const plantContainer = document.getElementById("trees-grid");
    const loadingSpinner = document.getElementById("trees-loading");

    loadingSpinner.style.display = "flex";
    plantContainer.innerHTML = "";

    fetch(id ? `https://openapi.programming-hero.com/api/category/${id}` : "https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(json => {
            const plants = json.plants;
            const plantContainer = document.getElementById("trees-grid");
            plantContainer.innerHTML = "";

            for (const plant of plants) {
                const temp = document.createElement("div");
                temp.className = 'tree-card';
                temp.innerHTML = `<img src="${plant.image}" alt="">
                        <div class="tree-info">
                            <h4 class="tree-name">${plant.name}</h4>
                            <p class="tree-details">
                            ${plant.description}
                            </p>
                            <div class="tree-additional-info">
                                <button class="category-tag">
                                    ${plant.category}
                                </button>
                                <p class="price">৳${plant.price}</p>
                            </div>
                        </div>
                        <button class="cart-btn">
                            Add to Cart
                        </button>`;
                plantContainer.appendChild(temp);

                temp.querySelector(".tree-name").addEventListener("click", () => {
                    fetch(`https://openapi.programming-hero.com/api/plant/${plant.id}`)
                        .then(res => res.json())
                        .then(data => {
                            const plantDetails = data.plants;
                            const modal = document.getElementById("plant-modal");
                            document.getElementById("modal-tree-name").innerText = plantDetails.name;
                            document.getElementById("modal-tree-image").src = plantDetails.image;
                            document.getElementById("modal-tree-description").innerText = plantDetails.description;
                            document.getElementById("modal-tree-category").innerText = plantDetails.category;
                            document.getElementById("modal-tree-price").innerText = plantDetails.price;

                            modal.showModal();
                        });
                });
                temp.querySelector('.cart-btn').addEventListener('click', () => addToCart(plant.name, plant.price));
            }

        }).then(() => {
            loadingSpinner.style.display = "none";
        });
};

const addToCart = (name, price) => {
    let cartItemsContainer = document.querySelector(".cart-items");
    if (!cartItemsContainer) {
        cartItemsContainer = document.createElement("div");
        cartItemsContainer.className = "cart-items";
        document.querySelector(".cart-content").prepend(cartItemsContainer);

        const totalBox = document.createElement("div");
        totalBox.className = "total-price";
        totalBox.innerHTML = `<p>Total: </p><p>৳0</p>`;
        const hr = document.createElement("hr");
        hr.className = "total-hr";
        document.querySelector(".cart-content").appendChild(hr);
        document.querySelector(".cart-content").appendChild(totalBox);
    }

    let found = null;
    for (const item of cartItemsContainer.querySelectorAll(".cart-item")) {
        if (item.querySelector(".item-name").innerText === name) {
            found = item;
            break;
        }
    }

    if (found) {
        const priceAndQuantity = found.querySelector(".item-price-and-quantity");
        const qty = priceAndQuantity.innerText.split("x");
        const newQty = parseInt(qty[1]) + 1;
        priceAndQuantity.innerText = `৳${price} x ${newQty}`;
    } else {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
      <div class="item-details">
        <h4 class="item-name">${name}</h4>
        <p class="item-price-and-quantity">৳${price} x 1</p>
      </div>
      <div class="remove-btn clickable-text">×</div>
    `;
        cartItem.querySelector(".remove-btn").onclick = () => {
            cartItem.remove();
            updateTotal();
        };
        cartItemsContainer.appendChild(cartItem);
    }

    updateTotal();
};

const updateTotal = () => {
    const items = document.querySelectorAll(".item-price-and-quantity");
    let sum = 0;
    for (const item of items) {
        const parts = item.innerText.split("x");
        const price = parseInt(parts[0].slice(1));
        const qty = parseInt(parts[1]);
        sum += price * qty;
    }

    const totalBox = document.querySelector(".total-price");
    const hrLine = document.querySelector(".total-hr");

    if (sum === 0) {
        totalBox.style.display = "none";
        hrLine.style.display = "none";
    } else {
        totalBox.style.display = "flex";
        hrLine.style.display = "block";
        totalBox.querySelector("p:last-child").innerText = `৳${sum}`;
    }

};

loadAndDisplayCategories();

loadAndDisplayPlants();