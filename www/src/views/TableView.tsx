import React from "react";

import Navigation from "../components/Navigation";
import Table from "../components/Table";

import useRouter from "../hooks/useRouter";

export default function TableView() {
  const router = useRouter();
  const tableCollection = router.location.pathname.split("/")[2];

  return (
    <Navigation>
      <Table collection={tableCollection} filters={[]} />
    </Navigation>
  );
}
