const BeanUI = (() => {
  const fields = [
    "name",
    "imageUrl",
    "country",
    "farm",
    "process",
    "variety",
    "area",
    "altitude",
    "producer",
    "harvestYear",
    "importer",
    "shop",
    "price",
    "purchaseDate",
    "roastDate",
    "roastLevel",
    "roasterMachine",
    "recipe",
    "cupping",
    "memo"
  ];

  const labels = {
    country: "国",
    farm: "農園",
    process: "プロセス",
    variety: "品種",
    area: "エリア",
    altitude: "標高",
    harvestYear: "収穫年度",
    importer: "輸入業者",
    shop: "購入店",
    price: "購入価格",
    purchaseDate: "購入日",
    roastDate: "焙煎日",
    roastLevel: "焙煎度",
    roasterMachine: "焙煎機",
    flavorTags: "フレーバー",
    recipe: "レシピ",
    memo: "メモ"
  };

  const detailOrder = [
    "country",
    "farm",
    "process",
    "variety",
    "area",
    "altitude",
    "harvestYear",
    "importer",
    "shop",
    "price",
    "purchaseDate",
    "roastDate",
    "roastLevel",
    "roasterMachine",
    "flavorTags",
    "recipe",
    "memo"
  ];

  function setText(element, value) {
    element.textContent = value || "";
  }

  function formatDate(value) {
    if (!value) return "";
    return value.replaceAll("-", ".");
  }

  function createTagList(tags) {
    const list = document.createElement("div");
    list.className = "tag-list";

    tags.slice(0, 5).forEach((tag) => {
      const item = document.createElement("span");
      item.className = "tag";
      setText(item, tag);
      list.appendChild(item);
    });

    return list;
  }

  function getDisplayValue(bean, key) {
    if (key === "flavorTags") return (bean.flavorTags || []).join(", ");
    if (key.includes("Date")) return formatDate(bean[key]);
    return bean[key] || "";
  }

  function createImageArea(bean, className) {
    const area = document.createElement("div");
    area.className = className;

    if (bean.imageUrl) {
      area.classList.add("has-image");
      const image = document.createElement("img");
      image.src = bean.imageUrl;
      image.alt = bean.name || "コーヒー豆の画像";
      area.appendChild(image);
      return area;
    }

    const fallback = document.createElement("span");
    setText(fallback, "Bean Archive");
    area.appendChild(fallback);
    return area;
  }

  function createCard(bean, onOpen) {
    const card = document.createElement("article");
    card.className = "bean-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${bean.name || "名称未設定の豆"}の詳細を開く`);

    const photo = createImageArea(bean, "bean-photo");

    const body = document.createElement("div");
    const title = document.createElement("h3");
    setText(title, bean.name || "名称未設定の豆");

    const meta = document.createElement("p");
    meta.className = "bean-meta";
    const metaParts = [bean.country, bean.area, bean.farm].filter(Boolean);
    setText(meta, metaParts.length ? metaParts.join(" / ") : "産地情報は未登録");

    body.append(title, meta);

    const tagList = createTagList(bean.flavorTags || []);

    card.addEventListener("click", () => onOpen(bean.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(bean.id);
      }
    });

    card.append(photo, body, tagList);

    return card;
  }

  function renderEmpty(container, isSearching) {
    const empty = document.createElement("div");
    empty.className = "empty-state";

    const title = document.createElement("h3");
    setText(title, isSearching ? "該当する豆が見つかりません" : "最初の豆を登録しましょう");

    const text = document.createElement("p");
    setText(
      text,
      isSearching
        ? "検索語を変えると、国・農園・フレーバータグなどを横断して探せます。"
        : "国、農園、焙煎日、フレーバー、レシピまで残せるコーヒー図鑑です。"
    );

    empty.append(title, text);
    container.appendChild(empty);
  }

  function renderBeans(container, beans, handlers, isSearching) {
    container.replaceChildren();

    if (!beans.length) {
      renderEmpty(container, isSearching);
      return;
    }

    beans.forEach((bean) => {
      container.appendChild(createCard(bean, handlers.onOpen));
    });
  }

  function renderDetail(bean, elements) {
    setText(elements.detailName, bean.name || "名称未設定の豆");
    elements.detailImage.replaceChildren(createImageArea(bean, "detail-image-inner"));
    elements.detailList.replaceChildren();

    detailOrder.forEach((key) => {
      const value = getDisplayValue(bean, key);
      if (!value) return;

      const term = document.createElement("dt");
      const description = document.createElement("dd");
      setText(term, labels[key]);
      setText(description, value);
      elements.detailList.append(term, description);
    });

    if (!elements.detailList.children.length) {
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      setText(term, "詳細");
      setText(description, "まだ詳細情報が登録されていません。");
      elements.detailList.append(term, description);
    }
  }

  function fillForm(form, bean) {
    form.elements.beanId.value = bean ? bean.id : "";
    fields.forEach((field) => {
      form.elements[field].value = bean ? bean[field] || "" : "";
    });
    form.elements.flavorTags.value = bean ? (bean.flavorTags || []).join(", ") : "";
  }

  function readForm(form) {
    const bean = {};
    fields.forEach((field) => {
      bean[field] = form.elements[field].value.trim();
    });

    bean.id = form.elements.beanId.value;
    bean.flavorTags = BeanStorage.splitTags(form.elements.flavorTags.value);
    return bean;
  }

  function updateSummary(beans) {
    const countries = new Set(beans.map((bean) => bean.country).filter(Boolean));
    const tags = new Set(beans.flatMap((bean) => bean.flavorTags || []));

    setText(document.getElementById("beanCount"), String(beans.length));
    setText(document.getElementById("countryCount"), String(countries.size));
    setText(document.getElementById("tagCount"), String(tags.size));
  }

  return {
    fillForm,
    readForm,
    renderBeans,
    renderDetail,
    updateSummary
  };
})();
