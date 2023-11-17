/**
 * @Paginate.js
 * @brief
 *
 * Component which displays the pagination using react-paginate
 *
 * @props
 *
 * asset            - JSON of asset from DB
 * setDisplayData   - JSON data to be displayed on screen according to paginaion
 * itemPerPage      - username returned from Microsoft API
 *
 *
 *@return
 *
 *
 * Paginate(Fn) -Pagination Component
 *
 * @note
 *
 * Revision History:
 * 151022 - Creation Date - Divine A Mathew
 *
 *
 */

//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactPaginate from "react-paginate";

//-----------------------------------------------------------------------------
// Paginate Return Function
//-----------------------------------------------------------------------------
function Paginate({ assets, setDisplayData, user, itemPerPage }) {
  const [pageNumber, SetPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    var datasPerPage;
    if (user && user[0].user_type === "admin") {
      datasPerPage = 4;
    } else {
      datasPerPage = 5;
    }

    if (itemPerPage >= datasPerPage) {
      datasPerPage = itemPerPage;
    }
    const pagesVisited = pageNumber * datasPerPage;
    setDisplayData(assets.slice(pagesVisited, pagesVisited + datasPerPage));
    setPageCount(Math.ceil(assets.length / datasPerPage));
  }, [pageNumber, assets, user]);

  const changePage = ({ selected }) => {
    SetPageNumber(selected);
  };

  return (
    <div>
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        ></ReactPaginate>
      )}
    </div>
  );
}

export default Paginate;
