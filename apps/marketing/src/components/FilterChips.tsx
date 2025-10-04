import React from "react";

export interface FilterChip {
  id: string;
  label: string;
  color: string;
  count?: number;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedFilters: string[];
  onFilterChange: (selectedFilters: string[]) => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  selectedFilters,
  onFilterChange,
  className = "",
}) => {
  const handleChipClick = (chipId: string) => {
    if (selectedFilters.includes(chipId)) {
      onFilterChange(selectedFilters.filter((id) => id !== chipId));
    } else {
      onFilterChange([...selectedFilters, chipId]);
    }
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  return (
    <div className={`filter-chips ${className}`}>
      <div className="filter-chips-header">
        <span className="filter-chips-title">Filter by Class:</span>
        {selectedFilters.length > 0 && (
          <button
            className="filter-chips-clear"
            onClick={handleClearAll}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="filter-chips-container">
        {chips.map((chip) => {
          const isSelected = selectedFilters.includes(chip.id);
          return (
            <button
              key={chip.id}
              className={`filter-chip ${isSelected ? "filter-chip--selected" : ""}`}
              style={
                {
                  "--chip-color": chip.color,
                  borderColor: isSelected ? chip.color : "var(--sim-border)",
                  backgroundColor: isSelected
                    ? `${chip.color}20`
                    : "transparent",
                  color: isSelected ? chip.color : "var(--sim-text)",
                } as React.CSSProperties
              }
              onClick={() => handleChipClick(chip.id)}
              aria-pressed={isSelected}
              aria-label={`Filter by ${chip.label}${chip.count ? ` (${chip.count} items)` : ""}`}
            >
              <span className="filter-chip-label">{chip.label}</span>
              {chip.count !== undefined && (
                <span className="filter-chip-count">{chip.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;
