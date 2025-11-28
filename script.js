const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const productGrid = document.getElementById("productGrid");
const tabButtons = document.querySelectorAll(".tab-button");

const products = [
  {
    id: 1,
    name: "Wool cashmere blazer",
    price: "₩248,000",
    tag: "LIMITED",
    category: "women",
    image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Minimal leather tote",
    price: "₩189,000",
    tag: "NEW",
    category: "women",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "City commuter jacket",
    price: "₩219,000",
    tag: "TRENDING",
    category: "men",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Merino crew knit",
    price: "₩139,000",
    tag: "RESTOCK",
    category: "men",
    image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Rosewood diffuser set",
    price: "₩49,000",
    tag: "HOME",
    category: "home",
    image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Soft boucle cushion",
    price: "₩39,000",
    tag: "HOME",
    category: "home",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
  },
];

const renderProducts = (category = "all") => {
  const filtered =
    category === "all" ? products : products.filter((product) => product.category === category);

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <div class="relative">
          <img src="${product.image}" alt="${product.name}" />
          <span class="badge absolute left-4 top-4">${product.tag}</span>
        </div>
        <div>
          <p class="text-sm text-slate-500">FW Capsule</p>
          <h3 class="text-lg font-semibold text-slate-900">${product.name}</h3>
        </div>
        <div class="flex items-center justify-between text-sm text-slate-500">
          <p class="font-semibold text-slate-900">${product.price}</p>
          <button class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-900">
            カートに追加
          </button>
        </div>
      </article>
    `
    )
    .join("");
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.category;
    renderProducts(category);
  });
});

menuToggle?.addEventListener("click", () => {
  mobileNav?.classList.toggle("active");
});

renderProducts();

