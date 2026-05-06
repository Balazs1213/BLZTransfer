import PropTypes from "prop-types";
import { MdFilterAltOff } from "react-icons/md";
import styles from "./FileDashboard.module.css";

const FilterSection = ({
  t,
  searchTerm,
  setSearchTerm,
  activeStateFilter,
  setActiveStateFilter,
  avStatusFilter,
  setAvStatusFilter,
  categoryFilter,
  setCategoryFilter,
  extFilter,
  setExtFilter,
  sortOrder,
  setSortOrder,
  uniqueAvStatuses,
  availableCategories,
  availableExtensions,
  translateStatusValue,
  translateCategoryValue,
  onClearFilters,
}) => {
  return (
    <div className={styles.filterSection}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t("searchPlaceholder")}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0.65rem 0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "0.95rem",
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "0.75rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            flex: 1,
            minWidth: "320px",
          }}
        >
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>
              {t("filterState")}
            </span>
            <select
              value={activeStateFilter}
              onChange={(e) => setActiveStateFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.7rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="ALL">{t("allStatuses")}</option>
              <option value="ACTIVE">{t("active")}</option>
              <option value="INACTIVE">{t("inactive")}</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>
              {t("filterAvStatus")}
            </span>
            <select
              value={avStatusFilter}
              onChange={(e) => setAvStatusFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.7rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="ALL">{t("allAvStatuses")}</option>
              {uniqueAvStatuses.map((status) => (
                <option key={status} value={status}>
                  {translateStatusValue(status)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>
              {t("filterCategoryLabel")}
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setExtFilter("ALL");
              }}
              style={{
                width: "100%",
                padding: "0.6rem 0.7rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="ALL">{t("cat_ALL")}</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {translateCategoryValue(category)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>
              {t("filterExtLabel")}
            </span>
            <select
              value={extFilter}
              onChange={(e) => setExtFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.7rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="ALL">{t("allExtensions")}</option>
              {availableExtensions.map((extension) => (
                <option key={extension} value={extension}>
                  {extension}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#4b5563" }}>
              {t("filterSortLabel")}
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.7rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="NEWEST">{t("sortNewest")}</option>
              <option value="OLDEST">{t("sortOldest")}</option>
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          className={styles.clearFiltersBtn}
          aria-label="Clear all filters"
          title="Clear all filters"
        >
          <MdFilterAltOff />
          <span>{t("clearFilters") || "Clear filters"}</span>
        </button>
      </div>
    </div>
  );
};

FilterSection.propTypes = {
  t: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  activeStateFilter: PropTypes.string.isRequired,
  setActiveStateFilter: PropTypes.func.isRequired,
  avStatusFilter: PropTypes.string.isRequired,
  setAvStatusFilter: PropTypes.func.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  extFilter: PropTypes.string.isRequired,
  setExtFilter: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  uniqueAvStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  availableCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  availableExtensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  translateStatusValue: PropTypes.func.isRequired,
  translateCategoryValue: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default FilterSection;
