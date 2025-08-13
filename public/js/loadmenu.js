async function loadDepartments(selector) {
  try {
    const res = await fetch("/dashboard/departmentLink");
    const data = await res.json();

    if (!data.success) {
      return alert(data.message || "Không thể tải danh sách phòng ban");
    }

    const ul = document.querySelector(selector);
    if (!ul) return console.error(`Không tìm thấy phần tử: ${selector}`);
    ul.innerHTML = "";

    data.data.forEach((dept) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `/dashboard/${dept.id}`; // hoặc `/dashboard/${dept.slug}` nếu có slug
      a.textContent = dept.name;
      a.classList.add("dropdown-item"); // optional: nếu Notika cần

      li.appendChild(a);
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Lỗi khi fetch phòng ban:", err);
  }
}

// Gọi khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  loadDepartments("#loadDepartment-mobile"); // Mobile menu
  loadDepartments("#loadDepartment-desktop"); // Desktop menu (nếu có)
});
