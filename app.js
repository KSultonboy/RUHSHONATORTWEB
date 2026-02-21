(function () {
  const config = window.WEBSITE_CONFIG || {};
  const API_BASE_URL = (config.API_BASE_URL || "http://localhost:3000/api").replace(/\/$/, "");

  const state = {
    products: [],
    cart: new Map(),
    loadingProducts: false,
  };

  const dom = {
    apiLabel: document.getElementById("apiLabel"),
    categorySelect: document.getElementById("categorySelect"),
    searchInput: document.getElementById("searchInput"),
    productsGrid: document.getElementById("productsGrid"),
    productsEmpty: document.getElementById("productsEmpty"),
    cartItems: document.getElementById("cartItems"),
    cartEmpty: document.getElementById("cartEmpty"),
    cartTotal: document.getElementById("cartTotal"),
    clearCartButton: document.getElementById("clearCartButton"),
    checkoutForm: document.getElementById("checkoutForm"),
    submitOrderButton: document.getElementById("submitOrderButton"),
    resultBox: document.getElementById("resultBox"),
  };

  dom.apiLabel.textContent = `API: ${API_BASE_URL}`;

  function money(value) {
    const num = Number(value || 0);
    return `${num.toLocaleString("ru-RU")} so'm`;
  }

  function sanitizeQuantity(value) {
    const normalized = String(value ?? "").replace(",", ".").trim();
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed <= 0) return 1;
    return parsed;
  }

  function showResult(message, isError) {
    dom.resultBox.classList.remove("hidden");
    dom.resultBox.classList.toggle("error", Boolean(isError));
    dom.resultBox.textContent = message;
  }

  function clearResult() {
    dom.resultBox.classList.add("hidden");
    dom.resultBox.classList.remove("error");
    dom.resultBox.textContent = "";
  }

  async function fetchJSON(path, options) {
    const res = await fetch(`${API_BASE_URL}${path}`, options);
    if (!res.ok) {
      const text = await res.text().catch(function () {
        return "";
      });
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async function loadCategories() {
    const categories = await fetchJSON("/public/categories");
    for (const category of categories) {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      dom.categorySelect.appendChild(option);
    }
  }

  async function loadProducts() {
    state.loadingProducts = true;
    dom.productsGrid.innerHTML = "";
    dom.productsEmpty.classList.add("hidden");

    const params = new URLSearchParams();
    if (dom.categorySelect.value) params.set("categoryId", dom.categorySelect.value);
    if (dom.searchInput.value.trim()) params.set("q", dom.searchInput.value.trim());

    const query = params.toString() ? `?${params.toString()}` : "";
    state.products = await fetchJSON(`/public/products${query}`);

    renderProducts();
    state.loadingProducts = false;
  }

  function renderProducts() {
    dom.productsGrid.innerHTML = "";

    if (!state.products.length) {
      dom.productsEmpty.classList.remove("hidden");
      return;
    }

    for (const product of state.products) {
      const card = document.createElement("article");
      card.className = "product-card";

      const img = document.createElement("img");
      img.src = product.images?.[0]
        ? `${API_BASE_URL.replace(/\/api$/, "")}${product.images[0]}`
        : "https://dummyimage.com/320x320/f4f4f5/a1a1aa&text=No+Image";
      img.alt = product.name;

      const name = document.createElement("div");
      name.className = "product-name";
      name.textContent = product.name;

      const meta = document.createElement("div");
      meta.className = "product-meta";
      meta.textContent = product.category?.name || "Kategoriyasiz";

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = money(product.currentPrice || 0);

      const button = document.createElement("button");
      button.className = "add-button";
      button.textContent = "Savatga qo'shish";
      button.addEventListener("click", function () {
        addToCart(product);
      });

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(meta);
      card.appendChild(price);
      card.appendChild(button);

      dom.productsGrid.appendChild(card);
    }
  }

  function addToCart(product) {
    clearResult();
    const current = state.cart.get(product.id);
    if (current) {
      current.quantity += 1;
    } else {
      state.cart.set(product.id, {
        productId: product.id,
        name: product.name,
        unitPrice: product.currentPrice || 0,
        quantity: 1,
      });
    }
    renderCart();
  }

  function removeFromCart(productId) {
    state.cart.delete(productId);
    renderCart();
  }

  function updateCartQuantity(productId, quantity) {
    const current = state.cart.get(productId);
    if (!current) return;

    const nextQty = sanitizeQuantity(quantity);
    current.quantity = nextQty;
    renderCart();
  }

  function cartTotal() {
    let total = 0;
    for (const item of state.cart.values()) {
      total += Math.round(item.unitPrice * item.quantity);
    }
    return total;
  }

  function renderCart() {
    dom.cartItems.innerHTML = "";
    const items = Array.from(state.cart.values());

    dom.cartEmpty.classList.toggle("hidden", items.length > 0);

    for (const item of items) {
      const row = document.createElement("div");
      row.className = "cart-item";

      const left = document.createElement("div");

      const name = document.createElement("div");
      name.className = "cart-item-name";
      name.textContent = item.name;

      const price = document.createElement("div");
      price.className = "cart-item-price";
      price.textContent = `${money(item.unitPrice)} x ${item.quantity}`;

      left.appendChild(name);
      left.appendChild(price);

      const actions = document.createElement("div");
      actions.className = "cart-item-actions";

      const qtyInput = document.createElement("input");
      qtyInput.className = "qty-input";
      qtyInput.type = "number";
      qtyInput.step = "0.1";
      qtyInput.min = "0.1";
      qtyInput.value = String(item.quantity);
      qtyInput.addEventListener("change", function () {
        updateCartQuantity(item.productId, qtyInput.value);
      });

      const removeButton = document.createElement("button");
      removeButton.className = "ghost";
      removeButton.type = "button";
      removeButton.textContent = "O'chirish";
      removeButton.addEventListener("click", function () {
        removeFromCart(item.productId);
      });

      actions.appendChild(qtyInput);
      actions.appendChild(removeButton);

      row.appendChild(left);
      row.appendChild(actions);
      dom.cartItems.appendChild(row);
    }

    dom.cartTotal.textContent = money(cartTotal());
  }

  async function submitOrder(event) {
    event.preventDefault();
    clearResult();

    const items = Array.from(state.cart.values());
    if (!items.length) {
      showResult("Savat bo'sh. Kamida bitta mahsulot qo'shing.", true);
      return;
    }

    const formData = new FormData(dom.checkoutForm);
    const payload = {
      customerName: String(formData.get("customerName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      note: String(formData.get("note") || "").trim(),
      items: items.map(function (item) {
        return {
          productId: item.productId,
          quantity: sanitizeQuantity(item.quantity),
        };
      }),
    };

    if (!payload.customerName) {
      showResult("Mijoz ismini kiriting.", true);
      return;
    }

    if (!payload.phone) {
      showResult("Telefon raqamini kiriting.", true);
      return;
    }

    dom.submitOrderButton.disabled = true;
    dom.submitOrderButton.textContent = "Yuborilmoqda...";

    try {
      const result = await fetchJSON("/public/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showResult(`Buyurtma qabul qilindi. Track code: ${result.trackCode || result.id}`, false);
      state.cart.clear();
      dom.checkoutForm.reset();
      renderCart();
    } catch (error) {
      showResult(`Xatolik: ${error.message || "Buyurtma yuborilmadi"}`, true);
    } finally {
      dom.submitOrderButton.disabled = false;
      dom.submitOrderButton.textContent = "Buyurtma berish";
    }
  }

  dom.clearCartButton.addEventListener("click", function () {
    state.cart.clear();
    renderCart();
    clearResult();
  });

  dom.categorySelect.addEventListener("change", function () {
    loadProducts().catch(function (error) {
      showResult(`Xatolik: ${error.message}`, true);
    });
  });

  dom.searchInput.addEventListener("input", function () {
    window.clearTimeout(dom.searchInput._timerId);
    dom.searchInput._timerId = window.setTimeout(function () {
      loadProducts().catch(function (error) {
        showResult(`Xatolik: ${error.message}`, true);
      });
    }, 250);
  });

  dom.checkoutForm.addEventListener("submit", submitOrder);

  Promise.all([loadCategories(), loadProducts()])
    .then(function () {
      renderCart();
    })
    .catch(function (error) {
      showResult(`Xatolik: ${error.message}`, true);
    });
})();
