const listingsGrid = document.querySelector(".listings-grid");

const loadTrigger = document.querySelector("#load-trigger");

let currentPage = Number(listingsGrid.dataset.page);

let hasMore = listingsGrid.dataset.hasMore === "true";

let loading = false;

const category = listingsGrid.dataset.category;

const search = listingsGrid.dataset.search;

async function loadMoreListings() {
  if (loading || !hasMore) return;

  loading = true;
  currentPage++;

  let url = `/listings?page=${currentPage}`;

  if (category) {
    url += `&category=${category}`;
  }

  if (search) {
    url += `&search=${search}`;
  }

  const res = await fetch(url);

  const html = await res.text();

  const parser = new DOMParser();

  const doc = parser.parseFromString(html, "text/html");

  const newListings = doc.querySelectorAll(".listing-card");

  newListings.forEach((listing) => {
    listingsGrid.appendChild(listing);
  });

  const newGrid = doc.querySelector(".listings-grid");

  hasMore = newGrid.dataset.hasMore === "true";

  loading = false;
}

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreListings();
  }
});

observer.observe(loadTrigger);
