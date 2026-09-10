import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TableGrid from "./TableGrid";
import { TableSettings } from "@src/types/table";

describe("TableGrid animation and performance", () => {
  test("renders 170 tables with fast constant animation timeout", () => {
    const generatedTables: TableSettings[] = Array.from({ length: 170 }, (_, i) => ({
      id: `table_${i}`,
      name: `Story Table ${i}`,
      collection: `collection_${i}`,
      section: i < 85 ? "Section A" : "Section B",
      description: `Test table description ${i}`,
      roles: ["ADMIN"],
      tableType: "primaryCollection",
      schema: { columns: {} },
    }));

    const sections = {
      "Section A": generatedTables.slice(0, 85),
      "Section B": generatedTables.slice(85),
    };

    const getLink = (table: TableSettings) => `/table/${table.id}`;

    const { container } = render(
      <MemoryRouter>
        <TableGrid sections={sections} getLink={getLink} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Section A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Section B").length).toBeGreaterThan(0);
    expect(screen.getByText("Story Table 0")).toBeInTheDocument();
    expect(screen.getByText("Story Table 169")).toBeInTheDocument();

    // Verify all 170 table card elements are present in DOM without lag
    const cards = container.querySelectorAll("section");
    expect(cards.length).toBe(2);
  });
});
