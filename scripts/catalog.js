const listNode = document.querySelector('[data-role="courses-list"]');
const filtersNode = document.querySelector('[data-role="filters"]');
const searchInput = document.querySelector('[data-role="search-input"]');
const searchForm = document.querySelector('[data-role="search-form"]');

let currentCategory = "all";
let currentQuery = "";

function createCourseCard(course) {
    const article = document.createElement("article");
    article.className = "course-card";
    article.dataset.category = course.category;

    article.innerHTML = `
    <div class="course-card__image-wrapper">
      <img src="${course.image}" alt="${course.title}" class="course-card__image" />
    </div>
    <div class="course-card__body">
      <div class="course-card__badge course-card__badge_theme-${course.badgeTheme}">
        ${course.categoryLabel || capitalize(course.category)}
      </div>
      <h2 class="course-card__title">${course.title}</h2>
      <div class="course-card__meta">
        <span class="course-card__price">$${course.price}</span>
        <span class="course-card__separator">|</span>
        <span class="course-card__author">by ${course.author}</span>
      </div>
    </div>
  `;

    return article;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderCourses(items) {
    listNode.innerHTML = "";
    const fragment = document.createDocumentFragment();

    items.forEach((course) => {
        fragment.appendChild(createCourseCard(course));
    });

    listNode.appendChild(fragment);
}

function applyFilters() {
    const query = currentQuery.trim().toLowerCase();

    const filtered = courses.filter((course) => {
        const byCategory = currentCategory === "all" || course.category === currentCategory;
        const byTitle = course.title.toLowerCase().includes(query);
        return byCategory && byTitle;
    });

    renderCourses(filtered);
}

filtersNode.addEventListener("click", (event) => {
    const button = event.target.closest(".courses__filter");
    if (!button) return;

    const category = button.dataset.category;
    if (!category) return;

    currentCategory = category;

    filtersNode.querySelectorAll(".courses__filter").forEach((node) => {
        node.classList.toggle("courses__filter_active", node === button);
    });

    applyFilters();
});

searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value;
    applyFilters();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
});

renderCourses(courses);
const filterButtons = document.querySelectorAll(".courses__filter");

function getCategoryCounts() {
    const counts = {};

    courses.forEach((course) => {
        const category = course.category;
        counts[category] = (counts[category] || 0) + 1;
    });

    counts.all = courses.length;

    return counts;
}

function updateCategoryCounters() {
    const counts = getCategoryCounts();

    filterButtons.forEach((button) => {
        const category = button.dataset.category;
        const counterNode = button.querySelector(".courses__filter-count");
        if (!counterNode || !category) return;

        const value = counts[category] ?? 0;
        counterNode.textContent = value;
    });
}
updateCategoryCounters();
recomputeFilteredCourses();
