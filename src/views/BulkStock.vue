<template>
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 class=  "h4 mb-1">Bulk Stock Entry</h2>
          <p class="mb-0 text-muted">Add multiple stock records in one batch.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-outline-primary" @click="addRow">Add Row</button>
          <button class="btn btn-primary" @click="saveAll">Save All</button>
        </div>
      </div>

      <div class="card-body p-0">
        <div v-if="errors.length" class="alert alert-danger rounded-0 mb-0">
          <ul class="mb-0 small">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>
        <div class="ag-theme-alpine" style="height: 500px; width: 100%;">
          <ag-grid-vue
            ref="bulkGrid"
            :key="gridKey"
            class="h-100"
            :rowData="rowData"
            :columnDefs="columnDefs"
            :editType="'fullRow'"
            @grid-ready="onGridReady"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import api from "../api/axios";

ModuleRegistry.registerModules([AllCommunityModule]);

export default {
  components: { AgGridVue },

  data() {
    return {
      rowData: [],
      gridApi: null,
      errors: [],
      stores: [],
    };
  },

  computed: {
    storeNames() {
      return this.stores.map((store) => store.store_name);
    },
    gridKey() {
      return this.storeNames.length;
    },
    columnDefs() {
      return [
        {
          field: "stock_no",
          headerName: "Stock No",
          valueGetter: "node.rowIndex + 1",
          editable: false,
          width: 120,
        },
        { field: "item_code", headerName: "Item Code", editable: true },
        { field: "item_name", headerName: "Item Name", editable: true },
        { field: "quantity", headerName: "Quantity", editable: true },
        { field: "location", headerName: "Location", editable: true },
        {
          field: "store_id",
          headerName: "Store",
          editable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: (params) => ({
            values: this.stores.map(store => store.id)
          }),
          valueFormatter: (params) => {
            const store = this.stores.find((store) => store.id === params.value);
            return store ? store.store_name : "";
          },

        },
        {
          field: "in_stock_date",
          headerName: "In Stock Date",
          editable: true,
        },
      ];
    },
  },

  mounted() {
    this.fetchStores();
  },

  methods: {
    ...mapActions("auth", ["logout"]),

    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    async fetchStores() {
      try {
        const response = await api.get("/stores");
        this.stores = response.data.data || [];
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells({ force: true });
        }
      } catch (error) {
        console.warn("Unable to fetch stores:", error);
      }
    },

    addRow() {
      this.rowData.push({});
    },

    async saveAll() {
      this.errors = [];

      if (this.gridApi) {
        this.gridApi.stopEditing();
      }

      const rows = [];
      if (this.gridApi) {
        this.gridApi.forEachNode((node) => {
          rows.push(node.data);
        });
      } else {
        rows.push(...this.rowData);
      }

      try {
        await api.post("/stocks/bulk", {
          rows,
        });

        alert("Saved successfully");
        this.rowData = [];
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const validation = error.response.data.errors || error.response.data;
          this.errors = Array.isArray(validation)
            ? validation
            : Object.values(validation).flat();
        } else {
          alert("Save failed. Please try again.");
        }
      }
    },
  },
};
</script>
