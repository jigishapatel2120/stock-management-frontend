<template>
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div>
          <h2 class="card-title mb-0">Stock List</h2>
        </div>
        <div class="d-flex gap-2 flex-wrap align-items-center">
          <div class="input-group input-group-sm">
            <input
              v-model="searchTerm"
              @keyup.enter="onSearch"
              type="text"
              class="form-control"
              placeholder="Search stocks..."
            />
            <button class="btn btn-outline-secondary" type="button" @click="onSearch">Search</button>
            <button class="btn btn-outline-secondary" type="button" @click="clearSearch">Clear</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div id="table" class="tabulator"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import api from "../api/axios";

export default {
  data() {
    return {
      table: null,
      searchTerm: "",
    };
  },

  mounted() {
    this.initTable();
  },

  methods: {
    ...mapActions("auth", ["logout"]),

    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },

    onSearch() {
      if (this.table) {
        this.table.setData();
      }
    },

    clearSearch() {
      this.searchTerm = "";
      if (this.table) {
        this.table.setData();
      }
    },

    async deleteRow(row) {
      if (!row.id) {
        return;
      }

      if (!confirm("Delete this stock entry?")) {
        return;
      }

      try {
        await api.delete(`/stocks/${row.id}`);
        if (this.table) {
          this.table.setData();
        }
      } catch (error) {
        alert("Unable to delete the stock entry.");
      }
    },

    initTable() {
      this.table = new Tabulator("#table", {
        layout: "fitColumns",
        theme: "bootstrap5",
        height: "520px",

        pagination: true,
        paginationMode: "remote",
        paginationSize: 15,

        ajaxURL: "http://127.0.0.1:8000/api/stocks",

        ajaxConfig: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },

        ajaxParams: (params = {}) => ({
          page: params.page || 1,
          size: params.size || 15,
          search: this.searchTerm || "",
          sort: params.sorters?.[0]?.field || "created_at",
          order: params.sorters?.[0]?.dir || "desc",
        }),

        dataReceiveParams: {
          data: "data",
          last_page: "last_page",
          total: "total",
        },

        ajaxResponse: (url, params, response) => response,

        columns: [
          { title: "Stock #", field: "stock_no_label" },
          { title: "Item Code", field: "item_code" },
          { title: "Item Name", field: "item_name" },
          { title: "Quantity", field: "quantity" },
          { title: "Location", field: "location" },
          { title: "In Stock Date", field: "in_stock_date" },
          { title: "Status", field: "status" },
          { title: "Created At", field: "created_at" },
          { title: "Store", field: "store.store_name" },
          { title: "Created By", field: "created_by.name" },
          {
            title: "Actions",
            formatter: "buttonCross",
            width: 120,
            hozAlign: "center",
            cellClick: (e, cell) => {
              this.deleteRow(cell.getRow().getData());
            },
          },
        ],
      });
    },
  },
};
</script>
