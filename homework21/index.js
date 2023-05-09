let user = JSON.parse(localStorage.getItem("user"));

let updateStatus = (user) => {
  fetch(
    "https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/" + user.id
  )
    .then((res) => res.json())
    .then((data) => {
      data.status = false;
      return fetch(
        "https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/" +
          data.id,
        {
          method: "PUT",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify(data),
        }
      );
    });
};

let renderCategoriesAndProducts = (data) => {
  for (let category in data) {
    const section = $("<section>").addClass("category");
    const headline = $("<h1>").addClass("category-headline");
    const productWrapper = $("<div>", { class: "products" });
    productWrapper.attr("value", category);

    headline.text(category);

    $(".product-wrapper").append(section);
    section.append(headline);
    section.append(productWrapper);

    $.each(data[category], function () {
      const productDiv = $("<div>", { class: "product" });
      productDiv.attr("value", category);
      const imgDiv = $("<div>", { class: "img" });
      const img = $("<img>", {
        src: `./img/images/products/${this.img}.png`,
        width: "117",
      });
      imgDiv.append(img);
      const h2 = $("<h2>").text(this.title);
      const priceAndBuyDiv = $("<div>", { class: "price-and-buy" });
      const price = $("<h1>");
      let saleDiv = null;
      if (this.sale == true) {
        saleDiv = $("<div>", { class: "sale" });
        const priceWithoutSale = $("<s>", { class: "price-without-sale" }).text(
          "$" + this.price
        );
        const salePercent = $("<p>", { class: "sale-percent" }).text(
          "-" + this.salePercent + "%"
        );
        saleDiv.append(priceWithoutSale, salePercent);
        const priceValue =
          this.price - (this.price * parseFloat(this.salePercent)) / 100;
        price.text("$" + priceValue);
      } else {
        priceAndBuyDiv.css({
          "margin-top": "43px",
        });
        price.text("$" + this.price);
      }

      const buyDiv = $("<div>", { class: "buy" });

      let user = JSON.parse(localStorage.getItem("user"));

      const shoppingCartImg = $("<img>", {
        src: "./img/images/shopping-cart.png",
        width: "25",
      });

      let product = this;

      buyDiv.on("click", async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          user = {
            shoppingCart: [],
          };
          window.location.href = "./login.html";
          return;
        }

        const response = await fetch(
          `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`
        );
        const userData = await response.json();

        const existingItem = userData.shoppingCart.find(
          (item) => item.id === product.id
        );
        if (existingItem) {
          existingItem.count++;
        } else {
          product.count = 1;
          userData.shoppingCart.push(product);
        }

        await fetch(
          `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${userData.id}`,
          {
            method: "PUT",
            headers: { "content-type": "application/json; charset=utf-8" },
            body: JSON.stringify(userData),
          }
        );

        localStorage.setItem("user", JSON.stringify(user));
        fetch(
          `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`
        )
          .then((res) => res.json())
          .then((res) => $("#product-count p").text(res.shoppingCart.length));

        buyDiv.css({
          "background-color": "#66ab59",
        });
      });

      let obj = this;

      if (user) {
        fetch(
          `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.shoppingCart.some((item) => item.id === obj.id)) {
              buyDiv.css({
                "background-color": "#66ab59",
              });
            }
          });
      }

      buyDiv.append(shoppingCartImg);
      priceAndBuyDiv.append(price, buyDiv);
      productDiv.append(imgDiv, h2, saleDiv, priceAndBuyDiv);
      $(`.products[value="${category}"]`).append(productDiv);
    });
  }
};
fetch("https://634e9f834af5fdff3a625f84.mockapi.io/products")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((res) => {
    const acc = res.reduce((acc, el) => {
      if (acc[el.category]) {
        acc[el.category].push(el);
      } else {
        acc[el.category] = [];
        acc[el.category].push(el);
      }
      return acc;
    }, {});
    renderCategoriesAndProducts(acc);

    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      fetch(
        `https://6442d57333997d3ef91aa550.mockapi.io/api/mindboard/users/${user.id}`
      )
        .then((res) => res.json())
        .then((res) => $("#product-count p").text(res.shoppingCart.length));
    }
    if (user) {
      $("#cart-button a").attr("href", "./shoppingCart.html");
      $("#logout-p").css({
        display: "block",
      });

      $("#logout-p").on("click", () => {
        updateStatus(user);
        localStorage.removeItem("user");
        setTimeout(() => {
          location.reload();
        }, 500);
      });
      $("#cabinet").text(user.name);
      $("#cabinet").attr("href", "./account.html");
    } else {
      console.log("Err");
    }
  });
