/* function toggleFuction() {
  let sidebar_hide = document.querySelector("#sidebar-hide");
  if (sidebar_hide) {
    sidebar_hide.addEventListener("click", function () {
      if (
        document
          .querySelector(".pc-sidebar")
          .classList.contains("pc-sidebar-hide")
      ) {
        document
          .querySelector(".pc-sidebar")
          .classList.remove("pc-sidebar-hide");
      } else {
        document.querySelector(".pc-sidebar").classList.add("pc-sidebar-hide");
      }
      if (document.querySelector(".pc-navbar").classList.contains("open")) {
        document.querySelector(".pc-navbar").classList.remove("open");
      } else {
        document.querySelector(".pc-navbar").classList.add("open");
      }
    });
  }
} */
function collapseFuction() {
  document.getElementById("pc-sidebar")?.classList.add("hide");
  document.querySelector(".pc-container")?.classList.add("pc-container-min");
  document.getElementById("pc-header")?.classList.add("pc-left-min");
  document.querySelector(".page-header")?.classList.add("pc-left-min");
  document.getElementById("pc-sidebar-min")?.classList.add("show");
}
function openFuction() {
  document.getElementById("pc-sidebar")?.classList.remove("hide");
  document.querySelector(".pc-container")?.classList.remove("pc-container-min");
  document.getElementById("pc-header")?.classList.remove("pc-left-min");
  document.querySelector(".page-header")?.classList.remove("pc-left-min");
  document.getElementById("pc-sidebar-min")?.classList.remove("show");
}
