<template>
  <v-data-table
    :headers="headers"
    :items="groups"
    item-key="id"
    class="table-rounded"
    loading="isLoding"
    loading-text="טוען..."
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>קבוצות</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              הוספת קבוצה
            </v-btn>
          </template>
          <v-card>
            <v-card-text
              ><add-group @add-group="close"></add-group
            ></v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.name`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ item.name }}</span
        >
      </div>
    </template>
    <template #[`item.teacher`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ `${item.teacher.firstName} ${item.teacher.lastName}` }}</span
        >
      </div>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon @click="deleteGroup(item)" color="rgba(255,0,0,1)">
        {{ icons.mdiDelete }}
      </v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "@firebase/firestore";
import Vue from "vue";
import Component from "vue-class-component";
import AddGroup from "../add-group/AddGroup.vue";
import { mdiPencil, mdiDelete } from "@mdi/js";
import Swal from "sweetalert2";

@Component({ name: "AllGroups", components: { AddGroup } })
export default class AllGroups extends Vue {
  groups: Record<string, unknown>[] = [];

  headers = [
    { text: "שם הקבוצה", value: "name" },
    { text: "מורה", value: "teacher" },
    { text: "", value: "actions", align: "left" },
  ];

  dialog = false;

  icons = { mdiPencil, mdiDelete };

  async created() {
    this.getGroups();
  }

  async getGroups() {
    this.groups = [];
    const groups = await getDocs(query(collection(getFirestore(), "groups")));

    groups.forEach(async (group) => {
      const teacher = await getDoc(
        doc(getFirestore(), "users", group.get("teacher"))
      );

      this.groups.push({
        id: group.id,
        name: group.get("name"),
        teacher: teacher.data(),
      });
    });
  }

  async deleteGroup(group: any) {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "אתה בטוח שברצונך למחוק את הקבוצה הזאת?",
      confirmButtonText: "כן",
      cancelButtonText: "לא",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (!isConfirmed) return false;

    try {
      await deleteDoc(doc(getFirestore(), "groups", group.id));
    } catch (error: any) {
      Swal.fire({ icon: "error", text: error, title: "לא ניתן למחוק" });
    }
    this.getGroups();
  }

  async close(value: any) {
    if (value instanceof Object) {
      const teacher = await getDoc(doc(getFirestore(), "users", value.teacher));

      this.groups.push({
        id: value.id,
        name: value.name,
        teacher: teacher.data(),
      });
    }

    this.dialog = false;
  }
}
</script>
