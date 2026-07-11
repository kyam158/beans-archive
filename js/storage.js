const BeanStorage = (() => {
  const STORAGE_KEY = "beanArchive.v1";
  const LEGACY_KEY = "beanArchive";
  const SCHEMA_VERSION = 1;

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `bean_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function normalizeBean(bean) {
    const now = new Date().toISOString();
    return {
      id: bean.id || createId(),
      name: bean.name || "",
      country: bean.country || "",
      farm: bean.farm || "",
      process: bean.process || "",
      variety: bean.variety || "",
      area: bean.area || bean.region || "",
      altitude: bean.altitude || "",
      producer: bean.producer || "",
      harvestYear: bean.harvestYear || "",
      importer: bean.importer || "",
      shop: bean.shop || "",
      price: bean.price || "",
      purchaseDate: bean.purchaseDate || "",
      roastDate: bean.roastDate || "",
      roastLevel: bean.roastLevel || "",
      recipe: bean.recipe || "",
      flavorTags: Array.isArray(bean.flavorTags)
        ? bean.flavorTags
        : splitTags(bean.flavorTags || ""),
      cupping: bean.cupping || "",
      memo: bean.memo || "",
      createdAt: bean.createdAt || now,
      updatedAt: bean.updatedAt || now
    };
  }

  function splitTags(value) {
    return String(value)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function loadLegacyBeans() {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) return [];

    try {
      return JSON.parse(legacy).map(normalizeBean);
    } catch {
      return [];
    }
  }

  function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return loadLegacyBeans();
    }

    try {
      const parsed = JSON.parse(saved);
      return (parsed.beans || []).map(normalizeBean);
    } catch {
      return [];
    }
  }

  function save(beans) {
    const payload = {
      version: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      beans: beans.map(normalizeBean)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  return {
    createId,
    load,
    save,
    splitTags
  };
})();
