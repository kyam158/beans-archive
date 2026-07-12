const BeanApp = (() => {
  let beans = BeanStorage.load();

  const elements = {
    addButton: document.getElementById("addBeanButton"),
    cancelButton: document.getElementById("cancelButton"),
    closeDialogButton: document.getElementById("closeDialogButton"),
    backButton: document.getElementById("backButton"),
    detailDeleteButton: document.getElementById("detailDeleteButton"),
    detailEditButton: document.getElementById("detailEditButton"),
    detailImage: document.getElementById("detailImage"),
    detailList: document.getElementById("detailList"),
    detailName: document.getElementById("detailName"),
    detailView: document.getElementById("detailView"),
    dialog: document.getElementById("beanDialog"),
    dialogTitle: document.getElementById("dialogTitle"),
    form: document.getElementById("beanForm"),
    homeView: document.getElementById("homeView"),
    list: document.getElementById("beanList"),
    resultCount: document.getElementById("resultCount"),
    searchInput: document.getElementById("searchInput")
  };

  function getSearchText(bean) {
    return [
      bean.name,
      bean.imageUrl,
      bean.country,
      bean.farm,
      bean.process,
      bean.variety,
      bean.area,
      bean.altitude,
      bean.producer,
      bean.harvestYear,
      bean.importer,
      bean.shop,
      bean.price,
      bean.purchaseDate,
      bean.roastDate,
      bean.roastLevel,
      bean.roasterMachine,
      bean.recipe,
      ...(bean.flavorTags || []),
      bean.cupping,
      bean.memo
    ]
      .join(" ")
      .toLowerCase();
  }

  function getFilteredBeans() {
    const query = elements.searchInput.value.trim().toLowerCase();
    if (!query) return beans;

    return beans.filter((bean) => getSearchText(bean).includes(query));
  }

  function persist() {
    BeanStorage.save(beans);
  }

  function render() {
    const filtered = getFilteredBeans();
    BeanUI.updateSummary(beans);
    BeanUI.renderBeans(
      elements.list,
      filtered,
      {
        onOpen: openDetail
      },
      Boolean(elements.searchInput.value.trim())
    );
    elements.resultCount.textContent = `${filtered.length}件`;
  }

  function getCurrentDetailId() {
    const match = window.location.hash.match(/^#bean\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function showHome() {
    elements.homeView.hidden = false;
    elements.detailView.hidden = true;
  }

  function showDetail(id) {
    const bean = beans.find((item) => item.id === id);
    if (!bean) {
      window.location.hash = "#home";
      return;
    }

    elements.homeView.hidden = true;
    elements.detailView.hidden = false;
    elements.detailEditButton.dataset.beanId = id;
    elements.detailDeleteButton.dataset.beanId = id;
    BeanUI.renderDetail(bean, elements);
  }

  function renderRoute() {
    const detailId = getCurrentDetailId();
    if (detailId) {
      showDetail(detailId);
      return;
    }

    showHome();
  }

  function openDetail(id) {
    window.location.hash = `#bean/${encodeURIComponent(id)}`;
  }

  function openCreateDialog() {
    elements.dialogTitle.textContent = "豆を追加";
    BeanUI.fillForm(elements.form, null);
    elements.dialog.showModal();
    elements.form.elements.name.focus();
  }

  function openEditDialog(id) {
    const bean = beans.find((item) => item.id === id);
    if (!bean) return;

    elements.dialogTitle.textContent = "豆を編集";
    BeanUI.fillForm(elements.form, bean);
    elements.dialog.showModal();
    elements.form.elements.name.focus();
  }

  function closeDialog() {
    elements.dialog.close();
  }

  function upsertBean(event) {
    event.preventDefault();

    const formBean = BeanUI.readForm(elements.form);
    const now = new Date().toISOString();

    if (formBean.id) {
      beans = beans.map((bean) =>
        bean.id === formBean.id
          ? { ...bean, ...formBean, updatedAt: now }
          : bean
      );
    } else {
      beans = [
        {
          ...formBean,
          id: BeanStorage.createId(),
          createdAt: now,
          updatedAt: now
        },
        ...beans
      ];
    }

    persist();
    closeDialog();
    render();
    renderRoute();
  }

  function deleteBean(id) {
    const bean = beans.find((item) => item.id === id);
    if (!bean) return;

    const confirmed = window.confirm(`「${bean.name || "名称未設定の豆"}」を削除しますか？`);
    if (!confirmed) return;

    beans = beans.filter((item) => item.id !== id);
    persist();
    if (getCurrentDetailId() === id) {
      window.location.hash = "#home";
    }
    render();
  }

  function bindEvents() {
    elements.addButton.addEventListener("click", openCreateDialog);
    elements.backButton.addEventListener("click", () => {
      window.location.hash = "#home";
    });
    elements.cancelButton.addEventListener("click", closeDialog);
    elements.closeDialogButton.addEventListener("click", closeDialog);
    elements.detailEditButton.addEventListener("click", () => {
      openEditDialog(elements.detailEditButton.dataset.beanId);
    });
    elements.detailDeleteButton.addEventListener("click", () => {
      deleteBean(elements.detailDeleteButton.dataset.beanId);
    });
    elements.form.addEventListener("submit", upsertBean);
    elements.searchInput.addEventListener("input", render);
    window.addEventListener("hashchange", renderRoute);

    elements.form.addEventListener("focusin", (event) => {
      if (!event.target.matches("input, textarea, select")) return;

      window.setTimeout(() => {
        event.target.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      }, 180);
    });

    elements.dialog.addEventListener("click", (event) => {
      if (event.target === elements.dialog) {
        closeDialog();
      }
    });
  }

  function init() {
    bindEvents();
    persist();
    render();
    renderRoute();
  }

  return {
    init
  };
})();

BeanApp.init();
