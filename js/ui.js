const BeanUI = (() => {
  const fields = [
    "name",
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
    producer: "生産者",
    harvestYear: "収穫年度",
    importer: "輸入業者",
    shop: "購入店",
    price: "購入価格",
    purchaseDate: "購入日",
    roastDate: "焙煎日",
    roastLevel: "焙煎度"
  };

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

  function createDetailList(bean) {
    const list = document.createElement("div");
    list.className = "bean-detail-list";

    Object.entries(labels).forEach(([key, label]) => {
      const value = key.includes("Date") ? formatDate(bean[key]) : bean[key];
      if (!value) return;

      const row = document.createElement("div");
      setText(row, `${label}: ${value}`);
      list.appendChild(row);
    });

    return list;
  }

  function createCard(bean, onEdit, onDelete) {
    const card = document.createElement("article");
    card.className = "bean-card";

    const photo = document.createElement("div");
    photo.className = "bean-photo";
    const icon = document.createElement("span");
    setText(icon, "豆");
    photo.appendChild(icon);

    const body = document.createElement("div");
    const title = document.createElement("h3");
    setText(title, bean.name || "名称未設定の豆");

    const meta = document.createElement("p");
    meta.className = "bean-meta";
    const metaParts = [bean.country, bean.area, bean.farm].filter(Boolean);
    setText(meta, metaParts.length ? metaParts.join(" / ") : "産地情報は未登録");

    body.append(title, meta);

    const detailList = createDetailList(bean);
    const tagList = createTagList(bean.flavorTags || []);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "secondary-button";
    editButton.type = "button";
    setText(editButton, "編集");
    editButton.addEventListener("click", () => onEdit(bean.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    setText(deleteButton, "削除");
    deleteButton.addEventListener("click", () => onDelete(bean.id));

    actions.append(editButton, deleteButton);
    card.append(photo, body, detailList, tagList, actions);

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
      container.appendChild(createCard(bean, handlers.onEdit, handlers.onDelete));
    });
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
    updateSummary
  };
})();
