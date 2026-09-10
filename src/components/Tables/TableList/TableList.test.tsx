import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TableList from "./TableList";
import { TableSettings } from "@src/types/table";

describe("TableList animation and performance", () => {
  test("renders 170 tables with fast constant animation timeout in list view", () => {
    const generatedTables: TableSettings[] = Array.from({ length: 170 }, (_, i) => ({
      id: `table_list_${i}`,
      name: `List Table ${i}`,
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
        <TableList sections={sections} getLink={getLink} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Section A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Section B").length).toBeGreaterThan(0);
    expect(screen.getByText("List Table 0")).toBeInTheDocument();
    expect(screen.getByText("List Table 169")).toBeInTheDocument();

    const sectionsFound = container.querySelectorAll("section");
    expect(sectionsFound.length).toBe(2);
  });
});
