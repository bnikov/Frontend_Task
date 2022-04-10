function transformData() {
  data = data.map((x, i) => {
    return {
      ...x,
      id: i,
      liked : false
    };
  });
}

function loadData() {
  for (let i = counter; i < counter + 4; i++) {
    if (i < data.length) {
      const card = `
          <div class="card">
            <div class="card-header">
              <img class="profile-picture" src="${data[i].profile_image}">
              <div class="profile-info">
                <b>${data[i].name}</b>
                <p>${formatDate(data[i].date.split(" ")[0])}</p>
              </div>
              <a href="${data[i].source_link}">
                <img class="platform-icon"  src="${data[i].source_type}.svg">
              </a>
            </div>

            <div class="card-image">
              <img data-item=${data[i].id} src="${data[i].image}">
            </div>  

            <div class="card-footer">
              <p class="caption" title="${data[i].caption}">${
        data[i].caption
      }</p>
              <div class="line"></div>
              <div class="likes">
                <img class="like-button" data-item=${
                  data[i].id
                } src="heart.svg">
                <p>${data[i].likes}</p>
              </div>
            </div>
          </div>`;
      document.getElementById("card-container").innerHTML += card;
    } else {
      document.getElementById("load-data-btn").style.display = "none";
      break;
    }
  }
  addEventListeners();
  counter += 4;
}

function addEventListeners() {
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((x) => {
    x.addEventListener("click", (event) => {
      updateLikes(event.target, false);
    });
  });

  const cards = document.querySelectorAll(".card-image");
  cards.forEach((x) => {
    x.addEventListener("click", (event) => {
      openModal(event.target);
    });
  });
}

function updateLikes(item, fromModal) {
  const id = item.dataset.item;
  const parent = item.closest(".likes");
  const likeCount = parent.querySelector("p");
  const likeButton = parent.querySelector(
    fromModal ? ".modal-like-button" : ".like-button"
  );

  if (likeButton.getAttribute("src") == "heart.svg") {
    data[id].likes++;
    data[id].liked = true;
    likeButton.src = "red-heart.svg";
  } else {
    data[id].likes--;
    likeButton.src = "heart.svg";
    data[id].liked = false;
  }

  likeCount.innerHTML = data[id].likes;
  if (fromModal) {
    const mainItem = document.querySelector(
      `.card .like-button[data-item="${id}"]`
    );
    const mainParent = mainItem.closest(".likes");
    const mainLikeCount = mainParent.querySelector("p");
    const mainLikeButton = mainParent.querySelector(".like-button");
    if (mainLikeButton.getAttribute("src") == "heart.svg") {
      mainLikeButton.src = "red-heart.svg";
    } else {
      mainLikeButton.src = "heart.svg";
    }
    mainLikeCount.innerHTML = data[id].likes;
  }
}

function closeModal() {
  document.querySelector(".modal").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
}

function openModal(item) {
  const modal = document.querySelector(".modal");
  const id = item.dataset.item;

  fillModal(modal, id);
  addModalEventListeners();
  modal.style.display = "initial";
  document.querySelector(".overlay").style.display = "initial";
}

function fillModal(modal, i) {
  modal.innerHTML = `
  <div>
  <div class="modal-card-image">
      <img data-item=${data[i].id} src="${data[i].image}">
    </div>

    <div class="modal-content">
      <div class="card-header">
      <img class="profile-picture" src="${data[i].profile_image}">
      <div class="profile-info">
        <b>${data[i].name}</b>
        <p>${formatDate(data[i].date.split(" ")[0])}</p>
      </div>  
    </div>

    <div class="card-footer">
      <p class="caption" title="${data[i].caption}">${data[i].caption}</p>
      
      <div class="line"></div>

      <div class="likes">
        <img class="modal-like-button" data-item=${data[i].id} src="${data[i].liked ? "red-heart.svg" : "heart.svg"}">
        <p>${data[i].likes}</p>
      </div>
    </div>
    <a href="${data[i].source_link}">
      <img class="modal-platform-icon"  src="${data[i].source_type}.svg">
    </a>
    </div>  
 </div>`;
}

function addModalEventListeners() {
  document.querySelector(".overlay").addEventListener("click", () => {
    closeModal();
  });

  document
    .querySelector(".modal-like-button")
    .addEventListener("click", (event) => {
      updateLikes(event.target, true);
    });
}

function formatDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const d = new Date(date);
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

let counter = 0;
transformData();
loadData();
